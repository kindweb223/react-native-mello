import React from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  YellowBox,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';
import Tags from "react-native-tags";
import ActionSheet from 'react-native-actionsheet'
import { Actions } from 'react-native-router-flux'
import { ImagePicker, Permissions } from 'expo';
import * as mime from 'react-native-mime-types';

import { 
  createFeed,
  updateFeed,
  deleteFeed,
  getFileUploadUrl,
  uploadFileToS3,
  deleteFile,
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'

import COLORS from '../../service/colors'
import styles from './styles'
import LoadingScreen from '../LoadingScreen';
import NewFeedImage from '../../components/NewFeedImageComponent';


class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: 'Feedo UX improvements',
      comments: 'Please submit ideas for Toffee sugar plum jelly beans cheesecake soufflé muffin. Oat cake dragée bear claw candy canes pastry.',
      tags: ['UX', 'Solvers'],
      loading: false,
    };
    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileName = null;
    YellowBox.ignoreWarnings(['Warning: Unsafe legacy lifecycles']);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps : ', nextProps.feed);
    let loading = false;
    if (this.props.feed.status !== types.CREATE_FEED_PENDING && nextProps.feed.status === types.CREATE_FEED_PENDING) {
      // creating a feed
      loading = true;
    } else if (this.props.feed.status !== types.UPDATE_FEED_PENDING && nextProps.feed.status === types.UPDATE_FEED_PENDING) {
      // upating a feed
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FEED_PENDING && nextProps.feed.status === types.DELETE_FEED_PENDING) {
      // deleting a feed
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FEED_FULFILLED && nextProps.feed.status === types.DELETE_FEED_FULFILLED) {
      // fullfilled in deleting a feed
      this.onClose();
      return;
    } else if (this.props.feed.status !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.feed.status === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.feed.status !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.feed.status === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // fullfilled in getting a file upload url
      loading = true;
      this.props.uploadFileToS3(nextProps.feed.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileName, this.selectedFileMimeType);
    } else if (this.props.feed.status !== types.UPLOAD_FILE_PENDING && nextProps.feed.status === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.feed.status !== types.UPLOAD_FILE_FULFILLED && nextProps.feed.status === types.UPLOAD_FILE_FULFILLED) {
      // fullfilled in uploading a file
      loading = true;
      let {
        id, 
        headline,
        comments,
        tags,
        files,
      } = this.props.feed.feed;
      const {
        objectKey
      } = this.props.feed.fileUploadUrl;

      if (files) {
        files = [
          ...files,
          {
            contentType: this.selectedFileMimeType,
            name: this.selectedFileName,
            objectKey,
          }
        ]
      } else {
        files = [
          {
            contentType: this.selectedFileMimeType,
            name: this.selectedFileName,
            objectKey,
          }
        ]
      }
      this.props.updateFeed(id, headline, comments, tags, files)
    } else if (this.props.feed.status !== types.UPDATE_FEED_PENDING && nextProps.feed.status === types.UPDATE_FEED_PENDING) {
      // updating a feed
      loading = true;
    } else if (this.props.feed.status !== types.UPDATE_FEED_FULFILLED && nextProps.feed.status === types.UPDATE_FEED_FULFILLED) {
      // fullfilled in updating a feed
    } else if (this.props.feed.status !== types.DELETE_FILE_PENDING && nextProps.feed.status === types.DELETE_FILE_PENDING) {
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

  componentDidMount() {
    // this.props.createFeed();
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onCreate() {
    this.props.createFeed();
  }

  onInsertLink() {
  }

  onInsertMedia() {
    this.imagePickerActionSheetRef.show();
  }

  onInsertAttachment() {
  }
  
  onOpenActionSheet() {
    this.leaveActionSheetRef.show();
    return;
  }

  onTapLeaveActionSheet(index) {
    if (index === 1) {
      if (this.props.feed.feed.id) {
        this.props.deleteFeed(this.props.feed.feed.id)
      } else {
        this.onClose();
      }
    }
  }

  async onTapImagePickerActionSheet(index) {
    if (index === 2) {
      return;
    }
    
    let result;
    if (index === 0) {
      // from camera
      const cameraPermission = await Permissions.getAsync(Permissions.CAMERA);
      if (cameraPermission.status !== 'granted') {
        await Permissions.askAsync(Permissions.CAMERA);
      }
      const cameraRollPermission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (cameraRollPermission.status !== 'granted') {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
      result = await ImagePicker.launchCameraAsync({
      });
    } else if (index === 1) {
      // from library
      const cameraRollPermission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (cameraRollPermission.status !== 'granted') {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
      result = await ImagePicker.launchImageLibraryAsync({
      });
    }
    if (!result.cancelled) {
      this.selectedFile = result.uri;
      this.selectedFileMimeType = mime.lookup(result.uri);
      this.selectedFileName = result.uri.replace(/^.*[\\\/]/, '');
      if (this.props.feed.feed.id) {
        this.props.getFileUploadUrl(this.props.feed.feed.id);
      }
    }
  }

  get renderTopContent() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.closeContainer}
          activeOpacity={0.6}
          onPress={this.onOpenActionSheet.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.createContainer}
          activeOpacity={0.6}
          onPress={this.onCreate.bind(this)}
        >
          <Text style={styles.textButton}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onRemoveImage(index) {
    const {
      id,
      files
    } = this.props.feed.feed;
    this.props.deleteFile(id, files[index].id);
    // this.state.files.splice(index, 1);
    // this.setState({
    //   files: this.state.files,
    // });
  }

  get renderImages() {
    const {
      files
    } = this.props.feed.feed;
    return (
      <NewFeedImage 
        files={files}
        onRemove={(index) => this.onRemoveImage(index)}
      />
    )
  }

  get renderCenterContent() {
    return (
      <View style={styles.mainContentContainer}>
        <TextInput 
          style={styles.textInputFeedName}
          placeholder='Name your feed'
          underlineColorAndroid='transparent'
          value={this.state.feedName}
          onChangeText={(value) => this.setState({feedName: value})}
        />
        <TextInput 
          style={styles.textInputNote}
          placeholder='Note'
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.comments}
          onChangeText={(value) => this.setState({comments: value})}
        />
        <Tags
          initialTags={this.state.tags}
          onChangeTags={tags => this.setState({ tags })}
          onTagPress={(index, tagLabel, event) => console.log(index, tagLabel)}
          containerStyle={{
            marginHorizontal: 20,
            marginVertical: 15,
          }}
          inputStyle={{
            backgroundColor: 'white',
          }}
          tagContainerStyle={{
            backgroundColor: COLORS.LIGHT_ORANGE_BACKGROUND,
          }}
          tagTextStyle={{
            color: COLORS.DARK_ORANGE,
            fontSize: 16,
          }}
        />
        {this.renderImages}
      </View>
    );
  }

  get renderBottomContent() {
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertLink.bind(this)}
        >
          <Ionicons name="ios-flash" size={28} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertMedia.bind(this)}
        >
          <Entypo name="image" size={19} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertAttachment.bind(this)}
        >
          <Ionicons name="md-attach" style={styles.attachment} size={22} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onOpenActionSheet.bind(this)}
        />
        <View style={styles.contentContainer}>
          {this.renderTopContent}
          {this.renderCenterContent}
          {this.renderBottomContent}
        </View>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onOpenActionSheet.bind(this)}
        />
        <ActionSheet
          ref={o => this.leaveActionSheetRef = o}
          title='Are you sure that you wish to leave?'
          options={['Continue editing', 'Leave and discard', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapLeaveActionSheet(index)}
        />
        <ActionSheet
          ref={o => this.imagePickerActionSheetRef = o}
          title='Select a Photo / Video'
          options={['Select From Camera', 'Select From Library', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapImagePickerActionSheet(index)}
        />
        {this.state.loading && <LoadingScreen />}
      </View>
    )
  }
}


NewFeedScreen.defaultProps = {
  feed: {},
  onClose: () => {},
}


NewFeedScreen.propTypes = {
  feed: PropTypes.object,
  onClose: PropTypes.func,
  createFeed: PropTypes.func,
  updateFeed: PropTypes.func,
  deleteFeed: PropTypes.func,
}


const mapStateToProps = ({ feed }) => ({
  feed,
})


const mapDispatchToProps = dispatch => ({
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, comments, tags, files) => dispatch(updateFeed(id, name, comments, tags, files)),
  deleteFeed: (id) => dispatch(deleteFeed(id)),
  getFileUploadUrl: (id) => dispatch(getFileUploadUrl(id)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewFeedScreen)