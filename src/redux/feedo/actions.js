import axios from 'axios';

import * as types from './types'


/**
 * Get feedo list
 */
export const getFeedoList = (index) => {
  let url = 'hunts'

  if (index === 1) {
    url = 'hunts?pinned=true'
  } else if (index === 2) {
    url = 'hunts?owner=false'
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
 * Get Feed detail
 */
export const getFeedDetailData = (feedId) => {
  let url = `hunts/${feedId}`

  return {
    types: [types.GET_FEED_DETAIL_PENDING, types.GET_FEED_DETAIL_FULFILLED, types.GET_FEED_DETAIL_REJECTED],
    promise: axios({
      method: 'get',
      url: url
    })
  };
}

/**
 * Pin Feed
 */
export const pinFeed = (feedId) => {
  let url = `hunts/${feedId}/pin`

  return {
    types: [types.PIN_FEED_PENDING, types.PIN_FEED_FULFILLED, types.PIN_FEED_REJECTED],
    promise:
      axios({
          method: 'post',
          url: url
      }),
    payload: feedId
  };
}

/**
 * UnPin Feed
 */
export const unpinFeed = (feedId) => {
  let url = `hunts/${feedId}/pin`

  return {
    types: [types.UNPIN_FEED_PENDING, types.UNPIN_FEED_FULFILLED, types.UNPIN_FEED_REJECTED],
    promise: axios.delete(url),
    payload: feedId
  };
}

/**
 * Delete Feed
 */
export const deleteFeed = (feedId) => {
  let url = `hunts/${feedId}`

  return {
    types: [types.DEL_FEED_PENDING, types.DEL_FEED_FULFILLED, types.DEL_FEED_REJECTED],
    promise: axios.delete(url),
    payload: feedId
  };
}

/**
 * Archive Feed
 */
export const archiveFeed = (feedId) => {
  let url = `/hunts/${feedId}`

  return {
    types: [types.ARCHIVE_FEED_PENDING, types.ARCHIVE_FEED_FULFILLED, types.ARCHIVE_FEED_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data: { status: 'ENDED' }
    }),
    payload: feedId
  };
}

/**
 * Duplicate Feed
 */
export const duplicateFeed = (feedId) => {
  let url = `/hunts/${feedId}/duplicate`

  return {
    types: [types.DUPLICATE_FEED_PENDING, types.DUPLICATE_FEED_FULFILLED, types.DUPLICATE_FEED_REJECTED],
    promise: axios({
      method: 'post',
      url: url
    })
  };
}
