import axios from 'axios';
import * as types from './types'

/**
 * check user account
 */
export const userLookup = (data) => {
  const url = 'users/lookup'

  return {
    types: [types.USER_LOOKUP_PENDING, types.USER_LOOKUP_FULFILLED, types.USER_LOOKUP_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}

/**
 * User login
 */
export const userSignIn = (data) => {
  const url = 'auth/login'

  return {
    types: [types.USER_SIGNIN_PENDING, types.USER_SIGNIN_FULFILLED, types.USER_SIGNIN_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}

/**
 * Get logged user's session
 */
export const getUserSession = () => {
  const url = 'users/session'

  return {
    types: [types.GET_USER_SESSION_PENDING, types.GET_USER_SESSION_FULFILLED, types.GET_USER_SESSION_REJECTED],
    promise:
      axios({
        method: 'get',
        url
      })  
  };
}

/**
 * User SignUp
 */
export const userSignUp = (data) => {
  const url = 'users'

  return {
    types: [types.USER_SIGNUP_PENDING, types.USER_SIGNUP_FULFILLED, types.USER_SIGNUP_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}

/**
 * User logout
 */
export const userSignOut = () => {
  const url = 'auth/logout'

  return {
    types: [types.USER_SIGNOUT_PENDING, types.USER_SIGNOUT_FULFILLED, types.USER_SIGNOUT_REJECTED],
    promise:
      axios({
        method: 'post',
        url
      })  
  };
}

/**
 * Get user's contact list (to invite the user)
 */
export const getContactList = (userId) => {
  let url = `users/${userId}/contacts`

  return {
    types: [types.GET_CONTACT_LIST_PENDING, types.GET_CONTACT_LIST_FULFILLED, types.GET_CONTACT_LIST_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}

/**
 * get user image
 */
export const getImageUrl = (userId) => {
  let url = `users/${userId}/image`

  return {
    types: [types.GET_USER_IMAGE_URL_PENDING, types.GET_USER_IMAGE_URL_FULFILLED, types.GET_USER_IMAGE_URL_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}

/**
 * Resend confirmation email
 */
export const resendConfirmationEmail = () => {
  let url = 'users/confirmation/resend'

  return {
    types: [types.RESEND_CONFIRMATION_EMAIL_PENDING, types.RESEND_CONFIRMATION_EMAIL_FULFILLED, types.RESEND_CONFIRMATION_EMAIL_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}


/**
 * set userinfo from storage
 */
export const setUserInfo = (data) => {
  return {
    type: types.SET_USER_INFO,
    payload: data
  };
}

/**
 * Update user profile
 */
export const updateProfile = (userId, data) => {
  let url = `users/${userId}`

  return {
    types: [types.UPDATE_PROFILE_PENDING, types.UPDATE_PROFILE_FULFILLED, types.UPDATE_PROFILE_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      }),
    payload: data.imageUrl
  };
}

/**
 * Update user password
 */
export const updatePassword = (userId, data) => {
  let url = `users/${userId}/password`

  return {
    types: [types.UPDATE_PASSWORD_PENDING, types.UPDATE_PASSWORD_FULFILLED, types.UPDATE_PASSWORD_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      })
  };
}

/**
 * Confirm user account
 */
export const ConfirmAccount = (token) => {
  let url = 'users/confirmation'
  const data = {
    token
  }

  return {
    types: [types.USER_CONFIRM_ACCOUNT_PENDING, types.USER_CONFIRM_ACCOUNT_FULFILLED, types.USER_CONFIRM_ACCOUNT_EJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      })
  };
}