#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include <errno.h>
#include <dbus/dbus.h>
#include <glib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <sys/signalfd.h>
#include <unistd.h>

#include "L0_LowLevel/gdbus/gdbus.h"
#include "L1_Utils/common_bluetooth.h"
#include "L1_Utils/dbus_conn_manager.hpp"
#include "L1_Utils/error.h"
#include "L3_Application/bluetooth_app.hpp"
#include "L3_Application/pupil_detect.hpp"

typedef struct {
 BluetoothApp *bt_app;
 EyeTrackingApp *et_app;
} AppComponents_t;

static GMainLoop *main_loop; 

/*
Proxy function declarations for application registeration

Calling RegisterApplication is done by using the BlueZ Proxy API. The 
proxy_added_cb is called whenever a new interface is added using the BlueZ DBus
API. Meaning this callback behavior is handled locally (Not with DBus)
*/
static void register_app_reply(DBusMessage *reply, void *user_data);
static void register_app_setup(DBusMessageIter *iter, void *user_data);
static void register_app(GDBusProxy *proxy);
static void proxy_added_cb(GDBusProxy *proxy, void *user_data);

/*
Signal Handlers for exiting the program

We use the glib APIs to handle custom interrupt handling.
*/
static gboolean signal_handler(GIOChannel *channel, GIOCondition cond,
    gpointer user_data);
static guint setup_signalfd();
static guint setup_interrupt_handlers();

static void register_app_reply(DBusMessage *reply, void *user_data)
{
    DBusError derr;

    dbus_error_init(&derr);
    dbus_set_error_from_message(&derr, reply);

    if (dbus_error_is_set(&derr))
        printf("RegisterApplication: %s\n", derr.message);
    else
        printf("RegisterApplication: OK\n");

    dbus_error_free(&derr);
}

static void register_app_setup(DBusMessageIter *iter, void *user_data)
{
    const char *path = "/";
    DBusMessageIter dict;

    dbus_message_iter_append_basic(iter, DBUS_TYPE_OBJECT_PATH, &path);

    dbus_message_iter_open_container(iter, DBUS_TYPE_ARRAY, "{sv}", &dict);

    /* TODO: Add options dictionary */

    dbus_message_iter_close_container(iter, &dict);
}

static void register_app(GDBusProxy *proxy)
{
    if (!g_dbus_proxy_method_call(proxy, "RegisterApplication",
        register_app_setup, register_app_reply,
        NULL, NULL)) {
        printf("Unable to call RegisterApplication\n");
    return;
}
}

static void proxy_added_cb(GDBusProxy *proxy, void *user_data)
{
    const char *iface;

    iface = g_dbus_proxy_get_interface(proxy);

    if (g_strcmp0(iface, GATT_MGR_IFACE))
        return;

    register_app(proxy);
}

static gboolean signal_handler(GIOChannel *channel, GIOCondition cond,
    gpointer user_data)
{
    static bool __terminated = false;
    struct signalfd_siginfo si;
    ssize_t result;
    int fd;

    if (cond & (G_IO_NVAL | G_IO_ERR | G_IO_HUP))
        return FALSE;

    fd = g_io_channel_unix_get_fd(channel);

    result = read(fd, &si, sizeof(si));
    if (result != sizeof(si))
        return FALSE;

    switch (si.ssi_signo) {
        case SIGINT:
        case SIGTERM:
        if (!__terminated) {
            printf("Terminating\n");
            g_main_loop_quit(main_loop);
        }

        __terminated = true;
        break;
    }

    return TRUE;
}

static guint setup_signalfd(void)
{
    GIOChannel *channel;
    guint source;
    sigset_t mask;
    int fd;

    sigemptyset(&mask);
    sigaddset(&mask, SIGINT);
    sigaddset(&mask, SIGTERM);

    if (sigprocmask(SIG_BLOCK, &mask, NULL) < 0) {
        perror("Failed to set signal mask");
        return 0;
    }

    fd = signalfd(-1, &mask, 0);
    if (fd < 0) {
        perror("Failed to create signal descriptor");
        return 0;
    }

    channel = g_io_channel_unix_new(fd);

    g_io_channel_set_close_on_unref(channel, TRUE);
    g_io_channel_set_encoding(channel, NULL, NULL);
    g_io_channel_set_buffered(channel, FALSE);

    source = g_io_add_watch(channel,
        (GIOCondition)(G_IO_IN | G_IO_HUP | G_IO_ERR | G_IO_NVAL),
        signal_handler, NULL);

    g_io_channel_unref(channel);

    return source;
}

static guint setup_interrupt_handlers()
{
    guint signal;
    
    signal = setup_signalfd();
    if (signal == 0)
        return -errno;

    return signal;
}

gboolean write_value(gpointer data)
{
    AppComponents_t* package = (AppComponents_t*) data;
    EyeTrackingApp* et_app = package->et_app;
    BluetoothApp* bt_app = package->bt_app;

    bt_app->set_new_cords(et_app->read());

    return TRUE;
}

int main( int argc, char** argv )
{
    /*
    Declare all of the structs and objects necessary to run
    
    event_src_signal    ID mainloop uses to refer to this IO watcher
    client              BlueZ abstraction of a DBus proxy
    bt_app              Handles BlueZ Object initialization

    */
    guint event_src_signal = setup_interrupt_handlers();
    GDBusClient *client;

    AppComponents_t c_data = {
     .bt_app = new BluetoothApp(),
     .et_app = new EyeTrackingApp()
    };

    g_idle_add (write_value, &c_data);

    /*
    Initialize BlueZ API client struct

    The only reason why this exists is to call the command to register the app
    with the DBus API, have yet to figure out why this part is necessary
    */
    client = g_dbus_client_new(DBusConnManager::instance().getConnection(), 
        "org.bluez", "/");
    g_dbus_client_set_proxy_handlers(client, proxy_added_cb, NULL, NULL,
        NULL);

    /*
    Start the main-loop

    The mainloop is what handles our event driven behavior, bluez DBus API is
    integrated with this API. We can safely intialize the mainloop struct here
    because the interupt handler(uses this struct in function definition) will 
    never be called until the mainloop starts
    */

    main_loop = g_main_loop_new(NULL, FALSE);
    g_main_loop_run(main_loop);

    /*
    Main loop returned

    Lets handle the de-initialization of all of this variables
    */
    g_dbus_client_unref(client);
    g_source_remove(event_src_signal);
    DBusConnManager::instance().disconnect();

    printf("Till next time! :D\n");
    return 0;
}
