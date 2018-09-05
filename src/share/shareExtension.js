import { NativeModules } from 'react-native'

export default {
  data: () => NativeModules.ShareExtensionViewController.data(),
  close: () => NativeModules.ShareExtensionViewController.close(),
  goToMainApp: () => NativeModules.ShareExtensionViewController.goToMainApp()
}
