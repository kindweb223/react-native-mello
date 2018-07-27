import _ from 'lodash'
import * as types from './types'

const initialState = {
  status: null,
  error: null,
  feed: {},
  fileUploadUrl: {},
  userTags: [],
};

export default function feed(state = initialState, action = {}) {
  switch (action.type) {

    // create a feed
    case types.CREATE_FEED_PENDING:
      return {
        ...state,
        status: types.CREATE_FEED_PENDING,
        feed: {},
        error: null,
      }
    case types.CREATE_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.CREATE_FEED_FULFILLED,
        feed: data,
      }
    }
    case types.CREATE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.CREATE_FEED_REJECTED,
        error: data,
      }
    }

    // update a feed
    case types.UPDATE_FEED_PENDING:
      return {
        ...state,
        status: types.UPDATE_FEED_PENDING,
        error: null,
      }
    case types.UPDATE_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.UPDATE_FEED_FULFILLED,
        feed: data,
      }
    }
    case types.UPDATE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.UPDATE_FEED_REJECTED,
        error: data,
      }
    }

    // delete a feed
    case types.DELETE_FEED_PENDING:
      return {
        ...state,
        status: types.DELETE_FEED_PENDING,
        error: null,
      }
    case types.DELETE_FEED_FULFILLED: {
      return {
        ...state,
        status: types.DELETE_FEED_FULFILLED,
        feed: {},
      }
    }
    case types.DELETE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FEED_REJECTED,
        error: data,
      }
    }

    // get a file upload url
    case types.GET_FILE_UPLOAD_URL_PENDING:
      return {
        ...state,
        status: types.GET_FILE_UPLOAD_URL_PENDING,
        fileUploadUrl: {},
        error: null,
      }
    case types.GET_FILE_UPLOAD_URL_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.GET_FILE_UPLOAD_URL_FULFILLED,
        fileUploadUrl: data
      }
    }
    case types.DELETE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FEED_REJECTED,
        error: data,
      }
    }

    // upload a file
    case types.UPLOAD_FILE_PENDING:
      return {
        ...state,
        status: types.UPLOAD_FILE_PENDING,
        error: null,
      }
    case types.UPLOAD_FILE_FULFILLED: {
      return {
        ...state,
        status: types.UPLOAD_FILE_FULFILLED,
      }
    }
    case types.UPLOAD_FILE_REJECTED: {
      return {
        ...state,
        status: types.UPLOAD_FILE_REJECTED,
        error: action.error,
      }
    }

    // add a file
    case types.ADD_FILE_PENDING:
      return {
        ...state,
        status: types.ADD_FILE_PENDING,
        error: null,
      }
    case types.ADD_FILE_FULFILLED: {
      const { data } = action.result
      let files = files = state.feed.files || [];
      files.unshift(data);
      return {
        ...state,
        status: types.ADD_FILE_FULFILLED,
        feed: {
          ...state.feed,
          files,
        }
      }
    }
    case types.ADD_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.ADD_FILE_REJECTED,
        error: data,
      }
    }
  
    // delete a file
    case types.DELETE_FILE_PENDING:
      return {
        ...state,
        status: types.DELETE_FILE_PENDING,
        error: null,
      }
    case types.DELETE_FILE_FULFILLED: {
      const fileId = action.payload;
      const files = _.filter(state.feed.files, file => file.id !== fileId);
      return {
        ...state,
        status: types.DELETE_FILE_FULFILLED,
        feed: {
          ...state.feed,
          files,
        }
      }
    }
    case types.DELETE_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FILE_REJECTED,
        error: data,
      }
    }

    // get user tags
    case types.GET_USER_TAGS_PENDING:
      return {
        ...state,
        status: types.GET_USER_TAGS_PENDING,
        error: null,
      }
    case types.GET_USER_TAGS_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.GET_USER_TAGS_FULFILLED,
        userTags: data,
      }
    }
    case types.DELETE_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FILE_REJECTED,
        error: data,
      }
    }

    // create a user tags
    case types.CREATE_USER_TAGS_PENDING:
      return {
        ...state,
        status: types.CREATE_USER_TAGS_PENDING,
        error: null,
      }
    case types.CREATE_USER_TAG_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.CREATE_USER_TAG_FULFILLED,
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
        status: types.CREATE_USER_TAG_REJECTED,
        error: data,
      }
    }
  
    // add a tag to a hunt
    case types.ADD_HUNT_TAG_PENDING:
      return {
        ...state,
        status: types.ADD_HUNT_TAG_PENDING,
        error: null,
      }
    case types.ADD_HUNT_TAG_FULFILLED: {
      const tagId = action.payload;
      const tag = _.find(state.userTags, tag => tag.id === tagId);
      let tags = state.feed.tags || [];
      tags.push(tag);
      return {
        ...state,
        status: types.ADD_HUNT_TAG_FULFILLED,
        feed: {
          ...state.feed,
          tags,
        }
      }
    }
    case types.ADD_HUNT_TAG_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.ADD_HUNT_TAG_REJECTED,
        error: data,
      }
    }

    // remove a tag from a hunt
    case types.REMOVE_HUNT_TAG_PENDING:
      return {
        ...state,
        status: types.REMOVE_HUNT_TAG_PENDING,
        error: null,
      }
    case types.REMOVE_HUNT_TAG_FULFILLED: {
      const tagId = action.payload;
      const tags = _.filter(state.feed.tags, tag => tag.id !== tagId);
      return {
        ...state,
        status: types.REMOVE_HUNT_TAG_FULFILLED,
        feed: {
          ...state.feed,
          tags,
        }
      }
    }
    case types.REMOVE_HUNT_TAG_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.REMOVE_HUNT_TAG_REJECTED,
        error: data,
      }
    }




    /**
     * Get Feed Detail
     */
    case types.GET_FEED_DETAIL_PENDING:
      return {
        ...state,
        status: types.GET_FEED_DETAIL_PENDING,
        error: null
      }
    case types.GET_FEED_DETAIL_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.GET_FEED_DETAIL_FULFILLED,
        feed: data,
      }
    }
    case types.GET_FEED_DETAIL_REJECTED: {
      return {
        ...state,
        status: types.GET_FEED_DETAIL_REJECTED,
        error: action.error,
      }
    }


    default:
      return state;
  }
}
