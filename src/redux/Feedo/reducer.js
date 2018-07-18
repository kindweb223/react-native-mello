import * as types from './types'

const initialState = {
  loading: null,
  error: null,
  feedoList: null,
  pinResult: null,
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_FEEDO_LIST_PENDING:
      return {
        ...initialState,
      }
    case types.GET_FEEDO_LIST_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: 'GET_FEEDO_LIST_FULFILLED',
        feedoList: data.content,
      }
    }
    case types.GET_FEEDO_LIST_REJECTED: {
      return {
        ...state,
        loading: 'GET_FEEDO_LIST_REJECTED',
        error: action.error,
      }
    }
    case types.PIN_FEED_PENDING: {
      return {
        ...state,
        pinResult: null,
        erro: null,
      }
    }
    case types.PIN_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: 'PIN_FEED_FULFILLED',
        pinResult: data,
      }
    }
    case types.PIN_FEED_REJECTED: {
      return {
        ...state,
        loading: 'PIN_FEED_REJECTED',
        error: action.error,
      }
    }
    default:
      return state;
  }
}
