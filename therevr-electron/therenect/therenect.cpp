#include <nan.h>
#include <node.h>
#include <v8.h>
#include <math.h>

#include <iostream>

#include "OpenNI.h"
// #include "NiTE.h"

bool isClosed = false;

openni::VideoStream g_colorStream;
openni::VideoFrameRef g_colorFrame;
const openni::SensorInfo* g_colorSensorInfo = NULL;

openni::VideoStream g_depthStream;
openni::VideoFrameRef g_depthFrame;
const openni::SensorInfo* g_depthSensorInfo = NULL;

// nite::UserTracker userTracker;
// nite::Status niteRc;
// nite::UserTrackerFrameRef userTrackerFrame;

openni::Device g_device;

float head_x = 0;
float head_y = 0;
float head_z = 0;

float confidence = 0.3f;

using namespace v8;

void Update(const v8::FunctionCallbackInfo<Value>& args) {
  if (isClosed) return;

  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
/*
  niteRc = userTracker.readFrame(&userTrackerFrame);
  if (niteRc != nite::STATUS_OK)
  {
    printf("Get next frame failed\n");
    return;
  }

  const nite::Array<nite::UserData>& users = userTrackerFrame.getUsers();
  for (int i = 0; i < users.getSize(); ++i)
  {
    const nite::UserData& user = users[i];

    if (user.isNew())
    {
      std::cout << "tracking new user.." << std::endl;
      userTracker.startSkeletonTracking(user.getId());
    }
    else if (user.getSkeleton().getState() == nite::SKELETON_CALIBRATING)
    {
      std::cout << "CALIBRATING" << std::endl;
    }
    else if (user.getSkeleton().getState() == nite::SKELETON_TRACKED)
    {
      const nite::SkeletonJoint& head = user.getSkeleton().getJoint(nite::JOINT_HEAD);
      std::cout << head.getPositionConfidence() << std::endl;
      if (head.getPositionConfidence() > confidence) {
        head_x = head.getPosition().x;
        head_y = head.getPosition().y;
        head_z = head.getPosition().z;
        printf("%d. (%5.2f, %5.2f, %5.2f)\n", user.getId(), head.getPosition().x, head.getPosition().y, head.getPosition().z);
      }
    }
  }*/
}

// void AddJointToObject(Local<Object> &obj, const char *jointName, const nite::SkeletonJoint& joint) {

//   Isolate* isolate = Isolate::GetCurrent();

//   Local<Object> pos = Object::New(isolate);

//   Local<Object> quat = Object::New(isolate);

//   if (joint.getPositionConfidence() > confidence) {
//     pos->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, joint.getPosition().x));
//     pos->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, joint.getPosition().y));
//     pos->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, joint.getPosition().z));

//     quat->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, joint.getOrientation().x));
//     quat->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, joint.getOrientation().y));
//     quat->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, joint.getOrientation().z));
//     quat->Set(String::NewFromUtf8(isolate, "w"), Number::New(isolate, joint.getOrientation().w));

//   } else {
//     pos->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, 0));
//     pos->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, 0));
//     pos->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, 0));

//     quat->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, 0));
//     quat->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, 0));
//     quat->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, 0));
//     quat->Set(String::NewFromUtf8(isolate, "w"), Number::New(isolate, 0));

//   }

//   pos->Set(String::NewFromUtf8(isolate, "quat"), quat);

//   obj->Set(String::NewFromUtf8(isolate, jointName), pos);

// }

int getDepthFromXY(char* data, int x, int y, int width) {
  return data[y*width + x];
}

void GetFrame(const v8::FunctionCallbackInfo<Value>& args) {
  if (isClosed) return;

  Isolate* isolate = Isolate::GetCurrent();

  openni::Status rc = openni::STATUS_OK;

  openni::VideoStream* streams[] = {&g_colorStream, &g_depthStream};

  Local<Object> frameObject = Object::New(isolate);

  int changedIndex = -1;
  rc = openni::OpenNI::waitForAnyStream(streams, 2, &changedIndex, 0);
  if (rc == openni::STATUS_OK)
  {
    g_colorStream.readFrame(&g_colorFrame);
    g_depthStream.readFrame(&g_depthFrame);
    // frameObject->Set(String::NewFromUtf8(isolate, "w"), Number::New(isolate, g_depthFrame.getWidth()));
    // frameObject->Set(String::NewFromUtf8(isolate, "h"), Number::New(isolate, g_depthFrame.getHeight()));

    frameObject->Set(String::NewFromUtf8(isolate, "w"), Number::New(isolate, 512));
    frameObject->Set(String::NewFromUtf8(isolate, "h"), Number::New(isolate, 512));

    int length = g_depthFrame.getDataSize();
    
    const openni::RGB888Pixel* colorFrameData = (const openni::RGB888Pixel* )g_colorFrame.getData();
    const openni::DepthPixel* depthFrameData = (const openni::DepthPixel* )g_depthFrame.getData();

    
    
    // char* data = new char[g_depthFrame.getWidth()*g_depthFrame.getHeight()*3];

    /*
    for (int i = 0; i < g_depthFrame.getWidth()*g_depthFrame.getHeight(); i++) {
      // depthFrameData[i];

      // data[i*3] = (depthFrameData[i] & 0xFF);
      // data[i*3+2] = 0;
      // data[i*3+1] = (char)floor(fmin((float)depthFrameData[i] / 256.0 * 10.0, 255));

      // printf("%d\n", (int)floor((float)depthFrameData[i] / 256));

      int depth = floor(((float)depthFrameData[i] / (1500)) * 255.0f);
      data[i*3] = fmin(depth, 255);
      data[i*3+2] = fmin(depth, 255);
      data[i*3+1] = fmin(depth, 255);
      // if (depth < 256) {
      //   data[i] = depth;
      // } else {
      //   data[i] = 0;
      // }
    }*/


    // printf("%d %d %d %d\n", g_depthFrame.getWidth(), g_colorFrame.getWidth(), g_depthFrame.getHeight(), g_colorFrame.getHeight());

    char* resizedDepth = new char[128*128*3];
    for (int x = 0; x < 128; x++) {
      for (int y = 0; y < 128; y++) {
        // taking from 512 x 424 resolution

        int depthX = x * g_colorFrame.getWidth() / 128;
        int depthY = y * g_colorFrame.getHeight() / 128;

        int iDepth = depthX + depthY*g_depthFrame.getWidth();
        int iResized = y * 128 + x;

        resizedDepth[iResized*3] = depthFrameData[iDepth] & 0xFF;
        resizedDepth[iResized*3+1] = (depthFrameData[iDepth] >> 8) & 0xFF;
        resizedDepth[iResized*3+2] = 0;

        // int pX = 0;
        // int pY = 0;
        // openni::CoordinateConverter coorConverter;
        // coorConverter.convertDepthToColor(g_depthStream, g_colorStream, depthX, depthY, depthFrameData[iDepth], &pX, &pY);

        // int i = y * 128 + x;
        // dataResized[i] = getDepthFromXY(data, x * 512 / 128, y * 424 / 128, g_depthFrame.getWidth());
      }
    }

    char* resizedColor = new char[512*512*3];
    for (int x = 0; x < 512; x++) {
      for (int y = 0; y < 512; y++) {
        int colorX = x * g_colorFrame.getWidth() / 512;
        int colorY = y * g_colorFrame.getHeight() / 512;

        int iColor = colorX + colorY*g_colorFrame.getWidth();
        int iResized = y * 512 + x;

        resizedColor[iResized*3] = colorFrameData[iColor].r;
        resizedColor[iResized*3+1] = colorFrameData[iColor].g;
        resizedColor[iResized*3+2] = colorFrameData[iColor].b;
      }
    }

    // char* data = new char[length];
    // memcpy(data, g_depthFrame.getData(), length);
    // printf("hmm %d\n", length);
    // Nan::MaybeLocal<v8::Object> actualBuffer = Nan::NewBuffer(data, (uint32_t) length);
    // Nan::MaybeLocal<v8::Object> actualBuffer = Nan::NewBuffer(data, (uint32_t) g_depthFrame.getWidth()*g_depthFrame.getHeight()*3);
    // Nan::MaybeLocal<v8::Object> actualBuffer = Nan::NewBuffer(dataResized, (uint32_t) 128*128);

    Nan::MaybeLocal<v8::Object> resizedColorBuffer = Nan::NewBuffer(resizedColor, (uint32_t) 512*512*3);
    Nan::MaybeLocal<v8::Object> resizedDepthBuffer = Nan::NewBuffer(resizedDepth, (uint32_t) 128*128*3);

    frameObject->Set(String::NewFromUtf8(isolate, "dataColor"), resizedColorBuffer.ToLocalChecked());
    frameObject->Set(String::NewFromUtf8(isolate, "dataDepth"), resizedDepthBuffer.ToLocalChecked());

    int size = sizeof(float);
    float horizontalFov;
    float verticalFov;
    g_depthStream.getProperty(ONI_STREAM_PROPERTY_HORIZONTAL_FOV, &horizontalFov, &size);
    g_depthStream.getProperty(ONI_STREAM_PROPERTY_VERTICAL_FOV, &verticalFov, &size);

    // frameObject->Set(String::NewFromUtf8(isolate, "resolutionY"), Number::New(g_depthStream.m_worldConvertCache.resolutionY, 0));
    frameObject->Set(String::NewFromUtf8(isolate, "xzFactor"), Number::New(isolate, tan(horizontalFov / 2) * 2));
    frameObject->Set(String::NewFromUtf8(isolate, "yzFactor"), Number::New(isolate, tan(verticalFov / 2) * 2));
    // frameObject->Set(String::NewFromUtf8(isolate, "data"), actualBuffer.ToLocalChecked());

  } else {
    frameObject->Set(String::NewFromUtf8(isolate, "w"), Number::New(isolate, 0));
    frameObject->Set(String::NewFromUtf8(isolate, "h"), Number::New(isolate, 0));
  }


  args.GetReturnValue().Set(frameObject);
}

void GetHead(const v8::FunctionCallbackInfo<Value>& args) {
  if (isClosed) return;

  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);

  Local<Object> skeletonObject = Object::New(isolate);
/*
  const nite::Array<nite::UserData>& users = userTrackerFrame.getUsers();

  for (int i = 0; i < users.getSize(); ++i)
  {
    const nite::UserData& user = users[i];
    const nite::Skeleton& skeleton = user.getSkeleton();

    if (user.getSkeleton().getState() == nite::SKELETON_TRACKED && skeleton.getJoint(nite::JOINT_HEAD).getPositionConfidence() > confidence)
    {
      AddJointToObject(skeletonObject, "head"          , skeleton.getJoint(nite::JOINT_HEAD            ));
      AddJointToObject(skeletonObject, "neck"          , skeleton.getJoint(nite::JOINT_NECK            ));
      AddJointToObject(skeletonObject, "torso"         , skeleton.getJoint(nite::JOINT_TORSO           ));
      AddJointToObject(skeletonObject, "left_shoulder" , skeleton.getJoint(nite::JOINT_LEFT_SHOULDER   ));
      AddJointToObject(skeletonObject, "left_elbow"    , skeleton.getJoint(nite::JOINT_LEFT_ELBOW      ));
      AddJointToObject(skeletonObject, "left_hand"     , skeleton.getJoint(nite::JOINT_LEFT_HAND       ));
      AddJointToObject(skeletonObject, "right_shoulder", skeleton.getJoint(nite::JOINT_RIGHT_SHOULDER  ));
      AddJointToObject(skeletonObject, "right_elbow"   , skeleton.getJoint(nite::JOINT_RIGHT_ELBOW     ));
      AddJointToObject(skeletonObject, "right_hand"    , skeleton.getJoint(nite::JOINT_RIGHT_HAND      ));
      AddJointToObject(skeletonObject, "left_hip"      , skeleton.getJoint(nite::JOINT_LEFT_HIP        ));
      AddJointToObject(skeletonObject, "left_knee"     , skeleton.getJoint(nite::JOINT_LEFT_KNEE       ));
      AddJointToObject(skeletonObject, "left_foot"     , skeleton.getJoint(nite::JOINT_LEFT_FOOT       ));
      AddJointToObject(skeletonObject, "right_hip"     , skeleton.getJoint(nite::JOINT_RIGHT_HIP       ));
      AddJointToObject(skeletonObject, "right_knee"    , skeleton.getJoint(nite::JOINT_RIGHT_KNEE      ));
      AddJointToObject(skeletonObject, "right_foot"    , skeleton.getJoint(nite::JOINT_RIGHT_FOOT      ));

      args.GetReturnValue().Set(skeletonObject);

      return;
    }
  }*/

  Local<Object> emptyPos = Object::New(isolate);

  emptyPos->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, 0));
  emptyPos->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, 0));
  emptyPos->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, 0));

  Local<Object> quat = Object::New(isolate);
  
  quat->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, 0));
  quat->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, 0));
  quat->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, 0));
  quat->Set(String::NewFromUtf8(isolate, "w"), Number::New(isolate, 0));

  emptyPos->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, 0));
  emptyPos->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, 0));
  emptyPos->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, 0));
  emptyPos->Set(String::NewFromUtf8(isolate, "quat"), quat);

  skeletonObject->Set(String::NewFromUtf8(isolate, "head"          ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "neck"          ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "torso"         ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "left_shoulder" ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "left_elbow"    ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "left_hand"     ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "right_shoulder"), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "right_elbow"   ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "right_hand"    ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "left_hip"      ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "left_knee"     ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "left_foot"     ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "right_hip"     ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "right_knee"    ), emptyPos);
  skeletonObject->Set(String::NewFromUtf8(isolate, "right_foot"    ), emptyPos);


  // Local<Object> obj = Object::New(isolate);
  // obj->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, head_x));
  // obj->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, head_y));
  // obj->Set(String::NewFromUtf8(isolate, "z"), Number::New(isolate, head_z));

  // arr->Set(String::NewFromUtf8(isolate, "head"), obj);

  args.GetReturnValue().Set(skeletonObject);
}

void Close(const v8::FunctionCallbackInfo<Value>& args) {
  isClosed = true;

  g_colorStream.stop();
  g_depthStream.stop();
  // nite::NiTE::shutdown();
  // g_device.close();
}

void Method(const v8::FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}

const char *pixelFormatString(openni::PixelFormat format) {
  switch(format) {
    case openni::PixelFormat::PIXEL_FORMAT_DEPTH_1_MM:
      return "PIXEL_FORMAT_DEPTH_1_MM";
    case openni::PixelFormat::PIXEL_FORMAT_DEPTH_100_UM:
      return "PIXEL_FORMAT_DEPTH_100_UM";
    case openni::PixelFormat::PIXEL_FORMAT_SHIFT_9_2:
      return "PIXEL_FORMAT_SHIFT_9_2";
    case openni::PixelFormat::PIXEL_FORMAT_SHIFT_9_3:
      return "PIXEL_FORMAT_SHIFT_9_3";
    case openni::PixelFormat::PIXEL_FORMAT_RGB888:
      return "PIXEL_FORMAT_RGB888";
    case openni::PixelFormat::PIXEL_FORMAT_YUV422:
      return "PIXEL_FORMAT_YUV422";
    case openni::PixelFormat::PIXEL_FORMAT_GRAY8:
      return "PIXEL_FORMAT_GRAY8";
    case openni::PixelFormat::PIXEL_FORMAT_GRAY16:
      return "PIXEL_FORMAT_GRAY16";
    case openni::PixelFormat::PIXEL_FORMAT_JPEG:
      return "PIXEL_FORMAT_JPEG";
    case openni::PixelFormat::PIXEL_FORMAT_YUYV:
      return "PIXEL_FORMAT_YUYV";
  }

  return "UNAVAILABLE";
}

void printVideoMode(const openni::VideoMode &videoMode) {
  std::cout << "<<<<<<<<<<<<<<<<<" << std::endl;
  std::cout << "FPS " << videoMode.getFps() << std::endl;
  std::cout << "X " << videoMode.getResolutionX() << std::endl;
  std::cout << "Y " << videoMode.getResolutionY() << std::endl;
  std::cout << "pixelFormat " << pixelFormatString(videoMode.getPixelFormat()) << std::endl;
  std::cout << ">>>>>>>>>>>>>>>>>" << std::endl;
}

void Init(Handle<Object> exports) {


  Isolate* isolate = Isolate::GetCurrent();
  exports->Set(String::NewFromUtf8(isolate, "hello"),
      FunctionTemplate::New(isolate, Method)->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "update"),
      FunctionTemplate::New(isolate, Update)->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "getHead"),
      FunctionTemplate::New(isolate, GetHead)->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "getFrame"),
      FunctionTemplate::New(isolate, GetFrame)->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "close"),
      FunctionTemplate::New(isolate, Close)->GetFunction());

  openni::OpenNI::initialize();
  // nite::NiTE::initialize();

  if (g_device.open(openni::ANY_DEVICE) != openni::STATUS_OK) {
    printf("CANNOT OPEN DEVICE %s\n", openni::OpenNI::getExtendedError());

    isClosed = true;
    return;
  }

  g_device.setImageRegistrationMode(openni::IMAGE_REGISTRATION_DEPTH_TO_COLOR);
  g_device.setDepthColorSyncEnabled( true );

  openni::Status nRetVal;

  ///
  
  printf("User tracker..\n");
/*
  niteRc = userTracker.create(&g_device);
  if (niteRc != nite::STATUS_OK)
  {
    printf("Couldn't create user tracker\n");
    return;
  }
*/
  ///

  printf("Color...\n");

  g_colorSensorInfo = g_device.getSensorInfo(openni::SENSOR_COLOR);
  nRetVal = g_colorStream.create(g_device, openni::SENSOR_COLOR);
  if (nRetVal != openni::STATUS_OK) {
    printf("Could not open stream..");
    return;
  }
  nRetVal = g_colorStream.start();
  if (nRetVal != openni::STATUS_OK) {
    printf("Could not start stream..");
    return;
  }
  g_colorStream.setVideoMode(g_colorSensorInfo->getSupportedVideoModes()[0]);
  g_colorStream.start();

  ///

  printf("Depth...\n");

  g_depthSensorInfo = g_device.getSensorInfo(openni::SENSOR_DEPTH);
  nRetVal = g_depthStream.create(g_device, openni::SENSOR_DEPTH);
  if (nRetVal != openni::STATUS_OK) {
    printf("Could not open stream..");
    return;
  }
  nRetVal = g_depthStream.start();
  if (nRetVal != openni::STATUS_OK) {
    printf("Could not start stream..");
    return;
  }

  const openni::Array<openni::VideoMode> &arr = g_colorSensorInfo->getSupportedVideoModes();
  std::cout << "SUPPORTED VIDEO MODES" << std::endl;
  for (int i = 0; i < arr.getSize(); i++) {
    std::cout << "[" << i << "]" << std::endl;
    printVideoMode(arr[i]);
  }
  std::cout << "END SUPPORTED VIDEO MODE" << std::endl;

  g_depthStream.setVideoMode(g_depthSensorInfo->getSupportedVideoModes()[1]);
  g_depthStream.start();


  std::cout << "CURRENT VIDEO MODE" << std::endl;
  printVideoMode(g_depthStream.getVideoMode());


  ///

  printf("\nStart moving around to get detected...\n(PSI pose may be required for skeleton calibration, depending on the configuration)\n");

}

NODE_MODULE(hello, Init)