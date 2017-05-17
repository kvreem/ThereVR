#ifndef BLUETOOTH_CHARACTERISTIC_BASE_HPP_
#define BLUETOOTH_CHARACTERISTIC_BASE_HPP_

#include <glib.h>
#include <string>

#include "L0_LowLevel/gdbus/gdbus.h"
#include "L1_Utils/dbus_conn_manager.hpp"

using namespace std;

/*
This design is to make a "static virtual" function, a concept that doesn't 
exist in C++.

To make a derived class the following functions MUST be defined:

Method Pointers
    gboolean (*chr_read_value)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
    gboolean (*chr_write_value)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
    gboolean (*chr_start_notify)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
    gboolean (*chr_stop_notify)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);

Property Pointers
    gboolean (*chr_get_uuid)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
    gboolean (*chr_get_service)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
    gboolean (*chr_get_value)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
    gboolean (*chr_set_value)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, GDBusPendingPropertySet id, 
                    void *user_data);
    gboolean (*chr_get_props)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *data);
*/
extern "C" {
    typedef struct
    {
        DBusMessage* (*chr_read_value)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
        DBusMessage* (*chr_write_value)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
        DBusMessage* (*chr_start_notify)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
        DBusMessage* (*chr_stop_notify)(DBusConnection *conn, DBusMessage *msg,
                            void *user_data);
    } BtCharacteristicMethodPointers_t;
    
    typedef struct
    {
        gboolean (*chr_get_uuid)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
        gboolean (*chr_get_service)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
        gboolean (*chr_get_value)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
        void (*chr_set_value)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, GDBusPendingPropertySet id, 
                    void *user_data);
        gboolean (*chr_get_props)(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *data);
    } BtCharacteristicPropertyPointers_t;

    typedef struct 
    {
        char *service;
        char *uuid;
        char *path;
        const char **props;
    } Characteristic_metadata_t;
}

template <typename T>
class BLECharacteristicBase
{
public:
    virtual string register_characteristic(void) = 0;

    BLECharacteristicBase();
    ~BLECharacteristicBase();

protected:
    static const string path_;

    GDBusMethodTable *mCharacteristicMethods;
    GDBusPropertyTable *mCharacteristicProperties;
    BtCharacteristicPropertyPointers_t mPropPointers;
    BtCharacteristicMethodPointers_t mMethodPointers;

private:
    void FillFuncPointers();
    void FillPropertyTable();
    void FillMethodTable();
};


/*
Template class definition

P.S. must be within the header file
*/

template <typename T>
const string BLECharacteristicBase<T>::path_ = "/characteristic";

template <typename T>
BLECharacteristicBase<T>::BLECharacteristicBase() 
{
    FillFuncPointers();
    FillPropertyTable();
    FillMethodTable();
}

template <typename T>
BLECharacteristicBase<T>::~BLECharacteristicBase() 
{
    delete[] mCharacteristicProperties;
    delete[] mCharacteristicMethods;
}

template <typename T>
void BLECharacteristicBase<T>::FillFuncPointers() 
{
    mMethodPointers.chr_read_value = &T::chr_read_value;
    mMethodPointers.chr_write_value = &T::chr_write_value;
    mMethodPointers.chr_start_notify = &T::chr_start_notify;
    mMethodPointers.chr_stop_notify = &T::chr_stop_notify;

    mPropPointers.chr_get_uuid = &T::chr_get_uuid;
    mPropPointers.chr_get_service = &T::chr_get_service;
    mPropPointers.chr_get_value = &T::chr_get_value;
    mPropPointers.chr_set_value = &T::chr_set_value;
    mPropPointers.chr_get_props = &T::chr_get_props;
}

template <typename T>
void BLECharacteristicBase<T>::FillPropertyTable() 
{
    /* 
    TODO:
    Lets find a better way than assigning struct members one by one...
    */

    mCharacteristicProperties = new GDBusPropertyTable[5];
    mCharacteristicProperties[0].name = "UUID";
    mCharacteristicProperties[0].type = "s";
    mCharacteristicProperties[0].get = mPropPointers.chr_get_uuid;    

    mCharacteristicProperties[1].name = "Service";
    mCharacteristicProperties[1].type = "o";
    mCharacteristicProperties[1].get = mPropPointers.chr_get_service;

    mCharacteristicProperties[2].name = "Value";
    mCharacteristicProperties[2].type = "ay";
    mCharacteristicProperties[2].get = mPropPointers.chr_get_value;
    mCharacteristicProperties[2].set = mPropPointers.chr_set_value;

    mCharacteristicProperties[3].name = "Flags";
    mCharacteristicProperties[3].type = "as";
    mCharacteristicProperties[3].get = mPropPointers.chr_get_props;
}

template <typename T>
void BLECharacteristicBase<T>::FillMethodTable() 
{
    mCharacteristicMethods = new GDBusMethodTable[5];
    mCharacteristicMethods[0].name = "ReadValue";
    mCharacteristicMethods[0].in_args = GDBUS_ARGS({ "options", "a{sv}" });
    mCharacteristicMethods[0].out_args = GDBUS_ARGS({ "value", "ay" });
    mCharacteristicMethods[0].function = mMethodPointers.chr_read_value;

    mCharacteristicMethods[1].name = "WriteValue";
    mCharacteristicMethods[1].in_args = GDBUS_ARGS({ "value", "ay" },
                                        { "options", "a{sv}" });
    mCharacteristicMethods[1].function = mMethodPointers.chr_write_value;


    mCharacteristicMethods[2].name = "StartNotify";
    mCharacteristicMethods[2].function = mMethodPointers.chr_start_notify;

    mCharacteristicMethods[3].name = "StopNotify";
    mCharacteristicMethods[3].function = mMethodPointers.chr_stop_notify;
}

#endif /* BLUETOOTH_CHARACTERISTIC_BASE_HPP_ */
