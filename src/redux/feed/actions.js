import { BASE_URL } from '../../service/api';
import axios from 'axios';

import * as types from './types'

/**
 * Create a feed
 */
export const createFeed = () => {
  let url = `${BASE_URL}/hunts`
  const data = {
    status: 'DRAFT',
  }
  console.log('createFeed : ', url, data)
  return {
    types: [types.CREATE_FEED_PENDING, types.CREATE_FEED_FULFILLED, types.CREATE_FEED_REJECTED],
    promise:
      axios({
        method: 'post',
        url: url,
        data,
      })  
  };
}

/**
 * Update a feed
 */
export const updateFeed = (id, feedName, note, tags, files) => {
  let url = `${BASE_URL}/hunts/${id}`
  const data = {
    status: 'PUBLISHED',
    headline: feedName,
    summary: note,
    tags,
    files,
  }

  return {
    types: [types.UPDATE_FEED_PENDING, types.UPDATE_FEED_FULFILLED, types.UPDATE_FEED_REJECTED],
    promise:
      axios({
        method: 'put',
        url: url,
        data,
      })  
  };
}

/**
 * Delete a feed
 */
export const deleteFeed = (id) => {
  let url = `${BASE_URL}/hunts/${id}`
  return {
    types: [types.DELETE_FEED_PENDING, types.DELETE_FEED_FULFILLED, types.DELETE_FEED_REJECTED],
    promise:
      axios({
        method: 'delete',
        url: url,
      })  
  };
}
