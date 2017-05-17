#include <dbus/dbus.h>
#include <glib.h>
#include <stdio.h>
#include <string>


#include "eye_tracker_ble_service.hpp"
#include "L0_LowLevel/gdbus/gdbus.h"

using namespace std;


EyeTrackerBLEService::EyeTrackerBLEService(int id, string uuid): 
    EyeTrackerBLEServiceBase(id, uuid),
    bluetooth_chr(1, ALERT_LEVEL_CHR_UUID, mServicePath)
{
    // DO NOTHING
}

EyeTrackerBLEService::~EyeTrackerBLEService()
{
    // DO NOTHING
}
void EyeTrackerBLEService::chr_write_cords(CoordinateData_t data)
{
    bluetooth_chr.set_value(data);
}

gboolean EyeTrackerBLEService::register_characteristics()
{
    bool success = true;

    if (bluetooth_chr.register_characteristic() == "")
    {
        success = false;
    }

    return success;
}

gboolean EyeTrackerBLEService::service_get_primary(
                            const GDBusPropertyTable *property, 
                            DBusMessageIter *iter, 
                            void *user_data)
{
    dbus_bool_t primary = TRUE;

    printf("Get Primary: %s\n", primary ? "True" : "False");

    dbus_message_iter_append_basic(iter, DBUS_TYPE_BOOLEAN, &primary);

    return TRUE;
}

gboolean EyeTrackerBLEService::service_get_uuid(const GDBusPropertyTable *property,
                            DBusMessageIter *iter, void *user_data)
{
    const char *uuid = (char *)user_data;

    printf("Get UUID: %s\n", uuid);

    dbus_message_iter_append_basic(iter, DBUS_TYPE_STRING, &uuid);

    return TRUE;
}

gboolean EyeTrackerBLEService::service_get_includes(
                            const GDBusPropertyTable *property,
                            DBusMessageIter *iter, void *user_data)
{
    const char *uuid = (char *)user_data;

    printf("Get Includes: %s\n", uuid);

    return TRUE;
}

gboolean EyeTrackerBLEService::service_exist_includes(
                            const GDBusPropertyTable *property,
                            void *user_data)
{
    const char *uuid = (char *)user_data;

    printf("Exist Includes: %s\n", uuid);

    return FALSE;
}
