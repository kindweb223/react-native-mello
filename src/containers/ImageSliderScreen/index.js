import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Slideshow from 'react-native-slideshow'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { filter } from 'lodash'

import styles from './styles'
import LoadingScreen from '../LoadingScreen';
import { 
  deleteFile,
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'


class ImageSliderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.props.position,
      loading: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps : ', nextProps.feed);
    let loading = false;
    if (this.props.feed.status !== types.DELETE_FILE_PENDING && nextProps.feed.status === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FILE_FULFILLED && nextProps.feed.status === types.DELETE_FILE_FULFILLED) {
      // fullfilled in deleting a file
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (nextProps.feed.error) {
      let error = null;
      if (nextProps.feed.error.error) {
        error = nextProps.feed.error.error;
      } else {
        error = nextProps.feed.error.message;
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
    } = this.props.feed.feed;
    const imageFiles = filter(files, file => file.fileType === 'MEDIA');
    let allImages = [];
    if (imageFiles) {
      imageFiles.forEach(item => {
        allImages.push({
          url: item.accessUrl,
        });
      })
    }
    return allImages;
  }

  onClose() {
    Actions.pop();
  }

  onDelete() {
    const {
      id,
      files
    } = this.props.feed.feed;
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
        <Slideshow 
          position={this.state.position}
          arrowSize={0}
          dataSource = {this.getImages()}
          onPositionChanged={position => this.setState({ position })}
        />
        <TouchableOpacity 
          style={styles.borderButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onDelete.bind(this)}
        >
          <Text style={styles.textButton}>Delete</Text>
        </TouchableOpacity>
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


ImageSliderScreen.defaultProps = {
  position: 0,
}


ImageSliderScreen.propTypes = {
  position: PropTypes.number,
}


const mapStateToProps = ({ feed }) => ({
  feed,
})


const mapDispatchToProps = dispatch => ({
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ImageSliderScreen)