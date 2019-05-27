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

export const handleFirstFlowTipStorageData = () => {
  AsyncStorage.setItem('FirstFlowTip', JSON.stringify(true))
}

export const handleFirstInviteTipStorageData = () => {
  AsyncStorage.setItem('FirstInviteTip', JSON.stringify(true))
}

export const handleProfilePhotoTipStorageData = () => {
  AsyncStorage.setItem('ProfilePhotoTip', JSON.stringify(true))
}


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
  }).then(result => {
    if (result.action === 'sharedAction') {
      // Set Asynstorage data when sharing the first flow
      AsyncStorage.setItem('FirstShareFlow', JSON.stringify(true))
    }
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
  fontSize: 14
}

const fontListSpecs = {
  fontFamily: undefined,
  fontSize: 14
}

const fontBoldSpecs = {
  fontFamily: undefined,
  fontSize: 22
}

const adujstHTMLTagHeight = (textSize) => {
  let textHeight = textSize.height
  if (textSize.width > cardWidth) {
    textHeight = Math.ceil(textSize.width / cardWidth) * textHeight
  }
  return textHeight
}

const replacingTextArray = [
  '<ul>',
  '</ul>',
  '<ol>',
  '</ol>',
  '<li>',
  '</li>',
  '<p>',
  '</p>',
  '<u>',
  '</u>',
  '<s>',
  '</s>',
  '<i>',
  '</i>',
  '<h2>',
  '</h2>',
  '<strong>',
  '</strong>'
]
const cardWidth = (CONSTANTS.SCREEN_SUB_WIDTH - 16) / 2 - 20

const getHtmlHeight = async (html, hasCoverImage, step) => {
  let totalLength = 0
  let limitLine = 0

  let htmlArray = _.compact(splitHtmlToArray(_.trim(html)))
  htmlArray = _.filter(htmlArray, item => item !== '<ol>' && item !== '<ul>' && item !== '<h2>')

  for (let i = 0; i < htmlArray.length; i ++) {
    let textHeight = 0
    const isLastText = htmlArray.length === (i + 1)

    if (htmlArray[i] === '&nbsp;</p>') {
      textHeight = isLastText ? 0 : 19.5
    } else {
      text = _.replace(htmlArray[i], '&nbsp;', ' ')

      for (let j = 0; j < replacingTextArray.length; j ++) {
        text = _.replace(text, replacingTextArray[j], '')
      }

      if (_.endsWith(htmlArray[i], '</h2>')) {
        textSize = await rnTextSize.measure({
          text,
          ...fontBoldSpecs,
          width: cardWidth - 10
        })
        textHeight = parseFloat(textSize.height) + 24 + 5 * parseFloat(textSize.lineCount)
      } else if (_.endsWith(htmlArray[i], '</ul>') || _.endsWith(htmlArray[i], '</ol>')) {
        textSize = await rnTextSize.measure({
          text,
          ...fontListParentSpecs
        })
        textHeight = adujstHTMLTagHeight(textSize)
        textHeight = parseFloat(textHeight) + parseFloat(18) * Math.ceil(textSize.width / cardWidth)
      } else if (_.endsWith(htmlArray[i], '</li>')) {
        textSize = await rnTextSize.measure({
          text,
          ...fontListSpecs,
          width: cardWidth - 10
        })
        textHeight = parseFloat(textSize.height) + parseFloat(isLastText ? 0 : 10)
      } else {
        textSize = await rnTextSize.measure({
          text,
          ...fontSpecs,
          width: cardWidth
        })
        textHeight = parseFloat(textSize.height)
      }
    }

    totalLength += parseFloat(textHeight)

    if (step === 0) {
      if (hasCoverImage) {
        if (totalLength < 101) {
          limitLine = i
        }
      } else {
        if (totalLength < 191) {
          limitLine = i
        }
      }
    }
  }

  return { textSize: totalLength, limitLine: limitLine + 1 }
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
  getHtmlHeight
}