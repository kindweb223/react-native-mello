
import { Alert, AlertButton } from 'react-native'

export default class AlertController {
    static shared = AlertController.shared == null ? new AlertController() : this.shared
    isShown = false

    showAlert(title, text, actions) {
        // Wrap in a short timeout so differnet alerts can be shown one after the other
        setTimeout(() => {
            if (this.isShown) { return }

            this.isShown = true
    
            if (actions != null) {
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
            } else {
                Alert.alert(title, text, [{ text: 'OK', onPress: () => this.didDismiss() }])
            }
          }, 50);
    }

    // Call this when using custom actions, to reset state
    didDismiss() {
        this.isShown = false
    }
}