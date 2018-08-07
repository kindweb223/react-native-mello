import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Slideshow from '../../components/Slideshow'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import { max, filter } from 'lodash'

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
      maxImageHeight: 0
    };
  }

  componentDidMount() {
    const {
      imageFiles,
    } = this.props;
    console.log('aaa: ', imageFiles)
    let imageHeightList = []
    imageFiles.forEach(element => {
      Image.getSize(element.accessUrl, (width, height) => {
        imageHeightList = [ ...imageHeightList, CONSTANTS.SCREEN_WIDTH / width * height ];
        console.log('PPP: ', width, height, imageHeightList)
        this.setState({ maxImageHeight: max(imageHeightList) })
      })
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  onDelete = () => {
    const {
      imageFiles,
    } = this.props;
    if (this.props.onRemove) {
      this.props.onRemove(imageFiles[this.state.position].id);
    }
  }

  onSetCoverImage = () => {

  }

  render () {
    const { maxImageHeight } = this.state
    const { imageFiles } = this.props;

    return (
      <View style={styles.container}>
        <Slideshow 
          position={this.state.position}
          imageFiles={imageFiles}
          width={CONSTANTS.SCREEN_WIDTH}
          height={CONSTANTS.SCREEN_HEIGHT - 120}
        />

        <TouchableOpacity 
          style={styles.closeButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onClose.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={25} color={'#fff'} />
        </TouchableOpacity>

        {this.props.removal && (
          <TouchableOpacity 
            style={styles.coverButton}
            activeOpacity={0.6}
            onPress={() => this.onSetCoverImage()}
          >
            <Entypo name="image" size={25} color={'#fff'} />
          </TouchableOpacity>
        )}

        {this.props.removal && (
          <TouchableOpacity 
            style={styles.deleteButton}
            activeOpacity={0.6}
            onPress={() => this.onDelete()}
          >
            <Feather name="trash-2" size={25} color={'#fff'} />
          </TouchableOpacity>
        )}

        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


ImageSliderScreen.defaultProps = {
  imageFiles: [],
  position: 0,
  removal: true,
  onRemove: () => {},
  onClose: () => {},
}


ImageSliderScreen.propTypes = {
  imageFiles: PropTypes.array,
  position: PropTypes.number,
  removal: PropTypes.bool,
  onRemove: PropTypes.func,
  onClose: PropTypes.func,
}


const mapStateToProps = ({ feedo }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ImageSliderScreen)