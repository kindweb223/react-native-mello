import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import * as mime from 'react-native-mime-types'
import _ from 'lodash'
import COLORS from '../../service/colors'
import styles from './styles'
const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class CropImageScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatarFile: props.avatarFile
    }
  }

  render () {
    const { avatarFile } = this.state
    console.log('PPPP: ', avatarFile.uri)
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.headerView}>
              <View style={styles.closeButton} />
              <Text style={styles.title}>Update avatar</Text>
              <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
                <Image source={CLOSE_ICON} />
              </TouchableOpacity>
            </View>

            <View style={styles.imageView}>
              <Image
                style={styles.image}
                source={{ uri: avatarFile.uri }}
                resizeMode="contain"
              />
            </View>

            <View style={styles.footerView}>
              <TouchableOpacity onPress={() => this.onSave()}>
                <View style={styles.saveBtn}>
                  <Text style={styles.saveText}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

CropImageScreen.defaultProps = {
  onClose: () => {}
}

CropImageScreen.propTypes = {
  onClose: PropTypes.func
}

export default CropImageScreen
