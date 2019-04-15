import React from 'react'
import {
    View,
    Text,
    Button,
} from 'react-native'
import { NetworkConsumer } from 'react-native-offline'
import ToasterComponent from '../ToasterComponent';

const offlineStyle = {
    backgroundColor: '#cc1234',
    padding: 12,
}

const offlineText = {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center'
}

class OfflineIndicator extends React.Component {

    render(){
        return (
            <NetworkConsumer pingInterval={5000}>
                {({ isConnected }) => (
                    isConnected ? null : (
                        <ToasterComponent
                            isVisible={!isConnected}
                            title="Device is offline"
                            buttonTitle=""
                        />
                    )
                )}
            </NetworkConsumer>
        )
    }
}

export default OfflineIndicator
