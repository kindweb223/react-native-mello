import _ from 'lodash'

/**
 * if the user is feed owner, return true
 */
const checkOwner = (feed) => {
  return feed.metadata.owner
}

/**
 * If the invitee is feed owner, return true
 */
const checkOwnerinvitee = (feed, invitee) => {
  if (feed.owner.id === invitee.userProfile.id) {
    return true
  }
  return false
}

/**
 * if the user has EDIT permission of feed, return true
 */
const checkEditor = (feed) => {
  if (feed.metadata.owner) {
    const userInvitee = _.find(feed.invitees, invitee => invitee.userProfile.id === feed.owner.id)
    if (!_.isEmpty(userInvitee) && userInvitee.permissions === 'EDIT')
      return true
  }
  return false
}

/**
 * if the user has Owner or Editor permission of feed, return true
 */
const checkOwnerEditor = (feed) => {
  if (checkOwner(feed) || checkEditor(feed)) {
    return true
  }
  return false
}

export {
  checkOwner,
  checkOwnerinvitee,
  checkEditor,
  checkOwnerEditor
}