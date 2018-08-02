import React from 'react'
import {
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types';
import { filter } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { 
  createCard,
  updateCard,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
} from '../../redux/card/actions'
import * as types from '../../redux/card/types'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import NewFeedImage from '../../components/NewFeedImageComponent';
import NewFeedDocument from '../../components/NewFeedDocumentComponent';

const FeedId = 'f7372968-0368-43e4-932a-8c5ccfe45a8b';


class NewCardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardTitle: '',
      idea: '',
      loading: false,
    };

    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;

    this.animatedShow = new Animated.Value(0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('NewCardScreen UNSAFE_componentWillReceiveProps : ', nextProps.card);
    let loading = false;
    if (this.props.card.status !== types.CREATE_CARD_PENDING && nextProps.card.status === types.CREATE_CARD_PENDING) {
      // creating a card
      loading = true;
    } else if (this.props.card.status !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.card.status === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.card.status !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.card.status === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileName, this.selectedFileMimeType);
    } else if (this.props.card.status !== types.UPLOAD_FILE_PENDING && nextProps.card.status === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.card.status !== types.UPLOAD_FILE_FULFILLED && nextProps.card.status === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      let {
        id, 
      } = this.props.card.currentCard;
      const {
        objectKey,
        accessUrl,
      } = this.props.card.fileUploadUrl;
      this.props.addFile(id, this.selectedFileType, this.selectedFileMimeType, this.selectedFileName, objectKey, accessUrl);
    } else if (this.props.card.status !== types.ADD_FILE_PENDING && nextProps.card.status === types.ADD_FILE_PENDING) {
      // adding a file
      loading = true;
    } else if (this.props.card.status !== types.ADD_FILE_FULFILLED && nextProps.card.status === types.ADD_FILE_FULFILLED) {
      // success in adding a file
    } else if (this.props.card.status !== types.UPDATE_CARD_PENDING && nextProps.card.status === types.UPDATE_CARD_PENDING) {
      // updating a card
      loading = true;
    } else if (this.props.card.status !== types.UPDATE_CARD_FULFILLED && nextProps.card.status === types.UPDATE_CARD_FULFILLED) {
      // success in updating a card
      this.onClose();
    } else if (this.props.card.status !== types.DELETE_FILE_PENDING && nextProps.card.status === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.card.status !== types.DELETE_FILE_FULFILLED && nextProps.card.status === types.DELETE_FILE_FULFILLED) {
      // success in deleting a file
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (nextProps.card.error) {
      let error = null;
      if (nextProps.card.error.error) {
        error = nextProps.card.error.error;
      } else {
        error = nextProps.card.error.message;
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
      this.props.createCard(this.props.feedo.currentFeed.id);
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
    if (this.state.cardTitle === '') {
      Alert.alert('', 'Please input a card title.', [
        {text: 'Close'},
      ]);
      return;
    }

    const {
      id, 
      files,
    } = this.props.card.currentCard;
    this.props.updateCard(this.props.feedo.currentFeed.id, id, this.state.cardTitle, this.state.idea, files);
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
  
  onHideKeyboard() {
    Keyboard.dismiss();
  }

  onTapOutsideCard() {
    this.onUpdate();
    return;
  }

  uploadFile(file, type) {
    this.selectedFile = file.uri;
    this.selectedFileMimeType = mime.lookup(file.uri);
    this.selectedFileName = file.fileName;
    this.selectedFileType = type;
    if (this.props.card.currentCard.id) {
      this.props.getFileUploadUrl(this.props.feedo.currentFeed.id, this.props.card.currentCard.id);
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

  onRemoveImage(fileId) {
    const {
      id,
    } = this.props.card.currentCard;
    this.props.deleteFile(id, fileId);
  }

  get renderImages() {
    const {
      files
    } = this.props.card.currentCard;
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
    } = this.props.card.currentCard;
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
          style={styles.textInputCardName}
          placeholder='Type a title or paste a link'
          underlineColorAndroid='transparent'
          value={this.state.cardTitle}
          onChangeText={(value) => this.setState({cardTitle: value})}
        />
        <TextInput 
          style={styles.textInputNote}
          placeholder='Note'
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.idea}
          onChangeText={(value) => this.setState({idea: value})}
        />
        {this.renderImages}
        {this.renderDocuments}
      </View>
    );
  }

  get renderBottomContent() {
    return (
      <View style={styles.bottomContainer}>
        <View style={{flexDirection: 'row',}}>
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
        <TouchableOpacity 
          style={[
            styles.bottomItemContainer, 
            {
              backgroundColor: COLORS.PURPLE,
              borderRadius: 8,
              marginRight: 0,
            },
          ]}
          activeOpacity={0.6}
          onPress={this.onHideKeyboard.bind(this)}
        >
          <MaterialCommunityIcons name="keyboard-close" size={20} color={'#fff'} />
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
          styles.cardContainer,
          {
            top: animatedMove,
            opacity: this.animatedShow,
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.backdropContainer}
          activeOpacity={1}
          onPress={this.onTapOutsideCard.bind(this)}
        />
        <View style={styles.contentContainer}>
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
          onPress={this.onTapOutsideCard.bind(this)}
        />
        {this.state.loading && <LoadingScreen />}
      </Animated.View>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderFeed}
        <ActionSheet
          ref={o => this.imagePickerActionSheetRef = o}
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


NewCardScreen.defaultProps = {
  card: {},
  onClose: () => {},
}


NewCardScreen.propTypes = {
  card: PropTypes.object,
  onClose: PropTypes.func,
}


const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
  createCard: (huntId) => dispatch(createCard(huntId)),
  updateCard: (huntId, ideaId, title, idea, files) => dispatch(updateCard(huntId, ideaId, title, idea, files)),
  getFileUploadUrl: (huntId, ideaId) => dispatch(getFileUploadUrl(huntId, ideaId)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (ideaId, fileType, contentType, name, objectKey, accessUrl) => dispatch(addFile(ideaId, fileType, contentType, name, objectKey, accessUrl)),
  deleteFile: (ideaId, fileId) => dispatch(deleteFile(ideaId, fileId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewCardScreen)