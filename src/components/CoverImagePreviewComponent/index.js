import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import _ from 'lodash'
import ImageSliderScreen from '../../containers/ImageSliderScreen'
import styles from './styles'
import CONSTANTS from '../../service/constants'

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

  render () {
    const { coverImage, isShowCount } = this.props
    const {
      files,
    } = this.state;

    const position = _.findIndex(files, file => file.accessUrl === coverImage)

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.container} onPress={() => this.onPressImage(position)}>
          <FastImage style={styles.imageCover} source={{ uri: coverImage }} resizeMode="cover" />
          {
            isShowCount && files.length > 1 && 
            <View style={styles.imageNumberContainer}>
              <Text style={styles.textImageNumber}>+{files.length - 1}</Text>
            </View>
          }
        </TouchableOpacity>

        <Modal 
          isVisible={this.state.isPreview}
          style={styles.previewModal}
          backdropColor='rgba(0, 0, 0, 0.9)'
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInTiming={100}
          animationOutTiming={100}
        >
          <ImageSliderScreen 
            imageFiles={files}
            position={position}
            removal={this.props.editable}
            isSetCoverImage={this.props.isSetCoverImage}
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
  isShowCount: true,
  onRemove: () => {},
  onSetCoverImage: () => {},
}


CoverImagePreviewComponent.propTypes = {
  files: PropTypes.array,
  coverImage: PropTypes.string,
  editable: PropTypes.bool,
  isSetCoverImage: PropTypes.bool,
  isShowCount: PropTypes.bool,
  onRemove: PropTypes.func,
  onSetCoverImage: PropTypes.func,
}
