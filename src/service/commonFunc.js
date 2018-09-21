import _ from 'lodash'

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
  return feed.metadata.owner
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

const isFeedEditor = (feed) => {
  if (!feed.metadata.owner && feed.metadata.permissions === 'EDIT') {
    return true
  }
  return false
}

const isFeedContributor = (feed) => {
  if (!feed.metadata.owner && feed.metadata.permissions === 'ADD') {
    return true
  }
  return false
}

const isFeedGuest = (feed) => {
  if (!feed.metadata.owner && feed.metadata.permissions === 'VIEW') {
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


const validateEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

export {
  checkUserIsInvitee,
  isFeedOwner,
  isInviteeOwner,
  isFeedOwnerEditor,
  isFeedEditor,
  isFeedContributor,
  isFeedGuest,
  isCardOwner,
  validateEmail
}