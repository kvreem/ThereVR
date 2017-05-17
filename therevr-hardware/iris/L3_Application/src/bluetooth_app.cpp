#include <stdio.h>
#include <string>
#include <dbus/dbus.h>
#include <glib.h>

#include "bluetooth_app.hpp"
#include "eye_tracker_ble_service.hpp"
#include "L0_LowLevel/gdbus/gdbus.h"
#include "dbus_conn_manager.hpp"


BluetoothApp::BluetoothApp()
{
    // Lets initialize all of the relevant materials here
    
    // This is our top-level service
    mService = new EyeTrackerBLEService(1, IAS_UUID);

    /* 
    Now we must register the service this should trickle down and register
    all of the other bluetooth objects
    */
    string servicePath = mService->register_service();
    if (servicePath.empty()) {
        return;
    }

    // mServices = g_list_append(mServices, servicePath.c_str());
    return;
}

BluetoothApp::~BluetoothApp()
{
    // Destructor that does nothing ATM
}

void BluetoothApp::set_new_cords(CoordinateData_t data)
{
    mService->chr_write_cords(data);
} 
