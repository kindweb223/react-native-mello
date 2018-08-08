import { BASE_URL } from '../../service/api';
import axios from 'axios';
import * as types from './types'

/**
 * Get feedo list
 */
export const userLogIn = () => {
  const url = '/auth/login'
  const data = {
    "username": "eamon@solvers.io",
    "password": "qwerty1"
  }

  return {
    types: [types.USER_LOGIN_PENDING, types.USER_LOGIN_FULFILLED, types.USER_LOGIN_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url,
        data: data
      })  
  };
}

/**
 * Get user's contact list (to invite the user)
 */
export const getContactList = (userId) => {
  console.log('USEREID: ', userId)
  let url = `/users/${userId}/contacts`

  return {
    types: [types.GET_CONTACT_LIST_PENDING, types.GET_CONTACT_LIST_FULFILLED, types.GET_CONTACT_LIST_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}
