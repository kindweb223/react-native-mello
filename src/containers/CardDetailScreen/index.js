import React from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Text,
  Clipboard,
  ScrollView,
  Linking,
  SafeAreaView,
  Platform,
  BackHandler,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import RNThumbnail from 'react-native-thumbnail';
import ImgToBase64 from 'react-native-image-base64';

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import _ from 'lodash';
import Modal from 'react-native-modal';
import moment from 'moment'
import Autolink from 'react-native-autolink';
import SafariView from "react-native-safari-view";
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import * as Animatable from 'react-native-animatable';

import { COMMENT_FEATURE } from '../../service/api'

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
  resetCardError,
} from '../../redux/card/actions'
import { 
  createFeed,
  setCurrentFeed,
  getFeedoList,
} from '../../redux/feedo/actions'
import * as types from '../../redux/card/types'
import * as feedoTypes from '../../redux/feedo/types'
import { getDurationFromNow } from '../../service/dateUtils'
import DocumentList from '../../components/DocumentListComponent';
import WebMetaList from '../../components/WebMetaListComponent';
import LikeComponent from '../../components/LikeComponent';
import ChooseLinkImages from '../../components/chooseLinkImagesComponent';
import UserAvatarComponent from '../../components/UserAvatarComponent';
import CoverImagePreviewComponent from '../../components/CoverImagePreviewComponent';
import LastCommentComponent from '../../components/LastCommentComponent';
import Analytics from '../../lib/firebase'
import LoadingScreen from '../LoadingScreen';
import CardEditScreen from './CardEditScreen'
import CardControlMenuComponent from '../../components/CardControlMenuComponent'
import ToasterComponent from '../../components/ToasterComponent'

import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';

const FOOTER_HEIGHT = 55
const FIXED_COMMENT_HEIGHT = 150
const IDEA_CONTENT_HEIGHT = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.STATUSBAR_HEIGHT - FIXED_COMMENT_HEIGHT - FOOTER_HEIGHT - CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT + ifIphoneX(0, 5)

class CardDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // cardName: '',
      idea: '',
      coverImage: '',
      links: [],
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
      isCopyLink: false,
      isDeleteLink: false,
      copiedLink: null,
      showEditScreen: false,
      isVisibleCardOpenMenu: false,
      cardOption: 0,
      initLoad: true,
      tempPosition: new Animated.ValueXY(),
      position: new Animated.ValueXY(),
      size: new Animated.ValueXY(),
      cardClosed: false,
      cardPadding: 0,
      isOpeningCard: true,
      isShowTempCard: false,
      fadeInUpAnimation: 'fadeInUp',
      slideInUpAnimation: 'slideInUp',
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

    this.animatedClose = new Animated.Value(1);
    this.animatedShow = new Animated.Value(0);
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
    this.coverImageWidth = 0
    this.coverImageHeight = 0
    this.coverImageScrollY = 0
    this.closeAnimationTime = CONSTANTS.ANIMATEION_MILLI_SECONDS + 50;
    this.scrollEnabled = true
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_PENDING) {
      // getting a file upload url
      loading = true;
    } else if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_FULFILLED) {
      // success in getting a file upload url
      loading = true;
      // Image resizing...
      const fileType = (Platform.OS === 'ios') ? this.selectedFileMimeType : this.selectedFile.type;

      if (fileType && fileType.indexOf('image/') !== -1) {
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
          } else if(imgRatio > maxRatio){
              //adjust height according to maxWidth
              imgRatio = maxWidth / actualWidth;
              actualHeight = imgRatio * actualHeight;
              actualWidth = maxWidth;
          } else{
              actualHeight = maxHeight;
              actualWidth = maxWidth;
          }
        }

        ImageResizer.createResizedImage(this.selectedFile.uri, actualWidth, actualHeight, CONSTANTS.IMAGE_COMPRESS_FORMAT, CONSTANTS.IMAGE_COMPRESS_QUALITY, 0, null)
          .then((response) => {
            console.log('Image compress Success!');
            this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, response.uri, this.selectedFileName, fileType);
          }).catch((error) => {
            console.log('Image compress error : ', error);
            this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, this.selectedFile.uri, this.selectedFileName, fileType);
          });
        return;
      }
      this.props.uploadFileToS3(nextProps.card.fileUploadUrl.uploadUrl, this.selectedFile.uri, this.selectedFileName, fileType);
    } else if (this.props.card.loading !== types.UPLOAD_FILE_PENDING && nextProps.card.loading === types.UPLOAD_FILE_PENDING) {
      // uploading a file
      loading = true;
    } else if (this.props.card.loading !== types.UPLOAD_FILE_FULFILLED && nextProps.card.loading === types.UPLOAD_FILE_FULFILLED) {
      // success in uploading a file
      loading = true;
      const { id } = this.props.card.currentCard;
      const { objectKey } = this.props.card.fileUploadUrl;
      const fileType = (Platform.OS === 'ios') ? this.selectedFileMimeType : this.selectedFile.type;
      if (fileType && fileType.indexOf('image/') !== -1) {
        const { width, height } = await this.getImageSize(this.selectedFile.uri);
        const metadata = {
          width,
          height
        }
        this.props.addFile(id, this.selectedFileType, fileType, this.selectedFileName, objectKey, metadata);
      }
      else {
        this.props.addFile(id, this.selectedFileType, fileType, this.selectedFileName, objectKey, null, this.base64String);
      }
    } else if (this.props.card.loading !== types.ADD_FILE_PENDING && nextProps.card.loading === types.ADD_FILE_PENDING) {
      loading = true;
    } else if (this.props.card.loading !== types.ADD_FILE_FULFILLED && nextProps.card.loading === types.ADD_FILE_FULFILLED) {
      // success in adding a file
      const { id } = this.props.card.currentCard;
      const newImageFiles = _.filter(nextProps.card.currentCard.files, file => file.contentType.indexOf('image') !== -1 || file.contentType.indexOf('video') !== -1);
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
      if (this.indexForAddedLinks < this.openGraphLinksInfo.length) {
        const { id } = this.props.card.currentCard;
        const {
          url,
          title,
          description,
          image,
          favicon,
        } = this.openGraphLinksInfo[this.indexForAddedLinks ++];
        this.props.addLink(id, url, title, description, image, favicon);
      } else if (this.allLinkImages.length > 0 
        && (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0)) {
        this.setState({
          isVisibleChooseLinkImagesModal: true,
        });
      }
    } else if (this.props.card.loading !== types.DELETE_LINK_PENDING && nextProps.card.loading === types.DELETE_LINK_PENDING) {
      // deleting a link
      loading = true;
    } else if (this.props.card.loading !== types.DELETE_LINK_FULFILLED && nextProps.card.loading === types.DELETE_LINK_FULFILLED) {
      this.setState({ isDeleteLink: true })
      setTimeout(() => {
        this.setState({ isDeleteLink: false })
      }, 3000)
    } else if (this.props.card.loading !== types.SET_COVER_IMAGE_FULFILLED && nextProps.card.loading === types.SET_COVER_IMAGE_FULFILLED) {
      const { width, height } = await this.getImageSize(nextProps.card.currentCard.coverImage);
      this.coverImageWidth = width
      this.coverImageHeight = height
      this.setState({
        coverImage: nextProps.card.currentCard.coverImage,
      });
      this.checkUrls();
      // success in setting a file as cover image
    } else if (this.props.card.loading !== types.UPDATE_CARD_FULFILLED && nextProps.card.loading === types.UPDATE_CARD_FULFILLED) {
      // success in updating a card
      if (this.props.cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
        this.saveFeedId();
      }
    } else if (this.props.card.loading !== types.DELETE_FILE_PENDING && nextProps.card.loading === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.card.loading !== types.DELETE_FILE_FULFILLED && nextProps.card.loading === types.DELETE_FILE_FULFILLED) {
      // success in deleting a file
      imageFiles = _.filter(nextProps.card.currentCard.files, file => file.contentType.indexOf('image') !== -1 || file.contentType.indexOf('video') !== -1);
      if (imageFiles.length > 0 && !nextProps.card.currentCard.coverImage) {
        this.onSetCoverImage(nextProps.card.currentCard.files[0].id);
      } else {
        const { width, height } = await this.getImageSize(nextProps.card.currentCard.coverImage);
        this.coverImageWidth = width
        this.coverImageHeight = height

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
    } else if (this.props.feedo.loading !== feedoTypes.GET_FEEDO_LIST_FULFILLED && nextProps.feedo.loading === feedoTypes.GET_FEEDO_LIST_FULFILLED) {
      if (this.isGettingFeedoList) {
        // loading = true;
        this.isGettingFeedoList = false;
        this.createCard(nextProps);
      }
    }


    // if (this.prevFeedo === null) {
    //   if (this.props.feedo.loading !== feedoTypes.UPDATE_FEED_PENDING && nextProps.feedo.loading === feedoTypes.UPDATE_FEED_PENDING) {
    //     // updating a feed
    //     loading = true;
    //   } else if (this.props.feedo.loading !== feedoTypes.UPDATE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.UPDATE_FEED_FULFILLED) {
    //     // success in updating a feed
    //     this.onUpdateCard();
    //   } else if (this.props.feedo.loading !== feedoTypes.DELETE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.DELETE_FEED_FULFILLED) {
    //     // success in deleting a feed
    //     if (this.isUpdateDraftCard) {
    //       this.onUpdateCard();
    //     } else {
    //       this.onClose();
    //     }
    //     return;
    //   }
    // }

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

            if (this.props.card.currentCard.links === null || this.props.card.currentCard.links.length === 0) {
              if (this.parseErrorUrls(error)) {
                error = 'Oops, we can\'t get the details from this link';
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
      const { width, height } = await this.getImageSize(nextProps.card.currentCard.coverImage);
      this.coverImageWidth = width
      this.coverImageHeight = height
      this.setState({
        idea: nextProps.card.currentCard.idea,
        coverImage: nextProps.card.currentCard.coverImage,
        links: nextProps.card.currentCard.links,
      })
    }
  }

  async componentDidMount() {
    const { viewMode, feedo, card, cardImageLayout, cardTextLayout, isMasonryView } = this.props;
    let { px, py, imgWidth, imgHeight } = cardImageLayout
    const { textPointX, textPointY, textWidth, textHeight } = cardTextLayout
    let imageHeight = 400
    if (viewMode === CONSTANTS.CARD_VIEW || viewMode === CONSTANTS.CARD_EDIT) {
      this.coverImageWidth = 0
      this.coverImageHeight = 0
      const coverData = _.find(card.currentCard.files, file => (file.accessUrl === card.currentCard.coverImage || file.thumbnailUrl === card.currentCard.coverImage))
      if (coverData && coverData.metadata) {
        this.coverImageWidth = coverData.metadata.width
        this.coverImageHeight = coverData.metadata.height
        const ratio = CONSTANTS.SCREEN_WIDTH / coverData.metadata.width
        imageHeight = coverData.metadata.height * ratio

        if (isMasonryView) {
          const masonryCardWidth = (CONSTANTS.SCREEN_SUB_WIDTH - 16) / 2 + 2
          const masonryRatio = coverData.metadata.width / masonryCardWidth
          imgHeight = coverData.metadata.height / masonryRatio
        }
      }

      this.setState({
        idea: card.currentCard.idea,
        coverImage: card.currentCard.coverImage,
        links: card.currentCard.links
      });
    }

    if (card.currentCard.idea === '' && viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({
        isEditableIdea: true,
      });
    }

    if (card.currentCard.coverImage) {
      //origin values
      this._width = imgWidth
      this._height = imgHeight
      this._x = px
      this._y = py - ifIphoneX(22, 0)

      //target values
      this._tWidth = CONSTANTS.SCREEN_WIDTH
      this._tHeight = imageHeight
      this._tX = 0
      this._tY = 0

      this.state.position.setValue({
        x: px,
        y: py,
      })

      this.state.size.setValue({
        x: imgWidth,
        y: imgHeight,
      })

      this.state.tempPosition.setValue({
        x: px,
        y: py,
      })
    } else {
      this._width = textWidth + 16 * 2
      this._height = textHeight
      this._x = textPointX - 16 // due to marginHorizontal of autolink text
      this._y = textPointY - this._textMarginTop - ifIphoneX(22, 0) // due to marginTop of autolink text

      this._tWidth = CONSTANTS.SCREEN_WIDTH
      this._tHeight = 200
      this._tX = 0
      this._tY = 0

      this.state.position.setValue({
        x: textPointX,
        y: textPointY,
      })

      this.state.size.setValue({
        x: textWidth,
        y: textHeight,
      })
    }

    const friction = 10
    Animated.parallel([
      Animated.spring(this.state.position.x, {
        toValue: this._tX,
        friction
      }),
      Animated.spring(this.state.position.y, {
        toValue: this._tY,
        friction
      }),
      Animated.spring(this.state.size.x, {
        toValue: this._tWidth,
        friction
      }),
      Animated.spring(this.state.size.y, {
        toValue: this._tHeight,
        friction
      }),
      Animated.spring(this.state.tempPosition.x, {
        toValue: this._tX,
        friction
      }),
      Animated.spring(this.state.tempPosition.y, {
        toValue: 20 + 80 + ifIphoneX(22, 0), // 80: limit scroll offset
        friction
      }),
      Animated.timing(this.animatedShow, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      })
    ]).start(() => {
      if (feedo.feedoList.length == 0) {
        this.isGettingFeedoList = true;
        this.props.getFeedoList(0);
      } else {
        this.createCard(this.props);
      }
    });
    if (Platform.OS === 'ios') {
      this.safariViewShowSubscription = SafariView.addEventListener('onShow', () => this.safariViewShow());
      this.safariViewDismissSubscription = SafariView.addEventListener('onDismiss', () => this.safariViewDismiss());
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.safariViewShowSubscription.remove();
      this.safariViewDismissSubscription.remove();
    }

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.onBack(this);
    return true;
  }

  getImageSize(uri) {
    if (uri) {
      return new Promise((resolve, reject) => {
        Image.getSize(uri,
          (width, height) => {
            resolve({width, height});
          }, (error) => {
            reject(error);
          });
      });
    } else {
      return { width: 0, height: 0 }
    }
  }

  safariViewShow() {
    this.isDisabledKeyboard = true;
  }

  safariViewDismiss() {
    this.isDisabledKeyboard = false;
  }

  async createCard(currentProps) {
    Analytics.logEvent('CardDetailScreen', {})

    const { cardMode, viewMode } = this.props;
    if (cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
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
    }
  }

  saveFeedId() {
    const feedoInfo = {
      time: moment().format('LLL'),
      feedoId: this.props.feedo.currentFeed.id,
      currentFeed: this.props.feedo.currentFeed
    }
    SharedGroupPreferences.setItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, JSON.stringify(feedoInfo), CONSTANTS.APP_GROUP_LAST_USED_FEEDO)
  }

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
    const allUrls = message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
    if (allUrls) {
      let newUrls = [];
      allUrls.forEach(url => {
        const index = _.findIndex(this.parsingErrorLinks, errorLink => errorLink === url);
        if (index === -1) {
          url = url.replace('[', '');
          url = url.replace(']', '');
          newUrls.push(url);
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
    if (this.props.viewMode === CONSTANTS.CARD_EDIT) {
      this.onUpdateCard()
    }

    let { cardPadding, coverImage } = this.state
    if (cardPadding !== 0 && Math.abs(cardPadding - 20) > 3) {
      cardPadding = 20
      this.scrollEnabled = false
    }

    // Revise if attempt to close card by scrolling down
    if (coverImage) {
      this._width = this._width + 2 * cardPadding
      this._height = this._height + 2 * cardPadding
      this._x = this._x - cardPadding
      this._y = this._y + ifIphoneX(cardPadding > 0 ? 22 : 0, 0)
    }

    if (this.props.isFromNotification || !coverImage) {
      this.props.onClose()
      return
    }

    this.setState({
      originalCardTopY: this.props.intialLayout.py,
      originalCardBottomY: this.props.intialLayout.py + this.props.intialLayout.height,
      isOpeningCard: false,
      isShowTempCard: cardPadding > 0
    }, () => {
      Animated.parallel([
        Animated.timing(this.state.position.x, {
          toValue: this._x,
          duration: this.closeAnimationTime,
        }),
        Animated.timing(this.state.position.y, {
          toValue: this._y,
          duration: this.closeAnimationTime,
        }),
        Animated.timing(this.state.size.x, {
          toValue: this._width,
          duration: this.closeAnimationTime,
        }),
        Animated.timing(this.state.size.y, {
          toValue: this._height,
          duration: this.closeAnimationTime,
        }),
        Animated.timing(this.state.tempPosition.x, {
          toValue: this._x,
          duration: this.closeAnimationTime,
        }),
        Animated.timing(this.state.tempPosition.y, {
          toValue: this._y,
          duration: this.closeAnimationTime,
        }),
        Animated.timing(this.animatedClose, {
          toValue: 0,
          duration: this.closeAnimationTime,
        })
      ]).start(() => {
        this.props.onClose()
        this.animatedShow.setValue(1);
        Animated.timing(this.animatedShow, {
          toValue: 0,
          duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
        }).start()
      });
    });
  }

  onUpdateCard() {
    const { currentCard } = this.props.card
    const { id, huntId, files } = currentCard
    const { idea, coverImage, links } = this.state

    if (currentCard.idea !== idea || currentCard.coverImage !== coverImage || currentCard.links !== links) {
      this.props.updateCard(huntId, id, '', idea, coverImage, files, false);
    }
  }

  onTapActionSheet(index) {
    if (index === 0) {
      this.props.onDeleteCard(this.props.card.currentCard.id)
    }
  }

  handleControlMenu = type => {
    this.setState({ cardOption: type, isVisibleCardOpenMenu: false })
  }

  handleControlMenHide = () => {
    const { cardOption } = this.state

    if (cardOption === 1) {
      this.onPressIdea()
    } else if (cardOption === 2) {
      this.onAddFile()
    } else if (cardOption === 3) {
      this.onAddDocument()
    } else if (cardOption === 4) {
      this.props.onMoveCard(this.props.card.currentCard.id)
    } else if (cardOption === 5) {
      setTimeout(() => {
        this.deleteActionSheet.show()
      }, 200)
    }
    this.setState({ cardOption: 0 })
  }

  onAddFile() {
    Permissions.checkMultiple(['camera', 'photo']).then(response => {
      if (response.camera === 'authorized' && response.photo === 'authorized') {
        setTimeout(() => {
          this.imagePickerActionSheetRef.show()
        }, 200)
    
      }
      else {
        Permissions.request('camera').then(response => {
          if (response === 'authorized') {
            Permissions.request('photo').then(response => {
              if (response === 'authorized') {
                setTimeout(() => {
                  this.imagePickerActionSheetRef.show()
                }, 200)
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

  PickerDocumentShow () {
    setTimeout(() => {
      DocumentPicker.show({
        filetype: [DocumentPickerUtil.allFiles()],
      },(error, response) => {
        if (error === null) {
          if (response.fileSize > CONSTANTS.MAX_UPLOAD_FILE_SIZE) {
            COMMON_FUNC.showPremiumAlert()
          } else {
            let type = 'FILE';
            const mimeType = mime.lookup(response.uri);
            if (mimeType !== false) {
              if (mimeType.indexOf('image') !== -1 || mimeType.indexOf('video') !== -1) {
                type = 'MEDIA';
              }
              this.generateThumbnail(response)  // Generate thumbnail if video
            }
            this.uploadFile(this.props.card.currentCard, response, type);
          }
        }
      });
      return;
      }, 200)
  }

  onDoneEditCard() {
    this.onUpdateCard()
    this.onCancelEditCard()
  }

  onCancelEditCard() {
    this.setState({
      showEditScreen: false,
      fadeInUpAnimation: '',
      slideInUpAnimation: '',
    })
  }

  onPressMoreActions() {
    if (this.props.viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({ isVisibleCardOpenMenu: true })
    }
  }

  async uploadFile(currentCard, file, type) {
    this.selectedFile = file;

    if (_.endsWith(file.uri, '.pages')) {
      this.selectedFileMimeType = 'application/x-iwork-pages-sffpages'
    } else if (_.endsWith(file.uri, '.numbers')) {
      this.selectedFileMimeType = 'application/x-iwork-numbers-sffnumbers'
    } else if (_.endsWith(file.uri, '.key')) {
      this.selectedFileMimeType = 'application/x-iwork-keynote-sffkey'
    } else {
      this.selectedFileMimeType = mime.lookup(file.uri);
    }

    this.selectedFileName = file.fileName;
    this.selectedFileType = type;

    if (currentCard.id) {
      this.props.getFileUploadUrl(this.props.feedo.currentFeed.id, currentCard.id);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (response.fileSize > CONSTANTS.MAX_UPLOAD_FILE_SIZE) {
          COMMON_FUNC.showPremiumAlert()
        } else {
          if (!response.fileName) {
            response.fileName = response.uri.replace(/^.*[\\\/]/, '')
          }
          this.generateThumbnail(response)  // Generate thumbnail if video
          this.uploadFile(this.props.card.currentCard, response, 'MEDIA');
        }
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        if (response.fileSize > CONSTANTS.MAX_UPLOAD_FILE_SIZE) {
          COMMON_FUNC.showPremiumAlert()
        } else {
          this.generateThumbnail(response)  // Generate thumbnail if video
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
      this.pickMediaFromCamera(options);
    } else if (index === 1) {
      // from library
      this.pickMediaFromLibrary(options);
    }
  }

  generateThumbnail(file) {
    const mimeType = mime.lookup(file.uri);

    if (mimeType.indexOf('video') !== -1) {
      RNThumbnail.get(file.uri).then((result) => {
        ImageResizer.createResizedImage(result.path, result.width, result.height, CONSTANTS.IMAGE_COMPRESS_FORMAT, 50, 0, null)
        .then((response) => {
          ImgToBase64.getBase64String(response.uri)
            .then(base64String => this.base64String = 'data:image/png;base64,' + base64String)
            .catch(err => console.log(err));                
        }).catch((error) => {
          console.log('Image compress error: ', error);
        });
      }).catch((error) => {
        console.log('RNThumbnail error: ', error);
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

  onChangeIdea(text) {
    this.setState({
      idea: text
    })
  }

  onKeyPressIdea(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.checkUrls();
    }
  }

  onFocus() {
    const { viewMode } = this.props;
    if (viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({
        isShowKeyboardButton: true,
      });
    }
  }

  onBlurIdea() {
    this.setState({
      isShowKeyboardButton: false,
      isEditableIdea: false,
    });
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

  onBack() {
    this.onClose();
  }

  async addLinkImage(id, imageUrl) {
    const mimeType = mime.lookup(imageUrl) || 'image/jpeg';
    const filename = imageUrl.replace(/^.*[\\\/]/, '')

    const { width, height } = await this.getImageSize(imageUrl);
    const metadata = {
      width,
      height
    }

    this.props.addFile(id, 'MEDIA', mimeType, filename, imageUrl, metadata);
  }

  get renderCoverImage() {
    const { viewMode, card } = this.props;
    const activeImageStyle = {
      width: this.state.size.x,
      height: this.state.size.y,
      top: this.state.position.y,
      left: this.state.position.x,
      padding: this.state.cardPadding,
    };
    let imageFiles = _.filter(card.currentCard.files, file => file.fileType === 'MEDIA');

    if (this.state.coverImage) {
      return (
        <Animated.View style={[styles.coverImageContainer, activeImageStyle]}>
          <CoverImagePreviewComponent
            coverImage={this.state.coverImage}
            files={imageFiles}
            editable={viewMode !== CONSTANTS.CARD_VIEW}
            isFastImage={true}
            isSetCoverImage={true}
            onRemove={(fileId) => this.onRemoveFile(fileId)}
            onSetCoverImage={(fileId) => this.onSetCoverImage(fileId)}
          />
        </Animated.View>
      );
    }
  }

  get renderTempCoverImage() {
    const { viewMode, card } = this.props;
    const activeImageStyle = {
      width: this.state.size.x,
      height: this.state.size.y,
      top: this.state.tempPosition.y,
      left: this.state.tempPosition.x,
      padding: 20,
      opacity: this.state.isShowTempCard ? 1 : 0
    };
    let imageFiles = _.filter(card.currentCard.files, file => file.fileType === 'MEDIA');

    if (this.state.coverImage) {
      return (
        <Animated.View style={[styles.tempCoverImageContainer, activeImageStyle]}>
          <CoverImagePreviewComponent
            coverImage={this.state.coverImage}
            files={imageFiles}
            editable={viewMode !== CONSTANTS.CARD_VIEW}
            isFastImage={true}
            isSetCoverImage={true}
            onRemove={(fileId) => this.onRemoveFile(fileId)}
            onSetCoverImage={(fileId) => this.onSetCoverImage(fileId)}
          />
        </Animated.View>
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

  onPressIdea() {
    if (this.props.viewMode === CONSTANTS.CARD_EDIT) {
      this.setState({ showEditScreen: true })
    }
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

  get renderText() {
    const { links } = this.props.card.currentCard;
    const { coverImage, isOpeningCard } = this.state
  
    let marginTop = 24
    marginTop = coverImage ? 24 : 65
    if (links && links.length > 0) {
      marginTop = 6
    } else {
      marginTop = coverImage ? 24 : 65
    }
    this._textMarginTop = marginTop

    let activeTextStyle = {
      width: this.state.size.x,
      height: this.state.size.y,
      top: this.state.position.y,
      left: this.state.position.x,
    };

    if (coverImage && !isOpeningCard) {
      return null
    }

    // Disable text only transition in masonry view or opening card
    if (!coverImage) {
      if (this.props.isMasonryView || isOpeningCard) {
        activeTextStyle = null
      }
    }

    return (
      <TouchableOpacity style={{ marginTop, marginBottom: 16 }} activeOpacity={1} onPress={() => this.onPressIdea()}>
        <Animated.View style={coverImage ? { opacity: this.animatedClose } : activeTextStyle}>
          <Animatable.View
            duration={CONSTANTS.ANIMATABLE_DURATION}
            animation={this.state.fadeInUpAnimation}
          >
            <Autolink
              style={styles.textInputIdea}
              text={this.state.idea}
              onPress={(url, match) => this.onPressLink(url)}
            />
          </Animatable.View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  onTapWebLinkActionSheet = (index) => {
    switch(index) {
      case 0:
        Clipboard.setString(this.state.copiedLink.originalUrl)
        this.setState({ isCopyLink: true })
        setTimeout(() => {
          this.setState({ isCopyLink: false })
        }, 2000)
        break;
      case 1:
        this.props.deleteLink(this.props.card.currentCard.id, this.state.copiedLink.id)
        break;
      default:
        break;
    }
  }

  onLongPressWbeMetaLink = (link) => {
    this.setState({ copiedLink: link })
    setTimeout(() => {
      this.webLinkActionSheet.show()
    }, 200)
  }

  get renderWebMeta() {
    const { viewMode } = this.props;
    const { links } = this.props.card.currentCard;

    if (links && links.length > 0) {
      const firstLink = links[0];
      return this.state.isOpeningCard && (
        <WebMetaList
          viewMode="edit"
          links={[firstLink]}
          isFastImage={true}
          coverImage={this.state.coverImage}
          editable={viewMode !== CONSTANTS.CARD_VIEW}
          longPressLink={(link) => this.onLongPressWbeMetaLink(link)}
        />
      )
    }
  }

  get renderDocuments() {
    const { viewMode } = this.props;
    const { files } = this.props.card.currentCard;

    const documentFiles = _.filter(files, file => file.fileType === 'FILE');
    if (documentFiles.length > 0) {
      return this.state.isOpeningCard && (
        <Animatable.View
          duration={CONSTANTS.ANIMATABLE_DURATION}
          animation={this.state.fadeInUpAnimation}
        >
          <View style={{ paddingHorizontal: 6 }}>
            <DocumentList
              files={documentFiles}
              editable={viewMode !== CONSTANTS.CARD_VIEW}
              onRemove={(fileId) => this.onRemoveFile(fileId)}
            />
          </View>
        </Animatable.View>
      )
    }
  }

  get renderHeader() {
    return this.state.isOpeningCard && (
      <TouchableOpacity 
        style={styles.headerContainer}
        activeOpacity={0.7}
        onPress={() => this.onBack()}
      >
        <Animated.View style={[styles.closeButtonView, { opacity: this.animatedClose }]}>
          <Ionicons name="md-close" size={25} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  get renderOwnerAndTime() {
    const { userProfile } = this.props.invitee;
    const { currentFeed } = this.props.feedo;
    const { currentCard } = this.props.card;
    const { userInfo } = this.props.user;

    const idea = _.find(currentFeed.ideas, idea => idea.id === currentCard.id)

    let name = ''
    if (userProfile) {
      name = `${userProfile.firstName} ${userProfile.lastName}`;
    }

    const letterToWidthRatio = 0.5476; // Approximate this by taking the width of some representative text samples
    let fontSize = CONSTANTS.SCREEN_WIDTH * 0.42 / (name.length * letterToWidthRatio) - 4;

    if (fontSize > 14) {
      fontSize = 14;
    }

    // if (COMMON_FUNC.isFeedOwner(currentFeed)) {
    //   const otherInvitees = _.filter(currentFeed.invitees, invitee => invitee.userProfile.id !== userInfo.id);
    //   if (!otherInvitees || otherInvitees.length === 0) {
    //     return (
    //       <View style={styles.inviteeContainer}>
    //         <Text style={styles.textInvitee}>{getDurationFromNow(currentCard.lastUpdated)}</Text>
    //       </View>
    //     );
    //   }
    // }
    let showLikes = true
    if (COMMON_FUNC.isFeedOwner(currentFeed)) {
      const otherInvitees = _.filter(currentFeed.invitees, invitee => invitee.userProfile.id !== userInfo.id);
      if (!otherInvitees || otherInvitees.length === 0) {
        showLikes = false
      }
    }

    return this.state.isOpeningCard && (
      <Animatable.View
        duration={CONSTANTS.ANIMATABLE_DURATION}
        animation={this.state.fadeInUpAnimation}
      >
        <View style={styles.inviteeContainer}>
          <View style={styles.inviteeView}>
            <UserAvatarComponent
              user={userProfile}
            />
            <Text style={[styles.textInvitee, { marginLeft: 9, fontSize }]} numberOfLines={1}>{name}</Text>
            <Entypo name="dot-single" style={styles.iconDot} />
            <Text style={styles.textInvitee}>{getDurationFromNow(currentCard.lastUpdated)}</Text>
          </View>
          {showLikes && idea && (
            <LikeComponent idea={idea} prevPage={this.props.prevPage} type="text" />
          )}
        </View>
      </Animatable.View>
    );
  }

  get renderCommentList() {
    return this.state.isOpeningCard && (
      <Animatable.View
        duration={CONSTANTS.ANIMATABLE_DURATION}
        animation={this.state.fadeInUpAnimation}
      >
        <LastCommentComponent prevPage={this.props.prevPage} initLoad={this.state.initLoad} />
      </Animatable.View>
    )
  }

  onScrollContent(event) {
    const scrollY = event.nativeEvent.contentOffset.y
    // If scroll down to go back to the top, do not close card
    if (scrollY > 0) {
      this.coverImageScrollY = scrollY
      return
    }

    if (scrollY <= 0) {
      if (!this.props.isFromNotification) {
        this.setState({ cardPadding: Math.abs(scrollY / 4)})
      }
    }

    if (scrollY === 0) {
      this.coverImageScrollY = 0
    }

    // If scroll dwon from top and scroll offset is less than -80, close card
    if (this.coverImageScrollY === 0 && scrollY < -80 && !this.state.cardClosed ) {
      if (this.state.coverImage) {
        this.closeAnimationTime = CONSTANTS.ANIMATEION_MILLI_SECONDS + 50
      }
      this.setState({ cardClosed: true })
      this.onClose()
    }

    if (this.state.initLoad) {
      this.setState({ initLoad: false })
    }
  }

  get renderMainContent() {
    const { currentComments } = this.props.card;
    const minHeight = currentComments.length === 0 ? IDEA_CONTENT_HEIGHT + FIXED_COMMENT_HEIGHT - FOOTER_HEIGHT : IDEA_CONTENT_HEIGHT

    return (
      <ScrollView
        style={{ opacity: this.state.isShowTempCard ? 0 : 1 }}
        ref={ref => this.scrollViewRef = ref}
        onLayout={this.onLayoutScrollView.bind(this)}
        onScroll={this.onScrollContent.bind(this)}
        scrollEventThrottle={100}
        scrollEnabled={this.scrollEnabled}
      >
        <View style={[styles.ideaContentView, { minHeight }]}>
          {this.renderCoverImage}
          {this.renderWebMeta}
          {this.renderText}
          {this.renderDocuments}
        </View>

        {/* {this.renderHeader} */}
        {this.renderOwnerAndTime}
        {COMMENT_FEATURE && this.renderCommentList}
      </ScrollView>
    );
  }

  onAddComment = () => {
    Analytics.logEvent('edit_card_add_comment', {})

    if (this.props.prevPage === 'activity') {
      Actions.ActivityCommentScreen({
        idea: this.props.card.currentCard,
        guest: COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed),
        isShowKeyboard: true,
      });
    } else {
      Actions.CommentScreen({
        idea: this.props.card.currentCard,
        guest: COMMON_FUNC.isFeedGuest(this.props.feedo.currentFeed),
        isShowKeyboard: true,
      });
    }
  }

  get renderAddComment() {
    return (
      <TouchableOpacity 
        style={styles.rowContainer}
        activeOpacity={0.6}
        onPress={this.onAddComment}
      >
        <Text style={styles.textAddComment}>Add comment</Text>
      </TouchableOpacity>
    )
  }

  get renderFooter() {
    const { feedo, viewMode } = this.props;
    const idea = _.find(this.props.feedo.currentFeed.ideas, idea => idea.id === this.props.card.currentCard.id)

    return (
      <Animatable.View
        duration={CONSTANTS.ANIMATABLE_DURATION + 200}
        animation={this.state.slideInUpAnimation}
      >
        <View style={[styles.footerContainer, { opacity: this.state.isOpeningCard ? 1 : 0 }]}>
          {COMMENT_FEATURE && !COMMON_FUNC.isFeedGuest(feedo.currentFeed) &&
            <View style={styles.addCommentView}>
              {this.renderAddComment}
            </View>
          }

          <View style={styles.likeView}>
            {viewMode === CONSTANTS.CARD_EDIT && (
              <TouchableOpacity 
                style={styles.threeDotButtonWrapper}
                activeOpacity={0.6}
                onPress={() => this.onPressMoreActions()}
              >
              <Entypo name="dots-three-horizontal" size={20} color={COLORS.MEDIUM_GREY} />
              </TouchableOpacity>
            )}

            {idea && (
              <LikeComponent idea={idea} prevPage={this.props.prevPage} type="icon" />
            )}
          </View>
        </View>
      </Animatable.View>
    )
  }

  get renderCard() {
    let cardStyle = {};

    const animatedTopMove = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.originalCardTopY, 0],
    });
    cardStyle = {
      // top: animatedTopMove,
      opacity: this.animatedShow,
    };

    let contentContainerStyle = {
      paddingBottom: Platform.OS==='android'? 20: 0,
      height: CONSTANTS.SCREEN_HEIGHT,
      backgroundColor: '#fff',
    }

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          cardStyle
        ]}
      >
        <Animated.View style={contentContainerStyle}>
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderTempCoverImage}
            {this.renderMainContent}
            {this.renderHeader}
            {this.renderFooter}
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    );
  }

  render () {
    const { showEditScreen, idea, loading } = this.state

    return (
      <View style={styles.container}>
        {showEditScreen
          ? <CardEditScreen
              {...this.props}
              idea={idea}
              checkUrls={() => this.checkUrls()}
              onDoneEditCard={() => this.onDoneEditCard()}
              onCancelEditCard={() => this.onCancelEditCard()}
              onChangeIdea={(value) => this.onChangeIdea(value)}
            />
          : this.renderCard
        }

        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          title='Select a Photo / Video'
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />
        <ActionSheet
          ref={ref => this.deleteActionSheet = ref}
          title={'Cards are the start of great ideas. Are you sure want to delete?'}
          options={['Delete', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapActionSheet(index)}
        />
        <ActionSheet
          ref={ref => this.webLinkActionSheet = ref}
          options={['Copy', 'Delete', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapWebLinkActionSheet(index)}
        />

        {loading && <LoadingScreen />}

        <Modal
          isVisible={this.state.isVisibleCardOpenMenu}
          style={styles.shareScreenContainer}
          backdropColor='#fff'
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={500}
          onModalHide={this.handleControlMenHide}
          onBackdropPress={() => this.setState({ isVisibleCardOpenMenu: false })}
          onBackButtonPress={() => this.setState({ isVisibleCardOpenMenu: false })}
        >
          <Animated.View style={styles.settingCardMenuView}>
            <CardControlMenuComponent
              onEditIdea={() => this.handleControlMenu(1)}
              onAddImage={() => this.handleControlMenu(2)}
              onAddFile={() => this.handleControlMenu(3)}
              onMove={() => this.handleControlMenu(4)}
              onDelete={() => this.handleControlMenu(5)}
            />
          </Animated.View>
        </Modal>

        <Modal 
          style={styles.shareScreenContainer}
          isVisible={this.state.isVisibleChooseLinkImagesModal}
        >
          <ChooseLinkImages
            images={this.allLinkImages}
            onClose={this.onCloseLinkImages.bind(this)}
            onSave={this.onSaveLinkImages.bind(this)}
          />
        </Modal>

        <ToasterComponent
          isVisible={this.state.isCopyLink}
          title="Copied"
          buttonTitle="OK"
          onPressButton={() => this.setState({ isCopyLink: false })}
          onBackButtonPress={() => this.setState({ isCopyLink: false })}
        />

        {this.state.isDeleteLink && (
          <ToasterComponent
            isVisible={this.state.isDeleteLink}
            title="Link deleted"
            buttonTitle="OK"
            onPressButton={() => this.setState({ isDeleteLink: false })}
          />
        )}
      </View>
    )
  }
}

CardDetailScreen.defaultProps = {
  prevPage: 'card',
  card: {},
  invitee: {},
  intialLayout: {},
  cardImageLayout: {},
  viewMode: CONSTANTS.CARD_EDIT,
  cardMode: CONSTANTS.MAIN_APP_CARD_FROM_DETAIL,
  shareUrl: '',
  shareImageUrls: [],
  isMasonryView: false,
  onClose: () => {},
  onOpenAction: () => {},
}


CardDetailScreen.propTypes = {
  prevPage: PropTypes.string,
  card: PropTypes.object,
  invitee: PropTypes.object,
  intialLayout: PropTypes.object,
  cardImageLayout: PropTypes.object,
  viewMode: PropTypes.number,
  cardMode: PropTypes.number,
  shareUrl: PropTypes.string,
  shareImageUrls: PropTypes.array,
  isMasonryView: PropTypes.bool,
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
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  getFeedoList: (index) => dispatch(getFeedoList(index)),

  createCard: (huntId) => dispatch(createCard(huntId)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  updateCard: (huntId, ideaId, title, idea, coverImage, files, isCreateCard) => dispatch(updateCard(huntId, ideaId, title, idea, coverImage, files, isCreateCard)),
  getFileUploadUrl: (huntId, ideaId) => dispatch(getFileUploadUrl(huntId, ideaId)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (ideaId, fileType, contentType, name, objectKey, metadata, base64String) => dispatch(addFile(ideaId, fileType, contentType, name, objectKey, metadata, base64String)),
  deleteFile: (ideaId, fileId) => dispatch(deleteFile(ideaId, fileId)),
  setCoverImage: (ideaId, fileId) => dispatch(setCoverImage(ideaId, fileId)),
  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
  addLink: (ideaId, originalUrl, title, description, imageUrl, faviconUrl) => dispatch(addLink(ideaId, originalUrl, title, description, imageUrl, faviconUrl)),
  deleteLink: (ideaId, linkId) => dispatch(deleteLink(ideaId, linkId)),
  resetCardError: () => dispatch(resetCardError())
})


export default connect(mapStateToProps, mapDispatchToProps)(CardDetailScreen)