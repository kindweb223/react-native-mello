import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Animated
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Slideshow from '../../components/Slideshow'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { max } from 'lodash'

import styles from './styles'
import LoadingScreen from '../LoadingScreen';
import * as feedTypes from '../../redux/feedo/types'
import * as cardTypes from '../../redux/card/types'
import CONSTANTS from '../../service/constants'
import Analytics from '../../lib/firebase'

class ImageSliderScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: this.props.position,
      loading: false,
      maxImageHeight: 0,
      isTouch: false,
      imageIndex: this.props.position
    };
    this.buttonOpacity = new Animated.Value(1)
  }

  componentDidMount() {
    Analytics.setCurrentScreen('ImageSliderScreen')

    const {
      mediaFiles,
    } = this.props;

    let imageHeightList = []
    mediaFiles.forEach(element => {
      Image.getSize(element.accessUrl, (width, height) => {
        imageHeightList = [ ...imageHeightList, CONSTANTS.SCREEN_WIDTH / width * height ];
        this.setState({ maxImageHeight: max(imageHeightList) })
      })
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if ((this.props.feedo.loading !== feedTypes.DELETE_FILE_PENDING && nextProps.feedo.loading === feedTypes.DELETE_FILE_PENDING)
      || (this.props.card.loading !== cardTypes.DELETE_FILE_PENDING && nextProps.card.loading === cardTypes.DELETE_FILE_PENDING)) {
      // deleting a file
      loading = true;
    } else if ((this.props.feedo.loading !== feedTypes.DELETE_FILE_FULFILLED && nextProps.feedo.loading === feedTypes.DELETE_FILE_FULFILLED)
      || (this.props.card.loading !== cardTypes.DELETE_FILE_FULFILLED && nextProps.card.loading === cardTypes.DELETE_FILE_FULFILLED)) {
      // fullfilled in deleting a file
    } else if (this.props.card.loading !== cardTypes.SET_COVER_IMAGE_PENDING && nextProps.card.loading === cardTypes.SET_COVER_IMAGE_PENDING) {
      // setting a file as cover image
      loading = true;
    } else if (this.props.card.loading !== cardTypes.SET_COVER_IMAGE_FULFILLED && nextProps.card.loading === cardTypes.SET_COVER_IMAGE_FULFILLED) {
      // success in setting a file as cover image
    } 

    this.setState({
      loading,
    });

    // showing error alert
    let error = nextProps.feedo.error;
    if (!error) {
      error = nextProps.card.error;
    }
    if (error) {
      let errorMessage = null;
      if (error.error) {
        errorMessage = error.error;
      } else {
        errorMessage = error.message;
      }
      if (errorMessage) {
        Alert.alert('Error', errorMessage, [
          {text: 'Close'},
        ]);
      }
      return;
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  onDelete() {
    const {
      mediaFiles,
    } = this.props;
    if (this.props.onRemove) {
      this.props.onRemove(mediaFiles[this.state.imageIndex].id);
    }
  }

  onSetCoverImage() {
    const {
      mediaFiles,
    } = this.props;
    if (this.props.onSetCoverImage) {
      this.props.onSetCoverImage(mediaFiles[this.state.imageIndex].id);
    }
  }

  handleImage = () => {
    const { isTouch } = this.state

    if (isTouch) {
      this.buttonOpacity.setValue(0);
      Animated.timing(this.buttonOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    } else {
      this.buttonOpacity.setValue(1);
      Animated.timing(this.buttonOpacity, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    }

    this.setState({ isTouch: !isTouch })
  }

  onSwipeDown = () => {
    this.props.onClose()
  }

  render () {
    const { maxImageHeight } = this.state
    const { mediaFiles, isFastImage } = this.props;
    let isImage = true;
    if (mediaFiles.length > 0) {
      const mediaFile = mediaFiles[this.state.imageIndex];
      if (mediaFile) {
        isImage = mediaFile && mediaFile.contentType.toLowerCase().indexOf('image') !== -1;
      }
    }
    return (
      <View style={styles.container}>
        <Slideshow 
          position={this.state.position}
          mediaFiles={mediaFiles}
          width={CONSTANTS.SCREEN_WIDTH}
          height={CONSTANTS.SCREEN_HEIGHT - 140}
          isFastImage={isFastImage}
          handleImage={() => this.handleImage()}
          onSwipeDown={this.onSwipeDown}
          setPosition={value => this.setState({ imageIndex: value.pos })}
        />

        <Animated.View 
          style={[styles.closeButtonWrapper, { opacity: this.buttonOpacity }]}
        >
          <TouchableOpacity
            style={{padding: 10}}
            activeOpacity={0.6}
            onPress={this.onClose.bind(this)}
          >
            <MaterialCommunityIcons name="close" size={25} color={'#fff'} />
          </TouchableOpacity>
        </Animated.View>
        {
          this.props.removal && this.props.isSetCoverImage && isImage &&
          <Animated.View 
            style={[styles.coverButton, { opacity: this.buttonOpacity }]}
          >
            <TouchableOpacity 
              activeOpacity={0.6}
              onPress={() => this.onSetCoverImage()}
            >
              <Text style={styles.coverText}>Set Cover Image</Text>
            </TouchableOpacity>
          </Animated.View>
        }
        {
          this.props.removal && 
          <Animated.View 
            style={[styles.deleteButton, { opacity: this.buttonOpacity }]}
          >
            <TouchableOpacity 
              activeOpacity={0.6}
              onPress={() => this.onDelete()}
            >
              <Feather name="trash-2" size={25} color={'#fff'} />
            </TouchableOpacity>
          </Animated.View >
        }
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


ImageSliderScreen.defaultProps = {
  mediaFiles: [],
  position: 0,
  removal: true,
  isFastImage: true,
  isSetCoverImage: false,
  onRemove: () => {},
  onSetCoverImage: () => {},
  onClose: () => {},
}


ImageSliderScreen.propTypes = {
  mediaFiles: PropTypes.array,
  position: PropTypes.number,
  removal: PropTypes.bool,
  isFastImage: PropTypes.bool,
  isSetCoverImage: PropTypes.bool,
  onRemove: PropTypes.func,
  onSetCoverImage: PropTypes.func,
  onClose: PropTypes.func,
}


const mapStateToProps = ({ feedo, card }) => ({
  feedo,
  card,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(ImageSliderScreen)