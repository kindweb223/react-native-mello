import { combineReducers } from 'redux'
import feedo from './feedo/reducer'
import feed from './feed/reducer'
import user from './user/reducer'

export default combineReducers({
  feedo,
  feed,
  user,
})