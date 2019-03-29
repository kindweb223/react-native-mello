import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import { NetworkConsumer } from 'react-native-offline'

class OfflineIndicator extends React.Component {

    render(){
        return (
            <NetworkConsumer pingInterval={2000}>
                {({ isConnected }) => (
                    isConnected ? (
                        <Text>Connected</Text>
                    ) : (
                        <Text>Not Connected</Text>
                    )
                )}
            </NetworkConsumer>
        )
    }
}

export default OfflineIndicator
