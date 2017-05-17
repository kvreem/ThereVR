#ifndef PUPIL_DETECT_HPP_
#define PUPIL_DETECT_HPP_

#include <opencv2/opencv.hpp>

typedef struct {
  uint32_t x;
  uint32_t y;
} CoordinateData_t;

class EyeTrackingApp {
public:
  EyeTrackingApp();
  ~EyeTrackingApp();
  CoordinateData_t getCoordinates();
  void setCoordinates(uint32_t newX, uint32_t newY);
	CoordinateData_t read();
	void detect(cv::Mat&);

	int frameCount;
  double fps, startTime, elapsedTime;

private:
  CoordinateData_t coords;
  cv::VideoCapture *capture;
};

#endif /* PUPIL_DETECT_HPP_ */
