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
  Image,
  SafeAreaView,
  AsyncStorage,
  Platform,
  BackHandler,
  ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Tags from '../../components/TagComponent'
import ActionSheet from 'react-native-actionsheet'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import _ from 'lodash'
import DeviceInfo from 'react-native-device-info';

import { 
  createFeed,
  updateFeed,
  deleteDraftFeed,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
  setCurrentFeed
} from '../../redux/feedo/actions'
import * as types from '../../redux/feedo/types'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
import LoadingScreen from '../LoadingScreen'
import ImageList from '../../components/ImageListComponent'
import DocumentList from '../../components/DocumentListComponent'
import TagCreateScreen from '../TagCreateScreen'
import { TAGS_FEATURE } from '../../service/api'
import Analytics from '../../lib/firebase'
import pubnub from '../../lib/pubnub'
import AlertController from '../../components/AlertController'

// const ATTACHMENT_ICON = require('../../../assets/images/Attachment/Blue.png')
// const IMAGE_ICON = require('../../../assets/images/Image/Blue.png')
const TAG_ICON = require('../../../assets/images/Tag/Blue.png')

const NewFeedMode = 1;
const TagCreateMode = 2;

class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: '',
      comments: '',
      loading: false,
      currentScreen: NewFeedMode,
      isKeyboardShow: false,
      lastCursorPos: 0,
      feedData: {}
    };
    
    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;
    
    this.isVisibleErrorDialog = false;

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
    this.animatedTagTransition = new Animated.Value(1);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.initFeedName !== '' && this.state.feedName !== nextProps.initFeedName) {
      this.setState({ feedName: nextProps.initFeedName })
    }

    let loading = false;
    if (this.props.feedo.loading !== types.CREATE_FEED_PENDING && nextProps.feedo.loading === types.CREATE_FEED_PENDING) {
      // creating a feed
      // loading = true;
    } else if (this.props.feedo.loading !== types.CREATE_FEED_FULFILLED && nextProps.feedo.loading === types.CREATE_FEED_FULFILLED) {
      if (this.props.feedoMode !== CONSTANTS.SHARE_EXTENTION_FEEDO) {
        const data = {
          userId: nextProps.user.userInfo.id,
          state: 'true'
        }
        AsyncStorage.setItem('BubbleFeedFirstTimeCreated', JSON.stringify(data));
      }
      this.setState({
        feedData: nextProps.feedo.currentFeed
      })
    } else if (this.props.feedo.loading !== types.DELETE_FEED_PENDING && nextProps.feedo.loading === types.DELETE_FEED_PENDING) {
      // deleting a feed
      // loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FEED_FULFILLED && nextProps.feedo.loading === types.DELETE_FEED_FULFILLED) {
      // success in deleting a feed
      this.props.setCurrentFeed({});
      this.onClose(null);
      return;
    } else if (this.props.feedo.loading !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.feedo.loading === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.feedo.loading !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.feedo.loading === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      if (this.selectedFile) {
        // Image resizing...
        const fileType = (Platform.OS === 'ios') ? this.selectedFileMimeType : this.selectedFile.type;
        if (fileType && fileType.indexOf('image/') !== -1) {
          const width = Math.round(this.selectedFile.width / CONSTANTS.IMAGE_COMPRESS_DIMENSION_RATIO);
          const height = Math.round(this.selectedFile.height / CONSTANTS.IMAGE_COMPRESS_DIMENSION_RATIO)
          ImageResizer.createResizedImage(this.selectedFile.uri, width, height, CONSTANTS.IMAGE_COMPRESS_FORMAT, CONSTANTS.IMAGE_COMPRESS_QUALITY, 0, null)
            .then((response) => {
              console.log('Image compress Success!');
              this.props.uploadFileToS3(nextProps.feedo.fileUploadUrl.uploadUrl, response.uri, this.selectedFileName, fileType);
            }).catch((error) => {
              console.log('Image compress error : ', error);
              this.props.uploadFileToS3(nextProps.feedo.fileUploadUrl.uploadUrl, this.selectedFile.uri, this.selectedFileName, fileType);
            });
          return;
        }
        this.props.uploadFileToS3(nextProps.feedo.fileUploadUrl.uploadUrl, this.selectedFile.uri, this.selectedFileName, fileType);
      }
    } else if (this.props.feedo.loading !== types.UPLOAD_FILE_PENDING && nextProps.feedo.loading === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.feedo.loading !== types.UPLOAD_FILE_FULFILLED && nextProps.feedo.loading === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      let { id } = this.state.feedData;
      const { objectKey } = this.props.feedo.fileUploadUrl;
      if (this.selectedFileType) {
        const fileType = (Platform.OS === 'ios') ? this.selectedFileMimeType : this.selectedFile.type;
        this.props.addFile(id, this.selectedFileType, fileType, this.selectedFileName, objectKey);
      }
    } else if (this.props.feedo.loading !== types.ADD_FILE_PENDING && nextProps.feedo.loading === types.ADD_FILE_PENDING) {
      // adding a file
      loading = true;
    } else if (this.props.feedo.loading !== types.ADD_FILE_FULFILLED && nextProps.feedo.loading === types.ADD_FILE_FULFILLED) {
      // success in adding a file
      this.setState({
        feedData: nextProps.feedo.currentFeed
      })
    } else if (this.props.feedo.loading !== types.UPDATE_FEED_PENDING && nextProps.feedo.loading === types.UPDATE_FEED_PENDING) {
      // updating a feed
      // loading = true;
    } else if (this.props.feedo.loading !== types.UPDATE_FEED_FULFILLED && nextProps.feedo.loading === types.UPDATE_FEED_FULFILLED) {
      // success in updating a feed
      this.onClose(nextProps.feedo.currentFeed);
      if (this.props.viewMode !== CONSTANTS.FEEDO_FROM_CARD && nextProps.selectedFeedId === null) {
        Actions.FeedDetailScreen({ data: nextProps.feedo.currentFeed });
      } 
    } else if (this.props.feedo.loading !== types.DELETE_FILE_PENDING && nextProps.feedo.loading === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FILE_FULFILLED && nextProps.feedo.loading === types.DELETE_FILE_FULFILLED) {
      // success in deleting a file
      this.setState({
        feedData: nextProps.feedo.currentFeed
      })
    } else if (this.props.feedo.loading !== types.GET_FEED_DETAIL_PENDING && nextProps.feedo.loading === types.GET_FEED_DETAIL_PENDING) {
      // getting a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.GET_FEED_DETAIL_FULFILLED && nextProps.feedo.loading === types.GET_FEED_DETAIL_FULFILLED) {
      // success in getting a feed
      this.setState({
        feedData: nextProps.feedo.currentFeed,
        feedName: nextProps.feedo.currentFeed.headline,
        comments: nextProps.feedo.currentFeed.summary,
      });
    } else if (this.props.feedo.loading !== types.ADD_HUNT_TAG_FULFILLED && nextProps.feedo.loading === types.ADD_HUNT_TAG_FULFILLED) {
      // success in add tags
      this.setState({
        feedData: nextProps.feedo.currentFeed
      })
    } else if (this.props.feedo.loading !== types.REMOVE_HUNT_TAG_FULFILLED && nextProps.feedo.loading === types.REMOVE_HUNT_TAG_FULFILLED) {
      // success in delete tags
      this.setState({
        feedData: nextProps.feedo.currentFeed
      })
    }

    this.setState({ loading });

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
            AlertController.shared.showAlert('Error', error, [
              {text: 'Close', onPress: () => this.isVisibleErrorDialog = false},
            ]);
          }
        }
        return;
      }
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NewFeedScreen')

    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      if (!_.isEmpty(this.props.feedData)) {
        this.props.setCurrentFeed(this.props.feedData)
        this.setState({
          feedData: this.props.feedData,
          feedName: this.props.feedData.headline,
          comments: this.props.feedData.summary,
        });
      } else {
        this.props.createFeed();
      }
    });

    if (Platform.OS === 'ios') {
      this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
      this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    }
    else {
      this.keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this.keyboardWillShow(e));
      this.keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this.keyboardWillHide(e));
    }

    this.textInputFeedNameRef.focus();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.onOpenActionSheet()
    return true;
  }

  keyboardWillShow(e) {
    this.setState({ isKeyboardShow: true })
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }
    ).start();
  }

  keyboardWillHide(e) {
    this.setState({ isKeyboardShow: false })
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : CONSTANTS.ANIMATEION_MILLI_SECONDS,
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
      this.props.onClose({ currentFeed: data, type: this.props.selectedFeedId ? 'update' : 'create' });
    }
  }

  onUpdate() {
    Analytics.logEvent('new_feed_create_new_feed', {})

    if (this.state.feedName === '') {
      AlertController.shared.showAlert('', 'Please give your flow a name.', [{ text: 'Close' }]);
      return;
    }

    const { id, tags, files } = this.state.feedData;
    this.props.updateFeed(id, this.state.feedName, this.state.comments, tags, files);
  }

  onAddMedia() {
    Permissions.checkMultiple(['camera', 'photo']).then(response => {
      if (response.camera === 'authorized' && response.photo === 'authorized') {
        //permission already allowed
        this.imagePickerActionSheetRef.show();
      }
      else {
        Permissions.request('camera').then(response => {
          if (response === 'authorized') {
            //camera permission was authorized
            Permissions.request('photo').then(response => {
              if (response === 'authorized') {
                //photo permission was authorized
                this.imagePickerActionSheetRef.show();
              }
              else if (Platform.OS === 'ios') {
                Permissions.openSettings();
              }    
            });
          }
          else if (Platform.OS === 'ios') {
            Permissions.openSettings();
          }
        });
      }
    });
  }

  onAddDocument() {
    if (Platform.OS === 'ios') {
      this.PickerDocumentShow();
    }
    else {
      Permissions.check('storage').then(response => { //'storage' permission doesn't support on iOS
        if (response === 'authorized') {
          //permission already allowed
          this.PickerDocumentShow();
        }
        else {
          Permissions.request('storage').then(response => {
            if (response === 'authorized') {
              //storage permission was authorized
              this.PickerDocumentShow();
            }
          });
        }
      });
    }
  }

  PickerDocumentShow() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error, response) => {
      if (error === null) {
        Analytics.logEvent('new_feed_add_file', {})

        let type = 'FILE';
        const mimeType = (Platform.OS === 'ios') ? mime.lookup(response.uri) : response.type;
        if (mimeType !== false) {
          if (mimeType.indexOf('image') !== -1 || mimeType.indexOf('video') !== -1) {
            type = 'MEDIA';
          }
        }
        this.uploadFile(response, type);
      }
    });
    return;
  }
  
  onOpenActionSheet() {
    const { feedoMode } = this.props;
    if (feedoMode === CONSTANTS.SHARE_EXTENTION_FEEDO) {
      this.props.deleteDraftFeed(this.state.feedData.id)
      return;
    }
    this.leaveActionSheetRef.show();
    return;
  }

  onTapLeaveActionSheet(index) {
    if (index === 1) {
      if (!this.props.selectedFeedId) {
        this.props.deleteDraftFeed(this.state.feedData.id)
      } else {
        this.onClose(this.state.feedData);
      }
    }
  }

  onOpenCreationTag() {
    this.setState({
      currentScreen: TagCreateMode,
    }, () => {
      Analytics.logEvent('new_feed_add_tag', {})

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
    this.setState({ comments: value });
  }
  
  uploadFile(file, type) {
    this.selectedFile = file;
    
    if (_.endsWith(file.uri, '.pages')) {
      this.selectedFileMimeType = 'application/x-iwork-pages-sffpages'
    } else if (_.endsWith(file.uri, '.numbers')) {
      this.selectedFileMimeType = 'application/x-iwork-numbers-sffnumbers'
    } else if (_.endsWith(file.uri, '.key')) {
      this.selectedFileMimeType = 'application/x-iwork-keynote-sffkey'
    } else {
      this.selectedFileMimeType = (Platform.OS === 'ios') ? mime.lookup(file.uri) : file.type;
    }

    this.selectedFileName = file.fileName;
    this.selectedFileType = type;

    if (this.state.feedData.id) {
      this.props.getFileUploadUrl(this.state.feedData.id);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        Analytics.logEvent('new_feed_add_camera_image', {})

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
        Analytics.logEvent('new_feed_add_library_image', {})

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
      if (DeviceInfo.isEmulator()) {
        Alert.alert("It's impossible to take a photo on Simulator")
      } else {
        this.pickMediaFromCamera(options);
      }
    } else if (index === 1) {
      // from library
      this.pickMediaFromLibrary(options);
    }
  }

  onRemoveFile(fileId) {
    const { id } = this.state.feedData;
    this.props.deleteFile(id, fileId);
  }

  get renderHeader() {
    const { feedoMode, isNewCard } = this.props;
    if (feedoMode === CONSTANTS.SHARE_EXTENTION_FEEDO) {
      return (
        <View style={styles.extensionTopContainer}>
          <TouchableOpacity 
            style={styles.backButtonWrapper}
            activeOpacity={0.6}
            onPress={this.onOpenActionSheet.bind(this)}
          >
            <Ionicons name="ios-arrow-back" size={28} color={COLORS.PURPLE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.extensionCreateButtonWapper}
            activeOpacity={0.6}
            onPress={this.onUpdate.bind(this)}
          >
            <Text style={[styles.textButton, {color: COLORS.PURPLE}]}>Create flow</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.mainHeaderContainer}>
        <TouchableOpacity 
          style={styles.btnClose}
          activeOpacity={0.7}
          onPress={this.onOpenActionSheet.bind(this)}
        >
          <Text style={[styles.textButton, { color: COLORS.PURPLE, fontWeight: 'normal' }]}>Cancel</Text>
        </TouchableOpacity>
        {isNewCard
          ? <Text style={styles.textButton}>New flow</Text>
          : <Text style={styles.textButton}>Edit flow</Text>
        }
        {this.props.feedo.loading === types.UPDATE_FEED_PENDING
          ? <View style={[styles.btnClose, { alignItems: 'flex-end' }]}>
              <ActivityIndicator color={COLORS.PURPLE} size="small" style={styles.loadingIcon} />
            </View>
          :
            <TouchableOpacity
              style={[styles.btnClose, { alignItems: 'flex-end' }]}
              activeOpacity={0.6}
              onPress={this.onUpdate.bind(this)}
            >
              <Text style={[styles.textButton, { color: COLORS.PURPLE }]}>Done</Text>
            </TouchableOpacity>
        }
      </View>
    );
  }

  get renderImages() {
    const { files } = this.state.feedData;
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
    const { files } = this.state.feedData;
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

  inputContentChange = (event) => {
  }

  inputSelectionChange = (event) => {
    const cursorPos = event.nativeEvent.selection.start

    if (cursorPos === this.state.lastCursorPos || cursorPos > this.state.lastCursorPos) {
      this.scrollViewMainContentRef.scrollToEnd()
    }
    if (cursorPos > this.state.lastCursorPos) {
      this.setState({ lastCursorPos: cursorPos })
    }
  }

  get renderCenterContent() {
    return (
      <ScrollView 
        ref={ref => this.scrollViewMainContentRef = ref}
        contentContainerStyle={styles.mainContentContainer}
      >
        <TextInput 
          ref={ref => this.textInputFeedNameRef = ref}
          style={styles.textInputFeedName}
          placeholder='Name your flow'
          underlineColorAndroid='transparent'
          value={this.state.feedName}
          multiline
          onChangeText={(value) => this.setState({feedName: value})}
          selectionColor={Platform.OS === 'ios' ? COLORS.PURPLE : COLORS.LIGHT_PURPLE}
        />
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => this.textInputFeedNoteRef.focus()}
          activeOpacity={1.0}
        >
          <TextInput
            ref={ref => this.textInputFeedNoteRef = ref}
            style={styles.textInputNote}
            placeholder='Tap to give this flow a description'
            multiline={true}
            onContentSizeChange={this.inputContentChange}
            onSelectionChange={this.inputSelectionChange}
            underlineColorAndroid='transparent'
            value={this.state.comments}
            onChangeText={(value) => this.onChangeNote(value)}
            selectionColor={Platform.OS === 'ios' ? COLORS.PURPLE : COLORS.LIGHT_PURPLE}
          />
        </TouchableOpacity>

        {this.renderImages}

        <View style={styles.attachView}>
          {this.renderDocuments}
        </View>

        {TAGS_FEATURE && !_.isEmpty(this.state.feedData) && this.state.feedData.tags.length > 0 && (
          <Tags
            tags={this.state.feedData.tags}
            readonly={true}
            placeHolder=""
            onPressTag={(index, tag) => this.onOpenCreationTag()}
            containerStyle={{
              marginHorizontal: 16
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
        )}
      </ScrollView>
    );
  }

  onHideKeyboard() {
    Keyboard.dismiss();
  }

  get renderBottomContent() {
    const { feedoMode } = this.props;
    if (feedoMode === CONSTANTS.SHARE_EXTENTION_FEEDO) {
      return;
    }
    return (
      <View style={styles.bottomContainer}>
        <View style={styles.bottomLeftContainer}>
          {TAGS_FEATURE && (
          <TouchableOpacity
            style={styles.bottomItemContainer}
            activeOpacity={0.6}
            onPress={this.onOpenCreationTag.bind(this)}
          >
            <Image source={TAG_ICON} />
          </TouchableOpacity>
          )}
          {/* <TouchableOpacity
            style={styles.bottomItemContainer}
            activeOpacity={0.6}
            onPress={this.onAddMedia.bind(this)}
          >
            <Image source={IMAGE_ICON} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomItemContainer}
            activeOpacity={0.6}
            onPress={this.onAddDocument.bind(this)}
          >
            <Image source={ATTACHMENT_ICON} />
          </TouchableOpacity> */}
        </View>

        {Platform.OS === 'ios' && this.state.isKeyboardShow && (
          <View style={styles.bottomRightCotainer}>
            <TouchableOpacity
              style={styles.keyboardIconView}
              activeOpacity={0.6}
              onPress={this.onHideKeyboard.bind(this)}
            >
              <MaterialCommunityIcons name="keyboard-close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  get renderFeed() {
    let postion = 0;
    const { feedoMode, viewMode } = this.props;
    if (viewMode === CONSTANTS.FEEDO_FROM_MAIN || viewMode === CONSTANTS.FEEDO_FROM_COLLAPSE) {
      postion = CONSTANTS.SCREEN_HEIGHT;
    } else if (viewMode === CONSTANTS.FEEDO_FROM_CARD) {
      postion = CONSTANTS.SCREEN_WIDTH;
    }
    const animatedMove  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [postion, 0]
    });
    let contentContainerStyle = {};
    if (feedoMode === CONSTANTS.SHARE_EXTENTION_FEEDO) {
      let bottomMargin = CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN;
      if (this.state.isKeyboardShow) {
        bottomMargin = CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN / 2;
      }
      contentContainerStyle = {
        height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN  - bottomMargin, this.animatedKeyboardHeight),
        marginTop: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
        marginBottom: Animated.add(bottomMargin, this.animatedKeyboardHeight),
        borderRadius: 18,
        backgroundColor: '#fff',
        marginHorizontal: 16,
      }
    } else {
      contentContainerStyle = {
        paddingBottom: this.animatedKeyboardHeight,
        height: CONSTANTS.SCREEN_HEIGHT,
        backgroundColor: '#fff'
      }
    }

    return (
      <Animated.View 
        style={[
          styles.feedContainer,
          { opacity: this.animatedShow },
          (viewMode === CONSTANTS.FEEDO_FROM_MAIN || viewMode === CONSTANTS.FEEDO_FROM_COLLAPSE) && { top: animatedMove },
          (viewMode === CONSTANTS.FEEDO_FROM_CARD) && { left: animatedMove }
        ]}
      >
        <Animated.View style={contentContainerStyle}>
          <SafeAreaView style={styles.feedContainer}>
            {this.renderHeader}
            {this.renderCenterContent}
            {this.renderBottomContent}
          </SafeAreaView>
        </Animated.View>

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
            opacity: animatedOpacity
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
        {TAGS_FEATURE && this.renderCreateTag}
        
        <ActionSheet
          ref={ref => this.leaveActionSheetRef = ref}
          title='Are you sure you want to discard?'
          options={['Keep Editing', this.props.selectedFeedId ? 'Close' : 'Discard', 'Cancel']}
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
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
      </View>
    );
  }
}


NewFeedScreen.defaultProps = {
  feedo: {},
  feedData: {},
  selectedFeedId: null,
  viewMode: CONSTANTS.FEEDO_FROM_MAIN,
  feedoMode: CONSTANTS.MAIN_APP_FEEDO,
  onClose: () => {},
  initFeedName: '',
  isNewCard: true
}


NewFeedScreen.propTypes = {
  feedo: PropTypes.object,
  feedData: PropTypes.object,
  selectedFeedId: PropTypes.string,
  onClose: PropTypes.func,
  viewMode: PropTypes.number,
  feedoMode: PropTypes.number,
  initFeedName: PropTypes.string,
  isNewCard: PropTypes.bool
}


const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})


const mapDispatchToProps = dispatch => ({
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, comments, tags, files) => dispatch(updateFeed(id, name, comments, tags, files)),
  deleteDraftFeed: (id) => dispatch(deleteDraftFeed(id)),
  getFileUploadUrl: (id) => dispatch(getFileUploadUrl(id)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (feedId, fileType, contentType, name, objectKey) => dispatch(addFile(feedId, fileType, contentType, name, objectKey)),
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewFeedScreen)