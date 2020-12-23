import { igAccountStatsReducer } from '../reducer';
import { addIgAccountStats } from '../actions';
import { loadingState, mockStats, expectetState, successState } from './reducer.stubb';

describe('igAccountStats reducer', () => {
  describe('handles addIgAccountStats action', () => {
    test('(without initial stats)', () => {
      expect(igAccountStatsReducer.reducer(loadingState, addIgAccountStats(mockStats))).toEqual(
        expectetState
      );
    });
    test('(with initial stats)', () => {
      expect(igAccountStatsReducer.reducer(successState, addIgAccountStats(mockStats))).toEqual(
        expectetState
      );
    });
  });
});
