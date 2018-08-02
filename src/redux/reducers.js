import { combineReducers } from 'redux'
import feedo from './feedo/reducer'
import user from './user/reducer'
import card from './card/reducer'

export default combineReducers({
  feedo,
  user,
  card,
})