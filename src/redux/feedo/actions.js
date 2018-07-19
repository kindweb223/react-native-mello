import { BASE_URL } from '../../service/api';
import axios from 'axios';

import * as types from './types'


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
    types: [types.GET_FEEDO_LIST_PENDING, types.GET_FEEDO_LIST_FULFILLED, types.GET_FEEDO_LIST_REJECTED],
    promise:
      axios({
          method: 'get',
          url: url
      })  
  };
}

/**
 * Pin feedo
 */
export const pinFeed = (huntId) => {
  let url = `${BASE_URL}/hunts/${huntId}/pin`

  return {
    types: [types.PIN_FEED_PENDING, types.PIN_FEED_FULFILLED, types.PIN_FEED_REJECTED],
    promise:
      axios({
          method: 'post',
          url: url
      })  
  };
}
