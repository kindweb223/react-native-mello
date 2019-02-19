import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import _ from 'lodash'
import ImageSliderScreen from '../../containers/ImageSliderScreen'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

export default class CoverImagePreviewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: this.props.files,
      isPreview: false,
      position: 0
    };
   
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ files: nextProps.files })
  }

  onPressImage(index) {
    this.setState({ isPreview: true, position: index })
  }

  renderCoverImage(files, coverImage, position) {
    const { isFastImage, isShareExtension } = this.props;
    const videoFile = COMMON_FUNC.checkVideoCoverImage(files, coverImage)

    if (isFastImage) {
      return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.onPressImage(position)}>
          <FastImage style={styles.imageCover} source={{ uri: coverImage }} resizeMode={isShareExtension ? 'cover' : 'cover'} />
          {
            files.length > 1 && 
            <View style={styles.imageNumberContainer}>
              <Text style={styles.textImageNumber}>+{files.length - 1}</Text>
            </View>
          }
          {videoFile && (
            <View style={styles.videoIconView}>
              <MaterialCommunityIcons name="play-circle-outline" size={60} color={COLORS.LIGHT_SOFT_GREY} />
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return (
      // Don't all
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        <Image style={styles.imageCover} source={{ uri: coverImage }} resizeMode={isShareExtension ? 'cover' : 'contain'} />
        {
            files && files.length > 1 &&
            <View style={styles.imageNumberContainer}>
              <Text style={styles.textImageNumber}>+{files.length - 1}</Text>
            </View>
        }
        {videoFile && (
          <View style={styles.videoIconView}>
            <MaterialCommunityIcons name="play-circle-outline" size={60} color={COLORS.LIGHT_SOFT_GREY} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  render () {
    const { coverImage, isFastImage } = this.props
    const {
      files,
    } = this.state;

    const position = _.findIndex(files, file => (file.accessUrl === coverImage || file.thumbnailUrl === coverImage))

    return (
      <View style={styles.container}>
        {this.renderCoverImage(files, coverImage, position)}
        <Modal 
          isVisible={this.state.isPreview}
          style={styles.previewModal}
          backdropColor='rgba(0, 0, 0, 0.9)'
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInTiming={100}
          animationOutTiming={100}
          onBackButtonPress={() => this.setState({ isPreview: false })}
        >
          <ImageSliderScreen 
            mediaFiles={files}
            position={position}
            removal={this.props.editable}
            isSetCoverImage={this.props.isSetCoverImage}
            isFastImage={isFastImage}
            onRemove={(id) => this.props.onRemove(id)}
            onSetCoverImage={(id) => this.props.onSetCoverImage(id)}
            onClose={() => this.setState({ isPreview: false })}
          />
        </Modal>
      </View>
    );
  }
}


CoverImagePreviewComponent.defaultProps = {
  files: [],
  coverImage: '',
  editable: true,
  isSetCoverImage: false,
  isFastImage: true,
  isShareExtension: false,
  onRemove: () => {},
  onSetCoverImage: () => {},
}


CoverImagePreviewComponent.propTypes = {
  files: PropTypes.array,
  coverImage: PropTypes.string,
  editable: PropTypes.bool,
  isSetCoverImage: PropTypes.bool,
  isFastImage: PropTypes.bool,
  isShareExtension: PropTypes.bool,
  onRemove: PropTypes.func,
  onSetCoverImage: PropTypes.func
}
