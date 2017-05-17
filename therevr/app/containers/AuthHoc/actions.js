/*
 *
 * AuthHoc actions
 *
 */

import {
  DEFAULT_ACTION,
  ACTIONS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loginAttempt(userInfo, nextRoute) {
  return {
    type: ACTIONS.LOGIN_ATTEMPT,
    userInfo,
    nextRoute,
  };
}

export function loginSuccess(userInfo) {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    userInfo,
  };
}

export function loginFailed() {
  return {
    type: ACTIONS.LOGIN_FAILED,
  };
}

export function getCallUser(userId) {
  return {
    type: ACTIONS.GET_USER_TO_CALL,
    userId,
  };
}

export function updateRecent(userId) {
  return {
    type: ACTIONS.ADD_TO_RECENT,
    userId,
  };
}

export function updateCurrentUserStatus(status) {
  return {
    type: ACTIONS.CHANGE_CURRENT_USER_STATUS,
    status,
  };
}

export function requestStatusChange(status, userId) {
  return {
    type: ACTIONS.REQUEST_CHANGE_CURRENT_USER_STATUS,
    status,
    userId,
  };
}

export function changeFriendsStatus(status, userId) {
  return {
    type: ACTIONS.FRIENDS_STATUS_CHANGED,
    status,
    userId,
  };
}

export function callUser(userId) {
  return {
    type: ACTIONS.CALL_USER,
    userId,
  };
}

export function endCall(userIds) {
  return {
    type: ACTIONS.END_CALL,
    userIds,
  };
}

export function addRecentApi(userId, recents) {
  return {
    type: ACTIONS.ADD_TO_RECENT_API,
    userId,
    recents,
  };
}

export function logout() {
  return {
    type: ACTIONS.LOGOUT,
  };
}

export function restoreState() {
  return {
    type: ACTIONS.RESTORE_STATE,
  };
}

export function uploadPicture(file, user, fileObj, update) {
  return {
    type: ACTIONS.UPLOAD_PICTURE_REQUEST,
    file,
    user,
    fileObj,
    update,
  };
}

export function uploadPictureSuccess(newPic) {
  return {
    type: ACTIONS.UPLOAD_PICTURE_SUCCESS,
    newPic,
  };
}

export function uploadPictureFailed(err) {
  return {
    type: ACTIONS.UPLOAD_PICTURE_FAILED,
    err,
  };
}

//

export function fetchRooms() {
  return {
    type: ACTIONS.FETCH_ROOMS
  }
}

export function fetchRoomsSuccess(rooms) {
  return {
    type: ACTIONS.FETCH_ROOMS_SUCCESS,
    rooms
  }
}

export function fetchRoomsFailed(err) {
  return {
    type: ACTIONS.FETCH_ROOMS_FAILED,
    err
  }
}

export function acceptCall(call) {
  return {
    type: ACTIONS.ACCEPT_ROOM,
    call
  }
}

export function acceptCallSuccess(call) {
  return {
    type: ACTIONS.ACCEPT_ROOM_SUCCESS,
    call
  }
}

export function rejectCall(call) {
  return {
    type: ACTIONS.REJECT_ROOM,
    call
  }
}

export function rejectCallSuccess(call) {
  return {
    type: ACTIONS.REJECT_ROOM_SUCCESS,
    call
  }
}

export function createRoom(contact) {
  console.log("ahsdas")
  return {
    type: ACTIONS.CREATE_ROOM,
    contact
  }
}

export function fetchContacts() {
  return {
    type: ACTIONS.FETCH_CONTACTS
  }
}

export function fetchContactsSuccess(contacts) {
  return {
    type: ACTIONS.FETCH_CONTACTS_SUCCESS,
    contacts
  }
}
