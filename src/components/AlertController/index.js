
import { Alert, AlertButton } from 'react-native'

export default class AlertController {
    static shared = AlertController.shared == null ? new AlertController() : this.shared

    isShown = false

    showAlert(title, text) {
        if (this.isShown) { return }
        this.isShown = true
        Alert.alert(title, text, [{ text: 'OK', onPress: () => this.didDismiss() }])
    }

    showAlert(title, text, actions) {
        if (this.isShown) { return }
        
        this.isShown = true
        newActions = []

        actions.forEach(element => {
            newActions.push({ 
                text: element.text, 
                onPress: () => { 
                    if (element.onPress != null) { 
                        element.onPress()
                    }

                    this.didDismiss()
                },
                style: element.style 
            })
        });

        Alert.alert(title, text, newActions)
    }

    // Call this when using custom actions, to reset state
    didDismiss() {
        this.isShown = false
    }
}