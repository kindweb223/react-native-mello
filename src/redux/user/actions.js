import axios from 'axios';
import * as types from './types'

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
 * User logout
 */
export const userSignOut = (data) => {
  const url = 'auth/logout'

  return {
    types: [types.USER_SIGNOUT_PENDING, types.USER_SIGNOUT_FULFILLED, types.USER_SIGNOUT_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
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
