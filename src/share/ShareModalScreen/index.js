import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'

import ShareExtension from '../shareExtension'
import styles from './styles'
import Modal from 'react-native-modalbox'
import CONSTANTS from '../../service/constants'
import { SCHEME } from '../../service/api'


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

    this.props.onOk();
  }

  onPressClose() {
    this.setState({
      isVisible: false,
    });
    this.props.onClose();
  }

  get renderOkButton() {
    if (this.props.buttons & CONSTANTS.MODAL_OK) {
      return (
        <TouchableOpacity 
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={this.onPressOk.bind(this)}
        >
          <Text style={styles.textButton}>{this.props.okLabel}</Text>
        </TouchableOpacity>
      );
    }
  }

  get renderLine() {
    if (this.props.buttons & CONSTANTS.MODAL_OK && this.props.buttons & CONSTANTS.MODAL_CLOSE) {
      return (
        <View style={styles.line} />
      );
    }
  }

  get renderCloseButton() {
    if (this.props.buttons & CONSTANTS.MODAL_CLOSE) {
      return (
        <TouchableOpacity 
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={this.onPressClose.bind(this)}
        >
          <Text style={styles.textButton}>Close</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          style={{ backgroundColor: 'transparent' }}
          scrollOffset={CONSTANTS.SCREEN_HEIGHT}
          backdropOpacity={0.2}
          swipeToClose={false}
          position="center"
          backdropPressToClose={false}
          isOpen={this.state.isVisible}
          onClosed={this.onClosed.bind(this)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContentContainer}>
              <View style={styles.topContainer}>
                <Text style={styles.textTitle}>Mello</Text>
                <Text style={styles.textDescription}>{this.props.message}</Text>
              </View>
              <View style={styles.bottomContainer}>
                {this.renderOkButton}
                {this.renderLine}
                {this.renderCloseButton}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}


ShareModalScreen.defaultProps = {
  message: 'Oops, you appear to be signed out of Mello. Sign In and try again',
  buttons: CONSTANTS.MODAL_OK | CONSTANTS.MODAL_CLOSE,
  okLabel: 'OK',
  onOk: () => {
    ShareExtension.goToMainApp(SCHEME);
  },
  onClose: () => {},
}


ShareModalScreen.propTypes = {
  message: PropTypes.string,
  buttons: PropTypes.number,
  okLabel: PropTypes.string,
  onOk: PropTypes.func,
  onClose: PropTypes.func,
}
