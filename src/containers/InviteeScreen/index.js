import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import _ from 'lodash'
import InviteeAutoComplete from '../../components/InviteeAutoComplete'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import LinkShareItem from '../../components/LinkShareModalComponent/LinkShareItem'
import NewUserTap from '../../components/NewUserTapComponent'
import ContactRemoveComponent from '../../components/ContactRemoveComponent'
import { getContactList } from '../../redux/user/actions'
import {
  inviteToHunt,
  updateSharingPreferences,
  deleteInvitee
} from '../../redux/feedo/actions'
import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors'
import { SHARE_LINK_URL } from '../../service/api'
import styles from './styles'
import Analytics from '../../lib/firebase'
import CardFilterComponent from '../../components/CardFilterComponent';
import Button from '../../components/Button'
import AlertController from '../../components/AlertController'
import ToasterComponent from '../../components/ToasterComponent'
import ActionSheet from 'react-native-actionsheet'
import CONSTANTS from '../../service/constants'

const MEMBER_ACTIONS = {
  CAN_EDIT: 'Can edit',
  CAN_ADD: 'Can add',
  CAN_VIEW: 'Can view',
  RESEND_INVITE: 'Resend invite',
  REMOVE: 'Remove',
}

class InviteeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAddInvitee: false,
      message: '',
      isPermissionModal: false,
      isRemoveModal: false,
      inviteePermission: 'ADD',
      isInput: false,
      inputText: '',
      contactList: [],
      inviteeEmails: [],
      filteredContacts: [],
      recentContacts: [],
      selectedContact: null,
      isInvalidEmail: false,
      invalidEmail: [],
      loading: false,
      tagText: '',
      isEnableShare: false,
      memberActions: []
    }
    this.isMount = false
    this.animatedKeyboardHeight = new Animated.Value(0);
  }

  componentDidMount() {
    Analytics.setCurrentScreen('InviteeScreen')

    const { userInfo } = this.props.user
    this.isMount = true
    this.setState({ loading: true })
    this.props.getContactList(userInfo.id)

    let filteredMembers = COMMON_FUNC.filterRemovedInvitees(this.props.data.invitees)
    filteredMembers = COMMON_FUNC.removeDuplicatedItems(filteredMembers)
    this.setState({ currentMembers:  filteredMembers })
    this.setState({isEnableShare: COMMON_FUNC.isSharingEnabled(this.props.data)})

    if (Platform.OS === 'ios') {
      this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
      this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
    }
    else {
      this.keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this.keyboardWillShow(e));
      this.keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this.keyboardWillHide(e));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, feedo, data } = nextProps

    if (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') {
      if (this.props.feedo.error) {
        AlertController.shared.showAlert(
          'Error',
          feedo.error
        )
      } else if (this.state.isReinviting) {
        this.setState({ isShowInviteToaster: true, inviteToasterTitle: 'Invitation sent - Collaboration is cooking!' })
        setTimeout(() => {
          this.setState({ isShowInviteToaster: false })
        }, 3000)
      } else {
        this.props.onClose()
      }
    }

    if (this.props.user.loading === 'GET_CONTACT_LIST_PENDING' && user.loading === 'GET_CONTACT_LIST_FULFILLED') {
      if (this.isMount) {
        this.setState({ loading: false })
        this.setState({
          contactList: this.getRecentContactList(data, user.contactList),
          recentContacts: this.getRecentContactList(data, user.contactList)
        })
      }
    }

    if (this.props.feedo.loading === 'DELETE_INVITEE_PENDING' && feedo.loading === 'DELETE_INVITEE_FULFILLED') {
      this.setState({ currentMembers: COMMON_FUNC.filterRemovedInvitees(feedo.currentFeed.invitees) })
    }
  }

  componentWillUnmount() {
    this.isMount = false
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }
    ).start();
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }
    ).start();
  }

  getRecentContactList = (feed, contactList) => {
    const invitees = COMMON_FUNC.filterRemovedInvitees(feed.invitees)
    const filteredList = _.filter(contactList, item =>
                          _.findIndex(invitees, invitee => invitee.userProfile.id === item.userProfile.id) === -1)
    return filteredList
  }

  handleInvitees = (inviteeEmails) => {
    const { contactList } = this.state

    let invalidEmail = _.filter(inviteeEmails, invitee => COMMON_FUNC.validateEmail(invitee.email) === false)
    this.setState({ isInvalidEmail: invalidEmail.length > 0 ? true : false, invalidEmail })

    const filteredList = _.filter(contactList, item =>
      _.findIndex(inviteeEmails, invitee => invitee.email === item.userProfile.email) === -1)

    this.setState({
      isInput: false,
      isAddInvitee: inviteeEmails.length > 0 ? true : false,
      inviteeEmails,
      recentContacts: filteredList
    })
  }

  handleChange = (text) => {
    const { recentContacts, inviteeEmails } = this.state
    this.setState({
      inputText: text,
      isInput: text.length > 0 ? true : false
    })

    const filteredContacts = recentContacts.filter(this.contactFilter(text.toLowerCase()))

    this.setState({ tagText: text, filteredContacts })
  }

  contactFilter = value => c => (
    [c.userProfile.firstName, c.userProfile.lastName, c.userProfile.email].join().toLowerCase().indexOf(value.toLowerCase()) !== -1
    && !c.added
  )

  handleLinkSharing = (value, data) => {
    this.setState({isEnableShare: value})

    const { updateSharingPreferences } = this.props
    if (value) {
      updateSharingPreferences(
        data.id,
        {
          level: 'REGISTERED_ONLY',
          permissions: 'ADD'
        }
      )
    } else {
      updateSharingPreferences(
        data.id,
        {
          level: 'INVITEES_ONLY'
        }
      )
    }
  }

  onSelectMember = (item) => {
    const { user, data, inviteToHunt } = this.props
    const { id, email, firstName, lastName } = item.userProfile
    if (data.owner && data.owner.email === email) return // if selected contact is feed owner

    let memberActions = [MEMBER_ACTIONS.REMOVE, 'Cancel']

    if (item.inviteStatus === 'DECLINED' || item.inviteStatus === 'INVITED') {
      memberActions.unshift(MEMBER_ACTIONS.RESEND_INVITE)
    }

    this.setState({
        selectedContact: item,
        memberActions,
        isReinviting: item.inviteStatus !== 'ACCEPTED'
      }, () => {
        this.ActionSheet.show()
      });
  }

  onSelectContact = (contact) => {
    let { inviteeEmails, recentContacts } = this.state
    let name
    if (contact.userProfile.newUser) {
      name = contact.userProfile.email
    } else {
      name = `${contact.userProfile.firstName} ${contact.userProfile.lastName}`
    }

    inviteeEmails.push({
      text: name,
      email: contact.userProfile.email,
      name: name,
      userProfileId: contact.userProfile.id
    })

    let contacts = _.filter(recentContacts, item => item.id !== contact.id)
    this.setState({
      isInput: false,
      isAddInvitee: true,
      inviteeEmails: inviteeEmails,
      filteredContacts: [],
      recentContacts: contacts,
      tagText: ''
    })
  }

  onSendInvitation = () => {
    const { data, inviteToHunt } = this.props
    const { inviteeEmails, message, inviteePermission, isAddInvitee, isInvalidEmail } = this.state

    if (isAddInvitee && !isInvalidEmail) {
      const params = {
        message,
        invitees: inviteeEmails,
        permissions: inviteePermission
      }

      if (!this.state.isInvalidEmail) {
        inviteToHunt(data.id, params)
      }
    }
  }

  onInvitetoHunt() {
    const { data, inviteToHunt } = this.props
    const { id, email, firstName, lastName } = this.state.selectedContact.userProfile

    let inviteeEmails = []
    inviteeEmails.push({
      text: firstName + ' ' + lastName,
      email,
      name: firstName + ' ' + lastName,
      userProfileId: id
    })
    const params = {
      message: '',
      invitees: inviteeEmails,
      permissions: this.state.selectedContact.permissions
    }
    inviteToHunt(data.id, params)
  }

  handlePermissionOption = (index) => {
    this.setState({ isPermissionModal: false })
    switch(index) {
      case 0: // Edit
        this.setState({ inviteePermission: 'EDIT' })
        return
      case 1: // Add
        this.setState({ inviteePermission: 'ADD' })
        return
      case 2: // View
        this.setState({ inviteePermission: 'VIEW' })
        return
      default:
        return
    }
  }

  updatePermission = () => {
    this.setState({ isPermissionModal: true })
  }

  renderFilteredContacts = (filteredContacts) => {
    const contentContainerStyle = {
      height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT - 60 - 40 - CONSTANTS.STATUSBAR_HEIGHT, this.animatedKeyboardHeight),
      paddingHorizontal: CONSTANTS.PADDING
    }

    if (filteredContacts && filteredContacts.length > 0) {
      return (
        <Animated.ScrollView style={contentContainerStyle} contentContainerStyle={styles.contactList} keyboardShouldPersistTaps="handled">
          {filteredContacts.map(item => (
            <TouchableOpacity onPress={() => this.onSelectContact(item)} key={item.id}>
              <View style={styles.contactItem}>
                <InviteeItemComponent invitee={item} isOnlyTitle={true} isShowSeparator={false} />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      );
    } else {
      return (
        <NewUserTap
          inputEmail={this.state.inputText}
          onHandleNewUserTap={item => this.onSelectContact(item)}
        />
      )
    }
  }

  onChangeMessage = (text) => {
    this.setState({ message: text })
  }

  showShareModal = (data) => {
    if (this.state.isEnableShare) {
      COMMON_FUNC.handleShareFeed(data)
    }
  }

  onTapActionSheet = (index) => {
    const { memberActions, selectedContact } = this.state

    let action = memberActions[index]

    switch(action) {
      case MEMBER_ACTIONS.CAN_EDIT:
        break
      case  MEMBER_ACTIONS.CAN_ADD:
        break
      case MEMBER_ACTIONS.CAN_VIEW:
        break
      case MEMBER_ACTIONS.RESEND_INVITE:
        this.onInvitetoHunt(selectedContact)
        break
      case MEMBER_ACTIONS.REMOVE:
        this.props.deleteInvitee(selectedContact)
        break
    }
  }

  render () {
    const {
      isAddInvitee,
      recentContacts,
      currentMembers,
      filteredContacts,
      inviteeEmails,
      inviteePermission,
      isPermissionModal,
      isRemoveModal,
      selectedContact,
      isInvalidEmail,
      invalidEmail,
      isInput,
      isReinviting,
      memberActions
    } = this.state
    const { data } = this.props

    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.h3, { color: COLORS.PRIMARY_BLACK }]}>Add people</Text>
          <Button
            style={{ width: 60 }}
            labelStyle={{ fontSize: 16 }}
            height={40}
            label='Send'
            color='white'
            labelColor={(!isAddInvitee || isInvalidEmail) ? COLORS.MEDIUM_GREY : COLORS.PURPLE}
            isLoading={this.props.feedo.loading === 'INVITE_HUNT_PENDING'}
            onPress={() => this.onSendInvitation()}
          />
        </View>

        <View style={styles.body}>
          <View style={styles.inputFieldView}>
            <View style={styles.padding}>
              <View style={styles.tagInputItem}>
                <InviteeAutoComplete
                  tagText={this.state.tagText}
                  inviteeEmails={inviteeEmails}
                  invalidEmail={invalidEmail}
                  handleInvitees={this.handleInvitees}
                  handleChange={this.handleChange}
                />
                {/* <TouchableOpacity onPress={() => this.updatePermission()}>
                  <View style={styles.rightView}>
                    <Text style={styles.viewText}>
                      {inviteePermission}
                    </Text>
                    <Entypo name="cog" style={styles.cogIcon} />
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>

            {isInput && (
              this.renderFilteredContacts(filteredContacts)
            )}

            {!isInput && (
              <View style={styles.padding}>
                <View style={styles.messageInputItem}>
                  <TextInput
                    ref={ref => this.messageRef = ref}
                    value={this.state.message}
                    placeholder="Add message"
                    placeholderTextColor={COLORS.DARK_GREY}
                    multiline={true}
                    style={[styles.textInput]}
                    onChangeText={this.onChangeMessage}
                    underlineColorAndroid='transparent'
                    selectionColor={Platform.OS === 'ios' ? COLORS.PURPLE : COLORS.LIGHT_PURPLE}
                  />
                </View>
              </View>
            )}

            {!isInput &&
              <View style={styles.padding}>
                <View style={styles.listItem}>
                  <LinkShareItem
                    isViewOnly={false}
                    feed={data}
                    onPress={() => this.showShareModal(data)}
                    isEnableShare={this.state.isEnableShare}
                    handleLinkSharing={value => this.handleLinkSharing(value, data)}
                  />
                </View>
              </View>
            }
          </View>

          {this.state.loading
            ? <View style={styles.loadingView}>
                <ActivityIndicator 
                  animating
                  color={COLORS.PURPLE}
                />
              </View>
            : (!isInput && currentMembers && currentMembers.length > 0) && (
                <View style={styles.inviteeListView}>
                  <View style={styles.titleView}>
                    <Text style={styles.titleText}>Current members</Text>
                  </View>
                  <View style={styles.separator} />
                  <ScrollView style={styles.inviteeList} contentContainerStyle={styles.inviteeListInnerView} keyboardShouldPersistTaps="handled">
                    {currentMembers.map(item => (
                      <TouchableOpacity key={item.id} onPress={() => this.onSelectMember(item)}>
                        <View style={styles.inviteeItem}>
                          <InviteeItemComponent invitee={item} isShowSeparator={false} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
            )
          }
        </View>

        <ActionSheet
          key="1"
          ref={ref => this.ActionSheet = ref}
          title={selectedContact && `${selectedContact.userProfile.firstName} ${selectedContact.userProfile.lastName}`}
          options={memberActions}
          cancelButtonIndex={memberActions.length - 1}
          destructiveButtonIndex={memberActions.length - 2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapActionSheet(index)}
        />

        {/* Old actionsheet version */}
        {/* <Modal
          isVisible={isRemoveModal}
          style={{ margin: 0 }}
          backdropColor={COLORS.MODAL_BACKDROP}
          backdropOpacity={0.4}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ isRemoveModal: false, isReinviting: false })}
          onBackButtonPress={() => this.setState({ isRemoveModal: false, isReinviting: false })}
        >
          <View style={styles.removeModal}>
            {
              selectedContact && 
              <InviteeItemComponent
                invitee={selectedContact}
                isShowSeparator={false}
              />
            }
            <View style={styles.actionButtons}>
              <Button
                style={{ marginTop: 28 }}
                color='rgba(255, 0, 0, 0.1)'
                labelColor={COLORS.RED}
                label="Remove"
                borderRadius={14}
                onPress={() => {
                  this.setState({ isRemoveModal: false })
                  this.props.deleteInvitee(selectedContact)
                }}
              />
              {isReinviting &&
                <Button
                  style={{ marginTop: 10 }}
                  color='rgba(255, 0, 0, 0.1)'
                  labelColor={COLORS.RED}
                  label="Resend Invite"
                  borderRadius={14}
                  onPress={() => {
                    this.setState({ isRemoveModal: false })
                    this.onInvitetoHunt(selectedContact)
                  }}
                />
              }
            </View>
          </View>
        </Modal> */}

        <Modal
          isVisible={isPermissionModal}
          style={{ margin: 0 }}
          backdropColor={COLORS.MODAL_BACKDROP}
          backdropOpacity={0.4}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ isPermissionModal: false })}
          onBackButtonPress={() => this.setState({ isPermissionModal: false })}
        >
          <LinkShareModalComponent
            inviteePermission={true}
            handleShareOption={this.handlePermissionOption}
          />
        </Modal>

        {this.state.isShowInviteToaster && (
          <ToasterComponent
            isVisible={this.state.isShowInviteToaster}
            title={this.state.inviteToasterTitle}
            buttonTitle="OK"
            onPressButton={() => this.setState({ isShowInviteToaster: false })}
          />
        )}
      </View>
    )
  }
}

InviteeScreen.defaultProps = {
  onClose: () => {},
  data: {},
  getContactList: () => {}
}

InviteeScreen.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  getContactList: PropTypes.func,
  inviteToHunt: PropTypes.func
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

const mapDispatchToProps = dispatch => ({
  getContactList: (userId) => dispatch(getContactList(userId)),
  inviteToHunt: (feedId, data) => dispatch(inviteToHunt(feedId, data)),
  updateSharingPreferences: (feedId, data) => dispatch(updateSharingPreferences(feedId, data)),
  // deleteInvitee: (feedId, inviteeId) => dispatch(deleteInvitee(feedId, inviteeId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteeScreen)
