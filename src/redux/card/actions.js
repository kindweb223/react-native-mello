import axios from 'axios';

import * as types from './types'

/**
 * Create a card
 */
export const createCard = (huntId) => {
  const url = `ideas`
  const data = {
    status: 'DRAFT',
    huntId,
  }
  return {
    types: [types.CREATE_CARD_PENDING, types.CREATE_CARD_FULFILLED, types.CREATE_CARD_REJECTED],
    promise: axios({
      method: 'post',
      url,
      data,
    }),
  };
}

/**
 * Update a card
 */
export const updateCard = (huntId, ideaId, title, idea, files) => {
  let url = `ideas/${ideaId}`
  const data = {
    status: 'PUBLISHED',
    huntId,
    title,
    idea,
    files,
  }

  return {
    types: [types.UPDATE_CARD_PENDING, types.UPDATE_CARD_FULFILLED, types.UPDATE_CARD_REJECTED],
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
export const deleteCard = (id) => {
  let url = `ideas/${id}`
  return {
    types: [types.DELETE_CARD_PENDING, types.DELETE_CARD_FULFILLED, types.DELETE_CARD_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
  };
}

/**
 * Get a file upload url
 */
export const getFileUploadUrl = (huntId, ideaId ) => {
  let url = `hunts/${huntId}/ideas/${ideaId}/fileUpload`
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
export const addFile = (ideaId, fileType, contentType, name, objectKey, accessUrl) => {
  let url = `ideas/${ideaId}/files`

  const data = {
    fileType,
    contentType,
    name,
    objectKey,
    accessUrl,
  }
  console.log('addFile Format : ', data);
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
export const deleteFile = (ideaId, fileId) => {
  let url = `ideas/${ideaId}/files/${fileId}`
  return {
    types: [types.DELETE_FILE_PENDING, types.DELETE_FILE_FULFILLED, types.DELETE_FILE_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: fileId,
  };
}
