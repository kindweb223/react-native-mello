import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import Octicons from 'react-native-vector-icons/Octicons'
import COLORS from '../../../service/colors'
import styles from './styles'

const CLOSE_ICON = require('../../../../assets/images/Close/Grey.png')

class ShareWidgetConfirmModal extends React.Component {
  componentDidMount() {
  }

  get renderHeader() {
    return (
      <TouchableOpacity 
        style={styles.closeButtonView}
        activeOpacity={0.7}
        onPress={() => this.props.onClose()}
      >
        <Image source={CLOSE_ICON} />
      </TouchableOpacity>
    )
  }

  enableShareWidget = () => {
    this.props.onEnableShareWidget()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          {this.renderHeader}
        </View>

        <View style={styles.mainView}>
          <View style={styles.iconView}>
            <Octicons
              name="check"
              size={50}
              color={COLORS.PURPLE}
            />
          </View>
          <Text style={styles.title}>Perfect! You can now start saving to Mello from other apps.</Text>
        </View>
        
      </View>
    )
  }
}

ShareWidgetConfirmModal.defaultProps = {
  onClose: () => {}
}

ShareWidgetConfirmModal.propTypes = {
  onClose: PropTypes.func
}

export default ShareWidgetConfirmModal