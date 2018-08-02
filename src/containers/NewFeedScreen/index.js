import React from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('NewFeedScreen UNSAFE_componentWillReceiveProps : ', nextProps.feedo.loading, nextProps.feedo.currentFeed);
    let loading = false;
    if (this.props.feedo.loading !== types.CREATE_FEED_PENDING && nextProps.feedo.loading === types.CREATE_FEED_PENDING) {
      // creating a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FEED_PENDING && nextProps.feedo.loading === types.DELETE_FEED_PENDING) {
      // deleting a feed
      loading = true;
    } else if (this.props.feedo.loading !== types.DELETE_FEED_FULFILLED && nextProps.feedo.loading === types.DELETE_FEED_FULFILLED) {
      // success in deleting a feed
      this.onClose();
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
      this.onClose();
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

  componentDidMount() {
    console.log('NewFeedScreen called ...');

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
      if (this.props.feedo.currentFeed.id) {
        this.props.deleteDraftFeed(this.props.feedo.currentFeed.id)
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
          <Text style={styles.textButton}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onRemoveImage(fileId) {
    const {
      id,
    } = this.props.feedo.currentFeed;
    this.props.deleteFile(id, fileId);
  }

  get renderImages() {
    const {
      files
    } = this.props.feedo.currentFeed;
    const imageFiles = filter(files, file => file.fileType === 'MEDIA');
    return (
      <ImageList 
        files={imageFiles}
        onRemove={(fileId) => this.onRemoveImage(fileId)}
      />
    )
  }

  get renderDocuments() {
    const {
      files
    } = this.props.feedo.currentFeed;
    const documentFiles = filter(files, file => file.fileType === 'FILE');
    return (
      <DocumentList 
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
          tags={this.props.feedo.currentFeed.tags}
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
            backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND,
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

  get renderFeed() {
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
          <KeyboardAwareScrollView
            enableAutomaticScroll={false}
          >
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
          // destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
      </View>
    );
  }
}


NewFeedScreen.defaultProps = {
  feedo: {},
  selectedFeedId: null,
  onClose: () => {},
}


NewFeedScreen.propTypes = {
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