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
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import _ from 'lodash'
import ImageSliderScreen from '../../containers/ImageSliderScreen'
import ExFastImage from '../ExFastImage';
import styles from './styles'
import CONSTANTS from '../../service/constants'

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
    if (nextProps.imageUploading && this.state.progress === 0) {
      this.animateProgressBar();
    }
  }

  onPressImage(index) {
    this.setState({ isPreview: true, position: index })
  }

  animateProgressBar() {
    let progress = 0;
    setInterval(() => {
      progress += 0.1;
      if (progress > 1) {
        this.setState({ indeterminate: true })
      }
      this.setState({ progress });
    }, 500);
  }

  get renderProgressBar() {
    if (this.props.cardMode === 'CardNew' && this.state.loadEnd) {
      return;
    }

    return this.props.imageUploading && (
      <View style={styles.progressView}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={this.state.progress}
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
    if (!coverImage) return;
    if (isFastImage) {
      return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.onPressImage(position)}>
          <ExFastImage
            style={styles.imageCover}
            source={{ uri: coverImage }}
            resizeMode={isShareExtension ? 'cover' : 'cover'}
            onLoadEnd={() => this.setState({ loadEnd: true })}
          />
          {
            files.length > 1 && 
            <View style={styles.imageNumberContainer}>
              <Text style={styles.textImageNumber}>+{files.length - 1}</Text>
            </View>
          }
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
          onLoadEnd={() => this.setState({ loadEnd: true })}
        />
        {
            files && files.length > 1 &&
            <View style={styles.imageNumberContainer}>
              <Text style={styles.textImageNumber}>+{files.length - 1}</Text>
            </View>
        }
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
