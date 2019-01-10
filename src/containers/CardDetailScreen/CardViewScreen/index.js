import React from 'react'
import {
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Octicons from 'react-native-vector-icons/Octicons'
import ImageResizer from 'react-native-image-resizer';

import * as mime from 'react-native-mime-types'
import _ from 'lodash';
import Modal from 'react-native-modal';
import moment from 'moment'
import SharedGroupPreferences from 'react-native-shared-group-preferences';

import {
  getCard,
  updateCard,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  getOpenGraph,
  addLink,
  resetCardError,
} from '../../../redux/card/actions'
import {  
  getFeedoList,
} from '../../../redux/feedo/actions'
import * as types from '../../../redux/card/types'
import COLORS from '../../../service/colors';
import CONSTANTS from '../../../service/constants';
import styles from './styles';
import LoadingScreen from '../../LoadingScreen';
import ChooseLinkImages from '../../../components/chooseLinkImagesComponent';
import Analytics from '../../../lib/firebase'

class CardViewScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idea,
      coverImage,
      textByCursor: '',
      
      loading: false,

      originalCardTopY: this.props.intialLayout.py,
      originalCardBottomY: this.props.intialLayout.py + this.props.intialLayout.height,
      isShowKeyboardButton: false,
      isVisibleChooseLinkImagesModal: false,

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
    this.isVisibleErrorDialog = false;

    this.parsingErrorLinks = [];

    this.scrollViewHeight = 0;
    this.textInputPositionY = 0;
    this.textInputHeightByCursor = 0;

    this.isDisabledKeyboard = false;

    this.shareImageUrls = [];
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;

    if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_PENDING && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_PENDING) {
      loading = true;
    } else if (this.props.card.loading !== types.GET_FILE_UPLOAD_URL_FULFILLED && nextProps.card.loading === types.GET_FILE_UPLOAD_URL_FULFILLED) {
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
      const { id } = this.props.card.currentCard;
      const { objectKey } = this.props.card.fileUploadUrl;
      this.props.addFile(id, this.selectedFileType, this.selectedFileMimeType, this.selectedFileName, objectKey);
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
    } else if (this.props.card.loading !== types.UPDATE_CARD_FULFILLED && nextProps.card.loading === types.UPDATE_CARD_FULFILLED) {
      // success in updating a card
      if (this.props.cardMode === CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD) {
        this.saveFeedId();
      }
      this.onClose();
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
        idea: nextProps.card.currentCard.idea
      })
    }
  }

  async componentDidMount() {
    const { feedo, card } = this.props;

    this.setState({
      idea: card.currentCard.idea
    });

    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      if (feedo.feedoList.length == 0) {
        this.isGettingFeedoList = true;
        this.props.getFeedoList(0);
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
        toValue: e.endCoordinates.height,
        duration: e.duration,
      }
    ).start(() => {
      if (this.isDisabledKeyboard === true || !this.textInputIdeaRef) {
        return;
      }
      
      this.textInputIdeaRef.focus();
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

  saveFeedId() {
    const feedoInfo = {
      time: moment().format('LLL'),
      feedoId: this.props.feedo.currentFeed.id,
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

  onPressMoreActions() {
    if (this.props.onOpenAction) {
      this.props.onOpenAction(this.props.card.currentCard);
    }
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

  onUpdate() {
    const {
      id, 
      files,
    } = this.props.card.currentCard;
    const { idea } = this.state

    if (idea.length > 0 || (files && files.length > 0)) {
      const cardName = '';
      this.props.updateCard(this.props.feedo.currentFeed.id, id, cardName, this.state.idea, null, files);
    } else {
      Alert.alert('Error', 'Enter some text or add an image')
    }
  }

  onBack() {
    this.onUpdate();
  }

  addLinkImage(id, imageUrl) {
    const mimeType = mime.lookup(imageUrl) || 'image/jpeg';
    const filename = imageUrl.replace(/^.*[\\\/]/, '')
    this.props.addFile(id, 'MEDIA', mimeType, filename, imageUrl);
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
    return (
      <View 
        style={{ flex: 1 }}
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

  get renderHeader() {
    return (
      <TouchableOpacity 
        style={styles.headerContainer}
        activeOpacity={0.7}
        onPress={() => this.onBack()}
      >
        <View style={styles.closeButtonView}>
          <Text style={styles.closeButtonText}>Done</Text>
        </View>
      </TouchableOpacity>
    )
  }

  get renderMainContent() { 
    return (
      <ScrollView
        ref={ref => this.scrollViewRef = ref}
        onLayout={this.onLayoutScrollView.bind(this)}
      >
        <View style={styles.ideaContentView}>
          {this.renderText}
        </View>
      </ScrollView>
    );
  }

  get renderCard() {
    let cardStyle = {};

    const animatedTopMove = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.originalCardTopY, 0],
    });
    cardStyle = {
      top: animatedTopMove,
      opacity: this.animatedShow,
    };

    let contentContainerStyle = {
      paddingTop: 0,
      paddingBottom: this.animatedKeyboardHeight,
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
            {this.renderMainContent}
            {this.renderHeader}
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderCard}

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


CardViewScreen.defaultProps = {
  prevPage: 'card',
  card: {},
  invitee: {},
  intialLayout: {},
  viewMode: CONSTANTS.CARD_EDIT,
  cardMode: CONSTANTS.MAIN_APP_CARD_FROM_DETAIL,
  shareUrl: '',
  shareImageUrls: [],
  onClose: () => {},
  onOpenAction: () => {},
}


CardViewScreen.propTypes = {
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
  getFeedoList: (index) => dispatch(getFeedoList(index)),

  getCard: (ideaId) => dispatch(getCard(ideaId)),
  updateCard: (huntId, ideaId, title, idea, coverImage, files) => dispatch(updateCard(huntId, ideaId, title, idea, coverImage, files)),
  getFileUploadUrl: (huntId, ideaId) => dispatch(getFileUploadUrl(huntId, ideaId)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (ideaId, fileType, contentType, name, objectKey) => dispatch(addFile(ideaId, fileType, contentType, name, objectKey)),
  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
  addLink: (ideaId, originalUrl, title, description, imageUrl, faviconUrl) => dispatch(addLink(ideaId, originalUrl, title, description, imageUrl, faviconUrl)),
  resetCardError: () => dispatch(resetCardError()),
})


export default connect(mapStateToProps, mapDispatchToProps)(CardViewScreen)