# **ThereVR Eye-tracking Code**
-----
The code contained in this repository is the entire source code for the linux executable of ThereVR's eye-tracking software. The code has the following dependecies:
* OpenCV
* BlueZ
* GLib
 
# Project Structure
---
- iris/ (Application code)
    - L3_Application/ (entry point and OpenCV code)
        - main.cpp  (application entry point)
        - pupil_detect.hpp (header file for OpenCV code)
        - bluetooth_app.hpp (BLE)
        - src/ (source files)
    - L2_IO (Input/output such as bluetooth)
        - bluetooth/ (bluetooth specific files) 
    - L1_Utils (common apis across all files)
        - dbus_conn_manager.hpp
        - error.h
        - common_bluetooth.h
        - src/
    - L0_LowLevel (external library files)
        - gdbus/ 
- tools/ (useful scripts during development
    - BelenoAdvertiser/ (used for testing)
    - bluetoothjs/ (javascript code for bluetooth hooks in electron app
    - capture_video.py (grab video of eyes during development)

# Setup Raspbian on SD Card (Mac OS X) 
-----
1. Download Raspbian from raspberrypi.org
Verify checksum of download to ensure download is valid
`shasum <raspbian zip download name>`

2. Prepare SD Card using diskutil
3. Unmount SD card from MAC OS
`diskutil unmountDisk /dev/disk<disk# from diskutil>`

4. Copy data from Raspbian image (.img) to SD card
`sudo dd bs=1m if=image.img of=/dev/rdisk<disk# from diskutil>`

5. Insert SD card into Raspberry Pi & power on
Update all available software using apt-get
```
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get upgrade
```

6. Install vim text editor
7. Run raspi-config to enable specified features
```
sudo raspi-config
# Expand Filesystem
# Enable Camera
```

Notes
If you are running into any trouble reference original tutorial.
Raspberry Pi website for downloading has a horrible server, use wget for longer timeout when downloading
use diskutil list to figure out which disk to target
UPDATE 1/28/2016 ISSUE 1
(ISSUE 1) !IMPORTANT!: If Raspberry Pi corrupts memory after attempting to run apt-get upgrade the filesystem might not be expanded. To fix the issue go into raspi-config and enable filesystem expansion.
reference raspberrypi.org tutorial

# Setup BlueZ 5.43
---
1. Install BlueZ dependencies
```
sudo apt-get update
sudo apt-get install -y libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev
```

2. Uninstall previous bluez (Double check if bluez install is not 5.43 using systemctl) install 
`sudo apt-get purge bluez`

3. Grab URL and download BlueZ 5.43 from BlueZ website
`wget <url>`

4. Unzip the tar.gz file
`tar xvf <path to bluez zip file>`

5. Download and apply a BlueZ patch that enables bcm43xx drivers (Make sure to navigate into the unzip directory before doing any of the next steps)
```
# If you haven't already navigated into the bluez unzip directory do so now with
# cd <blueZ unzip dir>
wget <patch URL>
unzip <bluez patch file name>
git apply -v <bluez patch file name>/*
```

6. Run configure command
./configure --prefix=/usr --mandir=/usr/share/man --sysconfdir=/etc/ --localstatedir=/var --enable-experimental --with-systemdsystemunitdir=/lib/systemd/system --with-systemduserunitdir=/usr/lib/systemd

7. Run make to compile the code
8. Run sudo make install to complete BlueZ install
9. Reboot the Raspberry Pi
10. To verify BlueZ installed properly run the following commands
```
# By default the device is powered down. Load this driver
# to control the enable pins to the bluetooth module and
# power the bluetooth device
hciattach /dev/ttyAMA0 bcm43xx 921600 noflow - 
sudo hciconfig hci0 up
sudo systemctl start bluetooth
sudo bluetoothctl # This will open a interactive bluetooth control console
  list
```
## Notes
It may be that the correct broadcom drivers are not within the /lib/firmware/brcm/ folder.
(ISSUE 1) DEFAULT RASPBIAN DOES NOT LOAD CORRECT FIRMWARE
The following commands must be executed upon every boot up of the raspberry pi to enable the bluetooth module:
hciattach /dev/ttyAMA0 bcm43xx 921600 noflow - 
sudo hciconfig hci0 up
sudo systemctl start bluetooth
To automate this process, copy and paste the code block above into /etc/rc.local file.
If you are running into any trouble reference original tutorial
reference Raspberrypi forums Pi Zero bluez install adafruit bluez tutorial
# **Setup OpenCV**
1. Install all dependencies
```
# Build dependencies
sudo apt-get install build-essential cmake pkg-config
 
# Image I/O 
sudo apt-get install libjpeg-dev libtiff5-dev libjasper-dev libpng12-dev
 
# Video I/O
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install libxvidcore-dev libx264-dev
 
# HighGui dependencies
sudo apt-get install libgtk2.0-dev
 
# Optimized OpenCV Dependencies
sudo apt-get install libatlas-base-dev gfortran
 
# OpenCV Python compile dependencies
sudo apt-get install python2.7-dev python3-dev
```

2. Download OpenCV Release 3.1 Source Files and unzip both files into home directory (~/.)
```
wget -O opencv.zip https://github.com/Itseez/opencv/archive/3.1.0.zip
wget -O opencv_contrib.zip https://github.com/Itseez/opencv_contrib/archive/3.1.0.zip
```

3. Create build folder in opencv unzip directory
4. Run Cmake and then make (Recommend to run make in screen so session is not terminated by no activity)
```
cmake -D CMAKE_BUILD_TYPE=RELEASE \    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib-3.1.0/modules \
    -D BUILD_EXAMPLES=ON ..
```

5. Run sudo make install, followed by sudo ldconfig within the build directory
6. Verify OpenCV install by importing cv2 library in python console

## Notes
If you are running into any trouble reference the original tutorial
pyimagesearch.com

# Setup Build Tools
---
1. Install Scons
2. Verify OpenCV install by building example_cv project
```
# cd into therevr/hardware directory
scons example_cv
```
3. Verify all Build tools install by building iris project
```
# cd into therevr/hardware directory
scons iris

# to clean the project run the following command
scons --clean
```
