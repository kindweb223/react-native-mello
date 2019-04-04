import { AsyncStorage } from "react-native";

class OfflineData {
  getResult = (result) => {
    console.log('OD - ', result)
  }
  isStored = (entryId, userId = null, recordType) => {
    let key = ''
    switch(recordType){
      case 'flowList':
        key = userId + '/' + flows
        break;
      case 'flow':
      case 'idea':
        key = entryId
        break 
    }
    AsyncStorage.getItem(key, this.getResult)
  }
  store = (key, value) => {
    AsyncStorage.setItem(key, value)
  }
}
