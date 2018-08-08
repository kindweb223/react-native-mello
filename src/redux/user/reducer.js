import * as types from './types'

const initialState = {
  loading: null,
  error: null,
  contactList: []
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_LOGIN_PENDING:
      return {
        ...initialState,
      }
    case types.USER_LOGIN_FULFILLED: {
      console.log('LOGIN_RESULT: ', action.result.data)
      return {
        ...state,
        loading: types.USER_LOGIN_FULFILLED,
      }
    }
    case types.USER_LOGIN_REJECTED: {
      console.log('LOGIN_ERROR: ', action)
      return {
        ...state,
        loading: types.USER_LOGIN_REJECTED,
        error: action.error,
      }
    }
    /**
     * Get user's contact list
     */
    case types.GET_CONTACT_LIST_PENDING:
      return {
        ...state,
        contactList: [],
        loading: types.GET_CONTACT_LIST_PENDING,
      }
    case types.GET_CONTACT_LIST_FULFILLED: {
      const { data } = action.result
      console.log('GET_CONTACT_LIST_FULFILLED: ', data)
      return {
        ...state,
        contactList: data,
        loading: types.GET_CONTACT_LIST_FULFILLED,
      }
    }
    case types.GET_CONTACT_LIST_REJECTED: {
      console.log('GET_CONTACT_LIST_ERROR: ', action)
      return {
        ...state,
        contactList: [],
        loading: types.GET_CONTACT_LIST_REJECTED,
        error: action.error,
      }
    }
    default:
      return state;
  }
}
