import _ from 'lodash'
import * as types from './types'

const initialState = {
  loading: null,
  error: null,
  currentCard: {},
  fileUploadUrl: {},
  currentOpneGraph: {},
};

export default function card(state = initialState, action = {}) {
  switch (action.type) {

    // create a card
    case types.CREATE_CARD_PENDING:
      return {
        ...state,
        loading: types.CREATE_CARD_PENDING,
        currentCard: {},
        error: null,
      }
    case types.CREATE_CARD_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.CREATE_CARD_FULFILLED,
        currentCard: data,
      }
    }
    case types.CREATE_CARD_REJECTED: {
      const { data } = action.error.response
      console.log('CREATE_CARD_REJECTED : ', action.error);
      return {
        ...state,
        loading: types.CREATE_CARD_REJECTED,
        error: data,
      }
    }

    // update a card
    case types.UPDATE_CARD_PENDING:
      return {
        ...state,
        loading: types.UPDATE_CARD_PENDING,
        error: null,
      }
    case types.UPDATE_CARD_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.UPDATE_CARD_FULFILLED,
        currentCard: data,
      }
    }
    case types.UPDATE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.UPDATE_CARD_REJECTED,
        error: data,
      }
    }

    // get a card
    case types.GET_CARD_PENDING:
      return {
        ...state,
        loading: types.GET_CARD_PENDING,
        error: null,
      }
    case types.GET_CARD_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.GET_CARD_FULFILLED,
        currentCard: data,
      }
    }
    case types.GET_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.GET_CARD_REJECTED,
        error: data,
      }
    }

    // set a card to currentCard
    case types.SET_CURRENT_CARD: {
      const data = action.payload;
      return {
        ...state,
        loading: types.SET_CURRENT_CARD,
        currentCard: data,
      }
    }
    
    // delete a card
    case types.DELETE_CARD_PENDING:
      return {
        ...state,
        loading: types.DELETE_CARD_PENDING,
        error: null,
      }
    case types.DELETE_CARD_FULFILLED: {
      return {
        ...state,
        loading: types.DELETE_CARD_FULFILLED,
        currentCard: {},
      }
    }
    case types.DELETE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_CARD_REJECTED,
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
      console.log('ADD_FILE_FULFILLED : ', data);
      let files = files = state.currentCard.files || [];
      files.unshift(data);
      return {
        ...state,
        loading: types.ADD_FILE_FULFILLED,
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
      const files = _.filter(state.currentCard.files, file => file.id !== fileId);
      return {
        ...state,
        loading: types.DELETE_FILE_FULFILLED,
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
        loading: types.DELETE_FILE_REJECTED,
        error: data,
      }
    }
    
    // get open graph
    case types.GET_OPEN_GRAPH_PENDING:
      return {
        ...state,
        loading: types.GET_OPEN_GRAPH_PENDING,
        currentOpneGraph: {},
        error: null,
      }
    case types.GET_OPEN_GRAPH_FULFILLED: {
      const data = action.result.data;
      console.log('GET_OPEN_GRAPH_FULFILLED : ', data);
      return {
          ...state,
          loading: types.GET_OPEN_GRAPH_FULFILLED,
          currentOpneGraph: data,
        }
      }
    case types.GET_OPEN_GRAPH_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.GET_OPEN_GRAPH_REJECTED,
        error: data,
      }
    }

    default:
      return state;
  }
}
