import {
  GET_FEEDO_LIST_PENDING,
  GET_FEEDO_LIST_FULFILLED,
  GET_FEEDO_LIST_REJECTED
} from './types'

const initialState = {
  loading: null,
  error: null,
  feedoList: null,
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    case GET_FEEDO_LIST_PENDING:
      return {
        ...initialState,
      }
    case GET_FEEDO_LIST_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        feedoList: data.content,
        loading: 'GET_FEEDO_LIST_FULFILLED',
      }
    }
    case GET_FEEDO_LIST_REJECTED:
      return {
        ...state,
      }
    default:
      return state;
  }
}
