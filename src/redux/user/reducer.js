import {
  USER_LOGIN_PENDING,
  USER_LOGIN_FULFILLED,
  USER_LOGIN_REJECTED
} from './types'

const initialState = {
  loading: null,
  error: null,
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case USER_LOGIN_PENDING:
      return {
        ...initialState,
      }
    case USER_LOGIN_FULFILLED: {
      console.log('LOGIN_RESULT: ', action)
      return {
        ...state,
        loading: 'USER_LOGIN_FULFILLED',
      }
    }
    case USER_LOGIN_REJECTED: {
      console.log('LOGIN_ERROR: ', action)
      return {
        ...state,
        loading: 'USER_LOGIN_REJECTED',
        error: action.error,
      }
    }
    default:
      return state;
  }
}
