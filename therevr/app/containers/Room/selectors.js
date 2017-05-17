import { createSelector } from 'reselect';

/**
 * Direct selector to the room state domain
 */
const selectRoomDomain = () => (state) => state.get('room');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Room
 */

const makeSelectRoom = () => createSelector(
  selectRoomDomain(),
  (substate) => substate.toJS()
);

export default makeSelectRoom;
export {
  selectRoomDomain,
};
