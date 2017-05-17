#include <fstream>
#include <math.h>
#include <stdio.h>
#include <opencv2/objdetect/objdetect.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include "pupil_detect.hpp"

EyeTrackingApp::EyeTrackingApp() {
  coords = {
    .x = 0,
    .y = 0
  };

  std::ofstream fs;
  fs.open("output.csv");
  fs << "x" << "," << "y" << std::endl;

  capture = new cv::VideoCapture(0);

  if(!capture->isOpened()) {
    std::cout << "Cannot open camera";
  }

  fps = capture->get(cv::CAP_PROP_FPS);
  std::cout << "fps: " << fps << std::endl;

  frameCount = 0;
  startTime = cv::getTickCount();
}

CoordinateData_t EyeTrackingApp::getCoordinates(){
  return coords;
}

void EyeTrackingApp::setCoordinates(uint32_t newX, uint32_t newY){
  coords.x = newX;
  coords.y = newY;
}

CoordinateData_t EyeTrackingApp::read() {
    frameCount++;

    cv::Mat frame, cropped;
    
    capture->read(frame);
    resize(frame, frame, cv::Size(300,300), 0, 0, 1);

    detect(frame);
    
    cv::imshow("cam", frame);

  return getCoordinates();
}

void EyeTrackingApp::detect(cv::Mat& image) {
  cv::Mat in;
  std::vector<cv::Mat> channels;
  
  //Convert to grayscale
  cv::cvtColor(image, in, CV_BGR2GRAY);

  threshold(in, in, 70, 255, cv::THRESH_BINARY);
  cv::imshow("thresh", in);
  cv::moveWindow("thresh", 100, 500);
  
  //Smooth out edges to reduce noise
  cv::GaussianBlur(in, in, cv::Size(9, 9), 2, 2);
    
  //Storage for detected circles
  std::vector<cv::Vec3f> circles;
  
  //Canny edge detection
  cv::Canny(in, in, 15, 40, 3);//20, 60 | 10, 40
  cv::imshow("edge", in);
  cv::moveWindow("edge", 500, 500);
  
  cv::HoughCircles(in, circles, CV_HOUGH_GRADIENT, 1, in.rows/2, 40, 15, 10, 30);

  for(size_t i = 0; i < circles.size(); i++) {
    cv::Point center(cvRound(circles[i][0]), cvRound(circles[i][1]));

    //Draw center
    cv::circle(image, center, 7, cv::Scalar(0, 255, 0), -1, 8, 0);
    setCoordinates(center.x, center.y);
  }
  
}
