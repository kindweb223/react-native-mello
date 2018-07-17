import { BASE_URL, AXIOS_CONFIG } from '../../service/api';
import axios from 'axios';

import {
  GET_FEEDO_LIST_PENDING,
  GET_FEEDO_LIST_FULFILLED,
  GET_FEEDO_LIST_REJECTED
} from './types'


/**
 * Get feedo list
 */
export const getFeedoList = () => {
  return {
    types: [GET_FEEDO_LIST_PENDING, GET_FEEDO_LIST_FULFILLED, GET_FEEDO_LIST_REJECTED],
    promise:
      axios({
          method: 'get',
          url: `${BASE_URL}/hunts`,
          AXIOS_CONFIG
      })  
  };
}