import _ from 'lodash'

/**
 * if the user is feed owner, return true
 */
const FeedOwner = (feed) => {
  return feed.metadata.owner
}

/**
 * If the invitee is feed owner, return true
 */
const FeedOwnerinvitee = (feed, invitee) => {
  if (feed.owner.id === invitee.userProfile.id) {
    return true
  }
  return false
}

/**
 * if the user has Owner or Editor permission of feed, return true
 */
const FeedOwnerEditor = (feed) => {
  if (FeedOwner(feed) || FeedEditor(feed)) {
    return true
  }
  return false
}

const FeedEditor = (feed) => {
  if (!feed.metadata.owner && feed.metadata.permissions === 'EDIT') {
    return true
  }
  return false
}

const FeedContributor = (feed) => {
  if (!feed.metadata.owner && feed.metadata.permissions === 'ADD') {
    return true
  }
  return false
}

const FeedGuest = (feed) => {
  if (!feed.metadata.owner && feed.metadata.permissions === 'VIEW') {
    return true
  }
  return false
}

/**
 * if the user is card owner, return true
 */
const CardOwner = (card) => {
  return card.metadata.owner
}


const validateEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

export {
  FeedOwner,
  FeedOwnerinvitee,
  FeedOwnerEditor,
  FeedEditor,
  FeedContributor,
  FeedGuest,
  CardOwner,
  validateEmail
}