/**
 * Return copy of invitee
 * Match invitee with inviteeDeletedId
 * If matched set status as 'REMOVED'
 * 
 * @param {*} invitee 
 * @param {*} inviteeDeletedId 
 */
const setRemovedInvitees = (invitee, inviteeDeletedId) => ({ // create an arrow function
  ...invitee, // copy all keys from invitee object 
  inviteStatus: (
    invitee.id === inviteeDeletedId ? 'REMOVED' : invitee.inviteStatus // if true returns 'removed' if not return the same inviteStatus
  ),
})

export {
    setRemovedInvitees,
}
