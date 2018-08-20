import { AsyncStorage } from 'react-native'
import axios from 'axios'
import * as types from './types'
import resolveError from './../../service/resolveError'

const initialState = {
  loading: null,
  error: null,
  contactList: [],
  userInfo: null,
  userSignUpData: null,
  userPhotoData: null,
  userLookup: null
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_LOOKUP_PENDING:
      return {
        ...state,
        error: null,
        userLookup: null,
        loading: types.USER_LOOKUP_PENDING,
      }
    case types.USER_LOOKUP_FULFILLED: {
      const { data } = action.result

      return {
        ...state,
        userLookup: data,
        loading: types.USER_LOOKUP_FULFILLED
      }
    }
    case types.USER_LOOKUP_REJECTED: {
      return {
        ...state,
        userLookup: null,
        loading: types.USER_LOOKUP_REJECTED
      }
    }
    /**
     * User signIn
     */
    case types.USER_SIGNIN_PENDING:
      return {
        ...state,
        loading: types.USER_SIGNIN_PENDING,
        userInfo: null,
      }
    case types.USER_SIGNIN_FULFILLED: {
      const { data, headers } = action.result
      const xAuthToken = headers['x-auth-token']

      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        AsyncStorage.setItem('xAuthToken', xAuthToken)
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
      return {
        ...state,
        loading: types.USER_SIGNIN_REJECTED,
        userInfo: null,
        error: resolveError('error.login.invalid', 'Your email or password is incorrect')
      }
    }
    /**
     * Get user's session
     */
    case types.GET_USER_SESSION_PENDING:
      console.log('GET_USER_SESSION_PENDING: ')
      return {
        ...state,
        loading: types.GET_USER_SESSION_PENDING,
        userInfo: null,
      }
    case types.GET_USER_SESSION_FULFILLED: {
      const { data } = action.result
      console.log('GET_USER_SESSION_FULFILLED: ', data)
      AsyncStorage.setItem('userInfo', JSON.stringify(data))

      return {
        ...state,
        error: null,
        userInfo: data,
        loading: types.GET_USER_SESSION_FULFILLED
      }
    }
    case types.GET_USER_SESSION_REJECTED: {
      console.log('GET_USER_SESSION_REJECTED: ', action.result)
      AsyncStorage.removeItem('userInfo')
      return {
        ...state,
        loading: types.GET_USER_SESSION_REJECTED,
        userInfo: null
      }
    }
    /**
     * User signup
     */
    case types.USER_SIGNUP_PENDING:
      return {
        ...state,
        loading: types.USER_SIGNUP_PENDING,
      }
    case types.USER_SIGNUP_FULFILLED: {
      const { data, headers } = action.result

      const xAuthToken = headers['x-auth-token']
      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        AsyncStorage.setItem('xAuthToken', xAuthToken)
      } else {
        AsyncStorage.removeItem('xAuthToken')
      }

      return {
        ...state,
        error: null,
        userSignUpData: data,
        loading: types.USER_SIGNUP_FULFILLED
      }
    }
    case types.USER_SIGNUP_REJECTED: {
      return {
        ...state,
        loading: types.USER_SIGNUP_REJECTED,
        userSignUpData: null,
        error: action.error.response.data
      }
    }
    /**
     * User signout
     */
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
     * Get user profile photo
     */
    case types.GET_PROFILE_PHOTO_PENDING:
      console.log('GET_PROFILE_PHOTO_PENDING')
      return {
        ...state,
        loading: types.GET_PROFILE_PHOTO_PENDING,
      }
    case types.GET_PROFILE_PHOTO_FULFILLED: {
      const { data } = action.result
      console.log('GET_PROFILE_PHOTO_FULFILLED', data)
      return {
        ...state,
        userPhotoData: data,
        loading: types.GET_PROFILE_PHOTO_FULFILLED,
      }
    }
    case types.GET_PROFILE_PHOTO_REJECTED: {
      console.log('GET_PROFILE_PHOTO_REJECTED')
      return {
        ...state,
        userPhotoData: null,
        loading: types.GET_PROFILE_PHOTO_REJECTED,
        error: action.error,
      }
    }
    /**
     * Resend confirmation email
     */
    case types.RESEND_CONFIRMATION_EMAIL_PENDING:
      return {
        ...state,
        loading: types.RESEND_CONFIRMATION_EMAIL_PENDING,
      }
    case types.RESEND_CONFIRMATION_EMAIL_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.RESEND_CONFIRMATION_EMAIL_FULFILLED,
      }
    }
    case types.RESEND_CONFIRMATION_EMAIL_REJECTED: {
      return {
        ...state,
        loading: types.RESEND_CONFIRMATION_EMAIL_REJECTED,
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
