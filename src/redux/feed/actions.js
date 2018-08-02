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
    promise: axios({
      method: 'post',
      url,
      data,
    }),
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
    promise: axios({
      method: 'put',
      url: url,
      data,
    }),
  };
}

/**
 * Delete a feed
 */
export const deleteFeed = (id) => {
  let url = `hunts/${id}`
  return {
    types: [types.DELETE_FEED_PENDING, types.DELETE_FEED_FULFILLED, types.DELETE_FEED_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
  };
}

/**
 * Get a file upload url
 */
export const getFileUploadUrl = (id) => {
  let url = `hunts/${id}/fileUpload`
  return {
    types: [types.GET_FILE_UPLOAD_URL_PENDING, types.GET_FILE_UPLOAD_URL_FULFILLED, types.GET_FILE_UPLOAD_URL_REJECTED],
    promise: axios({
      method: 'get',
      url: url,
    }),
  };
}

/**
 * Upload a file
 */
export const uploadFileToS3 = (signedUrl, file, fileName, mimeType) => {
  const fileData = {
    uri: file,
    name: fileName,
    type: mimeType,
  };
  return {
    types: [types.UPLOAD_FILE_PENDING, types.UPLOAD_FILE_FULFILLED, types.UPLOAD_FILE_REJECTED],
    promise:
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedUrl);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve('success');
            } else {
              reject('Could not upload file.');
            }
          }
        };
        xhr.send(fileData);
      })
  };
}

/**
 * Add a file
 */
export const addFile = (feedId, fileType, contentType, name, objectKey) => {
  let url = `hunts/${feedId}/files`
  const data = {
    fileType,
    contentType,
    name,
    objectKey,
  }
  return {
    types: [types.ADD_FILE_PENDING, types.ADD_FILE_FULFILLED, types.ADD_FILE_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data,
    }),
  };
}

/**
 * Delete a file
 */
export const deleteFile = (feedId, fileId) => {
  let url = `hunts/${feedId}/files/${fileId}`
  return {
    types: [types.DELETE_FILE_PENDING, types.DELETE_FILE_FULFILLED, types.DELETE_FILE_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: fileId,
  };
}

/**
 * Get user tags
 */
export const getUserTags = (userId) => {
  let url = `users/${userId}/tags`
  return {
    types: [types.GET_USER_TAGS_PENDING, types.GET_USER_TAGS_FULFILLED, types.GET_USER_TAGS_REJECTED],
    promise: axios({
      method: 'get',
      url: url,
    }),
  };
}

/**
 * Create a user tag
 */
export const createUserTag = (userId, tagName) => {
  let url = `users/${userId}/tags`
  const data = {
    text: tagName,
  }
  return {
    types: [types.CREATE_USER_TAG_PENDING, types.CREATE_USER_TAG_FULFILLED, types.CREATE_USER_TAG_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data,
    }),
  };
}

/**
 * Add a tag to a hunt
 */
export const addTagToHunt = (huntId, tagId) => {
  let url = `hunts/${huntId}/tags/${tagId}`
  return {
    types: [types.ADD_HUNT_TAG_PENDING, types.ADD_HUNT_TAG_FULFILLED, types.ADD_HUNT_TAG_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
    }),
    payload: tagId,
  };
}

/**
 * Remove a tag from a hunt
 */
export const removeTagFromHunt = (huntId, tagId) => {
  let url = `hunts/${huntId}/tags/${tagId}`
  return {
    types: [types.REMOVE_HUNT_TAG_PENDING, types.REMOVE_HUNT_TAG_FULFILLED, types.REMOVE_HUNT_TAG_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: tagId,
  };
}








/**
 * Get a Feed detail
 */
export const getFeedDetail = (feedId) => {
  let url = `hunts/${feedId}`

  return {
    types: [types.GET_FEED_DETAIL_PENDING, types.GET_FEED_DETAIL_FULFILLED, types.GET_FEED_DETAIL_REJECTED],
    promise: axios({
      method: 'get',
      url: url
    })
  };
}
