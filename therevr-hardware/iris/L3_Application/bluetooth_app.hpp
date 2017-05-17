#ifndef BLUETOOTH_APP_HPP_
#define BLUETOOTH_APP_HPP_

#include <glib.h>

#include "L1_Utils/dbus_conn_manager.hpp"
#include "L2_IO/bluetooth/eye_tracker_ble_service.hpp"

/* Immediate Alert Service UUID */
#define IAS_UUID            "00001802-0000-1000-8000-00805f9b34fb"

class BluetoothApp
{
public:
    BluetoothApp();
    ~BluetoothApp();
    void set_new_cords(CoordinateData_t data); 

private:
    GList *mServices;
    EyeTrackerBLEService *mService;
};

#endif /* BLUETOOTH_APP_HPP_ */
