import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'

import ShareExtension from '../shareExtension'
import styles from './styles'
import Modal from 'react-native-modalbox'
import CONSTANTS from '../../service/constants'


export default class ShareModalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  onClosed() {
    ShareExtension.close();
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          // backdrop={false}
          style={{ backgroundColor: 'transparent' }}
          scrollOffset={CONSTANTS.SCREEN_HEIGHT}
          position="center"
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          isOpen={true}
          onClosed={this.onClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContentContainer}>
              <TouchableOpacity onPress={this.closing}>
                <Text>Close</Text>
                <Text>type: { this.state.type }</Text>
                <Text>value: { this.state.value }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
