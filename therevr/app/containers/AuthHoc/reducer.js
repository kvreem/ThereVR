/*
 *
 * AuthHoc reducer
 *
 */

import { fromJS, Set, List } from 'immutable';
import { filterRecents, findUser, saveToStorage } from 'services/reducerHelpers/index';
import {
  ACTIONS,
} from './constants';


const initialState = fromJS({
  currentUser: null,
  beingCalled: false,
  calling: false,

  contacts: [],
  rooms: [],
  loadingRooms: false,
  loadingContacts: false
});

function authHocReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.LOGIN_SUCCESS:
      // Grabbing friends
      const friendObj = action.userInfo[1];
      // Getting online friends
      const onlineFriends = friendObj.filter((item) => {
        if (item.status === 'online') return item;
      });
      // Making recent a friendObj
      const madeRecent = [];
      friendObj.filter((friend) => {
        action.userInfo[0].recent.map((friendId) => {
          if (friendId === friend.user_id) madeRecent.push(friend);
        });
      });
      // Putting the friends object in currentUser
      const currentUser = Object.assign({}, action.userInfo[0], {
        friendObj,
        onlineFriends,
        recent: madeRecent,
      });
      saveToStorage(currentUser);
      // Setting state
      return state
        .set('currentUser', currentUser);

    case ACTIONS.LOGIN_FAILED:
      return state.set('currentUser', null);

    case ACTIONS.GET_USER_TO_CALL:
      const firendsOnline = state.get('currentUser').friendObj;
      const callingFriend = findUser(firendsOnline, action);
      return state.set('callingFriend', callingFriend);

    case ACTIONS.ADD_TO_RECENT:
      const allFriends = state.get('currentUser').friendObj;
      const recents = state.get('currentUser').recent;
      const foundUser = findUser(allFriends, action);
      const newRecents = filterRecents(recents, foundUser, action);

      const addRecents = Object.assign({}, state.get('currentUser'), {
        recent: newRecents,
      });
      saveToStorage(addRecents);
      return state.set('currentUser', addRecents);

    case ACTIONS.CHANGE_CURRENT_USER_STATUS:
      const changeStatus = state.get('currentUser');
      const changedUserStatus = Object.assign({}, changeStatus, {
        status: action.status,
      });
      saveToStorage(changedUserStatus);
      return state.set('currentUser', changedUserStatus);

    case ACTIONS.FRIENDS_STATUS_CHANGED:
      console.log(action);
      const userLoggedIn = state.get('currentUser');
      if (userLoggedIn.user_id === action.userId) return state;

      const friendUpdated = findUser(userLoggedIn.friendObj, action);
      console.log(friendUpdated);
      if (!friendUpdated) return state;

      friendUpdated.status = action.status;
      const newFriends = userLoggedIn.friendObj.map((friend) => {
        if (friend.user_id === friendUpdated.user_id) return friendUpdated;
        return friend;
      });

      const updateRecent = state.get('currentUser').recent.map((friend) => {
        if (friend.user_id === friendUpdated.user_id) return friendUpdated;
        return friend;
      });

      let online = state.get('currentUser').onlineFriends.map((friend) => {
        if (friend.user_id === friendUpdated.user_id && friendUpdated.status !== 'offline') return friendUpdated;
        return friend;
      });

      if (online.length === 0 && friendUpdated.status === 'online') {
        online = [friendUpdated];
      }

      if (online.length === 0 && friendUpdated.status !== 'online') {
        online = [];
      }

      const updatedUser = Object.assign({}, userLoggedIn, {
        friendObj: newFriends,
        recent: updateRecent,
        onlineFriends: online.filter((item) => {
          if (item.status !== 'offline') return item;
        }),
      });
      saveToStorage(updatedUser);
      return state.set('currentUser', updatedUser);

    case ACTIONS.CALL_USER:
      const isThisUser = state.get('currentUser').user_id;
      if (isThisUser === action.userId.calling) {
        const userThatIsCalling = state.get('currentUser').friendObj.filter((item) => {
          if (item.user_id === action.userId.caller) return item;
        })[0];
        return state.set('calledBy', userThatIsCalling);
      }
      if (isThisUser === action.userId.caller) return state.set('calling', true);
      return state;

    case ACTIONS.END_CALL:
      const newState = state.set('calledBy', null);
      return newState.set('calling', false);

    case ACTIONS.LOGOUT:
      return initialState;

    case ACTIONS.RESTORE_STATE:
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));

      return state
        .set('currentUser', storedUser);

    case ACTIONS.UPLOAD_PICTURE_SUCCESS:
      // const changePic = Object.assign({}, state.get('currentUser'), {
      //   profile_picture: action.newPic,
      // });
      return state;

    case ACTIONS.UPLOAD_PICTURE_REQUEST:
      const changePic = Object.assign({}, state.get('currentUser'), {
        profile_picture: action.file.target.result,
      });
      return state.set('currentUser', changePic);

    case ACTIONS.FETCH_CONTACTS:
      return state.set('loadingContacts', true)
    case ACTIONS.FETCH_CONTACTS_SUCCESS:
      console.log(fromJS(action.contacts).toJS());
      return state
        .set('loadingContacts', false)
        .set('contacts', fromJS( action.contacts ));
    case ACTIONS.FETCH_ROOMS:
      return state.set('loadingRooms', true)
    case ACTIONS.FETCH_ROOMS_SUCCESS:
      console.log(action.rooms);
      console.log(fromJS(action.rooms));

      return state
        .set('rooms', fromJS(action.rooms))
        .set('loadingRooms', false)
    case ACTIONS.FETCH_ROOMS_FAILED:
      return state.set('loadingRooms', false)

    case ACTIONS.ACCEPT_ROOM:
      return state;
    case ACTIONS.REJECT_ROOM:
      return state;

    case ACTIONS.REJECT_ROOM_SUCCESS:
    case ACTIONS.ACCEPT_ROOM_SUCCESS: 
    {
      console.log(action.call);
      const rooms = state.get('rooms');
      const index = rooms.findIndex((value) => { return value.get('_id') == action.call._id});
      console.log(index);
      console.log(rooms.toJS());

      if (index > -1) {
        return state.set('rooms', rooms.set(index, fromJS(action.call))).sort((a, b) => (
          (new Date(a)).getTime()-(new Date(b)).getTime()
        ));
      } else {
        return state.update('rooms', rooms => rooms.push(
          fromJS(action.call)
        )).sort((a, b) => (
          (new Date(a)).getTime()-(new Date(b)).getTime()
        ));
      }
    }

    default:
      return state;
  }
}

export default authHocReducer;
