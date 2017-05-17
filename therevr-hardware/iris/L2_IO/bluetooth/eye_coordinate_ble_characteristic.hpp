#ifndef BLUETOOTH_CHARACTERISTIC_HPP_
#define BLUETOOTH_CHARACTERISTIC_HPP_

#include <string>
#include <glib.h>

#include "L0_LowLevel/gdbus/gdbus.h"
#include "ble_characteristic_base.hpp"
#include "L3_Application/pupil_detect.hpp"

using namespace std;



typedef struct
{
    //uint32_t *value;
    CoordinateData_t *value;
    int vlen;
    Characteristic_metadata_t metadata;
} characteristic_t;


class EyeCoordinateBLECharacteristic: public BLECharacteristicBase<EyeCoordinateBLECharacteristic>
{
public:
    string register_characteristic(void);
    void set_value(CoordinateData_t data);
    EyeCoordinateBLECharacteristic(int id, string uuid, string parentSerivcePath);
    ~EyeCoordinateBLECharacteristic();

protected:
    /* 
    Required functions specified in BLECharacteristicBase
    */
    static DBusMessage* chr_read_value(DBusConnection *conn, DBusMessage *msg,
                                void *user_data);
    static DBusMessage* chr_write_value(DBusConnection *conn, DBusMessage *msg,
                                void *user_data);
    static DBusMessage* chr_start_notify(DBusConnection *conn, DBusMessage *msg,
                                void *user_data);
    static DBusMessage* chr_stop_notify(DBusConnection *conn, DBusMessage *msg,
                                void *user_data);

    /*
    Function Prototypes for required characteristic property methods
    */
    static gboolean chr_get_uuid(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *user_data);
    static gboolean chr_get_service(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *user_data);
    static gboolean chr_get_value(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *user_data);
    static void chr_set_value(const GDBusPropertyTable *property,
                    DBusMessageIter *iter,
                    GDBusPendingPropertySet id, void *user_data);
    static gboolean chr_get_props(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *data);

private:
    static const char *ias_alert_level_props[];
    characteristic_t *mChr;

    friend class BLECharacteristicBase<EyeCoordinateBLECharacteristic>;
    
    /*
    Helper functions, must be static because they are called from static funcs
    */
    static void chr_iface_destroy(gpointer user_data);
    static bool chr_read(characteristic_t *chr, DBusMessageIter *iter);
    static void chr_write(characteristic_t *chr, 
                            const CoordinateData_t *value, int len);
    static int parse_options(DBusMessageIter *iter, const char **device);
    static int parse_value(DBusMessageIter *iter, 
                            const CoordinateData_t **value, int *len);
};

#endif /* BLUETOOTH_CHARACTERISTIC_HPP_ */
