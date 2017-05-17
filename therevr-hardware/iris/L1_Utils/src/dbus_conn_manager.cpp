#include <dbus/dbus.h>

#include "dbus_conn_manager.hpp"
#include "L0_LowLevel/gdbus/gdbus.h"

DBusConnManager::DBusConnManager()
{
    mHasReference = false;
    DBusConnManager::connect();
}

DBusConnection* DBusConnManager::getConnection()
{
    if (mHasReference)
    {
        return mConnection; 
    }

    return NULL;
}

bool DBusConnManager::connect()
{  
    if (mHasReference) 
    {
        // Connection already established
        return true;
    }

    mConnection = g_dbus_setup_bus(DBUS_BUS_SYSTEM, NULL, NULL);
    if (mConnection == NULL) 
    {
        // Failed to create reference
        mHasReference = false;
    } else 
    {
        g_dbus_attach_object_manager(mConnection);
        mHasReference =true;
    }

    return mHasReference;
}

void DBusConnManager::disconnect()
{
    if (mConnection == NULL)
    {
        // There is no connection object
        return; 
    }

    dbus_connection_unref(mConnection);
}