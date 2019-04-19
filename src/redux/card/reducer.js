import _ from 'lodash'
import * as types from './types'
import * as feedTypes from '../feedo/types'
import { Actions } from 'react-native-router-flux';

const initialState = {
  loading: null,
  error: null,
  currentCard: {},
  fileUploadUrl: {},
  currentOpneGraph: {},
  currentLikes: [],
  currentComments: [],
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
    
    // reset card error
    case types.RESET_CARD_ERROR: {
      return {
        ...state,
        loading: types.RESET_CARD_ERROR,
        error: null,
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
        // currentCard: {},
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

    // move a card
    case types.MOVE_CARD_PENDING:
      return {
        ...state,
        loading: types.MOVE_CARD_PENDING,
        error: null,
      }
    case types.MOVE_CARD_FULFILLED: {
      return {
        ...state,
        loading: types.MOVE_CARD_FULFILLED,
      }
    }
    case types.MOVE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.MOVE_CARD_REJECTED,
        error: data,
      }
    }

    // like a card
    case types.LIKE_CARD_PENDING:
      return {
        ...state,
        loading: types.LIKE_CARD_PENDING,
        error: null,
      }
    case types.LIKE_CARD_FULFILLED: {
      return {
        ...state,
        loading: types.LIKE_CARD_FULFILLED
      }
    }
    case types.LIKE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.LIKE_CARD_REJECTED,
        error: data,
      }
    }
    case feedTypes.PUBNUB_LIKE_CARD_FULFILLED: {
      const ideaId = action.payload
      const { currentCard } = state

      if (currentCard.id === ideaId) {
        return {
          ...state,
          loading: feedTypes.PUBNUB_LIKE_CARD_FULFILLED,
          currentCard: {
            ...currentCard,
            metadata: {
              ...currentCard.metadata,
              likes: currentCard.metadata.likes + 1
            }
          }
        }
      } else {
        return {
          ...state,
          loading: feedTypes.PUBNUB_LIKE_CARD_FULFILLED
        }
      }
    }
    case feedTypes.PUBNUB_UNLIKE_CARD_FULFILLED: {
      const ideaId = action.payload
      const { currentCard } = state

      if (currentCard.id === ideaId) {
        return {
          ...state,
          loading: feedTypes.PUBNUB_UNLIKE_CARD_FULFILLED,
          currentCard: {
            ...currentCard,
            metadata: {
              ...currentCard.metadata,
              likes: currentCard.metadata.likes === 0 ? 0 : currentCard.metadata.likes - 1
            }
          }
        }
      } else {
        return {
          ...state,
          loading: feedTypes.PUBNUB_UNLIKE_CARD_FULFILLED
        }
      }
    }
  
    // unlike a card
    case types.UNLIKE_CARD_PENDING:
      return {
        ...state,
        loading: types.UNLIKE_CARD_PENDING,
        error: null,
      }
    case types.UNLIKE_CARD_FULFILLED: {
      return {
        ...state,
        loading: types.UNLIKE_CARD_FULFILLED,
      }
    }
    case types.UNLIKE_CARD_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.UNLIKE_CARD_REJECTED,
        error: data,
      }
    }

    // get card likes
    case types.GET_CARD_LIKES_PENDING:
      return {
        ...state,
        loading: types.GET_CARD_LIKES_PENDING,
        error: null,
      }
    case types.GET_CARD_LIKES_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        loading: types.GET_CARD_LIKES_FULFILLED,
        currentLikes: data.likes,
      }
    }
    case types.GET_CARD_LIKES_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.GET_CARD_LIKES_REJECTED,
        error: data,
      }
    }
  
    // get card comments
      case types.GET_CARD_COMMENTS_PENDING:
      return {
        ...state,
        loading: types.GET_CARD_COMMENTS_PENDING,
        error: null,
      }
    case types.GET_CARD_COMMENTS_FULFILLED: {
      const { data } = action.result

      return {
        ...state,
        loading: types.GET_CARD_COMMENTS_FULFILLED,
        currentCardId: action.payload,
        currentComments: data,
      }
    }
    case types.GET_CARD_COMMENTS_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.GET_CARD_COMMENTS_REJECTED,
        error: data,
      }
    }

    // add a comment
    case types.ADD_CARD_COMMENT_PENDING:
      return {
        ...state,
        loading: types.ADD_CARD_COMMENT_PENDING,
        error: null,
      }
    case types.ADD_CARD_COMMENT_FULFILLED: {
      const { data } = action.result

      return {
        ...state,
        loading: types.ADD_CARD_COMMENT_FULFILLED,
        currentComments: [...state.currentComments, data]
      }
    }
    case types.ADD_CARD_COMMENT_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.ADD_CARD_COMMENT_REJECTED,
        error: data,
      }
    }

    // update a comment
    case types.EDIT_CARD_COMMENT_PENDING:
      return {
        ...state,
        loading: types.EDIT_CARD_COMMENT_PENDING,
        error: null,
      }
    case types.EDIT_CARD_COMMENT_FULFILLED: {
      const { data } = action.result
      const { currentComments } = state
      const commentIndex = _.findIndex(currentComments, comment => comment.id === data.id);
      currentComments[commentIndex] = data;
      return {
        ...state,
        loading: types.EDIT_CARD_COMMENT_FULFILLED,
        currentComments: [...currentComments],
      }
    }
    case types.EDIT_CARD_COMMENT_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.EDIT_CARD_COMMENT_REJECTED,
        error: data,
      }
    }

    // delete a comment
    case types.DELETE_CARD_COMMENT_PENDING:
      return {
        ...state,
        loading: types.DELETE_CARD_COMMENT_PENDING,
        error: null,
      }
    case types.DELETE_CARD_COMMENT_FULFILLED: {
      const { commentId } = action.payload
      const currentComments = _.filter(state.currentComments, comment => comment.id !== commentId);
      return {
        ...state,
        loading: types.DELETE_CARD_COMMENT_FULFILLED,
        currentComments: [...currentComments],
      }
    }
    case types.DELETE_CARD_COMMENT_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_CARD_COMMENT_REJECTED,
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
      let files = state.currentCard.files || [];
      files.push(data);
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
      const deletedFile = _.find(state.currentCard.files, file => file.id === fileId);
      const files = _.filter(state.currentCard.files, file => file.id !== fileId);
      let coverImage = state.currentCard.coverImage;
      if (coverImage === deletedFile.accessUrl || coverImage === deletedFile.thumbnailUrl) {
        coverImage = null;
      }

      return {
        ...state,
        loading: types.DELETE_FILE_FULFILLED,
        currentCard: {
          ...state.currentCard,
          files,
          coverImage,
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
    
    // set a cover image
    case types.SET_COVER_IMAGE_PENDING:
      return {
        ...state,
        loading: types.SET_COVER_IMAGE_PENDING,
        error: null,
      }
    case types.SET_COVER_IMAGE_FULFILLED: {
      const fileId = action.payload;
      const file = _.find(state.currentCard.files, file => file.id === fileId);

      const isImage = file.contentType.toLowerCase().indexOf('image') !== -1;

      return {
        ...state,
        loading: types.SET_COVER_IMAGE_FULFILLED,
        currentCard: {
          ...state.currentCard,
          coverImage: isImage ? file.accessUrl : file.thumbnailUrl,
        }
      }
    }
    case types.SET_COVER_IMAGE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.SET_COVER_IMAGE_REJECTED,
        error: data,
      }
    }

    // add a link
    case types.ADD_LINK_PENDING:
      return {
        ...state,
        loading: types.ADD_LINK_PENDING,
        error: null,
      }
    case types.ADD_LINK_FULFILLED: {
      const { data } = action.result
      let links = links = state.currentCard.links || [];
      links.push(data);
      return {
        ...state,
        loading: types.ADD_LINK_FULFILLED,
        currentCard: {
          ...state.currentCard,
          links,
        }
      }
    }
    case types.ADD_LINK_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.ADD_LINK_REJECTED,
        error: data,
      }
    }
  
    // delete a link
    case types.DELETE_LINK_PENDING:
      return {
        ...state,
        loading: types.DELETE_LINK_PENDING,
        error: null,
      }
    case types.DELETE_LINK_FULFILLED: {
      const linkId = action.payload;
      const links = _.filter(state.currentCard.links, link => link.id !== linkId);
      return {
        ...state,
        loading: types.DELETE_LINK_FULFILLED,
        currentCard: {
          ...state.currentCard,
          links,
        }
      }
    }
    case types.DELETE_LINK_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        loading: types.DELETE_LINK_REJECTED,
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
      return {
          ...state,
          loading: types.GET_OPEN_GRAPH_FULFILLED,
          currentOpneGraph: data,
        }
      }
    case types.GET_OPEN_GRAPH_REJECTED: {
      console.log('GET_OPEN_GRAPH_REJECTED: ', action)

      const { data } = action.error.response
      return {
        ...state,
        loading: types.GET_OPEN_GRAPH_REJECTED,
        error: data,
        currentOpneGraph: {
          url: action.originalUrl,
          title: action.originalUrl,
          description: null,
          image: null,
          favicon: null,
          images: []
        }
      }
    }

    // Create card on share extension
    case types.ADD_SHARE_EXTENSION_CARD_PENDING: {
    console.log('ADD_SHARE_EXTENSION_CARD_PENDING')
      return {
        ...state,
        loading: types.ADD_SHARE_EXTENSION_CARD_PENDING,
        error: null,
      }
    }
    case types.ADD_SHARE_EXTENSION_CARD_FULFILLED: {
      return {
        ...state,
        loading: types.ADD_SHARE_EXTENSION_CARD_FULFILLED,
        currentCard: action.result.data
      }
    }
    case types.ADD_SHARE_EXTENSION_CARD_REJECTED: {
      console.log('ADD_SHARE_EXTENSION_CARD_REJECTED')
      const { data } = action.error.response      
      return {
        ...state,
        loading: types.ADD_SHARE_EXTENSION_CARD_REJECTED,
        error: data,
      }
    }
  
    default:
      return state;
  }
}
