import React from 'react'
import {
    View,
    Text,
    Button,
} from 'react-native'
import { NetworkConsumer } from 'react-native-offline'
import ToasterComponent from '../ToasterComponent';
import CONSTANTS from '../../service/constants'

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

    constructor(){
        super()
        this.state = {
            show: true
        }
    }

    hide = () => {
        this.setState({ show: false })
    }

    render() {
        const { show }  = this.state
        return (
            <View>
                {show && (
                    <NetworkConsumer pingInterval={CONSTANTS.NETWORK_CONSUMER_PING_INTERVAL}>
                        {({ isConnected }) => (
                            isConnected ? null : (
                                <ToasterComponent
                                    isVisible={!isConnected}
                                    title="Device is offline"
                                    buttonTitle="OK"
                                    onPressButton={this.hide}
                                    style={{zIndex: 10}}
                                />
                            )
                        )}
                    </NetworkConsumer>
                )}
            </View>         
        )
    }
}

export default OfflineIndicator
