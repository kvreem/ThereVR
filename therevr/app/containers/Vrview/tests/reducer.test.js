
import { fromJS } from 'immutable';
import vrviewReducer from '../reducer';

describe('vrviewReducer', () => {
  it('returns the initial state', () => {
    expect(vrviewReducer(undefined, {})).toEqual(fromJS({}));
  });
});
