import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import * as mime from 'react-native-mime-types'
import _ from 'lodash'
import ImageCrop from '../../components/ImageCrop'
import { getImageUrl, updateProfile } from '../../redux/user/actions'
import { uploadFileToS3 } from '../../redux/user/actions'
import LoadingScreen from '../LoadingScreen'
import COLORS from '../../service/colors'
import styles from './styles'
const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class CropImageScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      avatarFile: props.avatarFile,
      cropUrl: props.avatarFile
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps

    if (Actions.currentScene === 'CropImageScreen') {
      if (this.props.user.loading !== 'GET_USER_IMAGE_URL_PENDING' && user.loading === 'GET_USER_IMAGE_URL_PENDING') {
        this.setState({ loading: true })
      }

      if (this.props.user.loading !== 'GET_USER_IMAGE_URL_FULFILLED' && user.loading === 'GET_USER_IMAGE_URL_FULFILLED') {
        const { userImageUrlData } = user
        this.uploadImage(userImageUrlData)
      }

      if (this.props.user.loading !== 'UPLOAD_FILE_FULFILLED' && user.loading === 'UPLOAD_FILE_FULFILLED') {
        const { userInfo, userImageUrlData } = user
        const param = {
          imageUrl: userImageUrlData.objectKey
        }
        this.props.updateProfile(userInfo.id, param)
      }

      if (this.props.user.loading !== 'UPDATE_PROFILE_FULFILLED' && user.loading === 'UPDATE_PROFILE_FULFILLED') {
        this.setState({ loading: false }, () => {
          Actions.pop()
        })
      }

      if (user.loading === 'GET_USER_IMAGE_URL_REJECTED' || user.loading === 'UPLOAD_FILE_REJECTED' || user.loading === 'UPDATE_PROFILE_REJECTED') {
        this.setState({ loading: false }, () => {
          Alert.alert('Error', 'Server is failed')
        })
      }
    }
  }

  uploadImage = (userImageUrlData) => {
    const { avatarFile, cropUrl } = this.state

    if (!_.isEmpty(cropUrl)) {
      const baseUrl = userImageUrlData.uploadUrl
      const fileUrl = cropUrl.uri
      const fileName = cropUrl.name
      const fileType = mime.lookup(fileUrl);

      this.props.uploadFileToS3(baseUrl, fileUrl, fileName, fileType);
    } else {
      this.setState({ loading: false }, () => {
        Alert.alert('Error', 'Cropping is failed')
      })
    }
  }

  onSave = () => {
    const { userInfo } = this.props.user

    this.imageCrop.crop().then((uri) => {
      this.setState({ cropUrl: uri }, () => {
        this.props.getImageUrl(userInfo.id)
      })
    })
  }

  render () {
    const { avatarFile } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.imageView}>
            <ImageCrop
              ref={c => this.imageCrop = c}
              source={{ uri: avatarFile.uri }}
            />
          </View>

          <View style={styles.headerView}>
            <View style={styles.closeButton} />
            <Text style={styles.title}>Update avatar</Text>
            <TouchableOpacity onPress={() => Actions.pop()} style={styles.closeButton}>
              <Image source={CLOSE_ICON} />
            </TouchableOpacity>
          </View>

          <View style={styles.footerView}>
            <TouchableOpacity onPress={() => this.onSave()}>
              <View style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {this.state.loading && (
          <LoadingScreen />
        )}

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

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  getImageUrl: (data) => dispatch(getImageUrl(data)),
  updateProfile: (userId, data) => dispatch(updateProfile(userId, data)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CropImageScreen)
