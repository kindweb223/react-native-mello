import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import _ from 'lodash'
import InviteeAutoComplete from '../../components/InviteeAutoComplete'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import LinkShareItem from '../../components/LinkShareModalComponent/LinkShareItem'
import NewUserTap from '../../components/NewUserTapComponent'
import ContactRemoveComponent from '../../components/ContactRemoveComponent'
import { getContactList } from '../../redux/user/actions'
import { inviteToHunt, updateSharingPreferences } from '../../redux/feedo/actions'
import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors'
import { SHARE_LINK_URL } from '../../service/api'
import styles from './styles'
import Analytics from '../../lib/firebase'
import CardFilterComponent from '../../components/CardFilterComponent';

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

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
      tagText: ''
    }
    this.isMount = false
  }

  componentDidMount() {
    Analytics.setCurrentScreen('InviteeScreen')

    const { userInfo } = this.props.user
    this.isMount = true
    this.setState({ loading: true })
    this.props.getContactList(userInfo.id)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, feedo, data } = nextProps

    if (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') {
      if (this.props.feedo.error) {
        Alert.alert(
          'Error',
          feedo.error
        )
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
  }

  componentWillUnmount() {
    this.isMount = false
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

    let filteredContacts = []

    for (let i = 0; i < recentContacts.length; i ++) {
      const email = recentContacts[i].userProfile.email
      const name = `${recentContacts[i].userProfile.firstName} ${recentContacts[i].userProfile.lastName}`

      if (email.includes(text.toLowerCase()) || name.includes(text.toLowerCase())) {
        if (_.findIndex(inviteeEmails, item => item.text === email) === -1 &&
            _.findIndex(inviteeEmails, item => item.name === name) === -1) {
          filteredContacts.push(recentContacts[i])
        }
      }
    }

    this.setState({ tagText: text, filteredContacts })
  }

  handleLinkSharing = (value, data) => {
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
    this.setState({
      selectedContact: item,
      isRemoveModal: true
    })
  }

  onSelectContact = (contact) => {
    let { inviteeEmails, recentContacts } = this.state
    const name = `${contact.userProfile.firstName} ${contact.userProfile.lastName}`

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
    if (filteredContacts && filteredContacts.length > 0) {
      return (
        <ScrollView style={[ styles.contactList ]} keyboardShouldPersistTaps="handled">
          {filteredContacts.map(item => (
            <TouchableOpacity onPress={() => this.onSelectContact(item)} key={item.id}>
              <View style={styles.contactItem}>
                <InviteeItemComponent invitee={item} isOnlyTitle={true} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    let isEnableShare = data.sharingPreferences.level === 'INVITEES_ONLY' ? false : true
    if (isEnableShare) {
      Share.share({
        message: data.summary || '',
        url: `${SHARE_LINK_URL}${data.id}`,
        title: data.headline
      },{
        dialogTitle: data.headline,
        tintColor: COLORS.PURPLE,
        subject: data.headline
      })
    }
  }

  render () {
    const {
      isAddInvitee,
      recentContacts,
      filteredContacts,
      inviteeEmails,
      inviteePermission,
      isPermissionModal,
      isRemoveModal,
      selectedContact,
      isInvalidEmail,
      invalidEmail,
      isInput
     } = this.state
     const { data } = this.props

    return (
      <View style={styles.overlay}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.onClose()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.h3, { color: COLORS.PRIMARY_BLACK }]}>Add people</Text>
            <TouchableOpacity onPress={() => this.onSendInvitation()} activeOpacity={0.8}>
              <Text style={[styles.h3, (!isAddInvitee || isInvalidEmail) ? styles.sendDisableButtonText : styles.sendEnableButtonText]}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.inputFieldView}>
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

              {isInput && (
                this.renderFilteredContacts(filteredContacts)
              )}

              {!isInput && (
                <View style={styles.messageInputItem}>
                  <TextInput
                    ref={ref => this.messageRef = ref}
                    value={this.state.message}
                    placeholder="Add message"
                    multiline={true}
                    style={[styles.textInput]}
                    onChangeText={this.onChangeMessage}
                    underlineColorAndroid='transparent'
                    selectionColor={COLORS.PURPLE}
                  />
                </View>
              )}

              {!isInput &&
                <View style={styles.listItem}>
                  <LinkShareItem
                    isViewOnly={false}
                    feed={data}
                    onPress={() => this.showShareModal(data)}
                    handleLinkSharing={value => this.handleLinkSharing(value, data)}
                  />
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
              : (!isInput && recentContacts && recentContacts.length > 0) && (
                  <View style={styles.inviteeListView}>
                    <View style={styles.titleView}>
                      <Text style={styles.h3}>Current members</Text>
                    </View>
                    <ScrollView style={styles.inviteeList} keyboardShouldPersistTaps="handled">
                      {recentContacts.map(item => (
                        <TouchableOpacity key={item.id} onPress={() => this.onSelectMember(item)}>
                          <View style={styles.inviteeItem}>
                            <InviteeItemComponent invitee={item} />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
              )
            }
          </View>
        </ScrollView>

        {/* <ContactRemoveComponent
          isRemoveModal={this.state.isRemoveModal}
          selectedContact={selectedContact}
          onRemove={() => this.setState({ isRemoveModal: false }) }
        /> */}

        <CardFilterComponent
          cardCount={3}
          totalCardCount={3}
          show={this.state.isRemoveModal}
          onClose={() => this.setState({ isRemoveModal: false }) }
        />

        <Modal
          isVisible={isPermissionModal}
          style={{ margin: 0 }}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ isPermissionModal: false })}
        >
          <LinkShareModalComponent
            inviteePermission={true}
            handleShareOption={this.handlePermissionOption}
          />
        </Modal>
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteeScreen)
