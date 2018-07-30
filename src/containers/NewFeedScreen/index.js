import React from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  YellowBox,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Tags from '../../components/TagComponent'
import ActionSheet from 'react-native-actionsheet'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Permissions from 'react-native-permissions'

import * as mime from 'react-native-mime-types';
import { filter } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { 
  createFeed,
  updateFeed,
  deleteFeed,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
  getFeedDetail,
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import NewFeedImage from '../../components/NewFeedImageComponent';
import NewFeedDocument from '../../components/NewFeedDocumentComponent';
import TagCreateScreen from '../TagCreateScreen';

const NewFeedMode = 1;
const TagCreateMode = 2;

const FeedId = '4e3709a4-1fea-4fd5-b8ed-bd91b9be4afb';


class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: '',
      comments: '',
      loading: false,
      currentScreen: NewFeedMode,
    };

    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;

    this.animatedShow = new Animated.Value(0);
    this.animatedTagTransition = new Animated.Value(1);

    YellowBox.ignoreWarnings(['Warning: Unsafe legacy lifecycles']);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('NewFeedScreen UNSAFE_componentWillReceiveProps : ', nextProps.feed);
    let loading = false;
    if (this.props.feed.status !== types.CREATE_FEED_PENDING && nextProps.feed.status === types.CREATE_FEED_PENDING) {
      // creating a feed
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FEED_PENDING && nextProps.feed.status === types.DELETE_FEED_PENDING) {
      // deleting a feed
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FEED_FULFILLED && nextProps.feed.status === types.DELETE_FEED_FULFILLED) {
      // success in deleting a feed
      this.onClose();
      return;
    } else if (this.props.feed.status !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.feed.status === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.feed.status !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.feed.status === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      this.props.uploadFileToS3(nextProps.feed.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileName, this.selectedFileMimeType);
    } else if (this.props.feed.status !== types.UPLOAD_FILE_PENDING && nextProps.feed.status === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.feed.status !== types.UPLOAD_FILE_FULFILLED && nextProps.feed.status === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      let {
        id, 
      } = this.props.feed.feed;
      const {
        objectKey
      } = this.props.feed.fileUploadUrl;
      this.props.addFile(id, this.selectedFileType, this.selectedFileMimeType, this.selectedFileName, objectKey);
    } else if (this.props.feed.status !== types.ADD_FILE_PENDING && nextProps.feed.status === types.ADD_FILE_PENDING) {
      // adding a file
      loading = true;
    } else if (this.props.feed.status !== types.ADD_FILE_FULFILLED && nextProps.feed.status === types.ADD_FILE_FULFILLED) {
      // success in adding a file
    } else if (this.props.feed.status !== types.UPDATE_FEED_PENDING && nextProps.feed.status === types.UPDATE_FEED_PENDING) {
      // updating a feed
      loading = true;
    } else if (this.props.feed.status !== types.UPDATE_FEED_FULFILLED && nextProps.feed.status === types.UPDATE_FEED_FULFILLED) {
      // success in updating a feed
      this.onClose();
    } else if (this.props.feed.status !== types.DELETE_FILE_PENDING && nextProps.feed.status === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FILE_FULFILLED && nextProps.feed.status === types.DELETE_FILE_FULFILLED) {
      // success in deleting a file
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
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      // this.props.createFeed();
      this.props.getFeedDetail(FeedId);
    });
  }

  onClose() {
    this.animatedShow.setValue(1);
    Animated.timing(this.animatedShow, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onCreate() {
    if (this.state.feedName === '') {
      Alert.alert('', 'Please input your feed name.', [
        {text: 'Close'},
      ]);
      return;
    } else if (this.state.comments === '') {
      Alert.alert('', 'Please input note.', [
        {text: 'Close'},
      ]);
      return;
    }

    const {
      id, 
      tags,
      files,
    } = this.props.feed.feed;
    this.props.updateFeed(id, this.state.feedName, this.state.comments, tags, files);
  }

  onInsertLink() {
  }

  onAddMedia() {
    this.imagePickerActionSheetRef.show();
  }

  onAddDocument() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error, response) => {
      console.log('DocumentPicker Error : ', error);
      console.log('DocumentPicker Response : ', response);
    });
    return;

    console.log('Picked Document : ', result);
    this.selectedFile = result.uri;
    this.selectedFileMimeType = mime.lookup(result.uri);
    this.selectedFileName = result.name;
    this.selectedFileType = 'FILE';
    if (this.props.feed.feed.id) {
      this.props.getFileUploadUrl(this.props.feed.feed.id);
    }
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

  onOpenCreationTag() {
    this.setState({
      currentScreen: TagCreateMode,
    }, () => {
      this.animatedTagTransition.setValue(1)
      Animated.timing(this.animatedTagTransition, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    });
  }

  onCloseCreationTag() {
    this.animatedTagTransition.setValue(0)
    Animated.timing(this.animatedTagTransition, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({
        currentScreen: NewFeedMode,
      });
    });
  }

  uploadMediaFile(file) {
    this.selectedFile = file.uri;
    this.selectedFileMimeType = mime.lookup(file.uri);
    this.selectedFileName = file.fileName;
    this.selectedFileType = 'MEDIA';
    if (this.props.feed.feed.id) {
      this.props.getFileUploadUrl(this.props.feed.feed.id);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      console.log('Picked Media : ', response);
      if (!response.cancelled) {
        this.uploadMediaFile(response);
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      console.log('Picked Media : ', response);
      if (!response.cancelled) {
        this.uploadMediaFile(response);
      }
    });
  }

  onTapMediaPickerActionSheet(index) {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'feedo'
      }
    };
        
    if (index === 0) {
      // from camera
      Permissions.check('camera').then(response => {
        if (response !== 'authorized') {
          Permissions.request('camera').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromCamera(options);
            }
          });
        } else {
          this.pickMediaFromCamera(options);
        }
      });
    } else if (index === 1) {
      // from library
      Permissions.check('photo').then(response => {
        if (response !== 'authorized') {
          Permissions.request('photo').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromLibrary(options);
            }
          });
        } else {
          this.pickMediaFromLibrary(options);
        }
      });
    }
  }

  get renderTopContent() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.closeButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onOpenActionSheet.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.createButtonWapper}
          activeOpacity={0.6}
          onPress={this.onCreate.bind(this)}
        >
          <Text style={styles.textButton}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onRemoveImage(fileId) {
    const {
      id,
    } = this.props.feed.feed;
    this.props.deleteFile(id, fileId);
  }

  get renderImages() {
    const {
      files
    } = this.props.feed.feed;
    const imageFiles = filter(files, file => file.fileType === 'MEDIA');
    return (
      <NewFeedImage 
        files={imageFiles}
        onRemove={(fileId) => this.onRemoveImage(fileId)}
      />
    )
  }

  get renderDocuments() {
    const {
      files
    } = this.props.feed.feed;
    const documentFiles = filter(files, file => file.fileType === 'FILE');
    return (
      <NewFeedDocument 
        files={documentFiles}
        onRemove={(fileId) => this.onRemoveImage(fileId)}
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
          tags={this.props.feed.feed.tags}
          readonly={true}
          onPressTag={(index, tag) => this.onOpenCreationTag()}
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
        {this.renderDocuments}
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
          onPress={this.onAddMedia.bind(this)}
        >
          <Entypo name="image" size={19} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onAddDocument.bind(this)}
        >
          <Ionicons name="md-attach" style={styles.attachment} size={22} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  get renderFeed () {
    // if (this.state.currentScreen !== NewFeedMode) {
    //   return;
    // }
    const animatedMove  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_HEIGHT, 0],
    });
    
    return (
      
      <Animated.View 
        style={[
          styles.feedContainer,
          {
            top: animatedMove,
            opacity: this.animatedShow,
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.backdropContainer}
          activeOpacity={1}
          onPress={this.onOpenActionSheet.bind(this)}
        />
        <View style={styles.contentContainer}>
          {this.renderTopContent}
          <KeyboardAwareScrollView>
            {this.renderCenterContent}
            {this.renderBottomContent}
          </KeyboardAwareScrollView>
        </View>
        <TouchableOpacity 
          style={styles.backdropContainer}
          activeOpacity={1}
          onPress={this.onOpenActionSheet.bind(this)}
        />
        {this.state.loading && <LoadingScreen />}
      </Animated.View>
    );
  }

  get renderCreateTag() {
    if (this.state.currentScreen !== TagCreateMode) {
      return;
    }

    const animatedMove  = this.animatedTagTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150],
    });
    const animatedOpacity  = this.animatedTagTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    return (
      <Animated.View
        style={[
          styles.tagCreationContainer,
          {
            left: animatedMove,
            opacity: animatedOpacity,
          }
        ]}
      >
        <TagCreateScreen 
          onBack={() => this.onCloseCreationTag()}
        />
      </Animated.View>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderFeed}
        {this.renderCreateTag}
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
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
      </View>
    );
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
  addFile: (feedId, fileType, contentType, name, objectKey) => dispatch(addFile(feedId, fileType, contentType, name, objectKey)),
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
  getFeedDetail: feedId => dispatch(getFeedDetail(feedId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewFeedScreen)