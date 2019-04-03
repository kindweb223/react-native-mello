import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'

import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import _ from 'lodash'
import ImageSliderScreen from '../../containers/ImageSliderScreen'
import ExFastImage from '../ExFastImage';
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
      position: 0,
      progress: 0,
      indeterminate: false,
      loadEnd: false
    };
   
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ files: nextProps.files })
    if (this.props.imageUploading && !nextProps.imageUploading) {
      this.setState({ progress: 0 });
    }

    if (nextProps.imageUploading && this.state.progress === 0) {
      this.setState({
        progress: 0,
      }, () => {
        this.animateProgressBar();
      });
    }
  }

  onPressImage(index) {
    this.setState({ isPreview: true, position: index })
  }

  onLoadEnd = () => {
    this.setState({
      loadEnd: true,
      progress: 0
    });
  }

  animateProgressBar() {
    let progress = 0;
    let animateProgressInterval = setInterval(() => {
      progress += 0.1;
      if (progress <= 0.9) {
        this.setState({ progress });
      }
    }, 200);
    setTimeout(() => clearInterval(animateProgressInterval), 2000);
  }

  get renderProgressBar() {
    const { progress, useRealProgress } = this.props

    if (this.props.cardMode === 'CardNewSingle' && this.state.loadEnd) {
      return;
    }

    if (this.props.cardMode === 'CardDetailSingle' && this.state.loadEnd) {
      return;
    }

    return this.props.imageUploading && (
      <View style={[styles.progressView, this.state.files.length > 0 && { backgroundColor: 'transparent' } ]}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={useRealProgress === true ? progress : this.state.progress}
            indeterminate={this.state.indeterminate}
            color='white'
            unfilledColor='#A1A5AE'
            borderWidth={0}
          />
        </View>
      </View>
    )
  }

  renderCoverImage(files, coverImage, position) {
    const { isFastImage, isShareExtension } = this.props;
    const videoFile = COMMON_FUNC.checkVideoCoverImage(files, coverImage)

    if (!coverImage) return;
    if (isFastImage) {
      return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.onPressImage(position)}>
          <ExFastImage
            style={styles.imageCover}
            source={{ uri: coverImage }}
            resizeMode={isShareExtension ? 'cover' : 'cover'}
            onLoadEnd={this.onLoadEnd}
          />
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
        <Image
          style={styles.imageCover}
          source={{ uri: coverImage }}
          resizeMode={isShareExtension ? 'cover' : 'contain'}
          onLoadEnd={this.onLoadEnd}
        />
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
        {this.renderProgressBar}
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
  progress: 0,
  useRealProgress: true
}


CoverImagePreviewComponent.propTypes = {
  files: PropTypes.array,
  coverImage: PropTypes.string,
  editable: PropTypes.bool,
  isSetCoverImage: PropTypes.bool,
  isFastImage: PropTypes.bool,
  isShareExtension: PropTypes.bool,
  onRemove: PropTypes.func,
  onSetCoverImage: PropTypes.func,
  progress: PropTypes.number,
  useRealProgress: PropTypes.bool
}
