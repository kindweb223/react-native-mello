import { combineReducers } from 'redux'
import feedo from './feedo/reducer'
import user from './user/reducer'

export default combineReducers({
  feedo,
  user
})