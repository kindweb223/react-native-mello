import React from 'react'
import {
    View,
    Text,
    Button,
} from 'react-native'
import { NetworkConsumer } from 'react-native-offline'

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
            <NetworkConsumer pingInterval={2000}>
                {({ isConnected }) => (
                    isConnected ? null : (
                        <View style={offlineStyle}>
                            <Text style={offlineText}>Device is offline</Text>
                        </View>
                    )
                )}
            </NetworkConsumer>
        )
    }
}

export default OfflineIndicator
