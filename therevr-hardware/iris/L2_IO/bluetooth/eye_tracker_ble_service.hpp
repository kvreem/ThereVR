#ifndef BLUETOOTH_SERVICE_HPP_
#define BLUETOOTH_SERVICE_HPP_

#include <string>
#include <glib.h>

#include "L0_LowLevel/gdbus/gdbus.h"
#include "ble_service_base.hpp"
#include "eye_coordinate_ble_characteristic.hpp"

#define ALERT_LEVEL_CHR_UUID        "00002a06-0000-1000-8000-00805f9b34fb"

using namespace std;

class EyeTrackerBLEService: public EyeTrackerBLEServiceBase<EyeTrackerBLEService>
{
public:
    EyeTrackerBLEService(int id, string uuid);
    ~EyeTrackerBLEService();
    void chr_write_cords(CoordinateData_t data);

protected:
    /* 
    Required functions specified in EyeTrackerBLEServiceBase
    */
    static gboolean service_get_primary(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
    static gboolean service_get_uuid(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
    static gboolean service_get_includes(const GDBusPropertyTable *property,
                    DBusMessageIter *iter, void *user_data);
    static gboolean service_exist_includes(const GDBusPropertyTable *property,
                            void *user_data);
    
    gboolean register_characteristics();

private:
    friend class EyeTrackerBLEServiceBase<EyeTrackerBLEService>; 
    EyeCoordinateBLECharacteristic bluetooth_chr;
};

#endif /* BLUETOOTH_SERVICE_HPP_ */
