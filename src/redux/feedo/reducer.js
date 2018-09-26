import * as types from './types'
import * as cardTypes from '../card/types'
import { filter, find, findIndex } from 'lodash'
import resolveError from './../../service/resolveError'

const initialState = {
  loading: null,
  error: null,
  feedoList: null,
  currentFeed: {},
  pinResult: null,
  duplicaetdId: null,
  feedDetailAction: null,
  fileUploadUrl: {},
  userTags: [],
  archivedFeedList: []
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    /**
     * Get Feed List
     */
    case types.GET_FEEDO_LIST_PENDING:
      return {
        ...state,
        loading: types.GET_FEEDO_LIST_PENDING,
      }
    case types.GET_FEEDO_LIST_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.GET_FEEDO_LIST_FULFILLED,
        feedoList: data.content,
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
      return {
        ...state,
        loading: types.GET_FEED_DETAIL_FULFILLED,
        currentFeed: data,
      }
    }
    case types.GET_FEED_DETAIL_REJECTED: {
      return {
        ...state,
        loading: types.GET_FEED_DETAIL_REJECTED,
        error: action.error,
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
      return {
        ...state,
        loading: types.PIN_FEED_FULFILLED,
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
      return {
        ...state,
        loading: types.UNPIN_FEED_FULFILLED,
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
      const feedId = action.payload
      if (feedId === 'empty') {
        return {
          ...state,
          loading: types.DEL_FEED_FULFILLED,
        }
      } else {  // Delete duplicated Feed
        const restFeedoList = filter(feedoList, feed => feed.id !== feedId)        
        return {
          ...state,
          loading: types.DEL_FEED_FULFILLED,
          duplicatedId: null,
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
    case types.DUPLICATE_FEED_PENDING: {
      return {
        ...state,
        loading: types.DUPLICATE_FEED_PENDING,
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
          data
        ],
        duplicatedId: data.id,
        loading: types.DUPLICATE_FEED_FULFILLED,
      }
    }
    case types.DUPLICATE_FEED_REJECTED: {
      return {
        ...state,
        loading: types.DUPLICATE_FEED_REJECTED,
        error: action.error,
      }
    }
    /**
     * Append dummy Feed
     */
    case types.ADD_DUMMY_FEED: {
      const { payload: { feedId, flag } } = action
      const { feedoList } = state

      const currentFeed = filter(feedoList, feed => feed.id === feedId)
      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)

      if (flag === 'pin') {
        return {
          ...state,
          loading: 'ADD_DUMMY_FEED',
          feedoList: [
            Object.assign({}, currentFeed[0], { pinned: { pinned: true } }),
            ...restFeedoList
          ]
        }
      } else if (flag === 'unpin') {
        return {
          ...state,
          loading: 'ADD_DUMMY_FEED',
          pinnedDate: currentFeed[0].pinned.pinnedDate,
          feedoList: [
            Object.assign({}, currentFeed[0], { pinned: null }),
            ...restFeedoList
          ]
        }
      } else if (flag === 'delete') {
        return {
          ...state,
          loading: types.DEL_FEED_FULFILLED,
          deleteFeed: currentFeed,
          feedoList: restFeedoList
        }
      } else if (flag === 'archive') {
        return {
          ...state,
          loading: types.ARCHIVE_FEED_FULFILLED,
          archiveFeed: currentFeed,
          feedoList: [
            ...restFeedoList,
            Object.assign({}, currentFeed[0], { status: 'ARCHIVED' })
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
      const { payload: { feedId, flag } } = action
      const { feedoList, pinnedDate, deleteFeed, archiveFeed } = state

      const currentFeed = filter(feedoList, feed => feed.id === feedId)
      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)

      if (flag === 'pin') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            Object.assign({}, currentFeed[0], { pinned: null })
          ]
        }
      } else if (flag === 'unpin') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            Object.assign({}, currentFeed[0], { pinned: { pinned: true, pinnedDate } })
          ],
          pinnedDate: null
        }
      } else if (flag === 'delete') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            Object.assign({}, deleteFeed[0])
          ],
          deleteFeed: null,
        }
      } else if (flag === 'archive') {
        return {
          ...state,
          loading: 'FEED_FULFILLED',
          feedoList: [
            ...restFeedoList,
            Object.assign({}, archiveFeed[0])
          ],
          archiveFeed: null,
        }
      }
      
      return {
        ...state,
      }
    }
    /**
     * Set Feed detail action (Delete, Archive)
     */
    case types.SET_FEED_DETAIL_ACTION: {
      const { payload } = action
      return {
        ...state,
        loading: types.SET_FEED_DETAIL_ACTION,
        feedDetailAction: payload
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
          ...state.feedoList,
          data
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
        currentFeed: {},
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
      const tagId = action.payload;
      const tag = find(state.userTags, tag => tag.id === tagId);
      let tags = state.currentFeed.tags || [];
      tags.push(tag);
      return {
        ...state,
        loading: types.ADD_HUNT_TAG_FULFILLED,
        currentFeed: {
          ...state.currentFeed,
          tags,
        }
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
      return {
        ...state,
        loading: types.REMOVE_HUNT_TAG_FULFILLED,
        currentFeed: {
          ...state.currentFeed,
          tags,
        }
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
      const { feedoList, currentFeed } = state
      const { feedId, data } = action.payload

      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)
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

      return {
        ...state,
        loading: types.UPDATE_SHARING_PREFERENCES_FULFILLED,
        feedoList: [
          ...restFeedoList,
          newFeed
        ],
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
      const { data } = action.result
      const { currentFeed } = state
      const inviteeId = action.payload
      const restInviteeList = filter(currentFeed.invitees, invitee => invitee.id !== inviteeId)

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
      const { currentFeed } = state
      const { payload } = action

      let invitees = currentFeed.invitees
      for (let i = 0; i < invitees.length; i ++) {
        if (invitees[i].id === payload.inviteeId) {
          invitees[i].permissions = payload.type
        }
      }

      let updaedFeed = {
        ...currentFeed,
        invitees
      }

      return {
        ...state,
        loading: types.UPDATE_INVITEE_PERMISSION_FULFILLED,
        currentFeed: updaedFeed
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
      const { currentFeed, feedoList } = state
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

      return {
        ...state,
        loading: 'UPDATE_CARD_FULFILLED',
        currentFeed: {
          ...currentFeed,
        },
        feedoList: [
          ...restFeedoList,
          { ...currentFeed }
        ]
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
      console.log('UNLIKE_CARD_FULFILLED : ', currentFeed);
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
        currentFeed: {
          ...currentFeed,
        }
      }
    }

    /**
     * delete a card
     */
    case cardTypes.DELETE_CARD_FULFILLED: {
      const { currentFeed, feedoList } = state
      const ideaId = action.payload;
      const ideas = filter(currentFeed.ideas, idea => idea.id !== ideaId);

      const restFeedoList = filter(feedoList, feed => feed.id !== currentFeed.id)
      const newCurrentFeed = {
        ...currentFeed,
        ideas,
      }

      return {
        ...state,
        loading: 'DELETE_CARD_FULFILLED',
        currentFeed: newCurrentFeed,
        feedoList: [
          ...restFeedoList,
          newCurrentFeed
        ]
      }
    }

    /**
     * move a card
     */
    case cardTypes.MOVE_CARD_FULFILLED: {
      const { currentFeed, feedoList } = state
      const { ideaId, huntId } = action.payload;
      const ideas = filter(currentFeed.ideas, idea => idea.id !== ideaId);
      const movedCard = find(currentFeed.ideas, idea => idea.id === ideaId);

      const restFeedoList = filter(feedoList, feed => feed.id !== currentFeed.id)
      const moveToFeedIndex = findIndex(restFeedoList, feed => feed.id === huntId)

      if (moveToFeedIndex !== -1) {
        restFeedoList[moveToFeedIndex].ideas.push(movedCard);
      }
      return {
        ...state,
        loading: 'MOVE_CARD_FULFILLED',
        currentFeed: {
          ...currentFeed,
          ideas,
        },
        feedoList: [
          ...restFeedoList,
          {
            ...currentFeed,
            ideas,
          }
        ],
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
          ...restFeedoList,
          newFeed
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

    default:
      return state;
  }
}
