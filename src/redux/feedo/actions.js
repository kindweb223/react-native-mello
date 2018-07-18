import { BASE_URL } from '../../service/api';
import axios from 'axios';

import {
  GET_FEEDO_LIST_PENDING,
  GET_FEEDO_LIST_FULFILLED,
  GET_FEEDO_LIST_REJECTED
} from './types'


/**
 * Get feedo list
 */
export const getFeedoList = (index) => {
  let url = `${BASE_URL}/hunts`

  if (index === 1) {
    url = `${BASE_URL}/hunts?pinned=true`
  } else if (index === 2) {
    url = `${BASE_URL}/hunts?owner=false`
  }

  return {
    types: [GET_FEEDO_LIST_PENDING, GET_FEEDO_LIST_FULFILLED, GET_FEEDO_LIST_REJECTED],
    promise:
      axios({
          method: 'get',
          url: url
      })  
  };
}