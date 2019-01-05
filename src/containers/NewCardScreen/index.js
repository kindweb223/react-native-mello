import React from 'react'
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
  Text,
  Clipboard,
  ScrollView,
  AsyncStorage,
  Linking,
  SafeAreaView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ViewMoreText from 'react-native-view-more-text';

import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import _ from 'lodash';
import Modal from 'react-native-modal';
import moment from 'moment'
import Autolink from 'react-native-autolink';
import SafariView from "react-native-safari-view";
import SharedGroupPreferences from 'react-native-shared-group-preferences';

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
  resetCardError,
} from '../../redux/card/actions'
import { 
  createFeed,
  updateFeed,
  deleteDraftFeed,
  setCurrentFeed,
  getFeedoList,
} from '../../redux/feedo/actions'
import * as types from '../../redux/card/types'
import * as feedoTypes from '../../redux/feedo/types'
import { getDurationFromNow } from '../../service/dateUtils'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import DocumentList from '../../components/DocumentListComponent';
import WebMetaList from '../../components/WebMetaListComponent';
import LikeComponent from '../../components/LikeComponent';
import CommentComponent from '../../components/CommentComponent';
import ChooseLinkImages from '../../components/chooseLinkImagesComponent';
import UserAvatarComponent from '../../components/UserAvatarComponent';
import CoverImagePreviewComponent from '../../components/CoverImagePreviewComponent';
import SelectHuntScreen from '../SelectHuntScreen';
import LastCommentComponent from '../../components/LastCommentComponent';
import Analytics from '../../lib/firebase'

import * as COMMON_FUNC from '../../service/commonFunc'
const ATTACHMENT_ICON = require('../../../assets/images/Attachment/Blue.png')
const IMAGE_ICON = require('../../../assets/images/Image/Blue.png')


class NewCardScreen extends React.Component {
  constructor(props) {
    super(props);

    let coverImage = '';
    let idea = '';

    if (props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD && props.shareUrl !== '') {
      const openGraph = props.card.currentOpneGraph;
      coverImage = props.shareImageUrls.length > 0 ? props.shareImageUrls[0] : '',
      idea = openGraph.title || openGraph.metatags.title || '';
    }

    this.state = {
      // cardName: '',
      idea,
      coverImage,
      textByCursor: '',
      
      loading: false,
      // isFullScreenCard: false,
      originalCardTopY: this.props.intialLayout.py,
      originalCardBottomY: this.props.intialLayout.py + this.props.intialLayout.height,
      isShowKeyboardButton: false,
      isVisibleChooseLinkImagesModal: false,
      isVisibleSelectFeedoModal: false,

      isEditableIdea: false,
      isGettingFeedoList: false,
      isSuccessCopyUrl: false
    };

    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;

    // this.isOpenGraphForNewCard = false;
    // this.urlForNewCard = '';

    this.allLinkImages = [];
    this.selectedLinkImages = [];
    this.currentSelectedLinkImageIndex = 0;

    this.indexForOpenGraph = 0;
    this.linksForOpenGraph = [];

    this.indexForAddedLinks = 0;
    this.openGraphLinksInfo = [];

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
    this.scrollViewLayoutHeight = 0;
    this.isVisibleErrorDialog = false;

    this.parsingErrorLinks = [];

    this.draftFeedo = null;
    this.prevFeedo = null;
    this.isUpdateDraftCard = false;

    this.isUploadShareImage = props.shareImageUrls.length > 0;
    this.scrollViewHeight = 0;
    this.textInputPositionY = 0;
    this.textInputHeightByCursor = 0;

    this.isDisabledKeyboard = false;

    this.shareImageUrls = [];
    this.currentShareImageIndex = 0;

    if (props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD && props.shareUrl === '' && props.shareImageUrls.length) {
      props.shareImageUrls.forEach( async(imageUri, index) => {
        const fileName = imageUri.substring(imageUri.lastIndexOf("/") + 1, imageUri.length);
        const {width, height} = await this.getImageSize(imageUri);
        this.shareImageUrls.push({
          uri: imageUri,
          fileName,
          width,
          height,
        });
        if (index === 0 && this.state.coverImage === '') {
          this.setState({
            coverImage: imageUri,
          });
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.CREATE_CARD_PENDING && nextProps.card.loading === types.CREATE_CARD_PENDING) {
      // loading = true;
    } 
    else if (this.props.card.loading !== types.CREATE_CARD_FULFILLED && nextProps.card.loading === types.CREATE_CARD_FULFILLED) {
      // If share extension and a url has been passed
      if (this.props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD && this.props.shareUrl !== '') {
        const openGraph = this.props.card.currentOpneGraph;
        this.setState({
          // cardName: this.props.shareUrl,
          // idea: this.props.shareUrl,
          idea: openGraph.title || openGraph.metatags.title,
        });
        const { id } = nextProps.card.currentCard;
        const url = this.props.shareUrl || openGraph.url || openGraph.metatags['og:url'];
        const title = openGraph.title || openGraph.metatags.title;
        const description = openGraph.description || openGraph.metatags.metatags;
        const image =  openGraph.image || openGraph.metatags['og:image'] || (this.props.shareImageUrls.length > 0 && this.props.shareImageUrls[0]);
        const favicon =  openGraph.favicon;
        this.props.addLink(id, url, title, description, image, favicon);
      } 
      // If share extension and sharing an image
      else if (this.props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD && this.isUploadShareImage) {
        this.isUploadShareImage = false;
        this.uploadFile(nextProps.card.currentCard, this.shareImageUrls[this.currentShareImageIndex], 'MEDIA');
      }
      // If just creating a card
      else if (this.props.viewMode === CONSTANTS.CARD_NEW) {
        this.setState({
          // cardName: this.props.shareUrl,
          idea: this.props.shareUrl,
        }, () => {
          this.checkUrls();
        });
      }
      else {
        if (nextProps.user && nextProps.user.userInfo && nextProps.user.userInfo.id) {
          const data = {
            userId: nextProps.user.userInfo.id,
            state: 'true'
          }
          AsyncStorage.setItem('BubbleFirstCardTimeCreated', JSON.stringify(data));
        }
      }
    } else if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      // Image resizing...
      if (this.selectedFileMimeType.indexOf('image/') !== -1) {
        // https://www.built.io/blog/improving-image-compression-what-we-ve-learned-from-whatsapp
        let actualHeight = this.selectedFile.height;
        let actualWidth = this.selectedFile.width;
        const maxHeight = 600.0;
        const maxWidth = 800.0;
        let imgRatio = actualWidth/actualHeight;
        let maxRatio = maxWidth/maxHeight;

        if (actualHeight > maxHeight || actualWidth > maxWidth) {
          if(imgRatio < maxRatio){
              //adjust width according to maxHeight
              imgRatio = maxHeight / actualHeight;
              actualWidth = imgRatio * actualWidth;
              actualHeight = maxHeight;
          }
          else if(imgRatio > maxRatio){
              //adjust height according to maxWidth
              imgRatio = maxWidth / actualWidth;
              actualHeight = imgRatio * actualHeight;
              actualWidth = maxWidth;
          }
          else{
              actualHeight = maxHeight;
              actualWidth = maxWidth;
          }
        }

        ImageResizer.createResizedImage(this.selectedFile.uri, actualWidth, actualHeight, CONSTANTS.IMAGE_COMPRESS_FORMAT, CONSTANTS.IMAGE_COMPRESS_QUALITY, 0, null)
          .then((response) => {
            console.log('Image compress Success!');
            this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, response.uri, this.selectedFileName, this.selectedFileMimeType);
          }).catch((error) => {
            console.log('Image compress error : ', error);
            this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, this.selectedFile.uri, this.selectedFileName, this.selectedFileMimeType);
          });
        return;
      }
      this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, this.selectedFile.uri, this.selectedFileName, this.selectedFileMimeType);
    } else if (this.props.card.loading !== types.UPLOAD_FILE_PENDING && nextProps.card.loading === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.card.loading !== types.UPLOAD_FILE_FULFILLED && nextProps.card.loading === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      const {
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
      const {
        id, 
      } = this.props.card.currentCard;
      const newImageFiles = _.filter(nextProps.card.currentCard.files, file => file.contentType.indexOf('image') !== -1);
      if (newImageFiles.length === 1 && !nextProps.card.currentCard.coverImage) {
        this.onSetCoverImage(newImageFiles[0].id);
      }
      this.currentSelectedLinkImageIndex ++;
      if (this.currentSelectedLinkImageIndex < this.selectedLinkImages.length) {
        this.addLinkImage(id, this.selectedLinkImages[this.currentSelectedLinkImageIndex]);
      }
      this.currentShareImageIndex ++;
      if (this.currentShareImageIndex < this.shareImageUrls.length) {
        this.uploadFile(nextProps.card.currentCard, this.shareImageUrls[this.currentShareImageIndex], 'MEDIA');
      }
    } else if (this.props.card.loading !== types.ADD_LINK_PENDING && nextProps.card.loading === types.ADD_LINK_PENDING) {
      // adding a link
      if (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0) {
        loading = true;
      }
    } else if (this.props.card.loading !== types.ADD_LINK_FULFILLED && nextProps.card.loading === types.ADD_LINK_FULFILLED) {
      // success in adding a link
      if (this.props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD && this.isUploadShareImage) {
        this.isUploadShareImage = false;
        const { id } = this.props.card.currentCard;
        this.addLinkImage(id, this.props.shareImageUrls[0]);
      } else if (this.indexForAddedLinks < this.openGraphLinksInfo.length) {
        const { id } = this.props.card.currentCard;
        const {
          url,
          title,
          description,
          image,
          favicon,
        } = this.openGraphLinksInfo[this.indexForAddedLinks++];
        this.props.addLink(id, url, title, description, image, favicon);
      } else if (this.props.cardMode !== CONSTANTS.SHARE_EXTENTION_CARD && this.allLinkImages.length > 0 
        && (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0)) {
        this.setState({
          isVisibleChooseLinkImagesModal: true,
        });
      }
    } else if (this.props.card.loading !== types.DELETE_LINK_PENDING && nextProps.card.loading === types.DELETE_LINK_PENDING) {
      // deleting a link
      loading = true;
    } else if (this.props.card.loading !== types.DELETE_LINK_FULFILLED && nextProps.card.loading === types.DELETE_LINK_FULFILLED) {
      // success in deleting a link
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_PENDING && nextProps.card.loading === types.SET_COVER_IMAGE_PENDING) {
      // setting a file as cover image
      // loading = true;
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_FULFILLED && nextProps.card.loading === types.SET_COVER_IMAGE_FULFILLED) {
      this.setState({
        coverImage: nextProps.card.currentCard.coverImage,
      }, () => {
        if (this.props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
          setTimeout(() => {
            this.scrollViewRef.scrollToEnd();
          }, 0);
        }
      });
      this.checkUrls();
      // success in setting a file as cover image
    } else if (this.props.card.loading !== types.UPDATE_CARD_PENDING && nextProps.card.loading === types.UPDATE_CARD_PENDING) {
      // updating a card
      // loading = true;
    } else if (this.props.card.loading !== types.UPDATE_CARD_FULFILLED && nextProps.card.loading === types.UPDATE_CARD_FULFILLED) {
      // success in updating a card
      if (this.props.cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD || this.props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
        this.saveFeedId();
      }
      if (this.props.cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
        Actions.ShareSuccessScreen();
        return;
      }
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
      if (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0) {
        loading = true;
      }
    } else if (this.props.card.loading !== types.GET_OPEN_GRAPH_FULFILLED && nextProps.card.loading === types.GET_OPEN_GRAPH_FULFILLED) {
      // success in getting open graph
      if (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0) {
        loading = true;
      }
      if (this.allLinkImages.length === 0) {
        if (nextProps.card.currentOpneGraph.images) {
          this.allLinkImages = nextProps.card.currentOpneGraph.images;
        } else if (nextProps.card.currentOpneGraph.image) {
          this.allLinkImages.push(nextProps.card.currentOpneGraph.image);
        }
      }
      let currentIdea = this.state.idea;
      currentIdea = currentIdea.replace(' ', '');
      currentIdea = currentIdea.replace(',', '');
      currentIdea = currentIdea.replace('\n', '');
      if (currentIdea.toLowerCase() === this.linksForOpenGraph[this.indexForOpenGraph].toLowerCase()) {
        this.setState({
          idea: nextProps.card.currentOpneGraph.title,
        });
      }
      this.openGraphLinksInfo.push({
        url: nextProps.card.currentOpneGraph.url,
        title: nextProps.card.currentOpneGraph.title,
        description: nextProps.card.currentOpneGraph.description,
        image: nextProps.card.currentOpneGraph.image,
        favicon: nextProps.card.currentOpneGraph.favicon
      });
      
      this.indexForOpenGraph ++;
      
      if (this.indexForOpenGraph < this.linksForOpenGraph.length) {
        this.props.getOpenGraph(this.linksForOpenGraph[this.indexForOpenGraph]);
      } else {
        this.indexForAddedLinks = 0;
        const { id } = this.props.card.currentCard;
        const {
          url,
          title,
          description,
          image,
          favicon,
        } = this.openGraphLinksInfo[this.indexForAddedLinks++];
        this.props.addLink(id, url, title, description, image, favicon);
      }
    } else if (this.props.card.loading !== types.LIKE_CARD_PENDING && nextProps.card.loading === types.LIKE_CARD_PENDING) {
      // liking a card
      // loading = true;  // disable loading
    } else if (this.props.card.loading !== types.LIKE_CARD_FULFILLED && nextProps.card.loading === types.LIKE_CARD_FULFILLED) {
      // success in liking a card
    } else if (this.props.card.loading !== types.UNLIKE_CARD_PENDING && nextProps.card.loading === types.UNLIKE_CARD_PENDING) {
      // unliking a card
      // loading = true;  // disable loading
    } else if (this.props.card.loading !== types.UNLIKE_CARD_FULFILLED && nextProps.card.loading === types.UNLIKE_CARD_FULFILLED) {
      // success in unliking a card
    } else if (this.props.card.loading !== types.MOVE_CARD_PENDING && nextProps.card.loading === types.MOVE_CARD_PENDING) {
      // moving card
      // loading = true;
    } else if (this.props.feedo.loading !== feedoTypes.GET_FEEDO_LIST_PENDING && nextProps.feedo.loading === feedoTypes.GET_FEEDO_LIST_PENDING) {
      // loading = true;
    } else if (this.props.feedo.loading !== feedoTypes.GET_FEEDO_LIST_FULFILLED && nextProps.feedo.loading === feedoTypes.GET_FEEDO_LIST_FULFILLED) {
      if (this.isGettingFeedoList) {
        // loading = true;
        this.isGettingFeedoList = false;
        this.createCard(nextProps);
      }
    }


    if (this.prevFeedo === null) {
      if (this.props.feedo.loading !== feedoTypes.CREATE_FEED_PENDING && nextProps.feedo.loading === feedoTypes.CREATE_FEED_PENDING) {
        // creating a feed
        // loading = true;
      } else if (this.props.feedo.loading !== feedoTypes.CREATE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.CREATE_FEED_FULFILLED) {
        // creating a feed
        if (this.props.viewMode === CONSTANTS.CARD_NEW) {
          // loading = true;
          this.draftFeedo = nextProps.feedo.currentFeed;
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
        // loading = true;
      } else if (this.props.feedo.loading !== feedoTypes.DELETE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.DELETE_FEED_FULFILLED) {
        // success in deleting a feed
        if (this.isUpdateDraftCard) {
          this.onUpdateCard();
        } else {
          this.onClose();
        }
        return;
      }
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
            if (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0) {
              if (this.parseErrorUrls(error)) {
                error = 'Sorry, this link cannot be read';
              } else {
                // return;
              }
            } else {
              this.isVisibleErrorDialog = true;
            }
          }
          if (!this.isVisibleErrorDialog) {
            this.isVisibleErrorDialog = true;
            Alert.alert('Error', error, [
              {text: 'Close', onPress: () => this.isVisibleErrorDialog = false},
            ]);
          }
        }
        this.props.resetCardError();
        return;
      }
    }
    if (this.props.card.loading !== 'GET_CARD_FULFILLED' && nextProps.card.loading === 'GET_CARD_FULFILLED') {
      this.setState({
        // cardName: this.props.card.currentCard.title,
        idea: nextProps.card.currentCard.idea,
        coverImage: nextProps.card.currentCard.coverImage,
      })
    }
  }

  componentDidMount() {
    // console.log('Current Card : ', this.props.card.currentCard);
    const { viewMode, cardMode } = this.props;
    if (viewMode === CONSTANTS.CARD_VIEW || viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({
        // cardName: this.props.card.currentCard.title,
        idea: this.props.card.currentCard.idea,
        coverImage: this.props.card.currentCard.coverImage,
      });
    } else if (viewMode === CONSTANTS.CARD_NEW) {
      this.textInputIdeaRef.focus();
    }

    if (this.props.card.currentCard.idea === '' && viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({
        isEditableIdea: true,
      });
    }
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      if (this.props.feedo.feedoList.length == 0) {
        this.isGettingFeedoList = true;
        this.props.getFeedoList(0);
      } else {
        this.createCard(this.props);
      }
    });

    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    this.safariViewShowSubscription = SafariView.addEventListener('onShow', () => this.safariViewShow());
    this.safariViewDismissSubscription = SafariView.addEventListener('onDismiss', () => this.safariViewDismiss());
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
    this.safariViewShowSubscription.remove();
    this.safariViewDismissSubscription.remove();
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration,
      }
    ).start(() => {
      // When opening comment screen and in safari view controller this code seems to execute
      if (this.textInputIdeaRef) {
        this.textInputIdeaRef.focus();
      }
    });
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: e.duration,
      }
    ).start();
  }

  safariViewShow() {
    this.isDisabledKeyboard = true;
  }

  safariViewDismiss() {
    this.isDisabledKeyboard = false;
  }

  async createCard(currentProps) {
    Analytics.logEvent('new_card_new_card', {})

    const { cardMode, viewMode } = this.props;
    if ((cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) || (cardMode === CONSTANTS.SHARE_EXTENTION_CARD)) {
      try {
        const strFeedoInfo = await SharedGroupPreferences.getItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, CONSTANTS.APP_GROUP_LAST_USED_FEEDO);
        if (strFeedoInfo) {
          const feedoInfo = JSON.parse(strFeedoInfo);
          const diffHours = moment().diff(moment(feedoInfo.time, 'LLL'), 'hours');
          if (diffHours < 1) {
            const currentFeed = _.find(currentProps.feedo.feedoList, feed => feed.id === feedoInfo.feedoId)
            if (currentFeed) {
              this.props.setCurrentFeed(currentFeed);
              this.props.createCard(this.props.feedo.currentFeed.id);
              return;
            }
          }
        }
      } catch (error) {
        console.log('error code : ', error);
      }
      this.props.createFeed();
    } else if (viewMode === CONSTANTS.CARD_NEW) {
      this.props.createCard(this.props.feedo.currentFeed.id);
    }
  }

  saveFeedId() {
    const feedoInfo = {
      time: moment().format('LLL'),
      feedoId: this.props.feedo.currentFeed.id,
    }
    SharedGroupPreferences.setItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, JSON.stringify(feedoInfo), CONSTANTS.APP_GROUP_LAST_USED_FEEDO)
  }

  // checkUrl(content) {
  //   const { viewMode } = this.props;
  //   if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT) {
  //     if (content) {
  //       const texts = content.split(/[, ]/);
  //       const allUrls = texts[0].match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
  //       // if (texts.length === 1 && validUrl.isUri(texts[0])) {
  //       if (texts.length === 1 && allUrls && allUrls.length > 0) {
  //         if (this.parsingErrorLinks.length > 0 && this.parsingErrorLinks.indexOf(texts[0] !== -1)) {
  //           return true;
  //         }
  //         this.isOpenGraphForNewCard = true;
  //         this.urlForNewCard = texts[0];
  //         this.props.getOpenGraph(texts[0]);
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }
  compareUrls(linkUrl, currentUrl) {
    const linkUrls = linkUrl.match(/(((?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+((?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9]))|(?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9])(?:[a-zA-Z0-9]))))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi);
    let filterdLinkUrl = linkUrls[0].toLowerCase();
    const currentUrls = currentUrl.match(/(((?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+((?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9]))|(?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9])(?:[a-zA-Z0-9]))))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi);
    let filterdCurrentUrl = currentUrls[0].toLowerCase();
    if (filterdLinkUrl.startsWith('www.') && !filterdCurrentUrl.startsWith('www.')) {
      filterdCurrentUrl = 'www.' + filterdCurrentUrl;
    }
    if (filterdCurrentUrl.startsWith('www.') && !filterdLinkUrl.startsWith('www.')) {
      filterdLinkUrl = 'www.' + filterdLinkUrl;
    }
    if (filterdLinkUrl.endsWith('/') && !filterdCurrentUrl.endsWith('/')) {
      filterdCurrentUrl = filterdCurrentUrl + '/';
    }
    return filterdLinkUrl === filterdCurrentUrl;
  }

  checkUrls() {
    // if (this.checkUrl(this.state.idea)) {
    //   return true;
    // }
    const allUrls = this.state.idea && this.state.idea.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
    if (allUrls) {
      let newUrls = [];
      const {
        links
      } = this.props.card.currentCard;
      if (links) {
        allUrls.forEach(url => {
          const index = _.findIndex(links, link => this.compareUrls(link.originalUrl, url));
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
          const index = _.findIndex(this.parsingErrorLinks, errorLink => this.compareUrls(errorLink, url));
          if (index === -1) {
            filteredUrls.push(url);
          }
        });
      }

      if (filteredUrls.length > 0) {
        Analytics.logEvent('new_card_typed_link', {})

        // this.isOpenGraphForNewCard = false;
        this.indexForOpenGraph = 0;
        this.openGraphLinksInfo = [];
        this.linksForOpenGraph = filteredUrls;
        this.props.getOpenGraph(this.linksForOpenGraph[this.indexForOpenGraph]);
      }
    }
    return false;
  }

  parseErrorUrls(message) {
    alert('parseErrorUrls: ' + message)
    const allUrls = message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
    if (allUrls) {
      let newUrls = [];
      allUrls.forEach(url => {
        const index = _.findIndex(this.parsingErrorLinks, errorLink => errorLink === url);
        if (index === -1) {
          url = url.replace('[', '');
          url = url.replace(']', '');
          newUrls.push(url);
          // if (this.state.cardName.includes(url)) {
          //   this.setState({
          //     cardName: '',
          //   });
          //   if (!this.state.idea.includes(url)) {
          //     this.setState({
          //       idea: this.state.idea + this.state.idea ? ' ' : '' + url,
          //     })
          //   }
          // }
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
    const { idea } = this.state

    // let cardName = this.state.cardName;
    // if (cardName === '') {
    //   cardName = '';
    // }

    if (idea.length > 0 || (files && files.length > 0)) {
      const cardName = '';
      this.props.updateCard(this.props.feedo.currentFeed.id, id, cardName, this.state.idea, this.state.coverImage, files);
    } else {
      Alert.alert('Error', 'Enter some text or add an image')
    }
  }

  onCreateCard() {
    const {
      id, 
      files,
    } = this.props.card.currentCard;
    // let cardName = this.state.cardName;
    // if (cardName === '') {
    //   cardName = '';
    // }
    const cardName = '';
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
        if (response.fileSize > 1024 * 1024 * 10) {
          Alert.alert('Warning', 'File size must be less than 10MB')
        } else {
          let type = 'FILE';
          const mimeType = mime.lookup(response.uri);
          if (mimeType !== false) {
            if (mimeType.indexOf('image') !== -1 || mimeType.indexOf('video') !== -1) {
              type = 'MEDIA';
            }
          }
          this.uploadFile(this.props.card.currentCard, response, type);
        }
      }      
    });
    return;
  }
  
  onHideKeyboard() {
    const { cardMode } = this.props;
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      return;
    }
    Keyboard.dismiss();
  }

  onUpdateCard() {
    const { viewMode } = this.props;
    // if (viewMode === CONSTANTS.CARD_NEW) {
    //   if (this.checkUrl(this.state.cardName) || this.checkUrls()) {
    //     return;
    //   }
    // }
    if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT) {
      this.onUpdate();
      return;
    }
    this.onClose();
    return;
  }

  onTapLeaveActionSheet(index) {
    if (index === 1) {
      this.isUpdateDraftCard = false;
      if (this.draftFeedo) {
        this.props.deleteDraftFeed(this.draftFeedo.id)
      } else {
        this.onClose();
      }
    }
  }

  onPressMoreActions() {
    if (this.props.onOpenAction) {
      this.props.onOpenAction(this.props.card.currentCard);
    }
  }

  getImageSize(uri) {
    return new Promise((resolve, reject) => {
      Image.getSize(uri,
        (width, height) => {
          resolve({width, height});
        }, (error) => {
          reject(error);
        });
    });
  }

  async uploadFile(currentCard, file, type) {
    this.selectedFile = file;
    this.selectedFileMimeType = mime.lookup(file.uri);
    this.selectedFileName = file.fileName;
    this.selectedFileType = type;
    if (currentCard.id) {
      this.props.getFileUploadUrl(this.props.feedo.currentFeed.id, currentCard.id);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (response.fileSize > 1024 * 1024 * 10) {
          Alert.alert('Warning', 'File size must be less than 10MB')
        } else {
          if (!response.fileName) {
            response.fileName = response.uri.replace(/^.*[\\\/]/, '')
          }
          this.uploadFile(this.props.card.currentCard, response, 'MEDIA');
        }
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        if (response.fileSize > 1024 * 1024 * 10) {
          Alert.alert('Warning', 'File size must be less than 10MB')
        } else {
          this.uploadFile(this.props.card.currentCard, response, 'MEDIA');
        }
      }
    });
  }

  onTapMediaPickerActionSheet(index) {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'feedo'
      },
      mediaType: 'mixed'
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

  // async onChangeTitle(text) {
  //   const { viewMode } = this.props;
  //   if (this.parsingErrorLinks.length > 0 && this.parsingErrorLinks.includes(text)) {
  //     this.setState({cardName: ' '});
  //     setTimeout(() => {
  //       this.setState({cardName: ''});
  //     }, 0)
  //     return;
  //   }
  //   this.setState({cardName: text});    
  //   if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT){
  //     const clipboardContent = await Clipboard.getString();
  //     if (clipboardContent === text) {
  //       if (this.checkUrl(text)) {
  //         return;
  //       }
  //     }
  //   }
  // }
  
  // onKeyPressTitle(event) {
  //   if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
  //     this.checkUrl(this.state.cardName);
  //   }
  // }
  
  onChangeIdea(text) {
    // console.log('TextInput - onChangeIdea : ', text);
    this.setState({
      idea: text,
    }, async () => {
      const { viewMode } = this.props;
      if (viewMode === CONSTANTS.CARD_NEW) {
        const clipboardContent = await Clipboard.getString();
        if (clipboardContent === text) {
          if (this.checkUrls()) {
            return;
          }
        }
      }
    });
  }

  onKeyPressIdea(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.checkUrls();
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

  // onBlurTitle() {
  //   this.setState({
  //     isShowKeyboardButton: false,
  //   });
  //   this.checkUrl(this.state.cardName);
  // }

  onBlurIdea() {
    this.setState({
      isShowKeyboardButton: false,
      isEditableIdea: false,
    });
  }

  onShowLikes(likes) {
    if (likes > 0) {
      Actions.LikesListScreen({idea: this.props.card.currentCard});
    }
  }

  onCloseLinkImages() {
    this.allLinkImages = [];
    this.setState({
      isVisibleChooseLinkImagesModal: false,
    });
  }

  onSaveLinkImages(selectedImages) {
    const {
      id, 
    } = this.props.card.currentCard;
    this.onCloseLinkImages();
    this.selectedLinkImages = selectedImages;
    this.currentSelectedLinkImageIndex = 0;
    if (this.selectedLinkImages.length > 0) {
      this.addLinkImage(id, this.selectedLinkImages[this.currentSelectedLinkImageIndex]);
    }
  }

  onSelectCoverImage() {
  }

  onBack() {
    this.onUpdateCard();
  }

  onSelectFeedo() {
    this.prevFeedo = this.props.feedo.currentFeed;
    this.isDisabledKeyboard = true;
    this.setState({
      isVisibleSelectFeedoModal: true,
    });
  }

  onCloseSelectHunt() {
    this.isDisabledKeyboard = false;
    this.setState({isVisibleSelectFeedoModal: false})
    if (!this.props.feedo.currentFeed.id) {
      this.props.setCurrentFeed(this.prevFeedo);
    }
    if (this.prevFeedo.id !== this.props.feedo.currentFeed.id) {
      this.props.moveCard(this.props.card.currentCard.id, this.props.feedo.currentFeed.id);
    }
    this.prevFeedo = null;
  }

  onUpdateFeed() {
    const {
      files,
    } = this.props.card.currentCard;
    const { idea } = this.state
    if (idea.length === 0 && (!files || files.length === 0)) {
      Alert.alert('Error', 'Enter some text or add an image')
      return;
    }
    if (this.draftFeedo) {
      if (this.draftFeedo.id === this.props.feedo.currentFeed.id) {
        // Update Draft Mello to Publish one
        const {
          id, 
          headline,
          summary,
          tags,
          files,
        } = this.props.feedo.currentFeed;  
        this.props.updateFeed(id, headline || 'New flow', summary || '', tags, files);
        return;
      }
      this.isUpdateDraftCard = true;
      this.props.deleteDraftFeed(this.draftFeedo.id)
    } else {
      Analytics.logEvent('new_card_update_card', {})
      this.onUpdateCard();
    }
  }

  onPressIdea() {
    const { viewMode } = this.props;
    this.textInputHeightByCursor = 0;
    this.setState({
      isEditableIdea: true,
      textByCursor: '',
    }, () => {
      if (viewMode === CONSTANTS.CARD_NEW || viewMode === CONSTANTS.CARD_EDIT) {
        this.textInputIdeaRef.focus();
      }
    });
  }

  onPressLink(url) {
    SafariView.isAvailable()
      .then(SafariView.show({
        url: url,
        tintColor: COLORS.PURPLE
      }))
      .catch(error => {
        // Fallback WebView code for iOS 8 and earlier
        Linking.canOpenURL(url)
          .then(supported => {
              if (!supported) {
                  console.log('Can\'t handle url: ' + url);
              }
              else {
                  return Linking.openURL(url);
              }
          })
          .catch(error => console.error('An error occurred', error));
      });
  }

  addLinkImage(id, imageUrl) {
    const mimeType = mime.lookup(imageUrl) || 'image/jpeg';
    const filename = imageUrl.replace(/^.*[\\\/]/, '')
    this.props.addFile(id, 'MEDIA', mimeType, filename, imageUrl);
  }

  get renderCoverImage() {
    const { viewMode, cardMode } = this.props;
    let imageFiles = _.filter(this.props.card.currentCard.files, file => file.fileType === 'MEDIA');
    if (this.state.coverImage) {
      return (
        <View style={cardMode === CONSTANTS.SHARE_EXTENTION_CARD ? styles.extensionCoverImageContainer : styles.coverImageContainer}>
          <CoverImagePreviewComponent
            coverImage={this.state.coverImage}
            files={imageFiles}
            editable={viewMode !== CONSTANTS.CARD_VIEW}
            isFastImage={cardMode !== CONSTANTS.SHARE_EXTENTION_CARD}
            isSetCoverImage={true}
            onRemove={(fileId) => this.onRemoveFile(fileId)}
            onSetCoverImage={(fileId) => this.onSetCoverImage(fileId)}
          />
        </View>
      );
    }
  }

  // scroll functions for TextInput
  scrollContent() {
    const yPosition = this.textInputPositionY + this.textInputHeightByCursor;
    if (this.scrollViewHeight > 0 && yPosition > this.scrollViewHeight) {
      this.scrollViewRef.scrollTo({x: 0, y: yPosition - this.scrollViewHeight + CONSTANTS.TEXT_INPUT_LINE_HEIGHT});
    }
  }

  onContentSizeChange({nativeEvent}) {
    const height = nativeEvent.contentSize.height;
    if (this.textInputHeightByCursor !== height) {
      this.textInputHeightByCursor = height;
      this.scrollContent();
    }
  }

  onSelectionChange({nativeEvent}) {
    const cursorPosition = nativeEvent.selection.end;
    setTimeout(() => {
      const textByCursor = this.state.idea && this.state.idea.substring(0, cursorPosition);
      this.setState({
        textByCursor,
      });
    }, 0);    
  }

  onLayoutTextInput({nativeEvent: {layout}}) {
    this.textInputPositionY = layout.y;
  }

  onLayoutScrollView({nativeEvent: {layout}}) {
    this.scrollViewHeight = layout.height;
    this.scrollContent();
  }

  get renderText() {
    const { viewMode } = this.props;
    let isShowTextInput = false;
    if ((viewMode === CONSTANTS.CARD_NEW) || ((this.state.idea == '' || this.state.isEditableIdea) && (viewMode === CONSTANTS.CARD_EDIT))) {
      isShowTextInput = true;
    }
    if (isShowTextInput) {
      return (
        <View 
          style={{flex: 1}}
          onLayout={this.onLayoutTextInput.bind(this)}
        >
          <TextInput
            style={[styles.textInputIdea, {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              opacity: 0,
            }]}
            autoCorrect={false}
            multiline={true}
            underlineColorAndroid='transparent'
            value={this.state.textByCursor}
            onContentSizeChange={this.onContentSizeChange.bind(this)}
          />
          <TextInput
            ref={ref => this.textInputIdeaRef = ref}
            style={styles.textInputIdea}
            autoCorrect={true}
            placeholder='Type text or paste a link'
            multiline={true}
            underlineColorAndroid='transparent'
            value={this.state.idea}
            onChangeText={(value) => this.onChangeIdea(value)}
            onKeyPress={this.onKeyPressIdea.bind(this)}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlurIdea()}
            onSelectionChange={this.onSelectionChange.bind(this)}
            selectionColor={COLORS.PURPLE}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => this.onPressIdea()}>
        <ViewMoreText
          textStyle={styles.textInputIdea}
          numberOfLines={3}
          renderViewMore={this.renderSeeMore.bind(this)}
          renderViewLess={this.renderSeeLess.bind(this)}
        >
          <Autolink
            style={styles.textInputIdea}
            text={this.state.idea}
            onPress={(url, match) => this.onPressLink(url)}
          />
        </ViewMoreText>
      </TouchableOpacity>
    );
  }

  onLongPressWbeMetaLink = (url) => {
    Clipboard.setString(url)
    this.setState({ isSuccessCopyUrl: true })
    setTimeout(() => {
      this.setState({ isSuccessCopyUrl: false })
    }, 2000)
  }

  get renderWebMeta() {
    const { viewMode, cardMode } = this.props;
    const { links } = this.props.card.currentCard;
    if (links && links.length > 0) {
      const firstLink = links[0];
      return (
        <WebMetaList 
          links={[firstLink]}
          isFastImage={cardMode !== CONSTANTS.SHARE_EXTENTION_CARD}
          editable={viewMode !== CONSTANTS.CARD_VIEW}
          longPressLink={(url) => this.onLongPressWbeMetaLink(url)}
          // onRemove={(linkId) => this.onDeleteLink(linkId)}
        />
      )
    }
  }

  get renderDocuments() {
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      return;
    }
    const {
      files
    } = this.props.card.currentCard;
    const documentFiles = _.filter(files, file => file.fileType === 'FILE');
    if (documentFiles.length > 0) {
      return (
        <View style={{ paddingHorizontal: 6 }}>
          <DocumentList
            files={documentFiles}
            editable={viewMode !== CONSTANTS.CARD_VIEW}
            onRemove={(fileId) => this.onRemoveFile(fileId)}
          />
        </View>
      )
    }
  }

  renderSeeMore(onPress){
    return(
      <Text style={styles.textSeeMoreLessIdea} onPress={onPress}>See more</Text>
    );
  }

  renderSeeLess(onPress){
    return(
      <Text style={styles.textSeeMoreLessIdea} onPress={onPress}>See less</Text>
    );
  }

  get renderComments() {
    const { viewMode } = this.props;
    if (viewMode !== CONSTANTS.CARD_NEW) {
      return (
        <View>
          <View style={styles.line} />
          <LastCommentComponent prevPage={this.props.prevPage} />
        </View>
      )
    }
  }

  get renderMainContent() {
    return (
      <ScrollView
        ref={ref => this.scrollViewRef = ref}
        onLayout={this.onLayoutScrollView.bind(this)}
      >
        {this.renderCoverImage}
        {this.renderWebMeta}
        {this.renderText}
        {this.renderDocuments}
        {this.renderComments}
      </ScrollView>
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
          <Text style={styles.textFeedoName} numberOfLines={1}>{this.props.feedo.currentFeed.headline || 'New flow'}</Text>
          <Entypo name="chevron-right" size={20} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    )
  }

  get renderTopAttachmentButtons() {
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      return;
    } else if (viewMode !== CONSTANTS.CARD_EDIT) {
      return;
    }
    return (
      <View style={styles.attachmentButtonsContainer}>
        <TouchableOpacity 
          style={styles.iconView}
          activeOpacity={0.6}
          onPress={this.onAddMedia.bind(this)}
        >
          <Image source={IMAGE_ICON} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconView}
          activeOpacity={0.6}
          onPress={this.onAddDocument.bind(this)}
        >
          <Image source={ATTACHMENT_ICON} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.threeDotButtonWrapper}
          activeOpacity={0.6}
          onPress={() => this.onPressMoreActions()}
        >
          <Entypo name="dots-three-horizontal" size={20} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  get renderBottomAttachmentButtons() {
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      return;
    } else if (viewMode !== CONSTANTS.CARD_NEW) {
      return;
    }
    return (
      <View style={[styles.attachmentButtonsContainer, { paddingHorizontal: 16, marginVertical: 16 }]}>
        <TouchableOpacity 
          style={styles.iconView}
          activeOpacity={0.6}
          onPress={this.onAddMedia.bind(this)}
        >
          <Image source={IMAGE_ICON} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconView}
          activeOpacity={0.6}
          onPress={this.onAddDocument.bind(this)}
        >
          <Image source={ATTACHMENT_ICON} />
        </TouchableOpacity>
        {this.renderSelectFeedo}
      </View>
    );
  }

  get renderInvitee() {
    const { userProfile } = this.props.invitee;
    const { currentFeed } = this.props.feedo;
    const { userInfo } = this.props.user;

    let name = ''
    if (userProfile) {
      name = `${userProfile.firstName} ${userProfile.lastName}`;
    }

    const letterToWidthRatio = 0.5476; // Approximate this by taking the width of some representative text samples
    let fontSize = CONSTANTS.SCREEN_WIDTH * 0.42 / (name.length * letterToWidthRatio) - 4;

    if (fontSize > 14) {
      fontSize = 14;
    }

    if (COMMON_FUNC.isFeedOwner(currentFeed)) {
      const otherInvitees = _.filter(currentFeed.invitees, invitee => invitee.userProfile.id !== userInfo.id);
      if (!otherInvitees || otherInvitees.length === 0) {
        return (
          <View style={[styles.rowContainer, {flex: 1}]}>
            <Text style={styles.textInvitee}>{getDurationFromNow(this.props.card.currentCard.publishedDate)}</Text>
          </View>
        );
      }
    }

    return (
      <View style={[styles.rowContainer, {flex: 1}]}>
        <UserAvatarComponent
          user={userProfile}
        />
        <Text style={[styles.textInvitee, { marginLeft: 9, fontSize,}]} numberOfLines={1}>{name}</Text>
        <Entypo name="dot-single" style={styles.iconDot} />
        <Text style={styles.textInvitee}>{getDurationFromNow(this.props.card.currentCard.publishedDate)}</Text>
      </View>
    );
  }

  get renderLikesComment() {
    const idea = _.find(this.props.feedo.currentFeed.ideas, idea => idea.id === this.props.card.currentCard.id)

    if (idea) {
      return (
        <View style={styles.rowContainer}>
          <LikeComponent idea={idea} prevPage={this.props.prevPage} />
          <CommentComponent idea={idea} currentFeed={this.props.feedo.currentFeed} prevPage={this.props.prevPage} />
        </View>
      );
    }
    return null
  }

  get renderHeader() {
    const { cardMode, viewMode } = this.props;
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      return (
        <View style={[styles.headerContainer, styles.extensionHeaderContainer]}>
          <TouchableOpacity 
            style={styles.closeButtonShareWrapper}
            activeOpacity={0.7}
            onPress={() => this.props.shareUrl !== '' && this.props.shareImageUrls.length > 0 ? Actions.pop() : this.props.onClose()}
          >
            {
              this.props.shareUrl !== '' && this.props.shareImageUrls.length > 0 ?
                <Ionicons name="ios-arrow-back" size={28} color={COLORS.PURPLE} />
              :
                <Text style={[styles.textButton, {color: COLORS.PURPLE}]}>Cancel</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButtonShareWrapper}
            activeOpacity={0.6}
            onPress={this.onUpdateFeed.bind(this)}
          >
            <Text style={[styles.textButton, {color: COLORS.PURPLE}]}>Create card</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (viewMode === CONSTANTS.CARD_NEW) {
      return (
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.7}
            onPress={() => this.leaveActionSheetRef.show()}
          >
            <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addCardButtonWapper, {backgroundColor: COLORS.PURPLE}]}
            activeOpacity={0.6}
            onPress={this.onUpdateFeed.bind(this)}
          >
            <Text style={styles.textButton}>Done</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButtonWrapper}
          activeOpacity={0.7}
          onPress={() => this.onBack()}
        >
          <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
        </TouchableOpacity>
        {this.renderTopAttachmentButtons}
      </View>
    )
  }

  get renderBottomContent() {
    const { viewMode, cardMode } = this.props;
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      return (
        <View style={styles.extensionSelectFeedoContainer}>
          <Text style={[styles.textCreateCardIn, {color: COLORS.PRIMARY_BLACK}]}>Create card in:</Text>
          <TouchableOpacity
            style={[styles.selectFeedoButtonContainer, {paddingRight: 3}]}
            activeOpacity={0.6}
            onPress={this.onSelectFeedo.bind(this)}
          >
            <Text style={styles.textFeedoName} numberOfLines={1}>{this.props.feedo.currentFeed.headline || 'New flow'}</Text>
            <Entypo name="chevron-right" size={20} color={COLORS.PURPLE} />
          </TouchableOpacity>
        </View>
      )
    }
    if (viewMode !== CONSTANTS.CARD_NEW) {
      return (
        <View style={[styles.rowContainer, {justifyContent: 'space-between', marginHorizontal: 16, marginVertical: 8}]}>
          {this.renderInvitee}
          {this.renderLikesComment}
        </View>
      );
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
    } else {
      const animatedTopMove = this.animatedShow.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.originalCardTopY, 0],
      });
      cardStyle = {
        top: animatedTopMove,
        opacity: this.animatedShow,
      };
    }
    let contentContainerStyle = {};
    if (cardMode === CONSTANTS.SHARE_EXTENTION_CARD) {
      let bottomMargin = CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN;
      if (this.state.isShowKeyboardButton) {
        bottomMargin = 20;
      }
      contentContainerStyle = {
        height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN - bottomMargin, this.animatedKeyboardHeight),
        marginTop: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
        marginBottom: Animated.add(bottomMargin, this.animatedKeyboardHeight),
        borderRadius: 18,
        backgroundColor: '#fff',
        marginHorizontal: 16,
      }
    } else {
      contentContainerStyle = {
        paddingTop: 0,
        paddingBottom: this.animatedKeyboardHeight,
        height: CONSTANTS.SCREEN_HEIGHT,
        backgroundColor: '#fff',
      }
    }

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          cardStyle,
          cardMode === CONSTANTS.SHARE_EXTENTION_CARD && {backgroundColor: COLORS.MODAL_BACKGROUND}
        ]}
      >
        <Animated.View style={contentContainerStyle}>
          <SafeAreaView style={{flex: 1}}>
            {this.renderHeader}
            {this.renderMainContent}
            {this.renderBottomAttachmentButtons}
            {this.renderBottomContent}
            {
              // If show keyboard button, and not quick add card from dashboard as interferes with change Feed https://cl.ly/ba004cb3a34b
              viewMode === CONSTANTS.CARD_NEW && this.state.isShowKeyboardButton && cardMode !== CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD && cardMode !== CONSTANTS.SHARE_EXTENTION_CARD &&
              <Animated.View style={styles.hideKeyboardContainer}>
                <TouchableOpacity
                  style={[
                    styles.buttonItemContainer,
                    {
                      backgroundColor: COLORS.PURPLE,
                      borderRadius: 8,
                    },
                  ]}
                  activeOpacity={0.6}
                  onPress={this.onHideKeyboard.bind(this)}
                >
                  <MaterialCommunityIcons name="keyboard-close" size={20} color={'#fff'} />
                </TouchableOpacity>
              </Animated.View>
            }
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    );
  }

  get renderSelectHunt() {
    const { cardMode } = this.props;
    if (this.state.isVisibleSelectFeedoModal) {
      return (
        <SelectHuntScreen
          selectMode={cardMode !== CONSTANTS.SHARE_EXTENTION_CARD ? CONSTANTS.FEEDO_SELECT_FROM_MAIN : CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION}
          onClosed={() => this.onCloseSelectHunt()}
        />
      );
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderCard}
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

        <Modal 
          isVisible={this.state.isSuccessCopyUrl}
          style={styles.successModal}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ isSuccessCopyUrl: false })}
        >
          <View style={styles.successView}>
            <Octicons name="check" style={styles.successIcon} />
            <Text style={styles.successText}>Copied</Text>
          </View>
        </Modal>
      </View>
    );
  }
}


NewCardScreen.defaultProps = {
  prevPage: 'card',
  card: {},
  invitee: {},
  intialLayout: {},
  viewMode: CONSTANTS.CARD_NEW,
  cardMode: CONSTANTS.MAIN_APP_CARD_FROM_DETAIL,
  shareUrl: '',
  shareImageUrls: [],
  onClose: () => {},
  onOpenAction: () => {},
}


NewCardScreen.propTypes = {
  prevPage: PropTypes.string,
  card: PropTypes.object,
  invitee: PropTypes.object,
  intialLayout: PropTypes.object,
  viewMode: PropTypes.number,
  cardMode: PropTypes.number,
  shareUrl: PropTypes.string,
  shareImageUrls: PropTypes.array,
  onClose: PropTypes.func,
  onOpenAction: PropTypes.func,
}


const mapStateToProps = ({ card, feedo, user, }) => ({
  card,
  feedo,
  user,
})


const mapDispatchToProps = dispatch => ({
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, comments, tags, files) => dispatch(updateFeed(id, name, comments, tags, files)),
  deleteDraftFeed: (id) => dispatch(deleteDraftFeed(id)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  getFeedoList: (index) => dispatch(getFeedoList(index)),

  createCard: (huntId) => dispatch(createCard(huntId)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  updateCard: (huntId, ideaId, title, idea, coverImage, files) => dispatch(updateCard(huntId, ideaId, title, idea, coverImage, files)),
  getFileUploadUrl: (huntId, ideaId) => dispatch(getFileUploadUrl(huntId, ideaId)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (ideaId, fileType, contentType, name, objectKey) => dispatch(addFile(ideaId, fileType, contentType, name, objectKey)),
  deleteFile: (ideaId, fileId) => dispatch(deleteFile(ideaId, fileId)),
  setCoverImage: (ideaId, fileId) => dispatch(setCoverImage(ideaId, fileId)),
  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
  addLink: (ideaId, originalUrl, title, description, imageUrl, faviconUrl) => dispatch(addLink(ideaId, originalUrl, title, description, imageUrl, faviconUrl)),
  deleteLink: (ideaId, linkId) => dispatch(deleteLink(ideaId, linkId)),
  moveCard: (ideaId, huntId) => dispatch(moveCard(ideaId, huntId)),
  resetCardError: () => dispatch(resetCardError()),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewCardScreen)