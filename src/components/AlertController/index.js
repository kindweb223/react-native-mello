
import { Alert } from 'react-native'

export default class AlertController {
    static shared = AlertController.shared == null ? new AlertController() : this.shared

    showAlert(title, text) {
        console.log("[AlertController] Showing text: ", text)
        Alert.alert('Error', 'No Internet Connection')
    }
}