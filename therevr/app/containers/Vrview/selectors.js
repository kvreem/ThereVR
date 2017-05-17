import { createSelector } from 'reselect';

/**
 * Direct selector to the vrview state domain
 */
const selectVrviewDomain = () => (state) => state.get('vrview');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Vrview
 */

const makeSelectVrview = () => createSelector(
  selectVrviewDomain(),
  (substate) => substate.toJS()
);

export default makeSelectVrview;
export {
  selectVrviewDomain,
};
