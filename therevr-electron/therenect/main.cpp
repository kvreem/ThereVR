#include <iostream>

#include "NiTE.h"

int main(int argc, char **argv) {
  nite::UserTracker userTracker;
  nite::Status niteRc;

  nite::NiTE::initialize();

  niteRc = userTracker.create();
  if (niteRc != nite::STATUS_OK)
  {
    printf("Couldn't create user tracker\n");
    return 3;
  }
  printf("\nStart moving around to get detected...\n(PSI pose may be required for skeleton calibration, depending on the configuration)\n");

  nite::UserTrackerFrameRef userTrackerFrame;

  while (true) {
    niteRc = userTracker.readFrame(&userTrackerFrame);
    if (niteRc != nite::STATUS_OK)
    {
      printf("Get next frame failed\n");
      continue;
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
        if (head.getPositionConfidence() > .5)
        printf("%d. (%5.2f, %5.2f, %5.2f)\n", user.getId(), head.getPosition().x, head.getPosition().y, head.getPosition().z);
      }
    }
  }

  printf("hello, world!\n");
}