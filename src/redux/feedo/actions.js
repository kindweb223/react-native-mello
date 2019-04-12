import axios from 'axios';
import React from 'react'

import * as types from './types'


/**
 * Get feedo list
 */
export const getFeedoList = (index = 0, isForCardMove = false) => {
  // let url = 'hunts?owner=true'

  // if (index === 1) {
  //   url = 'hunts?owner=false'
  // } else if (index === 2) {
  //   url = 'hunts?pinned=true'
  // } else if (index === 3) {
  //   url = 'hunts'
  // }
  let url = 'hunts'

  return {
    types: [types.GET_FEEDO_LIST_PENDING, types.GET_FEEDO_LIST_FULFILLED, types.GET_FEEDO_LIST_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      }),
    payload: isForCardMove
  };
}

export const setFeedoListFromStorage = (feedoList) => {
  console.log('FL here is ', feedoList)
  return {
    type: types.SET_FEEDO_LIST_FROM_STORAGE,
    feedoList,
  }
}

/**
 * Get feedo list
 */
export const getInvitedFeedList = () => {
  let url = 'hunts?invitationStatus=INVITED'

  return {
    types: [types.GET_INVITED_FEEDO_LIST_PENDING, types.GET_INVITED_FEEDO_LIST_FULFILLED, types.GET_INVITED_FEEDO_LIST_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })
  };
}

/**
 * Update feed invitation (accept, ignore)
 */
export const updateInvitation = (feedId, type) => {
  let url = `hunts/${feedId}/invitees/invitation`

  return {
    types: [types.UPDATE_FEED_INVITATION_PENDING, types.UPDATE_FEED_INVITATION_FULFILLED, types.UPDATE_FEED_INVITATION_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data: { accepted: type }
    }),
    payload: {
      feedId,
      type
    },
  };
}

/**
 * Get Feed detail
 */
export const getFeedDetail = (feedId) => {
  let url = `hunts/${feedId}`

  return {
    types: [types.GET_FEED_DETAIL_PENDING, types.GET_FEED_DETAIL_FULFILLED, types.GET_FEED_DETAIL_REJECTED],
    promise: axios({
      method: 'get',
      url: url
    }),
    payload: feedId
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
export const deleteFeed = (feedList) => {
  let url = 'hunts'

  const data = feedList.map(item => {
    return { 'id': item.feed.id }
  })

  return {
    types: [types.DEL_FEED_PENDING, types.DEL_FEED_FULFILLED, types.DEL_FEED_REJECTED],
    promise: axios.delete(url, { data }),
    payload: { flag: 'delete', backFeedList: feedList }
  };
}

/**
 * Archive Feed
 */
export const archiveFeed = (feedList) => {
  let url = 'hunts/archive'
  const data = feedList.map(item => {
    return { 'id': item.feed.id }
  })

  return {
    types: [types.ARCHIVE_FEED_PENDING, types.ARCHIVE_FEED_FULFILLED, types.ARCHIVE_FEED_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data
    })
  };
}

/**
 * Restore archived Feed
 */
export const restoreArchiveFeed = (feedId) => {
  let url = `hunts/${feedId}`

  return {
    types: [types.RESTORE_ARCHIVE_FEED_PENDING, types.RESTORE_ARCHIVE_FEED_FULFILLED, types.RESTORE_ARCHIVE_FEED_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data: { status: 'PUBLISHED' }
    }),
    payload: feedId
  };
}

/**
 * Duplicate Feed
 */
export const duplicateFeed = (feedList) => {
  let url = 'hunts/duplicate'

  const data = feedList.map(item => {
    return { 'id': item.feed.id }
  })

  return {
    types: [types.DUPLICATE_FEED_PENDING, types.DUPLICATE_FEED_FULFILLED, types.DUPLICATE_FEED_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data
    }),
    payload: feedList
  };
}

/**
 * Delete Duplicated Feed
 */
export const deleteDuplicatedFeed = (feedList) => {
  let url = 'hunts'

  const data = feedList.map(item => {
    return { 'id': item.feed.id }
  })

  return {
    types: [types.DEL_FEED_PENDING, types.DEL_FEED_FULFILLED, types.DEL_FEED_REJECTED],
    promise: axios.delete(url, { data }),
    payload: { flag: 'duplicate', backFeedList: feedList }
  };
}

/**
 * Add dummy data until click Undo button (5s)
 */
export const addDummyFeed = (data) => {
  return {
    type: types.ADD_DUMMY_FEED,
    payload: data
  };
}

/**
 * Remove dummy data when press the Undo button
 */
export const removeDummyFeed = (data) => {
  return {
    type: types.REMOVE_DUMMY_FEED,
    payload: data
  };
}

/**
 * Setting action in feed detail page
 */
export const setFeedDetailAction = (data) => {
  return {
    type: types.SET_FEED_DETAIL_ACTION,
    payload: data
  }
}

/**
 * Create a feed
 */
export const createFeed = () => {
  const url = `hunts`
  const data = {
    status: 'TEMP',
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
export const deleteDraftFeed = (id) => {
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
 * Set a feed to currentFeed
 */
export const setCurrentFeed = (feed) => {
  return {
    type: types.SET_CURRENT_FEED,
    payload: feed,
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
export const addTagToHunt = (huntId, tag) => {
  let url = `hunts/${huntId}/tags`
  const data = [tag]
  return {
    types: [types.ADD_HUNT_TAG_PENDING, types.ADD_HUNT_TAG_FULFILLED, types.ADD_HUNT_TAG_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data
    })
  };
}

/**
 * Remove a tag from a hunt
 */
export const removeTagFromHunt = (huntId, tagId) => {
  let url = `hunts/${huntId}/tags`
  const data = [{id: tagId}]  
  return {
    types: [types.REMOVE_HUNT_TAG_PENDING, types.REMOVE_HUNT_TAG_FULFILLED, types.REMOVE_HUNT_TAG_REJECTED],
    promise: axios({
      method: 'delete',
      url: url,
      data
    }),
    payload: tagId,
  };
}

/**
 * Update sharing preferences
 */
export const updateSharingPreferences = (feedId, data) => {
  let url = `hunts/${feedId}/share`
  return {
    types: [types.UPDATE_SHARING_PREFERENCES_PENDING, types.UPDATE_SHARING_PREFERENCES_FULFILLED, types.UPDATE_SHARING_PREFERENCES_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data
    }),
    payload: {
      feedId,
      data
    }
  }
}

/**
 * Delete invitee
 */
export const deleteInvitee = (feedId, inviteeId) => {
  let url = `hunts/${feedId}/invitees/${inviteeId}`

  return {
    types: [types.DELETE_INVITEE_PENDING, types.DELETE_INVITEE_FULFILLED, types.DELETE_INVITEE_REJECTED],
    promise: axios({
      method: 'delete',
      url: url
    }),
    payload: inviteeId
  }
}

/**
 * Update invitee permission
 */
export const updateInviteePermission = (feedId, inviteeId, type) => {
  let url = `hunts/${feedId}/invitees/${inviteeId}/permissions`
  return {
    types: [types.UPDATE_INVITEE_PERMISSION_PENDING, types.UPDATE_INVITEE_PERMISSION_FULFILLED, types.UPDATE_INVITEE_PERMISSION_REJECTED],
    promise: axios({
      method: 'put',
      url: url,
      data: {
        permissions: type
      }
    }),
    payload: {
      inviteeId,
      type
    }
  }
}

/**
 * Invite to Hunt
 */
export const inviteToHunt = (feedId, data) => {
  let url = `hunts/${feedId}/invitees`
  return {
    types: [types.INVITE_HUNT_PENDING, types.INVITE_HUNT_FULFILLED, types.INVITE_HUNT_REJECTED],
    promise: axios({
      method: 'post',
      url: url,
      data
    }),
    payload: feedId
  }
}

export const addFilterTag = (data) => {
  return {
    type: types.ADD_FILTER_TAG,
    payload: data
  }
}

/**
 * Get archived feed list
 */
export const getArchivedFeedList = () => {
  let url = 'hunts?archived=true'

  return {
    types: [types.GET_ARCHIVED_FEED_PENDING, types.GET_ARCHIVED_FEED_FULFILLED, types.GET_ARCHIVED_FEED_REJECTED],
    promise:
      axios({
          method: 'get',
          url: url
      })  
  };
}

/**
 * Get activity feed
 */
export const getActivityFeed = (userId, data) => {
  // let url = `users/${userId}/activityFeed?page=${data.page}&size=${data.size}`
  let url = `users/${userId}/activityFeed`

  return {
    types: [types.GET_ACTIVITY_FEED_PENDING, types.GET_ACTIVITY_FEED_FULFILLED, types.GET_ACTIVITY_FEED_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })
  };
}

/**
 * Read activity group
 */
export const readActivityGroup = (userId, activityGroupId) => {
  let url = `users/${userId}/huntActivityGroup/${activityGroupId}`

  const data = {
    read: true
  }

  return {
    types: [types.READ_ACTIVITY_GROUP_PENDING, types.READ_ACTIVITY_GROUP_FULLFILLED, types.READ_ACTIVITY_GROUP_REJECTED],
    promise:
      axios({
        method: 'put',
        url: url,
        data
      }),
    payload: activityGroupId
  };
}

/**
 * Read all activity feed
 */
export const readAllActivityFeed = (userId) => {
  let url = `users/${userId}/activityFeed`

  const data = {
    read: true
  }

  return {
    types: [types.READ_ALL_ACTIVITY_FEED_PENDING, types.READ_ALL_ACTIVITY_FEED_FULFILLED, types.READ_ALL_ACTIVITY_FEED_REJECTED],
    promise:
      axios({
        method: 'put',
        url: url,
        data
      })
  };
}

/**
 * Read activity feed
 */
export const readActivityFeed = (userId, activityId) => {
  let url = `users/${userId}/activityFeed/${activityId}`

  const data = {
    read: true
  }

  return {
    types: [types.READ_ACTIVITY_FEED_PENDING, types.READ_ACTIVITY_FEED_FULFILLED, types.READ_ACTIVITY_FEED_REJECTED],
    promise:
      axios({
        method: 'put',
        url: url,
        data
      }),
    payload: activityId
  };
}

/**
 * Read activity feed
 */
export const alreadyReadActivityFeed = (activityId) => {
  return {
    type: types.READ_ACTIVITY_FEED_FULFILLED,
    payload: activityId
  };
}

/**
 * Delete activity feed
 */
export const deleteActivityFeed = (userId, activityId) => {
  let url = `users/${userId}/activityFeed/${activityId}`

  return {
    types: [types.DEL_ACTIVITY_FEED_PENDING, types.DEL_ACTIVITY_FEED_FULFILLED, types.DEL_ACTIVITY_FEED_REJECTED],
    promise:
      axios({
        method: 'delete',
        url: url
      }),
    payload: activityId
  };
}

/**
 * update feed data from Pubnub event
 */
export const pubnubDeleteFeed = (feedId) => {
  return {
    type: types.PUBNUB_DELETE_FEED,
    payload: feedId
  };
}

/*
 * Delete dummy card until toaster is hidden
 */
export const deleteDummyCard = (ideaId, type) => {
  return {
    type: types.DEL_DUMMY_CARD,
    payload: { ideaId, type }
  };
}

/**
 * Move dummy card until toaster is hidden
 */
export const moveDummyCard = (ideaId, huntId, type) => {
  return {
    type: types.MOVE_DUMMY_CARD,
    payload: { ideaId, huntId, type }
  };
}

/**
 * Get Feed detail from Pubnub
 */
export const pubnubGetFeedDetail = (feedId) => {
  let url = `hunts/${feedId}`

  return {
    types: [types.PUBNUB_GET_FEED_DETAIL_PENDING, types.PUBNUB_GET_FEED_DETAIL_FULFILLED, types.PUBNUB_GET_FEED_DETAIL_REJECTED],
    promise: axios({
      method: 'get',
      url: url
    }),
  };
}

export const pubnubMoveIdea = (feedId, ideaId) => {
  return {
    type: types.PUBNUB_MOVE_IDEA_FULFILLED,
    payload: {
      feedId,
      ideaId
    }
  };
}

/**
 * Like a card from Pubnub
 */
export const pubnubLikeCard = (ideaId) => {
  return {
    type: types.PUBNUB_LIKE_CARD_FULFILLED,
    payload: ideaId,
  };
}

/**
 * UnLike a card from Pubnub
 */
export const pubnubUnLikeCard = (ideaId) => {
  return {
    type: types.PUBNUB_UNLIKE_CARD_FULFILLED,
    payload: ideaId,
  };
}

/**
 * Delete invitee from other invitees' list
 */
export const pubnubDeleteInvitee = (huntId, inviteeId) => {
  return {
    type: types.PUBNUB_DELETE_INVITEE_FULFILLED,
    payload: {
      huntId,
      inviteeId
    }
  };
}

export const pubnubDeleteOtherInvitee = (huntId, inviteeId) => {
  return {
    type: types.PUBNUB_DELETE_OTHER_INVITEE_FULFILLED,
    payload: {
      huntId,
      inviteeId
    }
  };
}

export const getActivityFeedVisited = (userId) => {
  let url = `users/${userId}/activityFeedVisited`
  return {
    types: [types.GET_ACTIVITY_FEED_VISITED_PENDING, types.GET_ACTIVITY_FEED_VISITED_FULFILLED, types.GET_ACTIVITY_FEED_VISITED_REJECTED],
    promise:
      axios({
        method: 'post',
        url: url
      })
  }
}

export const saveFlowViewPreference = (feedId, inviteeId, preference) => {
  const url = `hunts/${feedId}/invitees/${inviteeId}/viewPreference`;
  return {
    types: [types.SAVE_FLOW_PREFERENCE_PENDING, types.SAVE_FLOW_PREFERENCE_FULFILLED, types.SAVE_FLOW_PREFERENCE_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data: { preference }
      }),
    payload: { feedId, preference }
  }
}

export const pubnubUserInvited = () => {
  return {
    type: types.PUBNUB_USER_INVITED_FULFILLED
  };
}

export const setFeedDetailFromStorage = (feed) => {
  return {
    type: types.SET_FEED_DETAIL_FROM_STORAGE,
    feed
  };
}