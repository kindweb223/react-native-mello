import React from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
  ScrollView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Tags from '../../components/TagComponent'
import ActionSheet from 'react-native-actionsheet'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types';
import _ from 'lodash'

import { 
  createFeed,
  updateFeed,
  deleteDraftFeed,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
  getFeedDetail,
} from '../../redux/feedo/actions'
import * as types from '../../redux/feedo/types'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import ImageList from '../../components/ImageListComponent';
import DocumentList from '../../components/DocumentListComponent';
import TagCreateScreen from '../TagCreateScreen';

const NewFeedMode = 1;
const TagCreateMode = 2;
const ScreenVerticalMinMargin = 80;


class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: '',
      comments: '',
      loading: false,
      currentScreen: NewFeedMode,
    };
    // this.isNewFeed = Object.keys(this.props.feedo.currentFeed).length === 0;
    
    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;
    
    this.isVisibleErrorDialog = false;

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
    this.animatedTagTransition = new Animated.Value(1);
  }

  UNSAFE_componentWillMount() {
    console.log('PPP: ', Object.keys(this.props.feedo.currentFeed))
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('NewFeedScreen UNSAFE_componentWillReceiveProps : ', nextProps.feedo.loading, nextProps.feedo.currentFeed);
    let loading = false;
    if (this.props.feedo.loading !== types.CREATE_FEED_PENDING && nextProps.feedo.loading === types.CREATE_FEED_PENDING) {
      // creating a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FEED_PENDING && nextProps.feedo.loading === types.DELETE_FEED_PENDING) {
      // deleting a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FEED_FULFILLED && nextProps.feedo.loading === types.DELETE_FEED_FULFILLED) {
      // success in deleting a feed
      this.onClose(null);
      return;
    } else if (this.props.feedo.loading !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.feedo.loading === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.feedo.loading !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.feedo.loading === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      this.props.uploadFileToS3(nextProps.feedo.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileName, this.selectedFileMimeType);
    } else if (this.props.feedo.loading !== types.UPLOAD_FILE_PENDING && nextProps.feedo.loading === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.feedo.loading !== types.UPLOAD_FILE_FULFILLED && nextProps.feedo.loading === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      let {
        id, 
      } = this.props.feedo.currentFeed;
      const {
        objectKey
      } = this.props.feedo.fileUploadUrl;
      this.props.addFile(id, this.selectedFileType, this.selectedFileMimeType, this.selectedFileName, objectKey);
    } else if (this.props.feedo.loading !== types.ADD_FILE_PENDING && nextProps.feedo.loading === types.ADD_FILE_PENDING) {
      // adding a file
      loading = true;
    } else if (this.props.feedo.loading !== types.ADD_FILE_FULFILLED && nextProps.feedo.loading === types.ADD_FILE_FULFILLED) {
      // success in adding a file
    } else if (this.props.feedo.loading !== types.UPDATE_FEED_PENDING && nextProps.feedo.loading === types.UPDATE_FEED_PENDING) {
      // updating a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.UPDATE_FEED_FULFILLED && nextProps.feedo.loading === types.UPDATE_FEED_FULFILLED) {
      // success in updating a feed
      this.onClose(nextProps.feedo.currentFeed);
      if (nextProps.type === 'create') {
        Actions.FeedDetailScreen({ data: nextProps.feedo.currentFeed });
      } 
    } else if (this.props.feedo.loading !== types.DELETE_FILE_PENDING && nextProps.feedo.loading === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FILE_FULFILLED && nextProps.feedo.loading === types.DELETE_FILE_FULFILLED) {
      // success in deleting a file
    } else if (this.props.feedo.loading !== types.GET_FEED_DETAIL_PENDING && nextProps.feedo.loading === types.GET_FEED_DETAIL_PENDING) {
      // getting a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.GET_FEED_DETAIL_FULFILLED && nextProps.feedo.loading === types.GET_FEED_DETAIL_FULFILLED) {
      // success in getting a feed
      this.setState({
        feedName: nextProps.feedo.currentFeed.headline,
        comments: nextProps.feedo.currentFeed.summary,
      });
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (this.props.feedo.loading !== nextProps.feedo.loading) {
      if (nextProps.feedo.error) {
        let error = null;
        if (nextProps.feedo.error.error) {
          error = nextProps.feedo.error.error;
        } else {
          error = nextProps.feedo.error.message;
        }
        if (error) {
          if (!this.isVisibleErrorDialog) {
            this.isVisibleErrorDialog = true;
            Alert.alert('Error', error, [
              {text: 'Close', onPress: () => this.isVisibleErrorDialog = false},
            ]);
          }
        }
        return;
      }
    }
  }

  componentDidMount() {
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      if (this.props.selectedFeedId) {
        this.props.getFeedDetail(this.props.selectedFeedId);
      } else {
        this.props.createFeed();
      }
    });
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    this.textInputFeedNameRef.focus();
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height - ScreenVerticalMinMargin - 18, // border radius = 18
        duration: e.duration,
      }
    ).start();
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: e.duration,
      }
    ).start();
  }

  onClose(data) {
    this.animatedShow.setValue(1);
    Animated.timing(this.animatedShow, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start();
    if (this.props.onClose) {
      this.props.onClose({ currentFeed: data });
    }
  }

  onUpdate() {
    if (this.state.feedName === '') {
      Alert.alert('', 'Please input your feed name.', [
        {text: 'Close'},
      ]);
      return;
    }

    const {
      id, 
      tags,
      files,
    } = this.props.feedo.currentFeed;
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
      if (error === null) {
        let type = 'FILE';
        const mimeType = mime.lookup(response.uri);
        if (mimeType.indexOf('image') !== -1 || mimeType.indexOf('video') !== -1) {
          type = 'MEDIA';
        }
        this.uploadFile(response, type);
      }      
    });
    return;
  }
  
  onOpenActionSheet() {
    this.leaveActionSheetRef.show();
    return;
  }

  onTapLeaveActionSheet(index) {
    if (index === 1) {
      if (!this.props.selectedFeedId) {
        this.props.deleteDraftFeed(this.props.feedo.currentFeed.id)
      } else {
        this.onClose(this.props.feedo.currentFeed);
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

  onChangeNote(value) {
    this.setState({comments: value});
  }
  
  uploadFile(file, type) {
    this.selectedFile = file.uri;
    this.selectedFileMimeType = mime.lookup(file.uri);
    this.selectedFileName = file.fileName;
    this.selectedFileType = type;
    if (this.props.feedo.currentFeed.id) {
      this.props.getFileUploadUrl(this.props.feedo.currentFeed.id);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (!response.fileName) {
          response.fileName = response.uri.replace(/^.*[\\\/]/, '')
        }
        this.uploadFile(response, 'MEDIA');
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        this.uploadFile(response, 'MEDIA');
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
        if (response === 'authorized') {
          this.pickMediaFromCamera(options);
        } else if (response === 'undetermined') {
          Permissions.request('camera').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromCamera(options);
            }
          });
        } else {
          Permissions.openSettings();
        }
      });
    } else if (index === 1) {
      // from library
      Permissions.check('photo').then(response => {
        if (response === 'authorized') {
          this.pickMediaFromLibrary(options);
        } else if (response === 'undetermined') {
          Permissions.request('photo').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromLibrary(options);
            }
          });
        } else {
          Permissions.openSettings();
        }
      });
    }
  }

  onRemoveFile(fileId) {
    const {
      id,
    } = this.props.feedo.currentFeed;
    this.props.deleteFile(id, fileId);
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
          onPress={this.onUpdate.bind(this)}
        >
          <Text style={styles.textButton}>{this.props.selectedFeedId ? 'Save' : 'Create'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  get renderImages() {
    const {
      files
    } = this.props.feedo.currentFeed;
    const imageFiles = _.filter(files, file => file.fileType === 'MEDIA');
    if (imageFiles.length > 0) {
      return (
        <ImageList 
          files={imageFiles}
          onRemove={(fileId) => this.onRemoveFile(fileId)}
        />
      )
    }
  }

  get renderDocuments() {
    const {
      files
    } = this.props.feedo.currentFeed;
    const documentFiles = _.filter(files, file => file.fileType === 'FILE');
    if (documentFiles.length > 0) {
      return (
        <DocumentList 
          files={documentFiles}
          onRemove={(fileId) => this.onRemoveFile(fileId)}
        />
      )
    }
  }

  onScrollNote(event) {
    console.log(event.nativeEvent.contentOffset);
  }

  get renderCenterContent() {
    return (
      <ScrollView 
        ref={ref => this.scrollViewMainContentRef = ref}
        style={styles.mainContentContainer}
      >
        <TextInput 
          ref={ref => this.textInputFeedNameRef = ref}
          style={styles.textInputFeedName}
          placeholder='Name your feed'
          underlineColorAndroid='transparent'
          value={this.state.feedName}
          onChangeText={(value) => this.setState({feedName: value})}
        />
        <TextInput
          ref={ref => this.textInputFeedNoteRef = ref}
          style={styles.textInputNote}
          placeholder='Add a note'
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.comments}
          onChangeText={(value) => this.onChangeNote(value)}
        />
        <Tags
          tags={this.props.feedo.currentFeed.tags}
          readonly={true}
          onPressTag={(index, tag) => this.onOpenCreationTag()}
          containerStyle={{
            marginHorizontal: 20,
            marginVertical: 8,
          }}
          inputStyle={{
            backgroundColor: 'white',
          }}
          tagContainerStyle={{
            backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND,
          }}
          tagTextStyle={{
            color: COLORS.DARK_ORANGE,
            fontSize: 16,
          }}
        />
        {this.renderImages}
        {this.renderDocuments}
      </ScrollView>
    );
  }

  get renderBottomContent() {
    return (
      <View style={styles.bottomContainer}>
        {/*
        <TouchableOpacity
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertLink.bind(this)}
        >
          <Octicons name="zap" size={20} color={COLORS.PURPLE} />
        </TouchableOpacity>
        */}
        <TouchableOpacity
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onAddMedia.bind(this)}
        >
          <Entypo name="image" size={20} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onAddDocument.bind(this)}
        >
          <Entypo name="attachment" style={styles.attachment} size={20} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  get renderFeed() {
    const animatedMove  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_HEIGHT, 0],
    });
    
    return (
      <Animated.View 
        style={[
          styles.feedContainer, {
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
        <Animated.View 
          style={[
            styles.contentContainer, 
            {
              paddingBottom: this.animatedKeyboardHeight,
              height: CONSTANTS.SCREEN_HEIGHT - ScreenVerticalMinMargin * 2,
            },
          ]}
        >
          {this.renderTopContent}
          {this.renderCenterContent}
          {this.renderBottomContent}
        </Animated.View>
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
          ref={ref => this.leaveActionSheetRef = ref}
          title='Are you sure that you wish to leave?'
          options={['Continue editing', this.props.selectedFeedId ? 'Close and discard' : 'Leave and discard', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapLeaveActionSheet(index)}
        />
        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          title='Select a Photo / Video'
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          // destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
      </View>
    );
  }
}


NewFeedScreen.defaultProps = {
  type: 'update',
  feedo: {},
  selectedFeedId: null,
  onClose: () => {},
}


NewFeedScreen.propTypes = {
  type: PropTypes.string,
  feedo: PropTypes.object,
  selectedFeedId: PropTypes.string,
  onClose: PropTypes.func,
}


const mapStateToProps = ({ feedo }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, comments, tags, files) => dispatch(updateFeed(id, name, comments, tags, files)),
  deleteDraftFeed: (id) => dispatch(deleteDraftFeed(id)),
  getFileUploadUrl: (id) => dispatch(getFileUploadUrl(id)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (feedId, fileType, contentType, name, objectKey) => dispatch(addFile(feedId, fileType, contentType, name, objectKey)),
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
  getFeedDetail: feedId => dispatch(getFeedDetail(feedId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewFeedScreen)