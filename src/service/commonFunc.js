import {
  Share,
  Platform,
  Alert,
  AsyncStorage
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import { SHARE_LINK_URL } from "../service/api"
import COLORS from '../service/colors'
import CONSTANTS from '../service/constants'
import AlertController from '../components/AlertController'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import moment from 'moment'
import rnTextSize from 'react-native-text-size'

/**
 * If the user is the invitee, return true
 */
const checkUserIsInvitee = (user, invitee) => {
  if (user.id === invitee.userProfile.id) {
    return true
  }
  return false
}

/**
 * If the user is feed owner, return true
 */
const isFeedOwner = (feed) => {
  return feed && feed.metadata && feed.metadata.owner
}

const isFeedOwnerOnlyInvitee = (feed) => {
  const invitees = filterRemovedInvitees(feed.invitees)
  return invitees.length === 1 && isInviteeOwner(feed, feed.invitees[0])
}
/**
 * If the invitee is feed owner, return true
 */
const isInviteeOwner = (feed, invitee) => {
  if (feed.owner.id === invitee.userProfile.id) {
    return true
  }
  return false
}

/**
 * If the user has Owner or Editor permission of feed, return true
 */
const isFeedOwnerEditor = (feed) => {
  if (isFeedOwner(feed) || isFeedEditor(feed)) {
    return true
  }
  return false
}

const isFeedContributorGuest = (feed) => {
  if (isFeedContributor(feed) || isFeedGuest(feed)) {
    return true
  }
  return false
}

const isFeedEditor = (feed) => {
  if (feed && feed.metadata && !feed.metadata.owner && feed.metadata.permissions === 'EDIT') {
    return true
  }
  return false
}

const isFeedContributor = (feed) => {
  if (feed && feed.metadata && !feed.metadata.owner && feed.metadata.permissions === 'ADD') {
    return true
  }
  return false
}

const isFeedGuest = (feed) => {
  if (feed && feed.metadata && !feed.metadata.owner && feed.metadata.permissions === 'VIEW') {
    return true
  }
  return false
}

/**
 * If the user is card owner, return true
 */
const isCardOwner = (card) => {
  return card.metadata.owner
}

/**
 * Filter invitees based on status (REMOVED)
 */
const filterRemovedInvitees = (invitees) => {
  return _.filter(invitees, invitee => invitee.inviteStatus !== 'REMOVED')
}

const validateEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

const isUserInvitee = (user, invitee) => {
  return user.userInfo.id === invitee.userProfile.id
}

const isSharingEnabled = (feed) => {
  return feed.sharingPreferences.level === 'INVITEES_ONLY' ? false : true
}

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15)
}

const handleShareFeed = (feed) => {
  let message = feed.headline
    
  if (Platform.OS === 'android') {
    message += ' ' + `${SHARE_LINK_URL}${feed.id}`
  }

  Share.share({
    message: message,
    url: `${SHARE_LINK_URL}${feed.id}`,
    title: feed.headline
  },{
    tintColor: COLORS.PURPLE,
    subject: 'Join my flow on Mello: ' + feed.headline
  })
}

const showPremiumAlert = () => {
  AlertController.shared.showAlert(
    '',
    CONSTANTS.PREMIUM_10MB_ALERT_MESSAGE,
    [
      {
        text: 'Ok',
        style: 'cancel'
      },
      {
        text: 'Discover',
        onPress: () => Actions.PremiumScreen()
      }
    ],
    { cancelable: false }
  )
}

const isMelloTipFeed = (feed) => {
  return feed.sharingPreferences.level === 'REGISTERED_ONLY_BCC'
}

const checkVideoCoverImage = (images, coverImage) => {
  return _.find(images, image => image.thumbnailUrl === coverImage  && image.contentType.toLowerCase().indexOf('video') !== -1)
}

const getCardViewMode = (feed, idea) => {
  let viewMode = CONSTANTS.CARD_VIEW
  if (isFeedOwnerEditor(feed) || (isFeedContributor(feed) && isCardOwner(idea))) {
    viewMode = CONSTANTS.CARD_EDIT
  }
  return viewMode
}

const setLastFeed = async (feed) => {
  const feedoInfo = {
    time: moment().format('LLL'),
    feedoId: feed.id,
    currentFeed: feed
  }

  if(Platform.OS === 'ios') {
    await SharedGroupPreferences.setItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, feedoInfo, CONSTANTS.APP_GROUP_LAST_USED_FEEDO);
  } else {
    await AsyncStorage.setItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, JSON.stringify(feedoInfo));
  }
}

const getLastFeed = async () => {
  let strFeedoInfo = null;
  
  if(Platform.OS === 'ios') {
    strFeedoInfo = await SharedGroupPreferences.getItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO, CONSTANTS.APP_GROUP_LAST_USED_FEEDO);
  } else {
    strFeedoInfo = await AsyncStorage.getItem(CONSTANTS.CARD_SAVED_LAST_FEEDO_INFO);
    strFeedoInfo = JSON.parse(strFeedoInfo)
  }

  return strFeedoInfo;
}

const useLastFeed = (feed) => {
  // If feed time is less than an hour
  // if (feed) {
  //   const diffHours = moment().diff(moment(feed.time, 'LLL'), 'hours');
  //   return diffHours < 1
  // }
  // else {
  //   return false
  // }

  return true
}

const removeDuplicatedItems = (array) => {
  var obj = {};
  for (var i = 0, len = array.length; i < len; i++)
    obj[array[i]['id']] = array[i];

  array = new Array();
  for (var key in obj)
    array.push(obj[key]);
  return array
}

const htmlToPlainText = (html = '') => {
  let myHtml = html

  myHtml = myHtml
    .replace(/<br\/?>/gi, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<h2.*?>(.*?)<\/h2>/gi, '$1')
    .replace(/<p.*?>(.*?)<\/p>/gi, '$1')
    .replace(/<(?:.|\s)*?>/g, '')

  return myHtml
}

const splitHtmlToArray = (html) => {
  var separators = ['\\\<h2>', '\\\<p>', '\\\<ul>', '\\\<ol>', '\\\<li>', '\\\<br />', '\\\<br/>'];
  var htmlArray = html.split(new RegExp(separators.join('|'), 'g'));
  return htmlArray;
}

const fontSpecs = {
  fontFamily: undefined,
  fontSize: 16
}

const fontListParentSpecs = {
  fontFamily: undefined,
  fontSize: 16
}

const fontListSpecs = {
  fontFamily: undefined,
  fontSize: 16
}

const fontBoldSpecs = {
  fontFamily: undefined,
  fontSize: 24,
  lineHeight: 32
}

const adujstHTMLTagHeight = (text, height, isLastText) => {
  let adjustedHeight = parseFloat(height)
  if (text.indexOf('</u>') !== -1 || text.indexOf('</strong>') !== -1 ) {
    adjustedHeight = height - 15
  }
  if (text.indexOf('</h2>') !== -1) {
    if (height < 45 && isLastText) {
      adjustedHeight = height - 15
    }
  }

  return adjustedHeight + parseFloat(isLastText === true ? 0 : 15)
}

const getHtmlHeight = async (html, hasCoverImage) => {
  let htmlArray = _.compact(splitHtmlToArray(_.trim(html)))
  htmlArray = _.filter(htmlArray, item => item !== '<ol>' && item !== '<ul>' && item !== '<h2>')

  const cardWidth = (CONSTANTS.SCREEN_SUB_WIDTH - 16) / 2
  let strLength = 0
  let limitLine = 0

  for (let i = 0; i < htmlArray.length; i ++) {
    let textHeight = 0
    if (_.endsWith(htmlArray[i], '</h2>')) {
      textSize = await rnTextSize.measure({
        text: htmlArray[i],
        width: cardWidth - 20,
        ...fontBoldSpecs
      })
      textHeight = adujstHTMLTagHeight(htmlArray[i], textSize.height, htmlArray.length === (i + 1))
    } else if (_.endsWith(htmlArray[i], '</ul>') || _.endsWith(htmlArray[i], '</ol>')) {
      textSize = await rnTextSize.measure({
        text: htmlArray[i],
        width: cardWidth - 20,
        ...fontListParentSpecs
      })
      textHeight = adujstHTMLTagHeight(htmlArray[i], textSize.height, htmlArray.length === (i + 1))
    } else if (_.endsWith(htmlArray[i], '</li>')) {
      textSize = await rnTextSize.measure({
        text: htmlArray[i],
        width: cardWidth - 20,
        ...fontListSpecs
      })
      textHeight = adujstHTMLTagHeight(htmlArray[i], textSize.height, htmlArray.length === (i + 1))
    } else {
      textSize = await rnTextSize.measure({
        text: htmlArray[i],
        width: cardWidth - 20,
        ...fontSpecs,
      })
      textHeight = adujstHTMLTagHeight(htmlArray[i], textSize.height, htmlArray.length === (i + 1))
    }
    strLength += parseFloat(textHeight)
    if (hasCoverImage) {
      if (strLength < 101) {
        limitLine = i
      }
    } else {
      if (strLength < 191) {
        limitLine = i
      }
    }
  }

  return { textSize: strLength, limitLine: limitLine + 1 }
}

export {
  checkUserIsInvitee,
  isFeedOwner,
  isInviteeOwner,
  isFeedOwnerEditor,
  isFeedContributorGuest,
  isFeedEditor,
  isFeedContributor,
  isFeedGuest,
  isCardOwner,
  validateEmail,
  isUserInvitee,
  filterRemovedInvitees,
  isSharingEnabled,
  generateRandomString,
  handleShareFeed,
  showPremiumAlert,
  isMelloTipFeed,
  checkVideoCoverImage,
  isFeedOwnerOnlyInvitee,
  getCardViewMode,
  removeDuplicatedItems,
  htmlToPlainText,
  splitHtmlToArray,
  setLastFeed,
  getLastFeed,
  useLastFeed,
  getHtmlHeight,
  adujstHTMLTagHeight
}