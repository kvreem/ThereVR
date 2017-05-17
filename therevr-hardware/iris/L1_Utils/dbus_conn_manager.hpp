#ifndef DBUS_CONN_MGR_HPP_
#define DBUS_CONN_MGR_HPP_

#include <dbus/dbus.h>

#include "singleton_template.hpp"


class DBusConnManager: public SingletonTemplate<DBusConnManager>
{
public:
    DBusConnection* getConnection();
    bool connect();
    void disconnect();

protected:
    DBusConnManager(); ///< Private constructor of singleton pattern

private:
    bool mHasReference;
    DBusConnection *mConnection;
    friend class SingletonTemplate<DBusConnManager>;  ///< used for Singleton 
};

#endif /* DBUS_CONN_MGR_HPP_ */