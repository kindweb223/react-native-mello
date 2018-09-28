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
  Clipboard,
  ScrollView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import _ from 'lodash';
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
  addLink,
  deleteLink,
  moveCard,
} from '../../redux/card/actions'
import { 
  createFeed,
  updateFeed,
  deleteDraftFeed,
} from '../../redux/feedo/actions'
import * as types from '../../redux/card/types'
import * as feedoTypes from '../../redux/feedo/types'
import { getTimestamp } from '../../service/dateUtils'
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
import UserAvatarComponent from '../../components/UserAvatarComponent';
import FastImage from "react-native-fast-image";
import CoverImagePreviewComponent from '../../components/CoverImagePreviewComponent';
import SelectHuntScreen from '../SelectHuntScreen';


const ScreenVerticalMinMargin = 80;


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
      isVisibleChooseLinkImagesModal: false,
      isVisibleSelectFeedoModal: false,
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


    this.openGraphNoteIndex = 0;
    this.addLinkIndex = 0;
    this.noteLinksForOpenGraph = [];
    this.openGraphForNoteLinks = [];

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
    this.scrollViewLayoutHeight = 0;
    this.isVisibleErrorDialog = false;

    this.parsingErrorLinks = [];

    this.draftFeedoId = null;
    this.prevFeedoId = null;
    this.isUpdateDraftCard = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('NewCardScreen UNSAFE_componentWillReceiveProps : ', nextProps.card);
    let loading = false;
    if (this.props.card.loading !== types.CREATE_CARD_PENDING && nextProps.card.loading === types.CREATE_CARD_PENDING) {
      loading = true;
    } else if (this.props.card.loading !== types.CREATE_CARD_FULFILLED && nextProps.card.loading === types.CREATE_CARD_FULFILLED) {
      if (this.props.cardMode === CONSTANTS.EXTENTION_CARD && this.props.shareUrl !== '') {
        this.setState({
          cardName: this.props.shareUrl,
        }, () => {
          this.checkUrl(this.state.cardName);
        });
      }
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
    } else if (this.props.card.loading !== types.ADD_LINK_PENDING && nextProps.card.loading === types.ADD_LINK_PENDING) {
      // adding a link
      loading = true;
    } else if (this.props.card.loading !== types.ADD_LINK_FULFILLED && nextProps.card.loading === types.ADD_LINK_FULFILLED) {
      // success in adding a link
      if (this.addLinkIndex < this.openGraphForNoteLinks.length) {
        const { id } = this.props.card.currentCard;
        const {
          url,
          title,
          description,
          image,
        } = this.openGraphForNoteLinks[this.addLinkIndex++];
        this.props.addLink(id, url, title, description, image);
      }
    } else if (this.props.card.loading !== types.DELETE_LINK_PENDING && nextProps.card.loading === types.DELETE_LINK_PENDING) {
      // deleting a link
      loading = true;
    } else if (this.props.card.loading !== types.DELETE_LINK_FULFILLED && nextProps.card.loading === types.DELETE_LINK_FULFILLED) {
      // success in deleting a link
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_PENDING && nextProps.card.loading === types.SET_COVER_IMAGE_PENDING) {
      // setting a file as cover image
      loading = true;
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_FULFILLED && nextProps.card.loading === types.SET_COVER_IMAGE_FULFILLED) {
      this.setState({
        coverImage: nextProps.card.currentCard.coverImage,
      });
      if (this.isOpenGraphForNewCard) {
        this.checkUrlsInNote();
      }
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
      imageFiles = _.filter(nextProps.card.currentCard.files, file => file.contentType.indexOf('image') !== -1);
      if (imageFiles.length > 0 && !nextProps.card.currentCard.coverImage) {
        this.onSetCoverImage(nextProps.card.currentCard.files[0].id);
      } else {
        this.setState({
          coverImage: nextProps.card.currentCard.coverImage,
        });
      }
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
        this.openGraphForNoteLinks.push({
          url: this.noteLinksForOpenGraph[this.openGraphNoteIndex++],
          title: nextProps.card.currentOpneGraph.title,
          description: nextProps.card.currentOpneGraph.description,
          image: nextProps.card.currentOpneGraph.image
        });

        if (this.openGraphNoteIndex < this.noteLinksForOpenGraph.length) {
          loading = true;
          this.props.getOpenGraph(this.noteLinksForOpenGraph[this.openGraphNoteIndex]);
        } else {
          this.addLinkIndex = 0;
          const { id } = this.props.card.currentCard;
          const {
            url,
            title,
            description,
            image,
          } = this.openGraphForNoteLinks[this.addLinkIndex++];
          this.props.addLink(id, url, title, description, image);
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
    } else if (this.props.card.loading !== types.MOVE_CARD_PENDING && nextProps.card.loading === types.MOVE_CARD_PENDING) {
      // moving card
      loading = true;
    } else if (this.props.feedo.loading !== feedoTypes.CREATE_FEED_PENDING && nextProps.feedo.loading === feedoTypes.CREATE_FEED_PENDING) {
      // creating a feed
      loading = true;
    } else if (this.props.feedo.loading !== feedoTypes.CREATE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.CREATE_FEED_FULFILLED) {
      // creating a feed
      if (this.props.viewMode === CONSTANTS.CARD_NEW) {
        loading = true;
        this.draftFeedoId = nextProps.feedo.currentFeed.id;
        this.props.createCard(nextProps.feedo.currentFeed.id);
      }
    } else if (this.props.feedo.loading !== feedoTypes.UPDATE_FEED_PENDING && nextProps.feedo.loading === feedoTypes.UPDATE_FEED_PENDING) {
      // updating a feed
      loading = true;
    } else if (this.props.feedo.loading !== feedoTypes.UPDATE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.UPDATE_FEED_FULFILLED) {
      // success in updating a feed
      this.onUpdateCard();
    } else if (this.props.feedo.loading !== feedoTypes.DELETE_FEED_PENDING && nextProps.feedo.loading === feedoTypes.DELETE_FEED_PENDING) {
      // deleting a feed
      loading = true;
    } else if (this.props.feedo.loading !== feedoTypes.DELETE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.DELETE_FEED_FULFILLED) {
      // success in deleting a feed
      if (this.isUpdateDraftCard) {
        this.onUpdateCard();
      } else {
        this.onClose();
      }
      return;
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (this.props.card.loading !== nextProps.card.loading || this.props.feedo.loading !== nextProps.feedo.loading) {
      if (nextProps.card.error || nextProps.feedo.error) {
        let error = null;
        if ((nextProps.card.error && nextProps.card.error.error) || (nextProps.feedo.error && nextProps.feedo.error.error)) {
          error = (nextProps.card.error && nextProps.card.error.error) || (nextProps.feedo.error && nextProps.feedo.error.error);
        } else {
          error = (nextProps.card.error && nextProps.card.error.message) || (nextProps.feedo.error && nextProps.feedo.error.message);
        }
        if (error) {
          if (nextProps.card.loading === types.GET_OPEN_GRAPH_REJECTED) {
            if (this.parseErrorUrls(error)) {
              error = 'Sorry, this link cannot be read';
            } else {
              return;
            }
          }
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
    // console.log('Current Card : ', this.props.card.currentCard);
    const { cardMode, viewMode } = this.props;
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
      if (cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
        this.props.createFeed();
      } else if (viewMode === CONSTANTS.CARD_NEW) {
        this.props.createCard(this.props.feedo.currentFeed.id);
      }
    });

    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height - ScreenVerticalMinMargin,
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

  checkUrl(content) {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT) {
      if (content) {
        const texts = content.split(/[, ]/);
        if (texts.length === 1 && validUrl.isUri(texts[0])) {
          if (this.parsingErrorLinks.length > 0 && this.parsingErrorLinks.indexOf(texts[0] !== -1)) {
            return true;
          }
          this.isOpenGraphForNewCard = true;
          this.urlForNewCard = texts[0];
          this.props.getOpenGraph(texts[0]);
          return true;
        }
      }
    }
    return false;
  }

  checkUrlsInNote() {
    if (this.checkUrl(this.state.idea)) {
      return true;
    }
    const allUrls = this.state.idea.match(/\bhttps?:\/\/\S+/gi);
    if (allUrls) {
      let newUrls = [];
      const {
        links
      } = this.props.card.currentCard;
      if (links) {
        allUrls.forEach(url => {
          const index = _.findIndex(links, link => link.originalUrl === url);
          if (index === -1) {
            newUrls.push(url);
          }
        });
      } else {
        newUrls = allUrls;
      }

      let filteredUrls = newUrls;
      if (this.parsingErrorLinks.length) {
        filteredUrls = [];
        newUrls.forEach(url => {
          const index = _.findIndex(this.parsingErrorLinks, errorLink => errorLink === url);
          if (index === -1) {
            filteredUrls.push(url);
          }
        });
      }

      if (filteredUrls.length > 0) {
        this.isOpenGraphForNewCard = false;
        this.openGraphNoteIndex = 0;
        this.openGraphForNoteLinks = [];
        this.noteLinksForOpenGraph = filteredUrls;
        this.props.getOpenGraph(this.noteLinksForOpenGraph[this.openGraphNoteIndex]);
      }
    }
    return false;
  }

  parseErrorUrls(message) {
    const allUrls = message.match(/\bhttps?:\/\/\S+/gi);
    if (allUrls) {
      let newUrls = [];
      allUrls.forEach(url => {
        const index = _.findIndex(this.parsingErrorLinks, errorLink => errorLink === url);
        if (index === -1) {
          url = url.replace('[', '');
          url = url.replace(']', '');
          newUrls.push(url);
          if (this.state.cardName.includes(url)) {
            this.setState({
              cardName: '',
            });
            if (!this.state.idea.includes(url)) {
              this.setState({
                idea: this.state.idea + this.state.idea ? ' ' : '' + url,
              })
            }
          }
        }
      });
      if (newUrls.length > 0) {
        this.parsingErrorLinks = this.parsingErrorLinks.concat(newUrls);
      }
      return true;
    }
    return false;
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
      cardName = '';
    }
    this.props.updateCard(this.props.feedo.currentFeed.id, id, cardName, this.state.idea, this.state.coverImage, files);
  }

  onCreateCard() {
    const {
      id, 
      files,
    } = this.props.card.currentCard;

    let cardName = this.state.cardName;
    if (cardName === '') {
      cardName = '';
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

  onUpdateCard() {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_NEW) {
      if (this.checkUrl(this.state.cardName) || this.checkUrlsInNote()) {
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

  onTapOutside() {
    const { cardMode } = this.props;
    if (cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
      // delete draft feed
      this.leaveActionSheetRef.show();
      return;
    } else if (cardMode === CONSTANTS.EXTENTION_CARD) {
      return;
    }
    this.onUpdateCard();
  }

  onTapLeaveActionSheet(index) {
    if (index === 1) {
      this.isUpdateDraftCard = false;
      this.props.deleteDraftFeed(this.draftFeedoId)
    }
  }

  onPressMoreActions() {
    if (this.props.onOpenAction) {
      this.props.onOpenAction(this.props.card.currentCard);
    }
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
    } = this.props.card.currentCard;
    this.props.deleteFile(id, fileId);
  }

  onDeleteLink(linkId) {
    const {
      id,
    } = this.props.card.currentCard;
    this.props.deleteLink(id, linkId);
  }

  onSetCoverImage(fileId) {
    this.props.setCoverImage(this.props.card.currentCard.id, fileId);
  }

  async onChangeTitle(text) {
    const { viewMode } = this.props;
    if (this.parsingErrorLinks.length > 0 && this.parsingErrorLinks.includes(text)) {
      this.setState({cardName: ' '});
      setTimeout(() => {
        this.setState({cardName: ''});
      }, 0)
      return;
    }
    this.setState({cardName: text});    
    if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT){
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent === text) {
        if (this.checkUrl(text)) {
          return;
        }
      }
    }
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
      this.checkUrlsInNote();
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
    this.checkUrlsInNote();
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

  onSelectFeedo() {
    this.prevFeedoId = this.props.feedo.currentFeed.id;
    this.setState({
      isVisibleSelectFeedoModal: true,
    });
  }

  onCloseSelectHunt() {
    this.setState({isVisibleSelectFeedoModal: false})
    if (this.prevFeedoId !== this.props.feedo.currentFeed.id) {
      this.props.moveCard(this.props.card.currentCard.id, this.props.feedo.currentFeed.id);
    }
  }

  onUpdateFeed() {
    if (this.draftFeedoId === this.props.feedo.currentFeed.id) {
      // Update Draft Feedo to Publish one
      const {
        id, 
        headline,
        summary,
        tags,
        files,
      } = this.props.feedo.currentFeed;  
      this.props.updateFeed(id, headline || 'New feed', summary || ' ', tags, files);
      return;
    }
    this.isUpdateDraftCard = true;
    this.props.deleteDraftFeed(this.draftFeedoId)
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
    const { viewMode } = this.props;

    let imageFiles = _.filter(this.props.card.currentCard.files, file => file.fileType === 'MEDIA');
    if (this.state.coverImage) {
      return (
        <View style={styles.imageCoverView}>
          <CoverImagePreviewComponent
            coverImage={this.state.coverImage}
            files={imageFiles}
            editable={viewMode !== CONSTANTS.CARD_VIEW}
            isSetCoverImage={true}
            onRemove={(fileId) => this.onRemoveFile(fileId)}
            onSetCoverImage={(fileId) => this.onSetCoverImage(fileId)}
          />
        </View>
      );
    }

    // imageFiles = _.filter(this.props.card.currentCard.files, file => file.contentType.indexOf('image') !== -1);

    // if (imageFiles.length > 0) {
    //   return (
    //     <View style={styles.coverImageSelectContainer}>
    //       <TouchableOpacity
    //         style={styles.coverImageSelectButtonWrapper}
    //         activeOpacity={0.6}
    //         onPress={() => this.onSelectCoverImage()}
    //       >
    //         <Text style={styles.textSelectButton}>Select cover image</Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
  }

  get renderWebMeta() {
    const { viewMode } = this.props;
    const { links } = this.props.card.currentCard;
    if (links && links.length > 0) {
      return (
        <WebMetaList 
          links={links}
          editable={viewMode !== CONSTANTS.CARD_VIEW}
          onRemove={(linkId) => this.onDeleteLink(linkId)}
        />
      )
    }
  }

  // get renderImages() {
  //   const { viewMode } = this.props;
  //   const {
  //     files
  //   } = this.props.card.currentCard;
  //   const imageFiles = _.filter(files, file => file.fileType === 'MEDIA');
  //   if (imageFiles.length > 0) {
  //     return (
  //       <ImageList 
  //         files={imageFiles}
  //         editable={viewMode !== CONSTANTS.CARD_VIEW}
  //         isSetCoverImage={true}
  //         onRemove={(fileId) => this.onRemoveFile(fileId)}
  //         onSetCoverImage={(fileId) => this.onSetCoverImage(fileId)}
  //       />
  //     )
  //   }
  // }

  get renderDocuments() {
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.EXTENTION_CARD) {
      return;
    }
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
          placeholder='Add a name or link here'
          underlineColorAndroid='transparent'
          value={this.state.cardName}
          onChangeText={(value) => this.onChangeTitle(value)}
          onKeyPress={this.onKeyPressTitle.bind(this)}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlurTitle()}
          selectionColor={COLORS.PURPLE}
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
          selectionColor={COLORS.PURPLE}
        />
        {this.renderWebMeta}
        {/* {this.renderImages} */}
        {this.renderDocuments}
      </View>
    );
  }

  get renderSelectFeedo() {
    const { cardMode } = this.props;
    if (cardMode !== CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
      return;
    }
    return (
      <View style={styles.selectFeedoContainer}>
        <Text style={styles.textCreateCardIn}>Create card in:</Text>
        <TouchableOpacity
          style={styles.selectFeedoButtonContainer}
          activeOpacity={0.6}
          onPress={this.onSelectFeedo.bind(this)}
        >
          <Text style={[styles.textCreateCardIn, {color: COLORS.PRIMARY_BLACK, marginHorizontal: 0}]}>{this.props.feedo.currentFeed.headline || 'New feed'}</Text>
          <Entypo name="chevron-right" size={20} color={COLORS.MEDIUM_GREY} />
        </TouchableOpacity>
      </View>
    )
  }

  get renderAttachmentButtons() {
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.EXTENTION_CARD) {
      return;
    }
    if (viewMode === CONSTANTS.CARD_VIEW) {
      return;
    }
    return (
      <View style={styles.attachmentButtonsContainer}>
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
        {this.renderSelectFeedo}
      </View>
    );
  }

  get renderInvitee() {
    const {
      userProfile
    } = this.props.invitee;
    const name = `${userProfile.firstName} ${userProfile.lastName}`;
    const letterToWidthRatio = 0.5476; // Approximate this by taking the width of some representative text samples
    let fontSize = CONSTANTS.SCREEN_WIDTH * 0.42 / (name.length * letterToWidthRatio) - 4;
    if (fontSize > 14) {
      fontSize = 14;
    }
    return (
      <View>
        <View style={styles.line} />
        <View style={[styles.rowContainer, {marginHorizontal: 22}]}>
          <UserAvatarComponent
            user={userProfile}
          />
          <Text style={[styles.textInvitee, { marginLeft: 9, fontSize,}]} numberOfLines={1}>{name}</Text>
          <Entypo name="dot-single" style={styles.iconDot} />
          <Text style={styles.textInvitee}>{getTimestamp(this.props.card.currentCard.publishedDate)}</Text>
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
            <CommentComponent idea={this.props.card.currentCard} currentFeed={this.props.feedo.currentFeed} />
          </View>
        </View>
      </View>
    );
  }

  get renderHeader() {
    const { cardMode } = this.props;
    if (cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
      return (
        <View style={styles.shareHeaderContainer}>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.leaveActionSheetRef.show()}
          >
            <MaterialCommunityIcons name="close" size={28} color={COLORS.PURPLE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addCardButtonWapper, {backgroundColor: COLORS.PURPLE}]}
            activeOpacity={0.6}
            onPress={this.onUpdateFeed.bind(this)}
          >
            <Text style={styles.textButton}>Create card</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (cardMode === CONSTANTS.EXTENTION_CARD) {
      return (
        <View style={styles.shareHeaderContainer}>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.onClose()}
          >
            <MaterialCommunityIcons name="close" size={28} color={COLORS.BLUE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addCardButtonWapper}
            activeOpacity={0.6}
            onPress={this.onUpdateCard.bind(this)}
          >
            <Text style={styles.textButton}>Add card</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.isFullScreenCard) {
      return (
        <View style={styles.mainHeaderContainer}>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.onUpdateCard()}
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
          onPress={this.onTapOutside.bind(this)}
        />
      );
    }
  }

  get renderOutsideMoreActions() {
    const { cardMode, viewMode } = this.props;
    if (cardMode === CONSTANTS.EXTENTION_CARD) {
      return;
    }
    if (!this.state.isFullScreenCard && viewMode !== CONSTANTS.CARD_NEW) {
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
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.EXTENTION_CARD) {
      return (
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.line} />
          <View style={styles.feedSelectContainer}>
            <Text style={styles.textAddFeed}>Add to </Text>
            <Text style={[styles.textButton, {color: COLORS.BLUE}]}>{this.props.feedo.currentFeed.headline}</Text>
            <Text style={styles.textAddFeed}> feed</Text>
          </View>
        </View>
      )
    }
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
        originalCardTopY: ScreenVerticalMinMargin,
        originalCardBottomY: ScreenVerticalMinMargin,
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
    const { viewMode, cardMode } = this.props;
    let cardStyle = {};
    if (viewMode === CONSTANTS.CARD_NEW) {
      const animatedMove  = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [CONSTANTS.SCREEN_HEIGHT, 0],
      });  
      cardStyle = {
        top: animatedMove,
        opacity: this.animatedShow,
      };
    } else if (!this.state.isFullScreenCard) {
      const animatedTopMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardTopY, 0],
      });
      cardStyle = {
        top: animatedTopMove,
        opacity: this.animatedShow,
      };
    } else {
      const animatedTopMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardTopY, 0],
      });
      cardStyle = {
        top: animatedTopMove,
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
        <Animated.View 
          style={[
            styles.contentContainer,
            { paddingTop: cardMode !== CONSTANTS.EXTENTION_CARD ?  26 : 10},
            (viewMode === CONSTANTS.CARD_NEW || !this.state.isFullScreenCard) && {height: CONSTANTS.SCREEN_HEIGHT - ScreenVerticalMinMargin * 2},
            this.state.isFullScreenCard && {flex: 1, borderRadius: 0},
            {paddingBottom: this.animatedKeyboardHeight}
          ]}
        >
          {this.renderHeader}
          <ScrollView
            enableAutomaticScroll={false}
            onScrollBeginDrag={(e) => this.onScrollBeginDrag(e)}
            onScroll={(e) => this.onScroll(e)}
          >
            {this.renderMainContent}
          </ScrollView>
          {this.renderAttachmentButtons}
          {this.renderBottomContent}
          {
            this.state.isShowKeyboardButton && 
            <Animated.View
              style={[styles.hideKeyboardContainer, {bottom: Animated.add(this.animatedKeyboardHeight, 17)}]}
            >
              <TouchableOpacity 
                style={[
                  styles.buttonItemContainer, 
                  {
                    backgroundColor: cardMode === CONSTANTS.EXTENTION_CARD ? COLORS.BLUE : COLORS.PURPLE,
                    borderRadius: 8,
                    marginRight: 0,                
                  },
                ]}
                activeOpacity={0.6}
                onPress={this.onHideKeyboard.bind(this)}
              >
                <MaterialCommunityIcons name="keyboard-close" size={20} color={'#fff'} />
              </TouchableOpacity>
            </Animated.View>
          }
        </Animated.View>
        {this.renderOutside}
      </Animated.View>
    );
  }

  get renderSelectHunt() {
    if (this.state.isVisibleSelectFeedoModal) {
      return (
        <SelectHuntScreen
          onClosed={() => this.onCloseSelectHunt()}
        />
      );
    }
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderCard}
        {this.renderOutsideMoreActions}
        {this.renderSelectHunt}
        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          title='Select a Photo / Video'
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
        <ActionSheet
          ref={ref => this.leaveActionSheetRef = ref}
          title='Are you sure that you wish to leave?'
          options={['Continue editing', 'Leave and discard', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapLeaveActionSheet(index)}
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
  cardMode: CONSTANTS.MAIN_APP_CARD_FROM_DETAIL,
  shareUrl: '',
  onClose: () => {},
  onOpenAction: () => {},
}


NewCardScreen.propTypes = {
  card: PropTypes.object,
  invitee: PropTypes.object,
  intialLayout: PropTypes.object,
  viewMode: PropTypes.number,
  cardMode: PropTypes.number,
  shareUrl: PropTypes.string,
  onClose: PropTypes.func,
  onOpenAction: PropTypes.func,
}


const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, comments, tags, files) => dispatch(updateFeed(id, name, comments, tags, files)),
  deleteDraftFeed: (id) => dispatch(deleteDraftFeed(id)),

  createCard: (huntId) => dispatch(createCard(huntId)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  updateCard: (huntId, ideaId, title, idea, coverImage, files) => dispatch(updateCard(huntId, ideaId, title, idea, coverImage, files)),
  getFileUploadUrl: (huntId, ideaId) => dispatch(getFileUploadUrl(huntId, ideaId)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (ideaId, fileType, contentType, name, objectKey) => dispatch(addFile(ideaId, fileType, contentType, name, objectKey)),
  deleteFile: (ideaId, fileId) => dispatch(deleteFile(ideaId, fileId)),
  setCoverImage: (ideaId, fileId) => dispatch(setCoverImage(ideaId, fileId)),
  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
  addLink: (ideaId, originalUrl, title, description, imageUrl) => dispatch(addLink(ideaId, originalUrl, title, description, imageUrl)),
  deleteLink: (ideaId, linkId) => dispatch(deleteLink(ideaId, linkId)),
  moveCard: (ideaId, huntId) => dispatch(moveCard(ideaId, huntId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewCardScreen)