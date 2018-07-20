import * as types from './types'

const initialState = {
  status: null,
  error: null,
  feed: {},
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    case types.CREATE_FEED_PENDING:
      return {
        ...initialState,
        status: types.CREATE_FEED_PENDING,
      }
    case types.CREATE_FEED_FULFILLED: {
      const { data } = action.result
      console.log('CREATE_FEED_FULFILLED : ', date);
      return {
        ...state,
        status: types.CREATE_FEED_FULFILLED,
        feed: data,
      }
    }
    case types.CREATE_FEED_REJECTEDD: {
      console.log('CREATE_FEED_REJECTEDD : ', action.error);
      return {
        ...state,
        status: types.CREATE_FEED_REJECTEDD,
        error: action.error,
      }
    }
    case types.UPDATE_FEED_PENDING:
      return {
        ...initialState,
        status: types.UPDATE_FEED_PENDING,
      }
    case types.UPDATE_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.UPDATE_FEED_FULFILLED,
        feed: data,
      }
    }
    case types.UPDATE_FEED_REJECTED: {
      return {
        ...state,
        status: types.UPDATE_FEED_REJECTED,
        error: action.error,
      }
    }
    case types.DELETE_FEED_PENDING:
      return {
        ...initialState,
        status: types.DELETE_FEED_PENDING,
      }
    case types.DELETE_FEED_FULFILLED: {
      return {
        ...state,
        status: types.DELETE_FEED_FULFILLED,
        feed: {},
      }
    }
    case types.DELETE_FEED_REJECTED: {
      return {
        ...state,
        status: types.DELETE_FEED_REJECTED,
        error: action.error,
      }
    }

    default:
      return state;
  }
}
