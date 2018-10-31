import { AsyncStorage } from 'react-native'
import axios from 'axios'
import * as types from './types'
import * as cardTypes from '../card/types'
import resolveError from './../../service/resolveError'
import CONSTANTS from '../../../src/service/constants'
import SharedGroupPreferences from 'react-native-shared-group-preferences'

const initialState = {
  loading: null,
  error: null,
  contactList: [],
  userInfo: null,
  userSignUpData: null,
  userImageUrlData: null,
  userLookup: null,
  userConfirmed: false
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_LOOKUP_PENDING:
      return {
        ...state,
        error: null,
        userLookup: null,
        userInfo: null,
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
        loading: types.USER_LOOKUP_REJECTED,
        error: action.error.response.data
      }
    }
    /**
     * User signIn
     */
    case types.USER_SIGNIN_PENDING:
      console.log('USER_SIGNIN_PENDING')
      return {
        ...state,
        userConfirmed: false,
        loading: types.USER_SIGNIN_PENDING,
        userInfo: null,
      }
    case types.USER_SIGNIN_FULFILLED: {
      const { data, headers } = action.result
      const xAuthToken = headers['x-auth-token']

      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        AsyncStorage.setItem('xAuthToken', xAuthToken)
        SharedGroupPreferences.setItem('xAuthToken', xAuthToken, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      } else {
        AsyncStorage.removeItem('xAuthToken')
        AsyncStorage.removeItem('userInfo')
        SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
        SharedGroupPreferences.setItem('userInfo', null, CONSTANTS.APP_GROUP_USER_IDENTIFIER)
      }

      return {
        ...state,
        error: null,
        userInfo: data,
        loading: types.USER_SIGNIN_FULFILLED
      }
    }
    case types.USER_SIGNIN_REJECTED: {
      console.log('USER_SIGNIN_REJECTED')
      return {
        ...state,
        loading: types.USER_SIGNIN_REJECTED,
        userInfo: null,
        error: action.error.response.data
      }
    }
    /**
     * Get user's session
     */
    case types.GET_USER_SESSION_PENDING:
      return {
        ...state,
        loading: types.GET_USER_SESSION_PENDING,
        userInfo: null,
      }
    case types.GET_USER_SESSION_FULFILLED: {
      const { data } = action.result

      const xAuthToken = axios.defaults.headers['x-auth-token']
      AsyncStorage.setItem('xAuthToken', xAuthToken)
      SharedGroupPreferences.setItem('xAuthToken', xAuthToken, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      
      AsyncStorage.setItem('userInfo', JSON.stringify(data))
      AsyncStorage.setItem('userBackInfo', JSON.stringify(data))
      SharedGroupPreferences.setItem('userInfo', JSON.stringify(data), CONSTANTS.APP_GROUP_USER_IDENTIFIER)

      return {
        ...state,
        error: null,
        userInfo: data,
        loading: types.GET_USER_SESSION_FULFILLED
      }
    }
    case types.GET_USER_SESSION_REJECTED: {
      AsyncStorage.removeItem('userInfo')
      AsyncStorage.removeItem('xAuthToken')
      SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      SharedGroupPreferences.setItem('userInfo', null, CONSTANTS.APP_GROUP_USER_IDENTIFIER)

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
        userConfirmed: false,
        loading: types.USER_SIGNUP_PENDING,
      }
    case types.USER_SIGNUP_FULFILLED: {
      const { data, headers } = action.result

      const xAuthToken = headers['x-auth-token']
      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        AsyncStorage.setItem('xAuthToken', xAuthToken)
        SharedGroupPreferences.setItem('xAuthToken', xAuthToken, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      } else {
        AsyncStorage.removeItem('xAuthToken')
        SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
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
        userConfirmed: false,
        loading: types.USER_SIGNOUT_PENDING,
      }
    case types.USER_SIGNOUT_FULFILLED: {
      const { data } = action.result

      AsyncStorage.removeItem('xAuthToken')
      AsyncStorage.removeItem('userInfo')
      SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      SharedGroupPreferences.setItem('userInfo', null, CONSTANTS.APP_GROUP_USER_IDENTIFIER)

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
     * Get user's image url
     */
    case types.GET_USER_IMAGE_URL_PENDING:
      return {
        ...state,
        loading: types.GET_USER_IMAGE_URL_PENDING,
      }
    case types.GET_USER_IMAGE_URL_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        userImageUrlData: data,
        loading: types.GET_USER_IMAGE_URL_FULFILLED,
      }
    }
    case types.GET_USER_IMAGE_URL_REJECTED: {
      return {
        ...state,
        userImageUrlData: null,
        loading: types.GET_USER_IMAGE_URL_REJECTED,
        error: action.error,
      }
    }
    /**
     * Upload image to S3
     */
    case cardTypes.UPLOAD_FILE_PENDING:
      return {
        ...state,
        loading: 'UPLOAD_FILE_PENDING',
        error: null,
      }
    case cardTypes.UPLOAD_FILE_FULFILLED: {
      return {
        ...state,
        loading: 'UPLOAD_FILE_FULFILLED',
      }
    }
    case cardTypes.UPLOAD_FILE_REJECTED: {
      return {
        ...state,
        loading: 'UPLOAD_FILE_REJECTED',
        error: action.error,
      }
    }
    /**
     * Update user profile
     */
    case types.UPDATE_PROFILE_PENDING:
      return {
        ...state,
        loading: types.UPDATE_PROFILE_PENDING,
      }
    case types.UPDATE_PROFILE_FULFILLED: {
      const { data } = action.result
      const { userInfo } = state

      if (userInfo) {
        // update the user's info when it's not signup page
        AsyncStorage.setItem('userInfo', JSON.stringify(data))
        AsyncStorage.setItem('userBackInfo', JSON.stringify(data))
        SharedGroupPreferences.setItem('userInfo', JSON.stringify(data), CONSTANTS.APP_GROUP_USER_IDENTIFIER)
      }

      return {
        ...state,
        loading: types.UPDATE_PROFILE_FULFILLED,
        userInfo: userInfo ? data : null
      }
    }
    case types.UPDATE_PROFILE_REJECTED: {
      return {
        ...state,
        loading: types.UPDATE_PROFILE_REJECTED,
        error: action.error,
      }
    }
    /**
     * Update user password
     */
    case types.UPDATE_PASSWORD_PENDING:
      return {
        ...state,
        error: null,
        loading: types.UPDATE_PASSWORD_PENDING,
      }
    case types.UPDATE_PASSWORD_FULFILLED: {
      const { data } = action.result

      return {
        ...state,
        loading: types.UPDATE_PASSWORD_FULFILLED,
      }
    }
    case types.UPDATE_PASSWORD_REJECTED: {
      return {
        ...state,
        loading: types.UPDATE_PASSWORD_REJECTED,
        error: action.error.response.data
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
    * Confirm user's account
    */
    case types.USER_CONFIRM_ACCOUNT_PENDING:
      return {
        ...state,
        loading: types.USER_CONFIRM_ACCOUNT_PENDING,
      }
    case types.USER_CONFIRM_ACCOUNT_FULFILLED: {
      return {
        ...state,
        userConfirmed: true,
        loading: types.USER_CONFIRM_ACCOUNT_FULFILLED,
      }
    }
    case types.USER_CONFIRM_ACCOUNT_REJECTED: {
      return {
        ...state,
        userConfirmed: false,
        loading: types.USER_CONFIRM_ACCOUNT_REJECTED,
        error: action.error.response.data
      }
    }
    /**
    * Send reset password email
    */
    case types.SEND_RESET_PASSWORD_EMAIL_PENDING:
      return {
        ...state,
        loading: types.SEND_RESET_PASSWORD_EMAIL_PENDING,
      }
    case types.SEND_RESET_PASSWORD_EMAIL_FULFILLED: {
      return {
        ...state,
        loading: types.SEND_RESET_PASSWORD_EMAIL_FULFILLED,
      }
    }
    case types.SEND_RESET_PASSWORD_EMAIL_REJECTED: {
      return {
        ...state,
        loading: types.SEND_RESET_PASSWORD_EMAIL_REJECTED,
        error: action.error,
      }
    }
    /**
    * Reset password
    */
    case types.RESET_PASSWORD_PENDING:
      return {
        ...state,
        loading: types.RESET_PASSWORD_PENDING,
      }
    case types.RESET_PASSWORD_FULFILLED: {
      AsyncStorage.removeItem('xAuthToken')
      AsyncStorage.removeItem('userInfo')
      SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      SharedGroupPreferences.setItem('userInfo', null, CONSTANTS.APP_GROUP_USER_IDENTIFIER)
      return {
        ...state,
        loading: types.RESET_PASSWORD_FULFILLED,
      }
    }
    case types.RESET_PASSWORD_REJECTED: {
      return {
        ...state,
        loading: types.RESET_PASSWORD_REJECTED,
        error: action.error.response.data
      }
    }
    /**
     * Validate invite
     */
    case types.VALIDATE_INVITE_PENDING:
      return {
        ...state,
        loading: types.VALIDATE_INVITE_PENDING,
      }
    case types.VALIDATE_INVITE_FULFILLED: {
      return {
        ...state,
        loading: types.VALIDATE_INVITE_FULFILLED,
      }
    }
    case types.VALIDATE_INVITE_REJECTED: {
      return {
        ...state,
        loading: types.VALIDATE_INVITE_REJECTED,
        error: action.error.response.data
      }
    }
    /**
     * Complete invite
     */
    case types.COMPLETE_INVITE_PENDING:
      return {
        ...state,
        loading: types.COMPLETE_INVITE_PENDING,
      }
    case types.COMPLETE_INVITE_FULFILLED: {
      const { headers } = action.result
      const xAuthToken = headers['x-auth-token']
      if (xAuthToken) {
        axios.defaults.headers['x-auth-token'] = xAuthToken
        AsyncStorage.setItem('xAuthToken', xAuthToken)
        SharedGroupPreferences.setItem('xAuthToken', xAuthToken, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      } else {
        AsyncStorage.removeItem('xAuthToken')
        SharedGroupPreferences.setItem('xAuthToken', null, CONSTANTS.APP_GROUP_TOKEN_IDENTIFIER)
      }

      return {
        ...state,
        loading: types.COMPLETE_INVITE_FULFILLED,
      }
    }
    case types.COMPLETE_INVITE_REJECTED: {
      return {
        ...state,
        loading: types.COMPLETE_INVITE_REJECTED,
        error: action.error.response.data
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

    /**
     * Add device token
     */
    case types.ADD_DEVICE_TOKEN_PENDING:
      return {
        ...state,
        loading: types.ADD_DEVICE_TOKEN_PENDING,
      }
    case types.ADD_DEVICE_TOKEN_FULFILLED: {
      console.log('ADD_DEVICE_TOKEN_FULFILLED : ', action.result)
      AsyncStorage.setItem(CONSTANTS.USER_DEVICE_TOKEN, JSON.stringify(action.result.data))
      return {
        ...state,
        loading: types.ADD_DEVICE_TOKEN_FULFILLED,
      }
    }
    case types.ADD_DEVICE_TOKEN_REJECTED: {
      console.log('ADD_DEVICE_TOKEN_REJECTED : ', action.error)
      return {
        ...state,
        loading: types.ADD_DEVICE_TOKEN_REJECTED,
        error: action.error.response.data
      }
    }

    /**
     * Update device token
     */
    case types.UPDATE_DEVICE_TOKEN_PENDING:
      return {
        ...state,
        loading: types.UPDATE_DEVICE_TOKEN_PENDING,
      }
    case types.UPDATE_DEVICE_TOKEN_FULFILLED: {
      console.log('UPDATE_DEVICE_TOKEN_FULFILLED : ', action.result)
      AsyncStorage.setItem(CONSTANTS.USER_DEVICE_TOKEN, JSON.stringify(action.result.data))
      return {
        ...state,
        loading: types.UPDATE_DEVICE_TOKEN_FULFILLED,
      }
    }
    case types.UPDATE_DEVICE_TOKEN_REJECTED: {
      console.log('UPDATE_DEVICE_TOKEN_REJECTED : ', action.error)
      return {
        ...state,
        loading: types.UPDATE_DEVICE_TOKEN_REJECTED,
        error: action.error.response.data
      }
    }

    /**
     * Delete profile photo url
     */
    case types.DELETE_PROFILE_PHOTO_REQUEST:
      return {
        ...state,
        loading: types.DELETE_PROFILE_PHOTO_REQUEST,
      }
    case types.DELETE_PROFILE_PHOTO_FULFILLED: {
      const { userInfo } = state
      const updateUserInfo = {
        ...userInfo,
        imageUrl: null
      }

      AsyncStorage.setItem('userInfo', JSON.stringify(updateUserInfo))
      AsyncStorage.setItem('userBackInfo', JSON.stringify(updateUserInfo))
      SharedGroupPreferences.setItem('userInfo', JSON.stringify(updateUserInfo), CONSTANTS.APP_GROUP_USER_IDENTIFIER)

      return {
        ...state,
        userInfo: updateUserInfo,
        loading: types.DELETE_PROFILE_PHOTO_FULFILLED,
      }
    }
    case types.DELETE_PROFILE_PHOTO_REJECTED: {
      return {
        ...state,
        loading: types.DELETE_PROFILE_PHOTO_REJECTED,
        error: action.error.response.data
      }
    }

    default:
      return state;
  }
}
