import _ from 'lodash'
import * as types from './types'

const initialState = {
  status: null,
  error: null,
  currentCard: {},
  fileUploadUrl: {},
};

export default function card(state = initialState, action = {}) {
  switch (action.type) {

    // create a card
    case types.CREATE_CARD_PENDING:
      return {
        ...state,
        status: types.CREATE_CARD_PENDING,
        currentCard: {},
        error: null,
      }
    case types.CREATE_CARD_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.CREATE_CARD_FULFILLED,
        currentCard: data,
      }
    }
    case types.CREATE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.CREATE_CARD_REJECTED,
        error: data,
      }
    }

    // update a card
    case types.UPDATE_CARD_PENDING:
      return {
        ...state,
        status: types.UPDATE_CARD_PENDING,
        error: null,
      }
    case types.UPDATE_CARD_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.UPDATE_CARD_FULFILLED,
        currentCard: data,
      }
    }
    case types.UPDATE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.UPDATE_CARD_REJECTED,
        error: data,
      }
    }
    
    // delete a card
    case types.DELETE_CARD_PENDING:
      return {
        ...state,
        status: types.DELETE_CARD_PENDING,
        error: null,
      }
    case types.DELETE_CARD_FULFILLED: {
      return {
        ...state,
        status: types.DELETE_CARD_FULFILLED,
        currentCard: {},
      }
    }
    case types.DELETE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_CARD_REJECTED,
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
      console.log('ADD_FILE_FULFILLED : ', data);
      let files = files = state.currentCard.files || [];
      files.unshift(data);
      return {
        ...state,
        status: types.ADD_FILE_FULFILLED,
        currentCard: {
          ...state.currentCard,
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
      const files = _.filter(state.currentCard.files, file => file.id !== fileId);
      return {
        ...state,
        status: types.DELETE_FILE_FULFILLED,
        currentCard: {
          ...state.currentCard,
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

    default:
      return state;
  }
}
