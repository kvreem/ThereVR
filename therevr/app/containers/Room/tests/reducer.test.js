
import { fromJS } from 'immutable';
import roomReducer from '../reducer';

describe('roomReducer', () => {
  it('returns the initial state', () => {
    expect(roomReducer(undefined, {})).toEqual(fromJS({}));
  });
});
