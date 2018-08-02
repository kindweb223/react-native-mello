import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Carousel from '../../components/Carousel'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { filter } from 'lodash'

import styles from './styles'
import LoadingScreen from '../LoadingScreen';
import { 
  deleteFile,
} from '../../redux/feedo/actions'
import * as types from '../../redux/feedo/types'
import CONSTANTS from '../../service/constants'

class ImageSliderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.props.position,
      loading: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps : ', nextProps.feedo);
    let loading = false;
    if (this.props.feedo.loading !== types.DELETE_FILE_PENDING && nextProps.feedo.loading === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FILE_FULFILLED && nextProps.feedo.loading === types.DELETE_FILE_FULFILLED) {
      // fullfilled in deleting a file
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (nextProps.feedo.error) {
      let error = null;
      if (nextProps.feedo.error.error) {
        error = nextProps.feedo.error.error;
      } else {
        error = nextProps.feedo.error.message;
      }
      if (error) {
        Alert.alert('Error', error, [
          {text: 'Close'},
        ]);
      }
      return;
    }
  }

  getImages() {
    const {
      files,
    } = this.props.feedo.currentFeed;
    const { position } = this.state
    const imageFiles = filter(files, file => file.fileType === 'MEDIA');
    selectImage = imageFiles[position]
    const restImages = imageFiles.slice(position, 1)
    return {
      selectImage,
      ...restImages
    }
  }

  onClose() {
    this.props.onClose()
  }

  onDelete() {
    const {
      id,
      files
    } = this.props.feedo.currentFeed;
    const imageFiles = filter(files, file => file.fileType === 'MEDIA');
    if (id) {
      this.props.deleteFile(id, imageFiles[this.state.position].id);
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onClose.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={30} color={'#fff'} />
        </TouchableOpacity>

        {/* <Slideshow 
          position={this.state.position}
          arrowSize={0}
          dataSource = {this.getImages()}
          onPositionChanged={position => this.setState({ position })}
          width={CONSTANTS.SCREEN_WIDTH}
          height={CONSTANTS.SCREEN_WIDTH}
        /> */}
        <Carousel
          width={CONSTANTS.SCREEN_WIDTH}
          height={CONSTANTS.SCREEN_WIDTH}
          backgroundColor="transparent"
        >
          {dataSource.map(item => (
            <Image key={item.id} style={styles.previewImage} source={{ uri: item.accessUrl }} threshold={300} />
          ))}
        </Carousel>

        {this.props.removal && (
          <TouchableOpacity 
            style={styles.borderButtonWrapper}
            activeOpacity={0.6}
            onPress={this.onDelete.bind(this)}
          >
            <Text style={styles.textButton}>Delete</Text>
          </TouchableOpacity>
        )}
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


ImageSliderScreen.defaultProps = {
  position: 0,
  removal: true
}


ImageSliderScreen.propTypes = {
  position: PropTypes.number,
  removal: PropTypes.bool
}


const mapStateToProps = ({ feedo }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ImageSliderScreen)