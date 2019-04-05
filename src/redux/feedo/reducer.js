import { AsyncStorage } from 'react-native'
import PushNotification from 'react-native-push-notification'
import * as types from './types'
import * as cardTypes from '../card/types'
import * as userTypes from '../user/types'
import { filter, find, findIndex, isEmpty } from 'lodash'
import resolveError from './../../service/resolveError'
import { restoreArchiveFeed } from './actions';
import { setRemovedInvitees } from './operations'

const initialState = {
  loading: null,
  error: null,
  feedoList: [],
  feedoListForCardMove: [],
  currentFeed: {},
  pinResult: null,
  feedDetailAction: null,
  fileUploadUrl: {},
  userTags: [],
  archivedFeedList: [],
  invitedFeedList: [],
  activityFeedList: [],
  activityData: {},
  dummyDelCard: {},
  dummyMoveCard: {},
  badgeCount: 0,
  isCreateCard: false,
  duplicatedFeedList: []
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    /**
     * Get Feed List
     */
    case types.GET_FEEDO_LIST_PENDING:
      return {
        ...state,
        feedoListForCardMove: [],
        loading: types.GET_FEEDO_LIST_PENDING,
      }
    case types.GET_FEEDO_LIST_FULFILLED: {
      const { data } = action.result
      const isForCardMove = action.payload;
      if (!isForCardMove) {
        return {
          ...state,
          loading: types.GET_FEEDO_LIST_FULFILLED,
          feedoList: data.content,
        }
      }
      return {
        ...state,
        loading: types.GET_FEEDO_LIST_FULFILLED,
        feedoListForCardMove: data.content,
      }
    }
    case types.GET_FEEDO_LIST_REJECTED: {
      return {
        ...state,
        loading: types.GET_FEEDO_LIST_REJECTED,
        error: action.error,
      }
    }
    /**
     * Get Invited Feed List
     */
    case types.GET_INVITED_FEEDO_LIST_PENDING:
      return {
        ...state,
        loading: types.GET_INVITED_FEEDO_LIST_PENDING,
      }
    case types.GET_INVITED_FEEDO_LIST_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.GET_INVITED_FEEDO_LIST_FULFILLED,
        invitedFeedList: data.content
      }
    }
    case types.GET_INVITED_FEEDO_LIST_REJECTED: {
      return {
        ...state,
        loading: types.GET_INVITED_FEEDO_LIST_REJECTED,
        error: action.error,
      }
    }
    /**
     * Update feedo invitation (accept, ignore)
     */
    case types.UPDATE_FEED_INVITATION_PENDING:
      return {
        ...state,
        loading: types.UPDATE_FEED_INVITATION_PENDING,
      }
    case types.UPDATE_FEED_INVITATION_FULFILLED: {
      PushNotification.getApplicationIconBadgeNumber((badgeCount) => {
        if (badgeCount > 0) {
          PushNotification.setApplicationIconBadgeNumber(badgeCount - 1)
        }
      })

      const { feedId, type } = action.payload
      const { invitedFeedList, feedoList, currentFeed } = state

      const restInvitedFeedList = filter(invitedFeedList, feed => feed.id !== feedId)
      const invitedFeed = find(invitedFeedList, feed => feed.id === feedId)

      // Update feed list
      let updateFeed = null
      let restFeedoList = []
      if (feedoList.length > 0) {
        restFeedoList = filter(feedoList, feed => feed.id !== feedId)
        updateFeed = find(feedoList, feed => feed.id === feedId)

        if (updateFeed) {
          updateFeed = {
            ...updateFeed,
            metadata: {
              ...updateFeed.metadata,
              myInviteStatus: 'ACCEPTED'
            }
          }
        } else {
          updateFeed = {
            ...invitedFeed,
            metadata: {
              ...invitedFeed.metadata,
              myInviteStatus: 'ACCEPTED'
            }
          }
        }
      } else if (type === true) {
        updateFeed = {
          ...invitedFeed,
          metadata: {
            ...invitedFeed.metadata,
            myInviteStatus: 'ACCEPTED'
          }
        }
      }

      // Update current feed
      let newCurrentFeed = {}
      if (!isEmpty(currentFeed)) {
        newCurrentFeed = {
          ...currentFeed,
          metadata: {
            ...currentFeed.metadata,
            myInviteStatus: type ? 'ACCEPTED' : 'DECLINED'
          }
        }
      }

      return {
        ...state,
        loading: types.UPDATE_FEED_INVITATION_FULFILLED,
        invitedFeedList: restInvitedFeedList,
        feedoList: type ? (updateFeed ? [updateFeed, ...restFeedoList] : restFeedoList) : restFeedoList,
        currentFeed: newCurrentFeed,
        inviteUpdateType: type,
        badgeCount: state.badgeCount > 0 ? state.badgeCount - 1 : 0
      }
    }
    case types.UPDATE_FEED_INVITATION_REJECTED: {
      return {
        ...state,
        loading: types.UPDATE_FEED_INVITATION_REJECTED,
        error: action.error,
      }
    }
    /**
     * Get Feed Detail
     */
    case types.GET_FEED_DETAIL_PENDING:
      return {
        ...state,
        loading: types.GET_FEED_DETAIL_PENDING,
        error: null
      }
    case types.GET_FEED_DETAIL_FULFILLED: {
      const { data } = action.result
      const { invitedFeedList, feedoList } = state
      const feedIndex = findIndex(invitedFeedList, feed => feed.id === data.id);
      if (feedIndex !== -1 && data.metadata.myInviteStatus === 'ACCEPTED') {
        invitedFeedList.pop(feedIndex)
        feedoList.push(data)

        return {
          ...state,
          loading: types.GET_FEED_DETAIL_FULFILLED,
          currentFeed: data,
          feedoList,
          invitedFeedList
        }
      }

      return {
        ...state,
        loading: types.GET_FEED_DETAIL_FULFILLED,
        currentFeed: data
      }
    }
    case types.GET_FEED_DETAIL_REJECTED: {
      const { data } = action.error.response
      const feedId = action.payload
      const { feedoList } = state
      let restFeedoList = feedoList
      if (data.code === 'error.hunt.not.found' || data.code === 'error.hunt.access.denied') {
        restFeedoList = filter(feedoList, feed => feed.id !== feedId)
      }

      return {
        ...state,
        loading: types.GET_FEED_DETAIL_REJECTED,
        error: data,
        feedoList: restFeedoList
      }
    }
    /**
     * Pin Feed
     */
    case types.PIN_FEED_PENDING: {
      return {
        ...state,
        error: null,
      }
    }
    case types.PIN_FEED_FULFILLED: {
      const feedId = action.payload
      const { feedoList } = state

      const currentFeed = find(feedoList, feed => feed.id === feedId)
      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)

      return {
        ...state,
        loading: types.PIN_FEED_FULFILLED,
        feedoList: [
          Object.assign({}, currentFeed, { pinned: { pinned: true } }),
          ...restFeedoList
        ]
      }
    }
    case types.PIN_FEED_REJECTED: {
      return {
        ...state,
        loading: types.PIN_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * UnPin Feed
     */
    case types.UNPIN_FEED_PENDING: {
      return {
        ...state,
        error: null,
      }
    }
    case types.UNPIN_FEED_FULFILLED: {
      const feedId = action.payload
      const { feedoList } = state

      const currentFeed = find(feedoList, feed => feed.id === feedId)
      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)

      return {
        ...state,
        loading: types.UNPIN_FEED_FULFILLED,
        feedoList: [
          Object.assign({}, currentFeed, { pinned: null }),
          ...restFeedoList
        ]
      }
    }
    case types.UNPIN_FEED_REJECTED: {
      return {
        ...state,
        loading: types.UNPIN_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * Delete Feed
     */
    case types.DEL_FEED_PENDING: {
      return {
        ...state,
        error: null,
      }
    }
    case types.DEL_FEED_FULFILLED: {
      const { feedoList } = state
      const data = action.payload

      if (data.flag === 'delete') {
        return {
          ...state,
          loading: types.DEL_FEED_FULFILLED,
        }
      } else {  // Delete duplicated Feed
        const restFeedoList = filter(feedoList, feed => findIndex(data.backFeedList, item => item.id === feed.id) === -1)
        return {
          ...state,
          loading: types.DEL_FEED_FULFILLED,
          duplicatedFeedList: [],
          feedoList: restFeedoList
        }
      }
    }
    case types.DEL_FEED_REJECTED: {
      return {
        ...state,
        loading: types.DEL_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * Archive Feed
     */
    case types.ARCHIVE_FEED_PENDING: {
      return {
        ...state,
        loading: types.ARCHIVE_FEED_PENDING,
        error: null,
      }
    }
    case types.ARCHIVE_FEED_FULFILLED: {
      return {
        ...state,
        loading: types.ARCHIVE_FEED_FULFILLED,
      }
    }
    case types.ARCHIVE_FEED_REJECTED: {
      return {
        ...state,
        loading: types.ARCHIVE_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * Leave Feed
     */
    case types.LEAVE_FEED_PENDING: {
      return {
        ...state,
        loading: LEAVE_FEED_PENDING,
        error: null
      }
    }
    case types.LEAVE_FEED_FULFILLED: {
      return {
        ...state,
        loading: types.LEAVE_FEED_FULFILLED,
      }
    }
    case types.LEAVE_FEED_REJECTED: {
      return {
        ...state,
        loading: types.LEAVE_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * Duplicate Feed
     */
    case types.DUPLICATE_FEED_PENDING: {
      return {
        ...state,
        loading: types.DUPLICATE_FEED_PENDING,
        duplicatedFeedList: [],
        error: null,
      }
    }
    case types.DUPLICATE_FEED_FULFILLED: {
      const { feedoList } = state
      const { data } = action.result

      return {
        ...state,
        feedoList: [
          ...feedoList,
          ...data
        ],
        duplicatedFeedList: data,
        loading: types.DUPLICATE_FEED_FULFILLED,
      }
    }
    case types.DUPLICATE_FEED_REJECTED: {
      return {
        ...state,
        loading: types.DUPLICATE_FEED_REJECTED,
        duplicatedFeedList: [],
        error: action.error,
      }
    }
    /**
     * Append dummy Feed
     */
    case types.ADD_DUMMY_FEED: {
      let { payload: { backFeedList, flag } } = action
      let { feedoList } = state

      backFeedList = backFeedList.map(item => item.feed)
      const restFeedoList = filter(feedoList, feed => findIndex(backFeedList, item => item.id === feed.id) === -1)

      if (flag === 'delete') {
        return {
          ...state,
          loading: types.DEL_FEED_FULFILLED,
          deleteFeedList: backFeedList,
          feedoList: [
            ...restFeedoList
          ]
        }
      } else if (flag === 'archive') {
        for (let i = 0; i < backFeedList.length; i ++) {
          const index = findIndex(feedoList, feed => feed.id === backFeedList[i].id)
          if (index !== -1) {
            feedoList[index] = Object.assign({}, feedoList[index], { status: 'ARCHIVED' })
          }
        }

        return {
          ...state,
          loading: types.ARCHIVE_FEED_FULFILLED,
          archiveFeedList: backFeedList,
          feedoList
        }
      } else if (flag === 'leave') {
        return {
          ...state,
          loading: types.LEAVE_FEED_FULFILLED,
          leaveFeedList: backFeedList,
          feedoList: [
            ...restFeedoList
          ]
        }
      }
      
      return {
        ...state,
      }
    }
    /**
     * Restore feed when clicking Undo in Toaster
     */
    case types.REMOVE_DUMMY_FEED: {
      let { payload: { backFeedList, flag } } = action
      const { feedoList, deleteFeedList, archiveFeedList, leaveFeedList } = state

      backFeedList = backFeedList.map(item => item.feed)
      const restFeedoList = filter(feedoList, feed => findIndex(backFeedList, item => item.id === feed.id) === -1)

      if (flag === 'pin') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            Object.assign({}, backFeedList[0], { pinned: null })
          ]
        }
      } else if (flag === 'unpin') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            Object.assign({}, backFeedList[0], { pinned: { pinned: true } })
          ]
        }
      } else if (flag === 'delete') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            ...deleteFeedList
          ],
          deleteFeedList: [],
        }
      } else if (flag === 'archive') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            ...archiveFeedList
          ],
          archiveFeedList: [],
        }
      } else if (flag === 'leave') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            ...leaveFeedList
          ],
          leaveFeedList: [],
        }
      }
      
      return {
        ...state,
      }
    }
    /**
     * Set Feed detail action (Delete, Archive, Leave)
     */
    case types.SET_FEED_DETAIL_ACTION: {
      const feedDetailAction = action.payload
      return {
        ...state,
        loading: types.SET_FEED_DETAIL_ACTION,
        feedDetailAction
      }
    }
    // create a feed
    case types.CREATE_FEED_PENDING:
      return {
        ...state,
        loading: types.CREATE_FEED_PENDING,
        currentFeed: {},
        error: null,
      }
    case types.CREATE_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.CREATE_FEED_FULFILLED,
        currentFeed: data,
      }
    }
    case types.CREATE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.CREATE_FEED_REJECTED,
        error: data,
      }
    }

    // update a feed
    case types.UPDATE_FEED_PENDING:
      return {
        ...state,
        loading: types.UPDATE_FEED_PENDING,
        error: null,
      }
    case types.UPDATE_FEED_FULFILLED: {
      const { data } = action.result
      const index = findIndex(state.feedoList, (o) => {
        return (o.id === data.id)
      });
      let feedoList = [];
      if (index === -1) {
        feedoList = [
          data,
          ...state.feedoList
        ];
      } else {
        feedoList = state.feedoList;
        feedoList[index] = data;
      }
      return {
        ...state,
        loading: types.UPDATE_FEED_FULFILLED,
        feedoList,
        currentFeed: data,
      }
    }
    case types.UPDATE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.UPDATE_FEED_REJECTED,
        error: data,
      }
    }

    // delete a feed
    case types.DELETE_FEED_PENDING:
      return {
        ...state,
        loading: types.DELETE_FEED_PENDING,
        error: null,
      }
    case types.DELETE_FEED_FULFILLED: {
      return {
        ...state,
        loading: types.DELETE_FEED_FULFILLED,
        // currentFeed: {},
      }
    }
    case types.DELETE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_FEED_REJECTED,
        error: data,
      }
    }

    // set a feed to currentFeed
    case types.SET_CURRENT_FEED: {
      const data = action.payload;
      return {
        ...state,
        loading: types.SET_CURRENT_FEED,
        currentFeed: data,
      }
    }

    // get a file upload url
    case types.GET_FILE_UPLOAD_URL_PENDING:
      return {
        ...state,
        loading: types.GET_FILE_UPLOAD_URL_PENDING,
        fileUploadUrl: {},
        error: null,
      }
    case types.GET_FILE_UPLOAD_URL_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.GET_FILE_UPLOAD_URL_FULFILLED,
        fileUploadUrl: data
      }
    }
    case types.DELETE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_FEED_REJECTED,
        error: data,
      }
    }

    // upload a file
    case types.UPLOAD_FILE_PENDING:
      return {
        ...state,
        loading: types.UPLOAD_FILE_PENDING,
        error: null,
      }
    case types.UPLOAD_FILE_FULFILLED: {
      return {
        ...state,
        loading: types.UPLOAD_FILE_FULFILLED,
      }
    }
    case types.UPLOAD_FILE_REJECTED: {
      return {
        ...state,
        loading: types.UPLOAD_FILE_REJECTED,
        error: action.error,
      }
    }

    // add a file
    case types.ADD_FILE_PENDING:
      return {
        ...state,
        loading: types.ADD_FILE_PENDING,
        error: null,
      }
    case types.ADD_FILE_FULFILLED: {
      const { data } = action.result
      let files = files = state.currentFeed.files || [];
      files.unshift(data);
      return {
        ...state,
        loading: types.ADD_FILE_FULFILLED,
        currentFeed: {
          ...state.currentFeed,
          files,
        }
      }
    }
    case types.ADD_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.ADD_FILE_REJECTED,
        error: data,
      }
    }
  
    // delete a file
    case types.DELETE_FILE_PENDING:
      return {
        ...state,
        loading: types.DELETE_FILE_PENDING,
        error: null,
      }
    case types.DELETE_FILE_FULFILLED: {
      const fileId = action.payload;
      const files = filter(state.currentFeed.files, file => file.id !== fileId);
      return {
        ...state,
        loading: types.DELETE_FILE_FULFILLED,
        currentFeed: {
          ...state.currentFeed,
          files,
        }
      }
    }
    case types.DELETE_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_FILE_REJECTED,
        error: data,
      }
    }

    // get user tags
    case types.GET_USER_TAGS_PENDING: 
      return {
        ...state,
        loading: types.GET_USER_TAGS_PENDING,
        error: null,
      }
    case types.GET_USER_TAGS_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.GET_USER_TAGS_FULFILLED,
        userTags: data,
      }
    }
    case types.DELETE_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_FILE_REJECTED,
        error: data,
      }
    }

    // create a user tags
    case types.CREATE_USER_TAGS_PENDING:
      return {
        ...state,
        loading: types.CREATE_USER_TAGS_PENDING,
        error: null,
      }
    case types.CREATE_USER_TAG_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.CREATE_USER_TAG_FULFILLED,
        userTags: [
          ...state.userTags,
          data,
        ],
      }
    }
    case types.CREATE_USER_TAG_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.CREATE_USER_TAG_REJECTED,
        error: data,
      }
    }

    // add a tag to a hunt
    case types.ADD_HUNT_TAG_PENDING:
      return {
        ...state,
        loading: types.ADD_HUNT_TAG_PENDING,
        error: null,
      }
    case types.ADD_HUNT_TAG_FULFILLED: {
      const { data } = action.result

      // Get all the new tags that were successfully added
      const newTags = filter(data, tag => tag.wasSuccessful === true);
      let tags = [...state.currentFeed.tags, ...newTags];
      
      // Also need to add newly created tags to list of user tags      
      const userTags = [...state.userTags]
      newTags.forEach(function (newTag) {
        // If doesn't already exist in the users tags then add it
        const alreadyExists = find(userTags, userTag => userTag.text === newTag.text);
        if (!alreadyExists) {
          userTags.push(newTag)
        }
      });
      
      const restFeedoList = filter(state.feedoList, feed => feed.id !== state.currentFeed.id)
      const newCurrentFeed = {
        ...state.currentFeed,
        tags,
      }

      return {
        ...state,
        loading: types.ADD_HUNT_TAG_FULFILLED,
        currentFeed: newCurrentFeed,
        feedoList: [
          ...restFeedoList,
          newCurrentFeed
        ],
        userTags
      }
    }
    case types.ADD_HUNT_TAG_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.ADD_HUNT_TAG_REJECTED,
        error: data,
      }
    }

    // remove a tag from a hunt
    case types.REMOVE_HUNT_TAG_PENDING:
      return {
        ...state,
        loading: types.REMOVE_HUNT_TAG_PENDING,
        error: null,
      }
    case types.REMOVE_HUNT_TAG_FULFILLED: {
      const tagId = action.payload;
      const tags = filter(state.currentFeed.tags, tag => tag.id !== tagId);

      const restFeedoList = filter(state.feedoList, feed => feed.id !== state.currentFeed.id)
      const newCurrentFeed = {
        ...state.currentFeed,
        tags,
      }

      return {
        ...state,
        loading: types.REMOVE_HUNT_TAG_FULFILLED,
        currentFeed: newCurrentFeed,
        feedoList: [
          ...restFeedoList,
          newCurrentFeed
        ]
      }
    }
    case types.REMOVE_HUNT_TAG_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.REMOVE_HUNT_TAG_REJECTED,
        error: data,
      }
    }
    /**
     * Update sharing preferenecs
     */
    case types.UPDATE_SHARING_PREFERENCES_PENDING: {
      return {
        ...state,
        loading: types.UPDATE_SHARING_PREFERENCES_PENDING,
        error: null,
      }
    }
    case types.UPDATE_SHARING_PREFERENCES_FULFILLED: {
      let { feedoList, currentFeed } = state
      const { feedId, data } = action.payload

      let newFeed = Object.assign(
        {},
        currentFeed,
        {
          sharingPreferences: {
            level: data.level,
            permissions: data.level === 'INVITEES_ONLY' ? null : data.permissions
          }
        }
      )

      const currentFeedIndex = findIndex(feedoList, feed => feed.id === currentFeed.id)
      feedoList[currentFeedIndex] = newFeed

      return {
        ...state,
        loading: types.UPDATE_SHARING_PREFERENCES_FULFILLED,
        feedoList,
        currentFeed: newFeed,
      }
    }
    case types.UPDATE_SHARING_PREFERENCES_REJECTED: {
      return {
        ...state,
        loading: types.UPDATE_SHARING_PREFERENCES_REJECTED,
        error: action.error,
      }
    }
    /**
     * Delete Invitee
     */
    case types.DELETE_INVITEE_PENDING:
      return {
        ...state,
        loading: types.DELETE_INVITEE_PENDING,
        error: null,
      }
    case types.DELETE_INVITEE_FULFILLED: {
      const { currentFeed } = state
      const inviteeId = action.payload
      const restInviteeList = currentFeed.invitees.map(invitee => setRemovedInvitees(invitee, inviteeId))

      return {
        ...state,
        loading: types.DELETE_INVITEE_FULFILLED,
        currentFeed: {
          ...currentFeed,
          invitees: restInviteeList
        }
      }
    }
    case types.DELETE_INVITEE_REJECTED: {
      const { data } = action.error.response

      return {
        ...state,
        loading: types.DELETE_INVITEE_REJECTED,
        error: data,
      }
    }
    /**
     * Update Invitee permission
     */
    case types.UPDATE_INVITEE_PERMISSION_PENDING:
      return {
        ...state,
        loading: types.UPDATE_INVITEE_PERMISSION_PENDING,
        error: null,
      }
    case types.UPDATE_INVITEE_PERMISSION_FULFILLED: {
      const { data } = action.result
      const { currentFeed, feedoList } = state
      const { payload } = action

      let invitees = []
      let updatedFeed = currentFeed
      if (!isEmpty(currentFeed)) {
        invitees = currentFeed.invitees
        for (let i = 0; i < invitees.length; i ++) {
          if (invitees[i].id === payload.inviteeId) {
            invitees[i].permissions = payload.type
          }
        }
  
        updatedFeed = {
          ...currentFeed,
          invitees
        }
      }

      return {
        ...state,
        loading: types.UPDATE_INVITEE_PERMISSION_FULFILLED,
        currentFeed: updatedFeed
      }
    }
    case types.UPDATE_INVITEE_PERMISSION_REJECTED: {
      const { data } = action.error.response

      return {
        ...state,
        loading: types.UPDATE_INVITEE_PERMISSION_REJECTED,
        error: data,
      }
    }


    /**
     * Update a card in feedList
     */

    case cardTypes.UPDATE_CARD_FULFILLED: {
      const { data } = action.result
      const isCreateCard = action.payload
      let { currentFeed, feedoList } = state
      const ideaIndex = findIndex(currentFeed.ideas, idea => idea.id === data.id);
      if (ideaIndex === -1) {
        currentFeed.ideas.unshift(data)  
      } else {
        currentFeed.ideas[ideaIndex] = data;
      }

      const inviteeIndex = findIndex(currentFeed.invitees, invitee => invitee.id === data.inviteeId);
      if (inviteeIndex !== -1) {
        let inviteeIdeas = currentFeed.invitees[inviteeIndex].ideas
        if (!inviteeIdeas) {
          inviteeIdeas = [];
          inviteeIdeas.push({ id: data.id });
        } else {
          const inviteeIdeaIndex = findIndex(inviteeIdeas, idea => idea.id === data.id);
          if (inviteeIdeaIndex === -1) {
            inviteeIdeas.unshift({ id: data.id });
          }
        }
        currentFeed.invitees[inviteeIndex].ideas = inviteeIdeas;
      }

      const restFeedoList = filter(feedoList, feed => feed.id !== currentFeed.id)
      const currentFeedIndex = findIndex(feedoList, feed => feed.id === currentFeed.id)
      feedoList[currentFeedIndex] = currentFeed

      return {
        ...state,
        loading: 'UPDATE_CARD_FULFILLED',
        isCreateCard,
        currentFeed: {
          ...currentFeed,
        },
        feedoList: isCreateCard ? [{ ...currentFeed }, ...restFeedoList] : feedoList
      }
    }


    /**
     * Like a card in ideas
     */
    case cardTypes.LIKE_CARD_FULFILLED: {
      const { currentFeed } = state
      const ideaId = action.payload;
      const ideaIndex = findIndex(currentFeed.ideas, idea => idea.id === ideaId);
      currentFeed.ideas[ideaIndex].metadata.likes ++;
      currentFeed.ideas[ideaIndex].metadata.liked = true;
      return {
        ...state,
        currentFeed: {
          ...currentFeed,
        }
      }
    }


    /**
     * UnLike a card in ideas
     */
    case cardTypes.UNLIKE_CARD_FULFILLED: {
      const { currentFeed } = state
      const ideaId = action.payload;
      const ideaIndex = findIndex(currentFeed.ideas, idea => idea.id === ideaId);
      currentFeed.ideas[ideaIndex].metadata.likes --;
      currentFeed.ideas[ideaIndex].metadata.liked = false;

      return {
        ...state,
        currentFeed: {
          ...currentFeed,
        }
      }
    }


    /**
     * add a comment in ideas
     */
    case cardTypes.ADD_CARD_COMMENT_FULFILLED: {
      const { currentFeed } = state
      const ideaId = action.payload;
      const ideaIndex = findIndex(currentFeed.ideas, idea => idea.id === ideaId);
      currentFeed.ideas[ideaIndex].metadata.comments ++;
      return {
        ...state,
        loading: 'ADD_CARD_COMMENT_FULFILLED',
        currentFeed: {
          ...currentFeed,
        }
      }
    }


    /**
     * delete a comment in ideas
     */
    case cardTypes.DELETE_CARD_COMMENT_FULFILLED: {
      const { currentFeed } = state
      const { ideaId } = action.payload;
      const ideaIndex = findIndex(currentFeed.ideas, idea => idea.id === ideaId);
      currentFeed.ideas[ideaIndex].metadata.comments --;
      return {
        ...state,
        loading: 'DELETE_CARD_COMMENT_FULFILLED',
        currentFeed: {
          ...currentFeed,
        }
      }
    }

    /**
     * move a card
     */
    case cardTypes.MOVE_CARD_FULFILLED: {
      const { currentFeed } = state
      const data = action.payload

      const restIdeas = filter(currentFeed.ideas, idea => findIndex(data, card => card.ideaId === idea.id ) === -1)
      const ideasSubmitted = currentFeed.metadata.ideasSubmitted - data.length

      return {
        ...state,
        loading: 'MOVE_CARD_FULFILLED',
        currentFeed: {
          ...currentFeed,
          ideas: restIdeas,
          metadata: Object.assign({}, currentFeed.metadata, { ideasSubmitted })
        }
      }
    }

    
    /**
     * Invite contact to HUNT
     */
    case types.INVITE_HUNT_PENDING: {
      return {
        ...state,
        loading: types.INVITE_HUNT_PENDING,
        error: null,
      }
    }
    case types.INVITE_HUNT_FULFILLED: {
      const { data } = action.result
      const { feedoList, currentFeed } = state
      const feedId = action.payload

      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)
      const newFeed = {
        ...currentFeed,
        invitees: [
          ...currentFeed.invitees,
          ...data
        ]
      }

      let error = null
      if (data.length === 0) {
        error = resolveError('error.invitee.feed.invalid', 'Email is Duplicated')
      }
  
      return {
        ...state,
        loading: types.INVITE_HUNT_FULFILLED,
        feedoList: [
          newFeed,
          ...restFeedoList
        ],
        currentFeed: newFeed,
        error
      }
    }
    case types.INVITE_HUNT_REJECTED: {
      const { error } = action
      return {
        ...state,
        loading: types.INVITE_HUNT_REJECTED,
        error: action.error
      }
    }
    case types.ADD_FILTER_TAG: {
      const data = action.payload
      return {
        ...state,
        loading: types.ADD_FILTER_TAG,
        filterTag: data
      }
    }
    /**
     * Get Archived Feed List
     */
    case types.GET_ARCHIVED_FEED_PENDING:
      return {
        ...state,
        loading: types.GET_ARCHIVED_FEED_PENDING,
      }
    case types.GET_ARCHIVED_FEED_FULFILLED: {
      const { data } = action.result

      return {
        ...state,
        loading: types.GET_ARCHIVED_FEED_FULFILLED,
        archivedFeedList: data.content,
      }
    }
    case types.GET_ARCHIVED_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.GET_ARCHIVED_FEED_REJECTED,
        archivedFeedList: [],
        error: data,
      }
    }

    /**
     * Restore Archived Feed
     */
    case types.RESTORE_ARCHIVE_FEED_PENDING:
      return {
        ...state,
        loading: types.RESTORE_ARCHIVE_FEED_PENDING,
      }
    case types.RESTORE_ARCHIVE_FEED_FULFILLED: {
      const { data } = action.result
      const { archivedFeedList, feedoList } = state
      const feedId = action.payload
      const restFeedoList = filter(archivedFeedList, feed => feed.id !== feedId)

      return {
        ...state,
        loading: types.RESTORE_ARCHIVE_FEED_FULFILLED,
        archivedFeedList: restFeedoList,
        feedoList: [
          ...feedoList,
          data
        ]
      }
    }
    case types.RESTORE_ARCHIVE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.RESTORE_ARCHIVE_FEED_REJECTED,
        error: data,
      }
    }
    /**
     * Get Activity Feed List
     */
    case types.GET_ACTIVITY_FEED_PENDING:
      return {
        ...state,
        loading: types.GET_ACTIVITY_FEED_PENDING,
      }
    case types.GET_ACTIVITY_FEED_FULFILLED: {
      const { data } = action.result

      if(data.badgeCount >= 0) {
        PushNotification.setApplicationIconBadgeNumber(data.badgeCount)
      }

      let activityFeedList = []
      activityFeedList = data.huntActivities

      return {
        ...state,
        loading: types.GET_ACTIVITY_FEED_FULFILLED,
        activityFeedList,
        activityData: data,
        badgeCount: data.badgeCount
      }
    }
    case types.GET_ACTIVITY_FEED_REJECTED: {
      return {
        ...state,
        loading: types.GET_ACTIVITY_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * Read all acitivty
     */
    case types.READ_ALL_ACTIVITY_FEED_PENDING:
      return {
        ...state,
        loading: types.READ_ALL_ACTIVITY_FEED_PENDING,
      }
    case types.READ_ALL_ACTIVITY_FEED_FULFILLED: {
      return {
        ...state,
        loading: types.READ_ALL_ACTIVITY_FEED_FULFILLED
      }
    }
    case types.READ_ALL_ACTIVITY_FEED_REJECTED: {
      return {
        ...state,
        loading: types.READ_ALL_ACTIVITY_FEED_REJECTED,
        error: action.error.response,
      }
    }
    /**
     * Read acitivty group
     */
    case types.READ_ACTIVITY_GROUP_PENDING:
      return {
        ...state,
        loading: types.READ_ACTIVITY_GROUP_PENDING,
      }
    case types.READ_ACTIVITY_GROUP_FULLFILLED: {
      const activityGroupId = action.payload
      const { activityFeedList, activityData } = state

      const currentActivityFeedList = filter(activityFeedList, feed => feed.id === activityGroupId)
      const restActivityFeedList = filter(activityFeedList, feed => feed.id !== activityGroupId)

      return {
        ...state,
        loading: types.READ_ACTIVITY_GROUP_FULLFILLED,
        activityFeedList: [
          ...restActivityFeedList,
          {
            ...currentActivityFeedList[0],
            read: true
          }
        ]
      }
    }
    case types.READ_ACTIVITY_GROUP_REJECTED: {
      return {
        ...state,
        loading: types.READ_ACTIVITY_GROUP_REJECTED,
        error: action.error.response,
      }
    }
    /**
     * Read acitivty
     */
    case types.READ_ACTIVITY_FEED_PENDING:
      return {
        ...state,
        loading: types.READ_ACTIVITY_FEED_PENDING,
      }
    case types.READ_ACTIVITY_FEED_FULFILLED: {
      const activityId = action.payload
      const { activityFeedList, activityData } = state

      const currentActivityFeedList = filter(activityFeedList, feed => feed.id === activityId)
      const restActivityFeedList = filter(activityFeedList, feed => feed.id !== activityId)

      return {
        ...state,
        loading: types.READ_ACTIVITY_FEED_FULFILLED,
        activityFeedList: [
          ...restActivityFeedList,
          {
            ...currentActivityFeedList[0],
            read: true
          }
        ]
      }
    }
    case types.READ_ACTIVITY_FEED_REJECTED: {
      return {
        ...state,
        loading: types.READ_ACTIVITY_FEED_REJECTED,
        error: action.error.response,
      }
    }
    /**
     * Delete acitivty
     */
    case types.DEL_ACTIVITY_FEED_PENDING:
      return {
        ...state,
        loading: types.DEL_ACTIVITY_FEED_PENDING,
      }
    case types.DEL_ACTIVITY_FEED_FULFILLED: {
      const activityId = action.payload
      const { activityFeedList, activityData } = state

      const restActivityFeedList = filter(activityFeedList, feed => feed.id !== activityId)

      return {
        ...state,
        loading: types.DEL_ACTIVITY_FEED_FULFILLED,
        activityFeedList: restActivityFeedList
      }
    }
    case types.DEL_ACTIVITY_FEED_REJECTED: {
      return {
        ...state,
        loading: types.DEL_ACTIVITY_FEED_REJECTED,
        error: action.error.response,
      }
    }
    case types.DEL_DUMMY_CARD: {
      const { currentFeed, feedoList } = state
      const { deletedIdeaList , type } = action.payload;

      let originalFeed = {}
      let deletedDummyCards = []
      if (type === 0) { //delete
        const restIdeas = filter(currentFeed.ideas, idea => findIndex(deletedIdeaList, card => card.idea.id === idea.id ) === -1)

        for (let i = 0; i < deletedIdeaList.length; i ++) {
          const card = find(currentFeed.ideas, idea => idea.id === deletedIdeaList[i].idea.id)
          deletedDummyCards.push(card)
        }

        const ideasSubmitted = currentFeed.metadata.ideasSubmitted - deletedIdeaList.length
        originalFeed = {
          ...currentFeed,
          ideas: restIdeas,
          metadata: Object.assign({}, currentFeed.metadata, { ideasSubmitted })
        }
      } else {  //restore
        currentFeed.ideas = [
          ...currentFeed.ideas,
          ...state.deletedDummyCards
        ]
        const ideasSubmitted = currentFeed.metadata.ideasSubmitted + state.deletedDummyCards.length
        originalFeed = {
          ...currentFeed,
          metadata: Object.assign({}, currentFeed.metadata, { ideasSubmitted })
        }
        deletedDummyCards = []
      }

      const restFeedoList = filter(feedoList, feed => feed.id !== currentFeed.id)

      return {
        ...state,
        loading: types.DEL_DUMMY_CARD,
        deletedDummyCards,
        currentFeed: originalFeed,
        feedoList: [
          originalFeed,
          ...restFeedoList
        ]
      }
    }
    /**
     * move dummy card
     */
    case types.MOVE_DUMMY_CARD: {
      const { currentFeed, feedoList } = state
      const { movedIdeaList, huntId, type } = action.payload;

      let dummyMoveCard = {}
      let newFeedList = []
      let originalFeed = {}
      let restFeedoList = []

      if (type === 0) {
        // Move
        restFeedoList = filter(feedoList, feed => feed.id !== currentFeed.id)

        const restIdeas = filter(currentFeed.ideas, idea => findIndex(movedIdeaList, card => card.idea.id === idea.id ) === -1)
       
        const moveToFeedIndex = findIndex(restFeedoList, feed => feed.id === huntId)
        
        const movedDummyCards = []

        if (moveToFeedIndex !== -1) {
          for (let i = 0; i < movedIdeaList.length; i ++) {
            const card = find(currentFeed.ideas, idea => idea.id === movedIdeaList[i].idea.id)
            movedDummyCards.push(card)

            restFeedoList[moveToFeedIndex].ideas.push(card);
          }
          restFeedoList[moveToFeedIndex].metadata.ideasSubmitted =
              restFeedoList[moveToFeedIndex].metadata.ideasSubmitted + movedIdeaList.length
        }

        originalFeed = {
          ...currentFeed,
          ideas: restIdeas
        }
        originalFeed.metadata.ideasSubmitted = originalFeed.metadata.ideasSubmitted - movedIdeaList.length


        newFeedList = [
          originalFeed,
          ...restFeedoList
        ]       

        dummyMoveCard = { movedIdeaList, feedId: huntId, oldFeed: currentFeed, newFeed: restFeedoList[moveToFeedIndex], movedDummyCards }
      } else {
        // Undo
        dummyMoveCard = state.dummyMoveCard
        restFeedoList = filter(feedoList, feed => feed.id !== dummyMoveCard.feedId)

        const restIdeas = filter(dummyMoveCard.newFeed.ideas, idea => findIndex(dummyMoveCard.movedIdeaList, card => card.idea.id === idea.id) === -1)

        let movedFeed = {
          ...dummyMoveCard.newFeed,
          ideas: restIdeas
        }
        movedFeed.metadata.ideasSubmitted = movedFeed.metadata.ideasSubmitted - dummyMoveCard.movedIdeaList.length
        
        const originalFeedIndex = findIndex(restFeedoList, feed => feed.id === currentFeed.id)

        if (originalFeedIndex !== -1) {
          restFeedoList[originalFeedIndex].ideas.push(dummyMoveCard.movedDummyCards);
          restFeedoList[originalFeedIndex].metadata.ideasSubmitted =
            restFeedoList[originalFeedIndex].metadata.ideasSubmitted + dummyMoveCard.movedIdeaList.length
        }

        newFeedList = [
          movedFeed,
          ...restFeedoList
        ]

        dummyMoveCard = {}
      }

      return {
        ...state,
        loading: 'MOVE_DUMMY_CARD',
        dummyMoveCard,
        feedoList: newFeedList
      }
    }
    case types.PUBNUB_DELETE_FEED: {
      const feedId = action.payload
      const { feedoList, invitedFeedList } = state

      const restFeedoList = filter(feedoList, feed => feed.id !== feedId )
      const restInviteeFeedoList = filter(invitedFeedList, feed => feed.id !== feedId )

      return {
        ...state,
        loading: types.PUBNUB_DELETE_FEED,
        feedoList: restFeedoList,
        invitedFeedList: restInviteeFeedoList
      }
    }
    case cardTypes.GET_CARD_FULFILLED: {
      const { data } = action.result
      const { feedoList, currentFeed } = state

      let updateFeed = find(feedoList, feed => feed.id === data.huntId)

      if (updateFeed) {
        if (updateFeed.id === currentFeed.id) {
          updateFeed = currentFeed
        }

        const restIdeas = filter(updateFeed.ideas, idea => idea.id !== data.id)
        const newUpdateFeed = {...updateFeed, ideas: [...restIdeas, data]}
        const restFeedoList = filter(feedoList, feed => feed.id !== data.huntId)

        const newCurrentFeed = (!isEmpty(currentFeed) && currentFeed.id === data.huntId) ? newUpdateFeed : currentFeed

        return {
          ...state,
          loading: 'GET_CARD_FULFILLED',
          feedoList: [...restFeedoList, newUpdateFeed],
          currentFeed: { ...newCurrentFeed }
        }
      } else {
        return {
          ...state,
          loading: 'GET_CARD_FULFILLED'
        }
      }
    }
    case cardTypes.GET_CARD_COMMENTS_FULFILLED: {
      const { data } = action.result
      const ideaId = action.payload
      const { currentFeed } = state

      let newCurrentFeed = currentFeed
      const restIdeas = filter(currentFeed.ideas, idea => idea.id !== ideaId)
      const currentIdea = find(currentFeed.ideas, idea => idea.id === ideaId )
      if (!isEmpty(currentFeed) && currentIdea) {
        const newUpdateFeed = {
          ...currentFeed,
          ideas: [
            ...restIdeas,
            {
              ...currentIdea,
              metadata: {
                ...currentIdea.metadata,
                comments: data.length
              }
            }
          ]
        }
        newCurrentFeed = newUpdateFeed
      }

      return {
        ...state,
        loading: 'GET_CARD_COMMENTS_FULFILLED',
        currentFeed: newCurrentFeed
      }
    }
    case types.PUBNUB_GET_FEED_DETAIL_FULFILLED: {
      const { data } = action.result
      const { feedoList, invitedFeedList, archivedFeedList, currentFeed } = state

      const restFeedoList = filter(feedoList, feed => feed.id !== data.id)
      const restInvitedFeedoList = filter(invitedFeedList, feed => feed.id !== data.id)
      const restArchivedFeedoList = filter(archivedFeedList, feed => feed.id !== data.id)
      const newCurrentFeed = isEmpty(currentFeed) ? currentFeed : currentFeed.id === data.id ? data : currentFeed

      return {
        ...state,
        loading: types.PUBNUB_GET_FEED_DETAIL_FULFILLED,
        currentFeed: newCurrentFeed,
        feedoList: feedoList.length === restFeedoList.length ? feedoList : [ ...restFeedoList, data ],
        invitedFeedList: invitedFeedList.length === restInvitedFeedoList.length ? invitedFeedList : [ ...restInvitedFeedoList, data ],
        archivedFeedList: archivedFeedList.length === restArchivedFeedoList.length ? archivedFeedList : [ ...restArchivedFeedoList, data ]
      }
    }
    case types.PUBNUB_MOVE_IDEA_FULFILLED: {
      const { feedId, ideaId } = action.payload
      const { feedoList, currentFeed } = state

      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)
      const oldFeed = find(feedoList, feed => feed.id === feedId)
      const restOldIdeas = filter(oldFeed.ideas, idea => idea.id !== ideaId)

      let newCurrentFeed = currentFeed
      const ideasSubmitted = oldFeed.metadata.ideasSubmitted - 1
      if (currentFeed.id === feedId) {
        newCurrentFeed = {
          ...newCurrentFeed,
          ideas: filter(newCurrentFeed.ideas, idea => idea.id !== ideaId),
          metadata: Object.assign({}, currentFeed.metadata, { ideasSubmitted })
        }
      }

      return {
        ...state,
        loading: types.PUBNUB_MOVE_IDEA_FULFILLED,
        feedoList: [
          ...restFeedoList,
          {
            ...oldFeed,
            ideas: restOldIdeas,
            metadata: Object.assign({}, currentFeed.metadata, { ideasSubmitted })
          }
        ],
        currentFeed: newCurrentFeed
      }
    }
    case types.PUBNUB_LIKE_CARD_FULFILLED: {
      const ideaId = action.payload
      const { currentFeed } = state

      let newCurrentFeed = currentFeed
      const restIdeas = filter(currentFeed.ideas, idea => idea.id !== ideaId)
      const currenntIdea = find(currentFeed.ideas, idea => idea.id === ideaId )
      if (!isEmpty(currentFeed) && currenntIdea) {
        const newUpdateFeed = {
          ...currentFeed,
          ideas: [
            ...restIdeas,
            {
              ...currenntIdea,
              metadata: {
                ...currenntIdea.metadata,
                likes: currenntIdea.metadata.likes + 1
              }
            }
          ]
        }
        newCurrentFeed = newUpdateFeed
      }
      return {
        ...state,
        loading: types.PUBNUB_LIKE_CARD_FULFILLED,
        currentFeed: newCurrentFeed
      }
    }
    case types.PUBNUB_UNLIKE_CARD_FULFILLED: {
      const ideaId = action.payload
      const { currentFeed } = state

      let newCurrentFeed = currentFeed
      const restIdeas = filter(currentFeed.ideas, idea => idea.id !== ideaId)
      const currenntIdea = find(currentFeed.ideas, idea => idea.id === ideaId )
      if (!isEmpty(currentFeed) && currenntIdea) {
        const newUpdateFeed = {
          ...currentFeed,
          ideas: [
            ...restIdeas,
            {
              ...currenntIdea,
              metadata: {
                ...currenntIdea.metadata,
                likes: currenntIdea.metadata === 0 ? 0 : currenntIdea.metadata.likes - 1
              }
            }
          ]
        }
        newCurrentFeed = newUpdateFeed
      }
      return {
        ...state,
        loading: types.PUBNUB_UNLIKE_CARD_FULFILLED,
        currentFeed: newCurrentFeed
      }
    }
    case types.PUBNUB_DELETE_INVITEE_FULFILLED:
    case types.PUBNUB_DELETE_OTHER_INVITEE_FULFILLED: {
      const { huntId, inviteeId } = action.payload
      const { feedoList, currentFeed } = state

      const selectFeed = find(feedoList, feedo => feedo.id === huntId)
      const restFeedoList = filter(feedoList, feedo => feedo.id !== huntId)
      
      const restInvitees = selectFeed ? selectFeed.invitees.map(invitee => setRemovedInvitees(invitee, inviteeId)) : null
      const currentRestInvitees = currentFeed.invitees.map(invitee => setRemovedInvitees(invitee, inviteeId))

      const newFeedoList = selectFeed ? [ ...restFeedoList, { ...selectFeed, invitees: restInvitees } ] : [ ...restFeedoList ]

      return {
        ...state,
        loading: types.PUBNUB_DELETE_INVITEE_FULFILLED,
        feedoList: newFeedoList,
        currentFeed: {
          ...currentFeed,
          invitees: currentRestInvitees
        }
      }
    }
    /**
     * Get activity feed visited
     */
    case types.GET_ACTIVITY_FEED_VISITED_PENDING:
      return {
        ...state,
        loading: types.GET_ACTIVITY_FEED_VISITED_PENDING,
      }
    case types.GET_ACTIVITY_FEED_VISITED_FULFILLED: {
      const { data } = action.result

      if(data.count >= 0) {
        PushNotification.setApplicationIconBadgeNumber(data.count)
      }

      return {
        ...state,
        loading: types.GET_ACTIVITY_FEED_VISITED_FULFILLED,
        badgeCount: data.count
      }
    }
    case types.GET_ACTIVITY_FEED_VISITED_REJECTED: {
      return {
        ...state,
        loading: types.GET_ACTIVITY_FEED_VISITED_REJECTED,
        error: action.error.response,
      }
    }
    /**
     * Save flow preference (LIST, MASONRY)
     */
    case types.SAVE_FLOW_PREFERENCE_PENDING:
      return {
        ...state,
        loading: types.SAVE_FLOW_PREFERENCE_PENDING,
      }
    case types.SAVE_FLOW_PREFERENCE_FULFILLED: {
      const { feedId, preference } = action.payload
      const { feedoList, invitedFeedList } = state

      let restFeedoList = filter(feedoList, feed => feed.id !== feedId)
      let updateFeed = find(feedoList, feed => feed.id === feedId)
      if (updateFeed) {
        updateFeed = {
          ...updateFeed,
          metadata: {
            ...updateFeed.metadata,
            myViewPreference: preference
          }
        }
        restFeedoList = [
          ...restFeedoList,
          updateFeed
        ]
      }

      let restInvitedFeedList = filter(invitedFeedList, feed => feed.id !== feedId)
      let invitedFeed = find(invitedFeedList, feed => feed.id === feedId)
      if (invitedFeed) {
        invitedFeed = {
          ...invitedFeed,
          metadata: {
            ...invitedFeed.metadata,
            myViewPreference: preference
          }
        }
        restInvitedFeedList = [
          ...restInvitedFeedList,
          invitedFeed
        ]
      }

      return {
        ...state,
        loading: types.SAVE_FLOW_PREFERENCE_FULFILLED,
        feedoList: restFeedoList,
        invitedFeedList: restInvitedFeedList
      }
    }
    case types.SAVE_FLOW_PREFERENCE_REJECTED: {
      return {
        ...state,
        loading: types.SAVE_FLOW_PREFERENCE_REJECTED,
        error: action.error.response,
      }
    }
    case userTypes.USER_SIGNOUT_FULFILLED: {
      return {
        ...state,
        feedoList: [],
        archivedFeedList: [],
        invitedFeedList: [],
        activityFeedList: []
      }
    }
    case userTypes.UPDATE_PROFILE_FULFILLED: {
      const { feedoList } = state
      const { data } = action.result

      const updatedFeedList = feedoList.map(feed => {
        ownerIndex = findIndex(feed.invitees, invitee => invitee.userProfile.id === data.id)
        if (ownerIndex) {
          feed.invitees[ownerIndex].userProfile.imageUrl = data.imageUrl
        }
        return feed
      })

      return {
        ...state,
        loading: userTypes.UPDATE_PROFILE_FULFILLED,
        feedoList: [...updatedFeedList]
      }
    }
    case types.PUBNUB_USER_INVITED_FULFILLED: {
      return {
        ...state,
        loading: types.PUBNUB_USER_INVITED_FULFILLED
      }
    }
    default:
      return state;
  }
}
