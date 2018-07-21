import axios from 'axios';

import * as types from './types'

/**
 * Create a feed
 */
export const createFeed = () => {
  const url = `hunts`
  const data = {
    status: 'DRAFT',
  }
  return {
    types: [types.CREATE_FEED_PENDING, types.CREATE_FEED_FULFILLED, types.CREATE_FEED_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data,
      })  
  };
}

/**
 * Update a feed
 */
export const updateFeed = (id, feedName, note, tags, files) => {
  let url = `hunts/${id}`
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
  let url = `hunts/${id}`
  return {
    types: [types.DELETE_FEED_PENDING, types.DELETE_FEED_FULFILLED, types.DELETE_FEED_REJECTED],
    promise:
      axios({
        method: 'delete',
        url: url,
      })  
  };
}

/**
 * Get a file upload url
 */
export const getFileUploadUrl = (id) => {
  let url = `hunts/${id}/fileUpload`
  return {
    types: [types.GET_FILE_UPLOAD_URL_PENDING, types.GET_FILE_UPLOAD_URL_FULFILLED, types.GET_FILE_UPLOAD_URL_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url,
      })
  };
}

/**
 * Upload a file
 */
export const uploadFileToS3 = (url, file, type) => {
  const fileData = {
    uri: file,
    name: 'mytestphoto.jpg',
    type: 'image/jpeg'
  };
  console.log('File : ', fileData);
  return {
    types: [types.UPLOAD_FILE_PENDING, types.UPLOAD_FILE_FULFILLED, types.UPLOAD_FILE_REJECTED],
    promise:
      axios({
        method: 'put',
        url: url,
        data: {file: fileData},
        headers: {'Content-Type': 'image/jpeg'},
        //  withCredentials: false}
      })
  };
}
