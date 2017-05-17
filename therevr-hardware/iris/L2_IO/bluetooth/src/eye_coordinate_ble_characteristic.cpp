#include <stdio.h>
#include <string>
#include <strings.h>
#include <stdbool.h>
#include <dbus/dbus.h>
#include <glib.h>
#include <errno.h>

#include "eye_coordinate_ble_characteristic.hpp"
#include "L0_LowLevel/gdbus/gdbus.h"
#include "L1_Utils/common_bluetooth.h"
#include "L1_Utils/dbus_conn_manager.hpp"
#include "L1_Utils/error.h"
#include "L3_Application/pupil_detect.hpp"

using namespace std;

const char *EyeCoordinateBLECharacteristic::ias_alert_level_props[] = {"read",
                                                                 NULL };

EyeCoordinateBLECharacteristic::EyeCoordinateBLECharacteristic(int id, string uuid, 
                                                string parentSerivcePath): 
    BLECharacteristicBase()
{
    string chr_path = path_ + to_string(id);
    CoordinateData_t defaultCoords = {
        .x = 0,
        .y = 0
    };

    mChr = g_new0(characteristic_t, 1);
    mChr->value = (CoordinateData_t*) g_memdup(&defaultCoords, sizeof(defaultCoords));
    mChr->vlen = sizeof(defaultCoords);
    mChr->metadata.uuid = g_strdup(uuid.c_str());
    mChr->metadata.props = ias_alert_level_props;
    mChr->metadata.service = g_strdup(parentSerivcePath.c_str());
    mChr->metadata.path = g_strdup(chr_path.c_str());
}

EyeCoordinateBLECharacteristic::~EyeCoordinateBLECharacteristic()
{
    // DO NOTHING
}

void EyeCoordinateBLECharacteristic::set_value(CoordinateData_t data)
{
    *mChr->value = data;
    g_dbus_emit_property_changed(DBusConnManager::instance().getConnection(), 
                mChr->metadata.path, GATT_CHARACTERISTIC_IFACE, "Value");
}

string EyeCoordinateBLECharacteristic::register_characteristic()
{
    printf("Attempting to register: %s\n", mChr->metadata.path);

    if (!g_dbus_register_interface(DBusConnManager::instance().getConnection(),
                                    mChr->metadata.path, 
                                    GATT_CHARACTERISTIC_IFACE,
                                    mCharacteristicMethods, NULL, 
                                    mCharacteristicProperties, 
                                    mChr, chr_iface_destroy)) 
    {
        printf("Couldn't register characteristic interface\n");
        return "";
    }

    printf("Registered characteristic: %s\n", mChr->metadata.path);
    return mChr->metadata.path;
}

/*
Function definitions for required characteristic property methods
*/

gboolean EyeCoordinateBLECharacteristic::chr_get_uuid(
    const GDBusPropertyTable *property, DBusMessageIter *iter, void *user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;

    dbus_message_iter_append_basic(iter, DBUS_TYPE_STRING, &chr->metadata.uuid);

    return TRUE;
}

gboolean EyeCoordinateBLECharacteristic::chr_get_service(
    const GDBusPropertyTable *property, DBusMessageIter *iter, void *user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;

    dbus_message_iter_append_basic(iter, DBUS_TYPE_OBJECT_PATH,
                            &chr->metadata.service);

    return TRUE;
}

gboolean EyeCoordinateBLECharacteristic::chr_get_value(
    const GDBusPropertyTable *property, DBusMessageIter *iter, void *user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;

    printf("Characteristic(%s): Get(\"Value\")\n", chr->metadata.uuid);

    return chr_read(chr, iter);
}

void EyeCoordinateBLECharacteristic::chr_set_value(const GDBusPropertyTable *property,
                DBusMessageIter *iter,
                GDBusPendingPropertySet id, void *user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;
    const CoordinateData_t *value;	//change (const)
    int len;

    printf("Characteristic(%s): Set('Value', ...)\n", chr->metadata.uuid);

    if (!parse_value(iter, &value, &len)) {
        printf("Invalid value for Set('Value'...)\n");
        g_dbus_pending_property_error(id,
                    ERROR_INTERFACE ".InvalidArguments",
                    "Invalid arguments in method call");
        return;
    }

    chr_write(chr, value, len);

    g_dbus_pending_property_success(id);
}

gboolean EyeCoordinateBLECharacteristic::chr_get_props(
        const GDBusPropertyTable *property, DBusMessageIter *iter, void *data)
{
    characteristic_t *chr = (characteristic_t *)data;
    DBusMessageIter array;
    int i;

    dbus_message_iter_open_container(iter, DBUS_TYPE_ARRAY,
                    DBUS_TYPE_STRING_AS_STRING, &array);

    for (i = 0; chr->metadata.props[i]; i++)
        dbus_message_iter_append_basic(&array,
                    DBUS_TYPE_STRING, &chr->metadata.props[i]);

    dbus_message_iter_close_container(iter, &array);

    return TRUE;
}

/*
Function definitions for required characteristic methods
*/

DBusMessage* EyeCoordinateBLECharacteristic::chr_read_value(DBusConnection *conn, 
                                            DBusMessage *msg, void *user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;
    DBusMessage *reply;
    DBusMessageIter iter;
    const char *device;

    if (!dbus_message_iter_init(msg, &iter))
        return g_dbus_create_error(msg, DBUS_ERROR_INVALID_ARGS,
                            "Invalid arguments");

    if (parse_options(&iter, &device))
        return g_dbus_create_error(msg, DBUS_ERROR_INVALID_ARGS,
                            "Invalid arguments");

    reply = dbus_message_new_method_return(msg);
    if (!reply)
        return g_dbus_create_error(msg, DBUS_ERROR_NO_MEMORY,
                            "No Memory");

    dbus_message_iter_init_append(reply, &iter);

    chr_read(chr, &iter);

    return reply;
}

DBusMessage* EyeCoordinateBLECharacteristic::chr_write_value(DBusConnection *conn, 
                                            DBusMessage *msg, void *user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;
    DBusMessageIter iter;
    const CoordinateData_t *value;
    int len;
    const char *device;

    dbus_message_iter_init(msg, &iter);

    if (parse_value(&iter, &value, &len))
        return g_dbus_create_error(msg, DBUS_ERROR_INVALID_ARGS,
                            "Invalid arguments");

    if (parse_options(&iter, &device))
        return g_dbus_create_error(msg, DBUS_ERROR_INVALID_ARGS,
                            "Invalid arguments");

    chr_write(chr, value, len);

    return dbus_message_new_method_return(msg);
}

DBusMessage* EyeCoordinateBLECharacteristic::chr_start_notify(DBusConnection *conn, 
                                            DBusMessage *msg, void *user_data)
{
    return g_dbus_create_error(msg, DBUS_ERROR_NOT_SUPPORTED, "Not Supported");
}

DBusMessage* EyeCoordinateBLECharacteristic::chr_stop_notify(DBusConnection *conn, 
                                            DBusMessage *msg, void *user_data)
{
    return g_dbus_create_error(msg, DBUS_ERROR_NOT_SUPPORTED, "Not Supported");
}

/*
Utility function defintions
*/

bool EyeCoordinateBLECharacteristic::chr_read(characteristic_t *chr, 
                                        DBusMessageIter *iter)
{
    DBusMessageIter array;

    dbus_message_iter_open_container(iter, DBUS_TYPE_ARRAY,
                    DBUS_TYPE_BYTE_AS_STRING, &array);

    dbus_message_iter_append_fixed_array(&array, DBUS_TYPE_BYTE,
                        &chr->value, chr->vlen);

    dbus_message_iter_close_container(iter, &array);

    return true;
}

void EyeCoordinateBLECharacteristic::chr_write(characteristic_t *chr, 
                                        const CoordinateData_t *value, int len)
{
    g_free(chr->value);
    chr->value = (CoordinateData_t*)g_memdup(value, len);	//chance
    chr->vlen = len;

    g_dbus_emit_property_changed(DBusConnManager::instance().getConnection(), 
                                chr->metadata.path, GATT_CHARACTERISTIC_IFACE,
                                 "Value");
}

int EyeCoordinateBLECharacteristic::parse_options(DBusMessageIter *iter, 
                                            const char **device)
{
    DBusMessageIter dict;

    if (dbus_message_iter_get_arg_type(iter) != DBUS_TYPE_ARRAY)
        return -EINVAL;

    dbus_message_iter_recurse(iter, &dict);

    while (dbus_message_iter_get_arg_type(&dict) == DBUS_TYPE_DICT_ENTRY) {
        const char *key;
        DBusMessageIter value, entry;
        int var;

        dbus_message_iter_recurse(&dict, &entry);
        dbus_message_iter_get_basic(&entry, &key);

        dbus_message_iter_next(&entry);
        dbus_message_iter_recurse(&entry, &value);

        var = dbus_message_iter_get_arg_type(&value);
        if (strcasecmp(key, "device") == 0) {
            if (var != DBUS_TYPE_OBJECT_PATH)
                return -EINVAL;
            dbus_message_iter_get_basic(&value, device);
            printf("Device: %s\n", *device);
        }

        dbus_message_iter_next(&dict);
    }

    return 0;
}

int EyeCoordinateBLECharacteristic::parse_value(DBusMessageIter *iter, 
                                            const CoordinateData_t **value, int *len)
{
    DBusMessageIter array;

    if (dbus_message_iter_get_arg_type(iter) != DBUS_TYPE_ARRAY)
        return -EINVAL;

    dbus_message_iter_recurse(iter, &array);
    dbus_message_iter_get_fixed_array(&array, value, len);

    return 0;
}

void EyeCoordinateBLECharacteristic::chr_iface_destroy(gpointer user_data)
{
    characteristic_t *chr = (characteristic_t *)user_data;

    g_free(chr->metadata.service);
    g_free(chr->metadata.uuid);
    g_free(chr->metadata.path);
    g_free(chr->value);
    g_free(chr);
}
