#ifndef BLUETOOTH_SERVICE_BASE_HPP_
#define BLUETOOTH_SERVICE_BASE_HPP_

#include <glib.h>
#include <string>

#include "L0_LowLevel/gdbus/gdbus.h"
#include "L1_Utils/common_bluetooth.h"
#include "L1_Utils/dbus_conn_manager.hpp"
#include "ble_characteristic_base.hpp"


using namespace std;

/*
This design is to make a "static virtual" function, a concept that doesn't 
exist in C++.

To make a derived class the following functions MUST be defined:

    gboolean service_get_primary(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *user_data)

    gboolean service_get_uuid(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *user_data)

    gboolean service_get_includes(const GDBusPropertyTable *property,
                        DBusMessageIter *iter, void *user_data)

    gboolean service_exist_includes(const GDBusPropertyTable *property,
                        void *user_data)
*/
extern "C" {
typedef struct
    {
        gboolean (*service_get_primary)(const GDBusPropertyTable *property,
                            DBusMessageIter *iter, void *user_data);
        gboolean (*service_get_uuid)(const GDBusPropertyTable *property,
                            DBusMessageIter *iter, void *user_data);
        gboolean (*service_get_includes)(const GDBusPropertyTable *property,
                            DBusMessageIter *iter, void *user_data);
        gboolean (*service_exist_includes)(const GDBusPropertyTable *property,
                            void *user_data);
    } BtServiceFuncPointers_t;
}

template <typename T>
class EyeTrackerBLEServiceBase
{
public:
    EyeTrackerBLEServiceBase(int pId, string pUuid);
    ~EyeTrackerBLEServiceBase();
    string register_service(void);

protected:
    static const string path_;

    virtual gboolean register_characteristics() = 0; 

    int mId;
    string mUuid;
    string mServicePath;
    GList *mCharacteristics;
    GDBusPropertyTable *mServiceProperties;
    BtServiceFuncPointers_t mFuncPointers;

private:
    void FillFuncPointers();
};


/*
Template class definition

P.S. must be within the header file
*/

template <typename T>
const string EyeTrackerBLEServiceBase<T>::path_ = "/service";

template <typename T>
EyeTrackerBLEServiceBase<T>::EyeTrackerBLEServiceBase(int pId, string pUuid) 
{
    mId = pId;
    mUuid = pUuid;
    mServicePath = path_ + to_string(mId);
    mCharacteristics = NULL;
        
    /* 
    TODO:
    Lets find a better way than assigning struct members one by one...
    
    P.S. The last element MUST be NULL in mServiceProperties[] which is why we
    initialize to 4 instead of 3
    */
    FillFuncPointers();
    mServiceProperties = new GDBusPropertyTable[4];
        
    mServiceProperties[0].name = "Primary";
    mServiceProperties[0].type = "b";
    mServiceProperties[0].get = mFuncPointers.service_get_primary;

    mServiceProperties[1].name = "UUID";
    mServiceProperties[1].type = "s";
    mServiceProperties[1].get = mFuncPointers.service_get_uuid;

    mServiceProperties[2].name = "Includes";
    mServiceProperties[2].type = "ao";
    mServiceProperties[2].get = mFuncPointers.service_get_includes;
    mServiceProperties[2].exists = mFuncPointers.service_exist_includes;
}

template <typename T>
EyeTrackerBLEServiceBase<T>::~EyeTrackerBLEServiceBase() 
{
    delete[] mServiceProperties;
}

template <typename T>
void EyeTrackerBLEServiceBase<T>::FillFuncPointers() 
{
    mFuncPointers.service_get_primary = &T::service_get_primary;
    mFuncPointers.service_get_uuid = &T::service_get_uuid;
    mFuncPointers.service_get_includes = &T::service_get_includes;
    mFuncPointers.service_exist_includes = &T::service_exist_includes;
}

template <typename T>
string EyeTrackerBLEServiceBase<T>::register_service()
{
    printf("Attempting to register: %s\n", mServicePath.c_str());

    if (!g_dbus_register_interface(DBusConnManager::instance().getConnection(),
                                    mServicePath.c_str(), 
                                    GATT_SERVICE_IFACE,
                                    NULL, NULL, mServiceProperties, 
                                    g_strdup(mUuid.c_str()), g_free)) 
    {
        printf("Couldn't register service interface\n");
        return "";
    }

    printf("Registered service: %s\n", mServicePath.c_str());
    register_characteristics();
    return mServicePath;
}

#endif /* BLUETOOTH_SERVICE_BASE_HPP_ */
