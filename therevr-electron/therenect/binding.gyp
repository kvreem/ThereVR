{
  "targets": [
    {
      "target_name": "therenect",
      "sources": [ "therenect.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "<!(node -e \"require('./kinect2-gyp-libs').OpenNI2.inc()\")",
        # "<!(node -e \"require('./kinect2-gyp-libs').NiTE2.inc()\")"
      ],
      "libraries": [
        "-L/usr/local/lib",
        "-L<!(node -e \"require('./kinect2-gyp-libs').OpenNI2.lib()\")",
        # "-L<!(node -e \"require('./kinect2-gyp-libs').NiTE2.lib()\")",
        # "-lNiTE2",
        "-lOpenNI2"
      ]
    }
  ]
}