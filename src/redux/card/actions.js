import axios from 'axios';

import * as types from './types'
import { LAMBDA_BASE_URL } from '../../../src/service/api'

/**
 * Create a draft card
 */
export const createCard = (huntId) => {
  const url = `ideas`
  const data = {
    status: 'TEMP',
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
export const updateCard = (huntId, ideaId, title, idea, coverImage, files, isCreateCard) => {
  let url = `ideas/${ideaId}`
  const data = {
    status: 'PUBLISHED',
    huntId,
    title,
    idea,
    coverImage,
    files,
  }
  return {
    types: [types.UPDATE_CARD_PENDING, types.UPDATE_CARD_FULFILLED, types.UPDATE_CARD_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data,
    }),
    payload: isCreateCard
  };
}

/**
 * Get a card
 */
export const getCard = (ideaId) => {
  let url = `ideas/${ideaId}`
  return {
    types: [types.GET_CARD_PENDING, types.GET_CARD_FULFILLED, types.GET_CARD_REJECTED],
    promise: axios({
      method: 'get',
      url: url,
    }),
  };
}

/**
 * Set a card to currentCard
 */
export const setCurrentCard = (idea) => {
  return {
    type: types.SET_CURRENT_CARD,
    payload: idea,
  };
}

/**
 * reset an error
 */
export const resetCardError = () => {
  return {
    type: types.RESET_CARD_ERROR,
    payload: {},
  };
}

/**
 * Delete a card
 */
export const deleteCard = (id) => {
  let url = `ideas/${id}`
  return {
    types: [types.DELETE_CARD_PENDING, types.DELETE_CARD_FULFILLED, types.DELETE_CARD_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: id,
  };
}

/**
 * Move a card
 */
export const moveCard = (ideaId, huntId) => {
  let url = `ideas/${ideaId}/move`
  const data = {
    huntId,
  }
  return {
    types: [types.MOVE_CARD_PENDING, types.MOVE_CARD_FULFILLED, types.MOVE_CARD_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data,
    }),
    payload: {
      ideaId,
      huntId,
    },
  };
}


/**
 * Like a card
 */
export const likeCard = (id) => {
  let url = `ideas/${id}/likes`
  return {
    types: [types.LIKE_CARD_PENDING, types.LIKE_CARD_FULFILLED, types.LIKE_CARD_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
    }),
    payload: id,
  };
}

/**
 * UnLike a card
 */
export const unlikeCard = (id) => {
  let url = `ideas/${id}/likes`
  return {
    types: [types.UNLIKE_CARD_PENDING, types.UNLIKE_CARD_FULFILLED, types.UNLIKE_CARD_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: id,
  };
}

/**
 * get likes of a card 
 */
export const getCardLikes = (id) => {
  let url = `ideas/${id}/likes`
  return {
    types: [types.GET_CARD_LIKES_PENDING, types.GET_CARD_LIKES_FULFILLED, types.GET_CARD_LIKES_REJECTED],
    promise: axios({
      method: 'get',
      url: url,
    }),
  };
}

/**
 * get comments of a card 
 */
export const getCardComments = (id) => {
  let url = `ideas/${id}/comments`
  return {
    types: [types.GET_CARD_COMMENTS_PENDING, types.GET_CARD_COMMENTS_FULFILLED, types.GET_CARD_COMMENTS_REJECTED],
    promise: axios({
      method: 'get',
      url: url,
    }),
    payload: id
  };
}

/**
 * add a comment to a card
 */
export const addCardComment = (ideaId, content) => {
  let url = `ideas/${ideaId}/comments`
  const data = {
    content,
  }
  return {
    types: [types.ADD_CARD_COMMENT_PENDING, types.ADD_CARD_COMMENT_FULFILLED, types.ADD_CARD_COMMENT_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data,
    }),
    payload: ideaId,
  };
}


/**
 * update a comment in a card
 */
export const updateCardComment = (ideaId, commentId, content) => {
  let url = `ideas/${ideaId}/comments/${commentId}`
  const data = {
    content,
  }
  return {
    types: [types.EDIT_CARD_COMMENT_PENDING, types.EDIT_CARD_COMMENT_FULFILLED, types.EDIT_CARD_COMMENT_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data,
    }),
  };
}


/**
 * delete a comment in a card
 */
export const deleteCardComment = (ideaId, commentId) => {
  let url = `ideas/${ideaId}/comments/${commentId}`
  return {
    types: [types.DELETE_CARD_COMMENT_PENDING, types.DELETE_CARD_COMMENT_FULFILLED, types.DELETE_CARD_COMMENT_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: { ideaId, commentId }
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
        xhr.setRequestHeader("Content-type", mimeType); 
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
export const addFile = (ideaId, fileType, contentType, name, objectKey, metadata) => {
  let url = `ideas/${ideaId}/files`
  const data = {
    fileType,
    contentType,
    name,
    objectKey,
    metadata
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

/**
 * set a image file as cover image
 */
export const setCoverImage = (ideaId, fileId,) => {
  let url = `ideas/${ideaId}/cover-image/${fileId}`
  return {
    types: [types.SET_COVER_IMAGE_PENDING, types.SET_COVER_IMAGE_FULFILLED, types.SET_COVER_IMAGE_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
    }),
    payload: fileId,
  };
}

/**
 * Add a link
 */
export const addLink = (ideaId, originalUrl, title, description, imageUrl, faviconUrl) => {
  let url = `ideas/${ideaId}/links`
  const data = {
    originalUrl,
    title,
    description,
    imageUrl,
    faviconUrl
  }
  return {
    types: [types.ADD_LINK_PENDING, types.ADD_LINK_FULFILLED, types.ADD_LINK_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data,
    }),
  };
}

/**
 * Delete a link
 */
export const deleteLink = (ideaId, linkId) => {
  let url = `ideas/${ideaId}/links/${linkId}`
  return {
    types: [types.DELETE_LINK_PENDING, types.DELETE_LINK_FULFILLED, types.DELETE_LINK_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
    }),
    payload: linkId,
  };
}

/**
 * Get a Open Graph
 */
export const getOpenGraph = (urlPath, isSharing = false) => {
  const url = 'url/parse';
  const data = {
    url: urlPath,
    isSharing,
  };

  console.log("getOpenGraph data: ", data)
  return {
    types: [types.GET_OPEN_GRAPH_PENDING, types.GET_OPEN_GRAPH_FULFILLED, types.GET_OPEN_GRAPH_REJECTED],
    promise: axios({
      method: 'post',
      baseURL: LAMBDA_BASE_URL,
      url,
      data,
    }),
    originalUrl: urlPath
  };
}

/**
 * Add a card in share extesnsion
 */
export const addSharExtensionCard = (huntId, idea, links, files, status) => {
  let url = 'ideas/shareExtension'
  const data = {
    huntId,
    idea,
    links,
    files,
    status
  }

  return {
    types: [types.ADD_SHARE_EXTENSION_CARD_PENDING, types.ADD_SHARE_EXTENSION_CARD_FULFILLED, types.ADD_SHARE_EXTENSION_CARD_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data,
    }),
  };
}