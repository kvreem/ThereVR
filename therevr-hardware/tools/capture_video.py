"""
CODE TAKEN FROM:
http://www.pyimagesearch.com/2016/02/22/writing-to-video-with-opencv/

Imported Modules
++++++++++++++++
imutils
    gives access to builtin/USB webcames as well as raspi camera
    Req: NumPy, SciPy, Matplotlib, and OpenCV

Depending on your video codecs that your machine supports the extension of the
file and the codec pair will be different

MAC COMMAND: python capture_video.py -o example.mp4 --picamera 0 --codec mp4v


"""
from __future__ import print_function
import argparse
import time
import sys
import imp

def check_for_python_modules():
    any_missing = (__check_for_python_module("numpy") and \
    __check_for_python_module("imutils") and \
    __check_for_python_module("scipy") and \
    __check_for_python_module("matplotlib"))

    if not any_missing:
        sys.exit(1)

def __check_for_python_module(module):
    found = True
    try:
        imp.find_module(module)
    except ImportError:
        print("Sorry you don't have module {0}".format(module))
        found = False
    return found

def args_parse():
    """ Retreives & parses the arguments from command line

    Grabs the arguments passed to the script from command line. The argument
    string is automatically grabbed by parse_args() function and parsed into
    a dictionary.
    
    --output flag must have correct extension for given codec
    --codec flag is called FourCC, it is always four characters

    Returns:
        A dict containing all parsed arguments from command line, optional args
        not provided from script execution is None
    """
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--output", required = False,
                    help = "path to output video file")
    ap.add_argument("-p", "--picamera", type = int, default = 1,
                    help = "whether or not the Raspberry Pi Camera is used")
    ap.add_argument("-f", "--fps", type = int, default = 20,
                    help = "FPS of output video")
    ap.add_argument("-c", "--codec", type = str, default = "MJPG",
                    help = "codec of output video")
    args = vars(ap.parse_args())

    return args


def main():
    import numpy as np
    import imutils
    from imutils.video import VideoStream
    import cv2

    args = args_parse()

    # intialize the video stream and allow the camera sensor to warmup
    print("[INFO] warming up camera")
    vs = VideoStream(usePiCamera=args["picamera"] > 0).start()
    time.sleep(2.0)

    # initialize the FourCC, video writer, dimensions of the frame, and zeros
    # array
    if args["picamera"] > 0:
        fourcc = cv2.VideoWriter_fourcc(*args["codec"])
    else:
        fourcc = cv2.cv.CV_FOURCC(*args["codec"])
    writer = None
    (h, w) = (None, None)
    zeros = None

    rotateState = 0
    MAX_ROTATE_STATE = 4;

    while True:
        # grab the frame from the video stream and reize to max width = 300p
        frame = vs.read()
        frame = imutils.resize(frame, width = 300)
        frame = imutils.rotate(frame, angle=90*(rotateState%MAX_ROTATE_STATE))

        if (writer is None) and (args["output"]is not None):
            # default image dimensions captured by the camera
            (h, w) = frame.shape[:2]
            writer = cv2.VideoWriter(args["output"], fourcc, args["fps"],
                                    (w, h), True)
            zero = np.zeros((h,w), dtype="uint8")

        # check if writer is None
        if writer is not None:
            writer.write(frame)

        cv2.imshow("Frame", frame)
        key = cv2.waitKey(1)

        if key == ord("q"):
            break

        # 63234 == key value for left arrow on MAC
        if key == 63234:
            rotateState += 1;
            

    print("[INFO] cleaning up...")
    cv2.destroyAllWindows()
    vs.stop()

    if writer is not None:
        writer.release()

if __name__ == '__main__':
    check_for_python_modules()
    main()
