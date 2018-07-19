import { BASE_URL } from '../../service/api';
import axios from 'axios';

import {
  USER_LOGIN_PENDING,
  USER_LOGIN_FULFILLED,
  USER_LOGIN_REJECTED
} from './types'


/**
 * Get feedo list
 */
export const userLogIn = () => {
  const url = `${BASE_URL}/auth/login`
  const data = {
    "username": "eamon@solvers.io",
    "password": "qwerty1"
  }

  return {
    types: [USER_LOGIN_PENDING, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED],
    promise:
      axios({
          method: 'get',
          url: url,
          data: data
      })  
  };
}
