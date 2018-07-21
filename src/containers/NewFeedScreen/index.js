import React from 'react'
import {
  SafeAreaView,
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

import { 
  createFeed,
  updateFeed,
  deleteFeed,
  getFileUploadUrl,
  uploadFileToS3,
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'

import COLORS from '../../service/colors'
import styles from './styles'
import LoadingScreen from '../LoadingScreen';


class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: 'Feedo UX improvements',
      note: 'Please submit ideas for Toffee sugar plum jelly beans cheesecake soufflé muffin. Oat cake dragée bear claw candy canes pastry.',
      tags: ['UX', 'Solvers'],
      loading: false,
    };
    this.selectedFile = null;
    this.selectedFileType = 'image';
    YellowBox.ignoreWarnings(['Warning: Unsafe legacy lifecycles']);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps : ', nextProps.feed);
    let loading = false;
    if (this.props.feed.status !== types.CREATE_FEED_PENDING && nextProps.feed.status === types.CREATE_FEED_PENDING) {
      // creating a feed
      loading = true;
    } else if (this.props.feed.status !== types.UPDATE_FEED_PENDING && nextProps.feed.status === types.UPDATE_FEED_PENDING) {
      //upating a feed
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FEED_PENDING && nextProps.feed.status === types.DELETE_FEED_PENDING) {
      //deleting a feed
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FEED_FULFILLED && nextProps.feed.status === types.DELETE_FEED_FULFILLED) {
      //fullfilled in deleting a feed
      this.onClose();
      return;
    } else if (this.props.feed.status !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.feed.status === types.GET_FILE_UPLOAD_URL_PENDING) {
      //getting a file upload url
      loading = true;
    } else if (this.props.feed.status !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.feed.status === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      //fullfilled in getting a file upload url
      loading = true;
      this.props.uploadFileToS3(nextProps.feed.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileType);
    } else if (this.props.feed.status !== types.UPLOAD_FILE_PENDING && nextProps.feed.status === types.UPLOAD_FILE_PENDING) {
      //uploading a file
      loading = true;
    } else if (this.props.feed.status !== types.UPLOAD_FILE_FULFILLED && nextProps.feed.status === types.UPLOAD_FILE_FULFILLED) {
      //fullfilled in uploading a file
    } 

    this.setState({
      loading,
    });

    //showing error alert
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
      console.log('ImagePicker : ', result);
      this.selectedFile = result.uri;
      this.selectedFileType = result.type;
      // this.props.getFileUploadUrl('71269dba-bd4a-4ead-950f-88215a959618');
      // const uploadUrl = "https://solvers-hunt.s3.amazonaws.com/solvers-dev/hunts/fa0aa987-6435-4061-b83a-567965d15e73/e1f92f01-c85b-4b2e-8c35-f8072f45ce16?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180720T223017Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAJWOLNJ6JUTX6P2CQ%2F20180720%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=df27e570c5e07594a929f76695dc421d5532172152fe852bc55f277badafe9f2";
      // this.props.uploadFileToS3(uploadUrl, this.selectedFile, this.selectedFileType);
      // return;
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
          value={this.state.note}
          onChangeText={(value) => this.setState({note: value})}
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
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
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
  updateFeed: (id, name, note, tags, files) => dispatch(updateFeed(id, name, note, tags, files)),
  deleteFeed: (id) => dispatch(deleteFeed(id)),
  getFileUploadUrl: (id) => dispatch(getFileUploadUrl(id)),
  uploadFileToS3: (url, file, type) => dispatch(uploadFileToS3(url, file, type)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewFeedScreen)