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
      isVisible: true,
    };
  }

  componentDidMount() {
  }

  onClosed() {
    ShareExtension.close();
  }

  onPressOk() {
    this.setState({
      isVisible: false,
    });
    ShareExtension.goToMainApp();
    ShareExtension.close();
  }

  onPressClose() {
    console.log("CLOSE")
    this.setState({
      isVisible: false,
    });
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
          isOpen={this.state.isVisible}
          onClosed={this.onClosed.bind(this)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContentContainer}>
              <View style={styles.topContainer}>
                <Text style={styles.textTitle}>Feedo</Text>
                <Text style={styles.textDescription}>Oops, you appear to be signed out of Feedo. Tap OK to log in again and try again</Text>
              </View>
              <View style={styles.bottomContainer}>
                <TouchableOpacity 
                  style={styles.buttonContainer}
                  activeOpacity={0.7}
                  onPress={this.onPressOk.bind(this)}
                >
                  <Text style={styles.textButton}>OK</Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity 
                  style={styles.buttonContainer}
                  activeOpacity={0.7}
                  onPress={this.onPressClose.bind(this)}
                >
                  <Text style={styles.textButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
