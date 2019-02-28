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
  SafeAreaView,
  Platform,
  ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as mime from 'react-native-mime-types'
import _ from 'lodash';
import moment from 'moment'
import SafariView from "react-native-safari-view";
import SharedGroupPreferences from 'react-native-shared-group-preferences';

import {
  getOpenGraph,
  resetCardError,
  addSharExtensionCard
} from '../../redux/card/actions'
import {  
  updateFeed,
  setCurrentFeed,
  getFeedoList,
  createFeed
} from '../../redux/feedo/actions'
import * as types from '../../redux/card/types'
import * as feedoTypes from '../../redux/feedo/types'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import WebMetaList from '../../components/WebMetaListComponent';
import CoverImagePreviewComponent from '../../components/CoverImagePreviewComponent';
import SelectHuntScreen from '../SelectHuntScreen';
import Analytics from '../../lib/firebase'

class CardNewShareScreen extends React.Component {
  constructor(props) {
    super(props);

    let coverImage = '';
    let idea = '';

    if (props.shareUrl !== '') {
      const openGraph = props.card.currentOpneGraph;
      coverImage = props.shareImageUrls.length > 0 ? props.shareImageUrls[0] : '',
      idea = openGraph.title || openGraph.metatags.title || '';
    }

    if (props.shareText !== '') {
      idea = props.shareText;
    }

    this.state = {
      idea,
      coverImage,
      textByCursor: '',
      
      loading: false,
      isVisibleSelectFeedoModal: false,
      isShowKeyboardButton: false,
      cachedFeedList: [],
      createEnabled: false
    };

    this.selectedFile = null;
    this.selectedFileMimeType = null;
    this.selectedFileType = null;
    this.selectedFileName = null;

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);

    this.isVisibleErrorDialog = false;

    this.parsingErrorLinks = [];

    this.draftFeedo = null;

    this.scrollViewHeight = 0;
    this.textInputPositionY = 0;
    this.textInputHeightByCursor = 0;

    this.isDisabledKeyboard = false;

    this.shareImageUrls = [];

    this.coverImageWidth = 0
    this.coverImageHeight = 0

    if (props.shareUrl === '' && props.shareImageUrls.length) {
      props.shareImageUrls.forEach( async(imageUri, index) => {
        const fileName = imageUri.substring(imageUri.lastIndexOf("/") + 1, imageUri.length);
        const { width, height } = await this.getImageSize(imageUri);
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

  getLinks = () => {
    let links = []
    if (this.props.shareUrl !== '') { // If share extension and a url has been passed
      const openGraph = this.props.card.currentOpneGraph;
      const originalUrl = this.props.shareUrl || openGraph.url || openGraph.metatags['og:url'];
      const title = openGraph.title || openGraph.metatags.title;
      const description = openGraph.description || openGraph.metatags.metatags;
      const imageUrl =  openGraph.image || openGraph.metatags['og:image'] || (this.props.shareImageUrls.length > 0 && this.props.shareImageUrls[0]);
      const faviconUrl =  openGraph.favicon;
      links = [
        {
          originalUrl,
          title,
          description,
          imageUrl,
          faviconUrl
        }
      ]
    }
    return links
  }

  async onCreateCard() {
    const links = this.getLinks()

    const huntId = this.props.feedo.currentFeed.id

    const { idea } = this.state
    let files = []
    if (this.props.shareImageUrls.length > 0) {
      const file = this.props.shareImageUrls[0]
      this.selectedFile = file;
      this.selectedFileMimeType = mime.lookup(file);
      this.selectedFileName = file.replace(/^.*[\\\/]/, '')
      this.selectedFileType = 'MEDIA';

      const { width, height } = await this.getImageSize(file);

      files = [
        {
          id: null,
          name: this.selectedFileName,
          contentType: this.selectedFileMimeType,
          objectKey: this.selectedFile,
          accessUrl: this.selectedFile,
          thumbnailUrl: null,
          fileType: this.selectedFileType,
          metadata: {
            width,
            height
          }
        }
      ]
    }

    this.setState({ loading: true })
    this.props.addSharExtensionCard(huntId, idea, links, files, 'PUBLISHED')
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.feedo.loading !== feedoTypes.GET_FEEDO_LIST_FULFILLED && nextProps.feedo.loading === feedoTypes.GET_FEEDO_LIST_FULFILLED) {
      this.setState({cachedFeedList: nextProps.feedo.feedoList, createEnabled: true})

      try {
        const strFeedoInfo = await SharedGroupPreferences.getItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, CONSTANTS.APP_GROUP_LAST_USED_FEEDO);
        if (strFeedoInfo) {
          const feedoInfo = JSON.parse(strFeedoInfo);
          const diffHours = moment().diff(moment(feedoInfo.time, 'LLL'), 'hours');
          if (diffHours < 1) {
            const currentFeed = _.find(nextProps.feedo.feedoList, feed => feed.id === feedoInfo.feedoId)
            if (currentFeed) {
              this.props.setCurrentFeed(currentFeed);
              this.draftFeedo = currentFeed
              return;
            }
            else {
              this.props.setCurrentFeed({});
              this.draftFeedo = null
            }
          }
        }
      } catch (error) {
        console.log('error code : ', error);
      }

      if (!this.props.feedo.currentFeed.id) {
        this.props.createFeed();
      }
    }

    if (this.draftFeedo === null) {
      if (this.props.feedo.loading !== feedoTypes.CREATE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.CREATE_FEED_FULFILLED) {
        this.draftFeedo = nextProps.feedo.currentFeed;
      }
    }

    if (this.props.card.loading !== types.ADD_SHARE_EXTENSION_CARD_FULFILLED && nextProps.card.loading === types.ADD_SHARE_EXTENSION_CARD_FULFILLED) {
      this.saveFeedId();
      this.onUpdateFeed()
    }

    if (this.props.feedo.loading !== feedoTypes.UPDATE_FEED_FULFILLED && nextProps.feedo.loading === feedoTypes.UPDATE_FEED_FULFILLED) {
      this.setState({ loading: false })
      if (!this.state.isVisibleSelectFeedoModal) {
        Actions.ShareSuccessScreen({type: 'replace'});
      }
    }

    // showing error alert
    if (this.props.card.loading !== nextProps.card.loading || this.props.feedo.loading !== nextProps.feedo.loading) {
      if (nextProps.card.error || nextProps.feedo.error) {
        this.setState({ loading: false })
        let error = null;
        if ((nextProps.card.error && nextProps.card.error.error) || (nextProps.feedo.error && nextProps.feedo.error.error)) {
          error = (nextProps.card.error && nextProps.card.error.error) || (nextProps.feedo.error && nextProps.feedo.error.error);
        } else {
          error = (nextProps.card.error && nextProps.card.error.message) || (nextProps.feedo.error && nextProps.feedo.error.message);
        }
        if (error) {
          console.log('ERROR: ', error)
          Alert.alert('Error', error)
        }
        this.props.resetCardError();
        return;
      }
    }
  }

  async componentDidMount() {
    this.textInputIdeaRef.focus();

    // this.setState({ loading: true })
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      if (this.props.feedo.feedoList.length == 0) {
        this.props.getFeedoList(0);
      }
      else {
        this.setState({createEnabled: true})
      }
    });

    try {
      const strFeedoInfo = await SharedGroupPreferences.getItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, CONSTANTS.APP_GROUP_LAST_USED_FEEDO);
      if (strFeedoInfo) {
        const feedoInfo = JSON.parse(strFeedoInfo);
        const diffHours = moment().diff(moment(feedoInfo.time, 'LLL'), 'hours');
        if (diffHours < 1) {
          this.props.setCurrentFeed(feedoInfo.currentFeed);
          this.draftFeedo = feedoInfo.currentFeed
        }
      }
    }
    catch(error) {

    }

    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this.keyboardWillHide(e));
    if (Platform.OS === 'ios') {
      this.safariViewShowSubscription = SafariView.addEventListener('onShow', () => this.safariViewShow());
      this.safariViewDismissSubscription = SafariView.addEventListener('onDismiss', () => this.safariViewDismiss());
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
    if (Platform.OS === 'ios') {
      this.safariViewShowSubscription.remove();
      this.safariViewDismissSubscription.remove();
    }
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
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
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
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
    return;
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

  onChangeIdea(text) {
    this.setState({
      idea: text,
    }, async () => {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent === text) {
        if (this.checkUrls()) {
          return;
        }
      }
    });
  }

  onKeyPressIdea(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.checkUrls();
    }
  }

  onFocusIdea() {
    this.setState({
      isShowKeyboardButton: true,
    });
  }

  onBlurIdea() {
    this.setState({
      isShowKeyboardButton: false,
    });
  }

  onSelectFeedo() {
    this.draftFeedo = this.props.feedo.currentFeed;
    this.isDisabledKeyboard = true;
    this.setState({
      isVisibleSelectFeedoModal: true,
    });
  }

  onCloseSelectHunt() {
    this.isDisabledKeyboard = false;
    this.setState({isVisibleSelectFeedoModal: false})
    if (!this.props.feedo.currentFeed.id) {
      this.props.setCurrentFeed(this.draftFeedo);
    }
    if(this.textInputIdeaRef) {
      this.textInputIdeaRef.focus();
    }
  }

  onUpdateFeed() {
    if (this.draftFeedo) {
      const {
        id, 
        headline,
        summary,
        tags,
        files,
      } = this.props.feedo.currentFeed;
      const feedIndex = _.findIndex(this.props.feedo.feedoList, feed => feed.id === id);

      if (feedIndex === -1) {
        this.props.updateFeed(id, headline || 'New flow', summary || '', tags, files);
      } else {
        this.setState({ loading: false })
        Actions.ShareSuccessScreen({type: 'replace'})
      }
    }
  }

  get renderCoverImage() {
    let imageFiles = _.filter(this.props.card.currentCard.files, file => file.fileType === 'MEDIA');

    if (this.state.coverImage) {
      return (
        <View
          style={styles.extensionCoverImageContainer}
        >
          <CoverImagePreviewComponent
            isShareExtension={true}
            coverImage={this.state.coverImage}
            files={imageFiles}
            editable={true}
            isFastImage={false}
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
      this.scrollViewRef.scrollTo({ x: 0, y: yPosition - this.scrollViewHeight + 30 });
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
          placeholder='Add a note'
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.idea}
          onChangeText={(value) => this.onChangeIdea(value)}
          onKeyPress={this.onKeyPressIdea.bind(this)}
          onFocus={() => this.onFocusIdea()}
          onBlur={() => this.onBlurIdea()}
          onSelectionChange={this.onSelectionChange.bind(this)}
          selectionColor={Platform.OS === 'ios' ? COLORS.PURPLE : COLORS.LIGHT_PURPLE}
        />
      </View>
    )
  }

  onLongPressWbeMetaLink = (link) => {
  }

  get renderWebMeta() {
    const links = this.getLinks()

    return (
      <WebMetaList
        viewMode="new"
        links={links}
        isFastImage={false}
        editable={true}
        longPressLink={(link) => this.onLongPressWbeMetaLink(link)}
      />
    )
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
      </ScrollView>
    );
  }

  get renderHeader() {
    return (
      <View style={styles.extensionHeaderContainer}>
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
          onPress={() => this.state.createEnabled ? this.onCreateCard() : {}}
        >
          <Text style={[styles.textButton, { color: this.state.createEnabled ? COLORS.PURPLE : COLORS.MEDIUM_GREY }]}>Create card</Text>
        </TouchableOpacity>
      </View>
    );
  }

  get renderBottomContent() {
    return (
      <View style={styles.extensionSelectFeedoContainer}>
        <Text style={[styles.textCreateCardIn, { color: COLORS.PRIMARY_BLACK }]}>Create card in:</Text>
        {
          this.state.createEnabled 
          ? <TouchableOpacity
          style={[styles.selectFeedoButtonContainer, { paddingRight: 3 }]}
          activeOpacity={0.6}
          onPress={() => this.onSelectFeedo()}
        >
          <Text style={styles.textFeedoName} numberOfLines={1}>{this.props.feedo.currentFeed.headline || 'New flow'}</Text>
          <Entypo name="chevron-right" size={20} color={COLORS.PURPLE} />
        </TouchableOpacity>
          : <ActivityIndicator 
              style={[styles.selectFeedoButtonContainer, {paddingRight: 9, width: 50}]}
              animating
              color={COLORS.PURPLE}
            />
        }
      </View>
    )
  }

  get renderCard() {
    let cardStyle = {};

    const animatedMove  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_HEIGHT, 0],
    });  
    cardStyle = {
      top: animatedMove,
      opacity: this.animatedShow,
    };

    let contentContainerStyle = {};
    let bottomMargin = CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN;
    if (this.state.isShowKeyboardButton) {
      bottomMargin = Platform.OS === 'ios' ? 20 : 40;
    }

    contentContainerStyle = {
      height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN - bottomMargin, this.animatedKeyboardHeight),
      marginTop: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
      marginBottom: Animated.add(bottomMargin, this.animatedKeyboardHeight),
      borderRadius: 18,
      backgroundColor: '#fff',
      marginHorizontal: 16,
    }

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          cardStyle,
          { backgroundColor: COLORS.MODAL_BACKGROUND }
        ]}
      >
        <Animated.View style={contentContainerStyle}>
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderHeader}
            {this.renderMainContent}
            {this.renderBottomContent}
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    );
  }

  get renderSelectHunt() {
    const { cachedFeedList } = this.state

    if (this.state.isVisibleSelectFeedoModal) {
      return (
        <SelectHuntScreen
          cachedFeedList={cachedFeedList}
          selectMode={CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION}
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

        {this.state.loading && <LoadingScreen />}

      </View>
    );
  }
}


CardNewShareScreen.defaultProps = {
  card: {},
  shareUrl: '',
  shareImageUrls: [],
  shareText: '',
  onClose: () => {},
}


CardNewShareScreen.propTypes = {
  card: PropTypes.object,
  shareUrl: PropTypes.string,
  shareImageUrls: PropTypes.array,
  shareText: PropTypes.string,
  onClose: PropTypes.func,
}


const mapStateToProps = ({ card, feedo, user, }) => ({
  card,
  feedo,
  user,
})


const mapDispatchToProps = dispatch => ({
  addSharExtensionCard: (huntId, idea, links, files, status) => dispatch(addSharExtensionCard(huntId, idea, links, files, status)),
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, comments, tags, files) => dispatch(updateFeed(id, name, comments, tags, files)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  getFeedoList: (index) => dispatch(getFeedoList(index)),

  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
  resetCardError: () => dispatch(resetCardError()),
})


export default connect(mapStateToProps, mapDispatchToProps)(CardNewShareScreen)