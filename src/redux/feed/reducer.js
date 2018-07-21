import * as types from './types'

const initialState = {
  status: null,
  error: null,
  feed: {},
  fileUploadUrl: {},
  file: {},
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
        file: {},
        error: null,
      }
    case types.UPLOAD_FILE_FULFILLED: {
      const { data } = action.result
      console.log('Upload Success : ', JSON.stringify(action.result));
      return {
        ...state,
        status: types.UPLOAD_FILE_FULFILLED,
        file: data
      }
    }
    case types.UPLOAD_FILE_REJECTED: {
      // const { data } = action.error.response
      console.log('Upload Error : ', JSON.stringify(action.error));
      return {
        ...state,
        status: types.UPLOAD_FILE_REJECTED,
        error: action.error,
      }
    }
    default:
      return state;
  }
}
