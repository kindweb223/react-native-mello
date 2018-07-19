import * as types from './types'
import { filter, omit } from 'lodash'

const initialState = {
  loading: null,
  error: null,
  feedoList: null,
  pinResult: null,
};

export default function feedo(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_FEEDO_LIST_PENDING:
      return {
        ...initialState,
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
        erro: null,
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
        erro: null,
      }
    }
    case types.DEL_FEED_FULFILLED: {
      // const { feedoList } = state
      // const feedId = action.payload
      // const currentFeed = filter(feedoList, feed => feed.id === feedId)
      // const restFeedoList = filter(feedoList, feed => feed.id !== feedId)
      
      return {
        ...state,
        // loading: 'FEED_FULFILLED',
        // feedoList: [
        //   ...restFeedoList,
        // ]
      }
    }
    case types.DEL_FEED_REJECTED: {
      return {
        ...state,
        loading: types.DEL_FEED_REJECTED,
        error: action.error,
      }
    }
    default:
      return state;
  }
}
