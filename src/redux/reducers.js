import { combineReducers } from 'redux'
import feedo from './feedo/reducer'
import feed from './feed/reducer'
import user from './user/reducer'
import card from './card/reducer'

export default combineReducers({
  feedo,
  feed,
  user,
  card,
})