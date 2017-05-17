import { createSelector } from 'reselect';
import { fromJS, Map, List } from 'immutable';

/**
 * Direct selector to the authHoc state domain
 */
const selectAuthHocDomain = () => (state) => state.get('authHoc');

/**
 * Other specific selectors
 */

const selectUser = (state) => state.get('user');

const selectCurrentUser = createSelector(
	selectUser,
	(userState) => {console.log(userState.toJS()); return userState.get('currentUser')}
)

const selectContacts = createSelector(
	selectUser,
	(userState) => userState.get('contacts')
)

// doing this to remediate issue with "friendObj"
const selectContactsFakeStatus = createSelector(
	selectContacts,
	(contacts) => {
		return contacts.toJS();
		// return contacts.map(contact => {
		// 	return contact
		// 	.set('status', 'online')
		// 	.set('user_id', contact.get('id'))
		// 	.set('profile_picture', `https://therevr.s3.amazonaws.com/${contact.get('id')}`)
		// }).toJS();
	}
)

const selectCurrentProfileId = (state, props) => ( props.routeParams || {routeParams: null} ).userId;
const selectCurrentProfile = createSelector(
	selectCurrentUser,
	selectContactsFakeStatus,
	selectCurrentProfileId,
	(currentUser, contacts, currentProfileId) => {
		if (currentUser && currentUser.user_id == currentProfileId) {
			return currentUser;
		} else {
			return contacts.find(contact => {
				return contact.user_id == currentProfileId
			});
		}
	}
)

const selectRoom = (state, props) => {
	return (state.get('user').get('rooms') || List())
	.find((value) => {return value.get('_id') == props.params.roomId})
}

const fillRoom = (room, contacts, currentUser) => {
	if (!room) return null;

	const users = room.get('users').map((user) => {
		const userData = {
			data: null,
			rejected: room.get('rejectedUsers').indexOf(user) > -1,
			active: room.get('activeUsers').indexOf(user) > -1,
			accepted: room.get('acceptedUsers').indexOf(user) > -1
		}
		console.log("!")
		if (user == currentUser._id) userData.data = currentUser;
		else {
			if (contacts.find( (contact) => contact.get('_id') == user ))
				userData.data = contacts.find( (contact) => contact.get('_id') == user ).toJS();
		}
		console.log("?")

		return userData;
	});

	var callState = "In Call";
	if ((users.size - room.get('rejectedUsers').size) == 1) {
		callState = "Call Ended";
	} else if (room.get('activeUsers').size == 1) {
		callState = "Calling";
	} else if (room.get('activeUsers').size == 0) {
		callState = "Call Ended";
	}

	const inRoom = room.get('activeUsers').indexOf(currentUser._id) > -1;

	return room
		.set('users', users)
		.set('callState', callState)
		.set('inRoom', inRoom)
		.toJS();
}

const makeSelectRoomWithContacts = () => createSelector(
	selectRoom, selectContacts, selectCurrentUser,
	(room, contacts, currentUser) => {
		return fillRoom(room, contacts, currentUser);
	}
)

const selectRooms = createSelector(
	selectUser, selectContacts, selectCurrentUser,
	(userState, contacts, currentUser) => {
		return userState.get('rooms').filter((room) => room.get('users').indexOf(currentUser._id) > -1).map((room) => {
			return fillRoom(room, contacts, currentUser);
		}).toJS()
	}
)

const selectCurrentRoom = createSelector(
	selectUser, selectContacts, selectCurrentUser,
	(userState, contacts, currentUser) => {
		const room = userState.get('rooms').find((room) => room.get('activeUsers').indexOf(currentUser._id) > -1);
		if (room) {
			return fillRoom(room, contacts, currentUser);
		}
	}
)

// const selectRoomsList = createSelector(
// 	[ selectContacts, selectRooms ],
// 	(contacts, rooms) => {
// 		return {contacts, rooms};
// 	}
// )

/**
 * Default selector used by AuthHoc
 */

const makeSelectAuthHoc = () => createSelector(
  selectAuthHocDomain(),
  (substate) => substate
);

export default makeSelectAuthHoc;
export {
  selectAuthHocDomain,
  selectUser,
  selectCurrentUser,
  selectRooms,
  selectCurrentRoom,
  selectContacts,
  selectContactsFakeStatus,
  selectCurrentProfile,
  selectRoomsList,
  makeSelectRoomWithContacts
};
