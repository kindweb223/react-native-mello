import * as types from './types'
import { filter, find } from 'lodash'

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
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    /**
     * Get Feed List
     */
    case types.GET_FEEDO_LIST_PENDING:
      return {
        ...state,
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
      const { feedoList } = state
      const feedId = action.payload
      const currentFeed = filter(feedoList, feed => feed.id === feedId)
      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)

      return {
        ...state,
        loading: 'FEED_FULFILLED',
        feedoList: [
          ...restFeedoList,
          Object.assign({}, currentFeed[0], { pinned: { pinned: true } })
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
      const { feedoList } = state
      const feedId = action.payload
      const currentFeed = filter(feedoList, feed => feed.id === feedId)
      const restFeedoList = filter(feedoList, feed => feed.id !== feedId)
      return {
        ...state,
        loading: 'FEED_FULFILLED',
        feedoList: [
          ...restFeedoList,
          Object.assign({}, currentFeed[0], { pinned: null })
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
          loading: 'FEED_FULFILLED',
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
            Object.assign({}, currentFeed[0], { status: 'ENDED' })
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
          loading: types.DEL_FEED_FULFILLED,
          feedoList: [
            ...restFeedoList,
            Object.assign({}, deleteFeed[0])
          ],
          deleteFeed: null,
        }
      } else if (flag === 'archive') {
        return {
          ...state,
          loading: types.ARCHIVE_FEED_FULFILLED,
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
      return {
        ...state,
        loading: types.UPDATE_FEED_FULFILLED,
        feedoList: [
          ...state.feedoList,
          data
        ],
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
    default:
      return state;
  }
}
