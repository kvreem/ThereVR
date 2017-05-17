import { put, takeLatest, take, select, cancel } from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';

import {
  loginUser, changeStatus,
  updateApiRecents, uploadPic
} from 'services/api/index';

import {
  loginSuccess, loginFailed,
  updateCurrentUserStatus, uploadPictureSuccess,
  fetchRoomsSuccess, fetchRoomsFailed,
  fetchContactsSuccess,
  acceptCallSuccess,
  rejectCallSuccess
} from './actions';

import {
  selectCurrentUser
} from './selectors';

import { ACTIONS } from './constants';
/* eslint-disable */
// Functions

// Logs user in
export function* logUserIn(action) {
  const { userInfo } = action;
  console.log( "logUserIn", userInfo );

  try {
    const response = yield loginUser(userInfo);

    if (!response.success) return put(loginFailed());

    yield put(loginSuccess(response.content));
    const route = `/home`;
    return yield put(push(route));
  }
  catch (err) {
    console.log(err);
    return put(loginFailed());
  }
}

export function* logUserOut(action) {
  return yield put(push('/'));
}

// LChanges Users status
export function* changeCurrentUserStatus(action) {
  const { status, userId } = action;

  try {
    const body = {
      status,
      user_id: userId,
    };
    const response = yield changeStatus(body);

    yield put(updateCurrentUserStatus(response.content.status));

  }
  catch (err) {
    console.log(err);
  }
}

// Updates users recents
export function* updateRecent(action) {
  const { userId, recents } = action;

  try {
    const recent_ids = recents.map((friend) => {
      return friend.user_id;
    }).filter((item) => {
      if (item) return item;
    });

    const body = {
      recent_ids,
      user_id: userId,
    };
    const response = yield updateApiRecents(body);

  }
  catch (err) {
    console.log(err);
  }
}

//  uploads users new picture
export function* uploadPicture(action) {
  const { file, user, fileObj, update } = action;

  try {
    const data = {
      data_uri: file.target.result,
      filename: fileObj.name,
      filetype: fileObj.type,
      user,
    };

    const response = yield uploadPic(data);
    yield put(uploadPictureSuccess(response.content[0].profile_picture));
    update();
  }
  catch (err) {
    console.log(err);
  }
}

export function* fetchRooms(action, state) {
  try {
    const currentUser = yield select(selectCurrentUser);

    console.log(`/api/rooms/${currentUser.user_id}`);

    var res = yield fetch(`/api/rooms/${currentUser.user_id}`, {method: 'GET'});
    var json = yield res.json();

    if (json.success) {
      yield put(fetchRoomsSuccess(json.results));
    } else {
      yield put(fetchRoomsFailed(json.err));
    }

  } catch(err) {
    yield put(fetchRoomsFailed(err));
  }
}

export function* fetchContacts(action, state) {
  try {
    const currentUser = yield select(selectCurrentUser);

    var res = yield fetch(`/api/contacts/${currentUser.user_id}`, {method: 'GET'});
    var json = yield res.json();

    if (json.success) {
      yield put(fetchContactsSuccess(json.results.contacts));
    } else {
      console.log(json.err);
    }
  } catch(err) {
    console.log(err);
  }
}

export function* createRoom(action, state) {
  try {
    const currentUser = yield select(selectCurrentUser);

    var res = yield fetch(`/api/rooms/create/${currentUser.user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipients: [action.contact.user_id]
      })
    })

    var json = yield res.json();

    if (json.success) {
      console.log("Success");
      yield put(push(`/room/${json.room._id}`));
    } else {
      console.error( json )
    }
  } catch(err) {
    console.error(err);
  }
}

export function* acceptCall(action, state) {
  const currentUser = yield select(selectCurrentUser);

  var res = yield fetch(`/api/rooms/accept/${currentUser.user_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomid: [action.call._id]
    })
  })

  var json = yield res.json();

  if (json.success) {
    yield put(acceptCallSuccess(json.room));
    yield put(push(`/room/${json.room._id}`));
  }

  console.log("accept", action);
}

export function* rejectCall(action, state) {
  const currentUser = yield select(selectCurrentUser);

  var res = yield fetch(`/api/rooms/reject/${currentUser.user_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomid: [action.call._id]
    })
  })

  var json = yield res.json();

  if (json.success) {
    yield put(rejectCallSuccess(json.room));
    yield put(push('/home'));
  }

  console.log("reject", action);
}

// Watchers these functions watch for an action. When they see this action they
// call the appropriate function. The action still gets passed to the reducer.
function* watchLogin() {
  const watcher1 = yield takeLatest(ACTIONS.LOGIN_ATTEMPT, logUserIn);
  // only allow fetching room if we have logged in
  const watcher2 = yield takeLatest(ACTIONS.FETCH_CONTACTS, fetchContacts);
  const watcher3 = yield takeLatest(ACTIONS.FETCH_ROOMS, fetchRooms);
  const watcher4 = yield takeLatest(ACTIONS.CREATE_ROOM, createRoom);

  const watcher5 = yield takeLatest(ACTIONS.ACCEPT_ROOM, acceptCall);
  const watcher6 = yield takeLatest(ACTIONS.REJECT_ROOM, rejectCall);

    // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher1);
  yield cancel(watcher2);
  yield cancel(watcher3);
  yield cancel(watcher4);
  yield cancel(watcher5);
  yield cancel(watcher6);
}

function* watchLogout() {
  yield takeLatest(ACTIONS.LOGOUT, logUserOut);
}

function* watchChangeStatus() {
  yield takeLatest(ACTIONS.REQUEST_CHANGE_CURRENT_USER_STATUS, changeCurrentUserStatus);
}

function* watchUpdateRecent() {
  yield takeLatest(ACTIONS.ADD_TO_RECENT_API, updateRecent);
}

function* watchUploadPic() {
  yield takeLatest(ACTIONS.UPLOAD_PICTURE_REQUEST, uploadPicture);
}

// All sagas to be loaded
export default [
  watchLogin,
  watchLogout,
  watchChangeStatus,
  watchUpdateRecent,
  watchUploadPic,
];
