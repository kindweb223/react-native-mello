import { AsyncStorage } from 'react-native'
import axios from 'axios'
import * as types from './types'
import resolveError from './../../service/resolveError'

const initialState = {
  loading: null,
  error: null,
  contactList: [],
  userInfo: null
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_SIGNIN_PENDING:
      return {
        ...initialState,
        loading: types.USER_SIGNIN_PENDING,
        userInfo: null,
      }
    case types.USER_SIGNIN_FULFILLED: {
      const { data, headers } = action.result
      const xAuthToken = headers['x-auth-token']

      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        AsyncStorage.setItem('xAuthToken', xAuthToken)
        AsyncStorage.setItem('userInfo', JSON.stringify(data))
      } else {
        AsyncStorage.removeItem('xAuthToken')
        AsyncStorage.removeItem('userInfo')
      }

      return {
        ...state,
        error: null,
        userInfo: data,
        loading: types.USER_SIGNIN_FULFILLED
      }
    }
    case types.USER_SIGNIN_REJECTED: {
      console.log('USER_SIGNIN_REJECTED: ', action.result)
      return {
        ...state,
        loading: types.USER_SIGNIN_REJECTED,
        userInfo: null,
        error: resolveError('error.login.invalid', 'Your email or password is incorrect')
      }
    }
    case types.USER_SIGNOUT_PENDING:
      return {
        ...state,
        loading: types.USER_SIGNOUT_PENDING,
      }
    case types.USER_SIGNOUT_FULFILLED: {
      const { data } = action.result
      AsyncStorage.removeItem('xAuthToken')
      AsyncStorage.removeItem('userInfo')

      return {
        ...state,
        loading: types.USER_SIGNOUT_FULFILLED,
      }
    }
    case types.USER_SIGNOUT_REJECTED: {
      return {
        ...state,
        loading: types.USER_SIGNOUT_REJECTED,
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
      return {
        ...state,
        contactList: data,
        loading: types.GET_CONTACT_LIST_FULFILLED,
      }
    }
    case types.GET_CONTACT_LIST_REJECTED: {
      return {
        ...state,
        contactList: [],
        loading: types.GET_CONTACT_LIST_REJECTED,
        error: action.error,
      }
    }
    /**
     * set userinfo from storage
     */
    case types.SET_USER_INFO: {
      const data = action.payload
      return {
        ...state,
        userInfo: data
      }
    }
    default:
      return state;
  }
}
