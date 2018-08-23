import React from 'react'
import {
  SafeAreaView,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
  Text,
  Image,
  Clipboard,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import UserAvatar from 'react-native-user-avatar'
import validUrl from 'valid-url';
import Modal from 'react-native-modal';


import { 
  createCard,
  getCard,
  updateCard,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
  getOpenGraph,
  setCoverImage,
} from '../../redux/card/actions'
import * as types from '../../redux/card/types'
import { getDurationFromNow } from '../../service/dateUtils'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import ImageList from '../../components/ImageListComponent';
import DocumentList from '../../components/DocumentListComponent';
import WebMetaList from '../../components/WebMetaListComponent';
import LikeComponent from '../../components/LikeComponent';
import CommentComponent from '../../components/CommentComponent';
import ChooseLinkImages from '../../components/chooseLinkImagesComponent';

const ScreenVerticalMargin = 100;


class NewCardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardName: '',
      idea: '',
      coverImage: null,

      loading: false,
      isFullScreenCard: false,
      originalCardTopY: this.props.intialLayout.py,
      originalCardBottomY: this.props.intialLayout.py + this.props.intialLayout.height,
      isShowKeyboardButton: false,
      openGraphForLinks: [],
      isVisibleChooseLinkImagesModal: false,
    };

    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;

    this.isOpenGraphForNewCard = false;
    this.urlForNewCard = '';

    this.allLinkImages = [];
    this.selectedLinkImages = [];
    this.currentSelectedLinkImageIndex = 0;


    this.openGraphIndex = 0;
    this.linksForOpenGraph = [];
    this.openGraphForLinks = [];

    this.animatedShow = new Animated.Value(0);
    this.scrollViewLayoutHeight = 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('NewCardScreen UNSAFE_componentWillReceiveProps : ', nextProps.card);
    let loading = false;
    if (this.props.card.loading !== types.CREATE_CARD_PENDING && nextProps.card.loading === types.CREATE_CARD_PENDING) {
      loading = true;
    } else if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileName, this.selectedFileMimeType);
    } else if (this.props.card.loading !== types.UPLOAD_FILE_PENDING && nextProps.card.loading === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.card.loading !== types.UPLOAD_FILE_FULFILLED && nextProps.card.loading === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      let {
        id, 
      } = this.props.card.currentCard;
      const {
        objectKey,
      } = this.props.card.fileUploadUrl;
      this.props.addFile(id, this.selectedFileType, this.selectedFileMimeType, this.selectedFileName, objectKey);
    } else if (this.props.card.loading !== types.ADD_FILE_PENDING && nextProps.card.loading === types.ADD_FILE_PENDING) {
      // adding a file
      loading = true;
    } else if (this.props.card.loading !== types.ADD_FILE_FULFILLED && nextProps.card.loading === types.ADD_FILE_FULFILLED) {
      // success in adding a file
      const newImageFiles = _.filter(nextProps.card.currentCard.files, file => file.contentType.indexOf('image') !== -1);
      if (newImageFiles.length === 1 && !nextProps.card.currentCard.coverImage) {
        loading = true;
        this.onSetCoverImage(newImageFiles[0].id);
      } else {
        this.currentSelectedLinkImageIndex ++;
        if (this.currentSelectedLinkImageIndex < this.selectedLinkImages.length) {
          this.addLinkImage(this.selectedLinkImages[this.currentSelectedLinkImageIndex]);
        }
      }
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_PENDING && nextProps.card.loading === types.SET_COVER_IMAGE_PENDING) {
      // setting a file as cover image
      loading = true;
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_FULFILLED && nextProps.card.loading === types.SET_COVER_IMAGE_FULFILLED) {
      this.setState({
        coverImage: nextProps.card.currentCard.coverImage,
      });
      // success in setting a file as cover image
    } else if (this.props.card.loading !== types.UPDATE_CARD_PENDING && nextProps.card.loading === types.UPDATE_CARD_PENDING) {
      // updating a card
      loading = true;
    } else if (this.props.card.loading !== types.UPDATE_CARD_FULFILLED && nextProps.card.loading === types.UPDATE_CARD_FULFILLED) {
      // success in updating a card
      this.onClose();
    } else if (this.props.card.loading !== types.DELETE_FILE_PENDING && nextProps.card.loading === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.card.loading !== types.DELETE_FILE_FULFILLED && nextProps.card.loading === types.DELETE_FILE_FULFILLED) {
      // success in deleting a file
      this.setState({
        coverImage: nextProps.card.currentCard.coverImage,
      });
    } else if (this.props.card.loading !== types.GET_OPEN_GRAPH_PENDING && nextProps.card.loading === types.GET_OPEN_GRAPH_PENDING) {
      // getting open graph
      loading = true;
    } else if (this.props.card.loading !== types.GET_OPEN_GRAPH_FULFILLED && nextProps.card.loading === types.GET_OPEN_GRAPH_FULFILLED) {
      // success in getting open graph
      if (this.isOpenGraphForNewCard) {
        this.setState({
          cardName: nextProps.card.currentOpneGraph.title,
          idea: nextProps.card.currentOpneGraph.description + '\n' + this.urlForNewCard,
          coverImage: nextProps.card.currentOpneGraph.image,
        });
        if (nextProps.card.currentOpneGraph.image) {
          loading = true;
          this.addLinkImage(nextProps.card.currentOpneGraph.image);
        } 
        this.allLinkImages = nextProps.card.currentOpneGraph.images;
        if (this.allLinkImages.length > 0) {
          this.setState({
            isVisibleChooseLinkImagesModal: true,
          });
        }
      } else {
        this.openGraphForLinks.push({
          url: this.linksForOpenGraph[this.openGraphIndex++],
          title: nextProps.card.currentOpneGraph.title,
          description: nextProps.card.currentOpneGraph.description,
          image: nextProps.card.currentOpneGraph.image
        });

        if (this.openGraphIndex >= this.linksForOpenGraph.length) {
          this.setState({
            openGraphForLinks: this.openGraphForLinks,
          });
        } else {
          loading = true;
          this.props.getOpenGraph(this.linksForOpenGraph[this.openGraphIndex]);
        }
      }
    } else if (this.props.card.loading !== types.LIKE_CARD_PENDING && nextProps.card.loading === types.LIKE_CARD_PENDING) {
      // liking a card
      loading = true;
    } else if (this.props.card.loading !== types.LIKE_CARD_FULFILLED && nextProps.card.loading === types.LIKE_CARD_FULFILLED) {
      // success in liking a card
    } else if (this.props.card.loading !== types.UNLIKE_CARD_PENDING && nextProps.card.loading === types.UNLIKE_CARD_PENDING) {
      // unliking a card
      loading = true;
    } else if (this.props.card.loading !== types.UNLIKE_CARD_FULFILLED && nextProps.card.loading === types.UNLIKE_CARD_FULFILLED) {
      // success in unliking a card
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
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_VIEW || viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({
        cardName: this.props.card.currentCard.title,
        idea: this.props.card.currentCard.idea,
        coverImage: this.props.card.currentCard.coverImage,
      });
    }

    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      if (viewMode === CONSTANTS.CARD_NEW) {
        this.props.createCard(this.props.feedo.currentFeed.id);
      }
    });
  }

  onClose() {
    this.setState({
      originalCardTopY: this.props.intialLayout.py,
      originalCardBottomY: this.props.intialLayout.py + this.props.intialLayout.height,
    }, () => {
      this.animatedShow.setValue(1);
      Animated.timing(this.animatedShow, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS + 200,
      }).start();
      if (this.props.onClose) {
        this.props.onClose();
      }
    });
  }

  onUpdate() {
    const {
      id, 
      files,
    } = this.props.card.currentCard;

    let cardName = this.state.cardName;
    if (cardName === '') {
      cardName = 'New Card';
    }
    this.props.updateCard(this.props.feedo.currentFeed.id, id, cardName, this.state.idea, this.state.coverImage, files);
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
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW) {
      if (this.checkUrl(this.state.cardName) || this.checkUrl(this.state.idea)) {
        return;
      }
    }
    if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT) {
      this.onUpdate();
      return;
    }
    this.onClose();
    return;
  }

  onPressMoreActions() {
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

  onRemoveFile(fileId) {
    const {
      id,
    } = this.props.card.currentCard;
    this.props.deleteFile(id, fileId);
  }

  onSetCoverImage(fileId) {
    this.props.setCoverImage(this.props.card.currentCard.id, fileId);
  }

  checkUrl(content) {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW) {
      const texts = content.split(/[, ]/);
      if (texts.length === 1 && validUrl.isUri(texts[0])) {
        this.isOpenGraphForNewCard = true;
        this.urlForNewCard = texts[0];
        this.props.getOpenGraph(texts[0]);
        return true;
      }
    }
    return false;
  }

  async onChangeTitle(text) {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW) {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent === text) {
        if (this.checkUrl(text)) {
          return;
        }
      }
    }
    this.setState({cardName: text});
  }
  
  onKeyPressTitle(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.checkUrl(this.state.cardName);
    }
  }
  
  async onChangeIdea(text) {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW) {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent === text) {
        if (this.checkUrl(text)) {
          return;
        }
      }
    }
    this.setState({idea: text});
  }

  onKeyPressIdea(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.checkUrl(this.state.idea);
    }
  }

  onFocus() {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({
        isShowKeyboardButton: true,
      });
    }
  }

  onBlurTitle() {
    this.setState({
      isShowKeyboardButton: false,
    });
    this.checkUrl(this.state.cardName);
  }

  onBlurIdea() {
    this.setState({
      isShowKeyboardButton: false,
    });
    this.checkUrl(this.state.idea);
    // const urls = this.state.idea.match(/\bhttps?:\/\/\S+/gi);
    // if (urls) {
    //   this.isOpenGraphForNewCard = false;
    //   this.openGraphIndex = 0;
    //   this.openGraphForLinks = [];
    //   this.linksForOpenGraph = urls;
    //   this.props.getOpenGraph(this.linksForOpenGraph[this.openGraphIndex]);
    // }
  }

  onShowLikes(likes) {
    if (likes > 0) {
      Actions.LikesListScreen({idea: this.props.card.currentCard});
    }
  }

  onCloseLinkImages() {
    this.setState({
      isVisibleChooseLinkImagesModal: false,
    });
  }

  onSaveLinkImages(selectedImages) {
    this.onCloseLinkImages();
    this.selectedLinkImages = selectedImages;
    this.currentSelectedLinkImageIndex = 0;
    if (this.selectedLinkImages.length > 0) {
      this.addLinkImage(this.selectedLinkImages[this.currentSelectedLinkImageIndex]);
    }
  }

  onSelectCoverImage() {
  }

  addLinkImage(imageUrl) {
    const {
      id, 
    } = this.props.card.currentCard;
    const mimeType = mime.lookup(imageUrl);
    const filename = imageUrl.replace(/^.*[\\\/]/, '')
    this.props.addFile(id, 'MEDIA', mimeType, filename, imageUrl);
  }

  getLikedText(likes) {
      let text = ''

      if (likes === 1) {
        text = likes + ' person liked'
      }
      else if (likes > 0) {
        text = likes + ' people liked'
      }

      return text
  }

  get renderCoverImage() {
    if (this.state.coverImage) {
      return (
        <Image style={styles.imageCover} source={{ uri: this.state.coverImage }} resizeMode="cover" />
      );
    }
    const imageFiles = _.filter(this.props.card.currentCard.files, file => file.contentType.indexOf('image') !== -1);
    if (imageFiles.length > 0) {
      return (
        <View style={styles.coverImageSelectContainer}>
          <TouchableOpacity
            style={styles.coverImageSelectButtonWrapper}
            activeOpacity={0.6}
            onPress={() => this.onSelectCoverImage()}
          >
            <Text style={styles.textSelectButton}>Select cover image</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  get renderWebMeta() {
    const { viewMode } = this.props;
    const { openGraphForLinks } = this.state;
    if (openGraphForLinks.length > 0) {
      return (
        <WebMetaList 
          links={openGraphForLinks}
          editable={viewMode !== CONSTANTS.CARD_VIEW}
        />
      )
    }
  }

  get renderImages() {
    const { viewMode } = this.props;
    const {
      files
    } = this.props.card.currentCard;
    const imageFiles = _.filter(files, file => file.fileType === 'MEDIA');
    if (imageFiles.length > 0) {
      return (
        <ImageList 
          files={imageFiles}
          editable={viewMode !== CONSTANTS.CARD_VIEW}
          isSetCoverImage={true}
          onRemove={(fileId) => this.onRemoveFile(fileId)}
          onSetCoverImage={(fileId) => this.onSetCoverImage(fileId)}
        />
      )
    }
  }

  get renderDocuments() {
    const { viewMode } = this.props;
    const {
      files
    } = this.props.card.currentCard;
    const documentFiles = _.filter(files, file => file.fileType === 'FILE');
    if (documentFiles.length > 0) {
      return (
        <DocumentList
          files={documentFiles}
          editable={viewMode !== CONSTANTS.CARD_VIEW}
          onRemove={(fileId) => this.onRemoveFile(fileId)}
        />
      )
    }
  }

  get renderMainContent() {
    const { viewMode } = this.props;
    return (
      <View style={styles.mainContentContainer}>
        <TextInput 
          style={styles.textInputCardTitle}
          editable={viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT}
          placeholder='Add a name or link here’'
          underlineColorAndroid='transparent'
          value={this.state.cardName}
          onChangeText={(value) => this.onChangeTitle(value)}
          onKeyPress={this.onKeyPressTitle.bind(this)}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlurTitle()}
        />
        {this.renderCoverImage}
        <TextInput 
          style={styles.textInputIdea}
          editable={viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT}
          placeholder='Add a note'
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.idea}
          onChangeText={(value) => this.onChangeIdea(value)}
          onKeyPress={this.onKeyPressIdea.bind(this)}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlurIdea()}
        />
        {this.renderWebMeta}
        {this.renderImages}
        {this.renderDocuments}
      </View>
    );
  }

  get renderAttachmentButtons() {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_VIEW) {
      return;
    }

    return (
      <View style={styles.attachmentButtonsContainer}>
        <View style={{flexDirection: 'row',}}>
          <TouchableOpacity 
            style={styles.buttonItemContainer}
            activeOpacity={0.6}
            onPress={this.onAddMedia.bind(this)}
          >
            <Entypo name="image" size={20} color={COLORS.PURPLE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buttonItemContainer}
            activeOpacity={0.6}
            onPress={this.onAddDocument.bind(this)}
          >
            <Entypo name="attachment" style={styles.attachment} size={20} color={COLORS.PURPLE} />
          </TouchableOpacity>
        </View>
        {
          this.state.isShowKeyboardButton && 
            <TouchableOpacity 
              style={[
                styles.buttonItemContainer, 
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
        }
      </View>
    );
  }

  get renderInvitee() {
    const {
      firstName,
      lastName,
      imageUrl,
    } = this.props.invitee.userProfile;
    const name = `${firstName} ${lastName}`;
    return (
      <View>
        <View style={styles.line} />
        <View style={[styles.rowContainer, {marginHorizontal: 22}]}>
          <UserAvatar
            size="24"
            name={name}
            color="#000"
            textColor="#fff"
            src={imageUrl}
          />
          <Text style={[styles.textInvitee, {marginLeft: 9}]}>{name}</Text>
          <Entypo name="dot-single" style={styles.iconDot} />
          <Text style={styles.textInvitee}>{getDurationFromNow(this.props.card.currentCard.publishedDate)}</Text>
        </View>
      </View>
    );
  }

  get renderLikes() {
    const {
      likes,
    } = this.props.card.currentCard.metadata;
    return (
      <View>
        <View style={styles.line} />
        <View style={[styles.rowContainer, {justifyContent: 'space-between', marginHorizontal: 22}]}>
          <TouchableOpacity
            style={{paddingVertical: 3,}}
            activeOpacity={0.7}
            onPress={() => this.onShowLikes(likes)}
          >
            <Text style={styles.textInvitee}>{this.getLikedText(likes)}</Text>
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <LikeComponent idea={this.props.card.currentCard} />
            <CommentComponent idea={this.props.card.currentCard} />
          </View>
        </View>
      </View>
    );
  }

  get renderHeader() {
    if (this.state.isFullScreenCard) {
      return (
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.onTapOutsideCard()}
          >
            <MaterialCommunityIcons name="close" size={28} color={COLORS.PURPLE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.threeDotButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.onPressMoreActions()}
          >
            <Entypo name="dots-three-horizontal" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      );
    }
  }

  get renderOutside() {
    if (!this.state.isFullScreenCard) {
      return (
        <TouchableOpacity 
          style={styles.backdropContainer}
          activeOpacity={1}
          onPress={this.onTapOutsideCard.bind(this)}
        />
      );
    }
  }

  get renderOutsideMoreActions() {
    if (!this.state.isFullScreenCard) {
      return (
        <View style={styles.outSideMoreActionContainer}>
          <TouchableOpacity 
            style={styles.threeDotButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.onPressMoreActions()}
          >
            <Entypo name="dots-three-horizontal" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      );
    }

  }

  get renderBottomContent() {
    const { viewMode } = this.props;
    if (viewMode !== CONSTANTS.CARD_NEW) {
      return (
        <View>
          {this.renderInvitee}
          {this.renderLikes}
        </View>
      );
    }
  }

  onScrollBeginDrag(e) {
    this.scrollViewLayoutHeight = 0;
  }

  onScroll(e) {
    const { viewMode } = this.props;
    const currentOffsetY = e.nativeEvent.contentOffset.y;
    if (viewMode !== CONSTANTS.CARD_NEW && !this.state.isFullScreenCard && this.scrollViewLayoutHeight === 0 && currentOffsetY > 10) {
      this.scrollViewLayoutHeight = e.nativeEvent.layoutMeasurement.height;
      this.setState({
        isFullScreenCard: true,
        originalCardTopY: ScreenVerticalMargin,
        originalCardBottomY: ScreenVerticalMargin,
      }, () => {
        this.animatedShow.setValue(0);
        Animated.timing(this.animatedShow, {
          toValue: 1,
          duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
        }).start();
      });
    }
  }

  get renderCard() {
    const { viewMode } = this.props;
    let cardStyle = {};
    if (viewMode === CONSTANTS.CARD_NEW) {
      const animatedMove  = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [CONSTANTS.SCREEN_HEIGHT, ScreenVerticalMargin],
      });  
      cardStyle = {
        top: animatedMove,
        bottom: ScreenVerticalMargin,
        opacity: this.animatedShow,
      };
    } else if (!this.state.isFullScreenCard) {
      const animatedTopMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardTopY, ScreenVerticalMargin],
      });
      const animatedBottomMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardBottomY, ScreenVerticalMargin],
      });
      cardStyle = {
        top: animatedTopMove,
        bottom: animatedBottomMove,
        opacity: this.animatedShow,
      };
    } else {
      const animatedTopMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardTopY, 0],
      });
      const animatedBottomMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardBottomY, 0],
      });
      cardStyle = {
        top: animatedTopMove,
        bottom: animatedBottomMove,
      };
    }

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          cardStyle,
        ]}
      >
        {this.renderOutside}
        <View 
          style={[
            styles.contentContainer,
            (viewMode === CONSTANTS.CARD_NEW || !this.state.isFullScreenCard) && {maxHeight: CONSTANTS.SCREEN_HEIGHT - ScreenVerticalMargin * 2},
            this.state.isFullScreenCard && {flex: 1, borderRadius: 0},
          ]}
        >
          {this.renderHeader}
          <KeyboardAwareScrollView
            enableAutomaticScroll={false}
            onScrollBeginDrag={(e) => this.onScrollBeginDrag(e)}
            onScroll={(e) => this.onScroll(e)}
          >
            {this.renderMainContent}
            {this.renderAttachmentButtons}
          </KeyboardAwareScrollView>
          {this.renderBottomContent}
        </View>
        {this.renderOutside}
      </Animated.View>
    );
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.backdropContainer}
          activeOpacity={1}
          onPress={this.onTapOutsideCard.bind(this)}
        />
        {this.renderOutsideMoreActions}
        {this.renderCard}
        <TouchableOpacity 
          style={styles.backdropContainer}
          activeOpacity={1}
          onPress={this.onTapOutsideCard.bind(this)}
        />
        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          title='Select a Photo / Video'
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
        {this.state.loading && <LoadingScreen />}
        <Modal 
          style={{margin: 0}}
          isVisible={this.state.isVisibleChooseLinkImagesModal}
        >
          <ChooseLinkImages
            images={this.allLinkImages}
            onClose={this.onCloseLinkImages.bind(this)}
            onSave={this.onSaveLinkImages.bind(this)}
          />
        </Modal>
      </SafeAreaView>
    );
  }
}


NewCardScreen.defaultProps = {
  card: {},
  invitee: {},
  intialLayout: {},
  viewMode: CONSTANTS.CARD_NEW,
  onClose: () => {},
}


NewCardScreen.propTypes = {
  card: PropTypes.object,
  invitee: PropTypes.object,
  intialLayout: PropTypes.object,
  onClose: PropTypes.func,
  viewMode: PropTypes.number,
}


const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
  createCard: (huntId) => dispatch(createCard(huntId)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  updateCard: (huntId, ideaId, title, idea, coverImage, files) => dispatch(updateCard(huntId, ideaId, title, idea, coverImage, files)),
  getFileUploadUrl: (huntId, ideaId) => dispatch(getFileUploadUrl(huntId, ideaId)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (ideaId, fileType, contentType, name, objectKey) => dispatch(addFile(ideaId, fileType, contentType, name, objectKey)),
  deleteFile: (ideaId, fileId) => dispatch(deleteFile(ideaId, fileId)),
  setCoverImage: (ideaId, fileId) => dispatch(setCoverImage(ideaId, fileId)),
  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewCardScreen)