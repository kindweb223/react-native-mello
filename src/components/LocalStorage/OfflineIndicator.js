import React from 'react'
import {
    View,
    Text,
    Button,
} from 'react-native'
import { NetworkConsumer } from 'react-native-offline'

class OfflineIndicator extends React.Component {

    render(){
        return (
            <NetworkConsumer pingInterval={2000}>
                {({ isConnected }) => (
                    isConnected ? null : (
                        <Button title="Device is offline" color="#cc1234"></Button>
                    )
                )}
            </NetworkConsumer>
        )
    }
}

export default OfflineIndicator
