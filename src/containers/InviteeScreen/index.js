import React from 'react'
import {
  View,
  Text, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Image,
  Share,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import KeyboardScrollView from '../../components/KeyboardScrollView'
import InviteeAutoComplete from '../../components/InviteeAutoComplete'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import { getContactList } from '../../redux/user/actions'
import { inviteToHunt } from '../../redux/feedo/actions'
import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors'
import styles from './styles'
const PLUS_ICON = require('../../../assets/images/Add/White.png')
const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

const InvitePeopleItemComponent = () => (
  <View style={styles.innerView}>
    <View style={styles.plusButton}>
      <Image source={PLUS_ICON} />
    </View>
    <Text style={styles.title}>Invite people</Text>
  </View>
)

class InviteeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAddInvitee: false,
      message: '',
      isPermissionModal: false,
      inviteePermission: 'ADD',
      isSuccess: false,
      isInput: false,
      contactList: [],
      inviteeEmails: [],
      filteredContacts: [],
      recentContacts: [],
      isInvalidEmail: false,
      invalidEmail: [],
      loading: false
    }
    this.isMount = false
  }

  componentDidMount() {
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
        if (this.isMount) {
          this.setState({ isSuccess: true }, () => {
            this.closeModal()
          })
        }
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

  closeModal = () => {
    setTimeout(() => {
      this.setState({ isSuccess: false }, () => {
        if (!this.state.isSuccess) {
          this.props.handleModal()
        }
      })
    }, 2000)
  }

  getRecentContactList = (feed, contactList) => {
    const { invitees } = feed
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
    this.setState({ isInput: text.length > 0 ? true : false })

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

    this.setState({ filteredContacts })
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
      recentContacts: contacts
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
  }

  onChangeMessage = (text) => {
    this.setState({ message: text })
  }

  render () {
    const { data } = this.props
    const {
      isAddInvitee,
      contactList,
      recentContacts,
      filteredContacts,
      inviteeEmails,
      inviteePermission,
      isPermissionModal,
      isSuccess,
      isInvalidEmail,
      invalidEmail
     } = this.state

    return (
      <View style={styles.overlay}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.onClose()}>
              <Image source={CLOSE_ICON} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onSendInvitation()} activeOpacity={0.8}>
              <View style={[styles.sendButtonView, (!isAddInvitee || isInvalidEmail) ? styles.sendDisableButtonView : styles.sendEnableButtonView]}>
                <Text style={[styles.sendButtonText, (!isAddInvitee || isInvalidEmail) ? styles.sendDisableButtonText : styles.sendEnableButtonText]}>Send</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.inputFieldView}>
              <View style={styles.tagInputItem}>
                <InviteeAutoComplete
                  inviteeEmails={inviteeEmails}
                  invalidEmail={invalidEmail}
                  handleInvitees={this.handleInvitees}
                  handleChange={this.handleChange}
                />
                <TouchableOpacity onPress={() => this.updatePermission()}>
                  <View style={styles.rightView}>
                    <Text style={styles.viewText}>
                      {inviteePermission}
                    </Text>
                    <Entypo name="cog" style={styles.cogIcon} />
                  </View>
                </TouchableOpacity>
              </View>

              {this.state.isInput && (
                this.renderFilteredContacts(filteredContacts)
              )}

              {!this.state.isInput && (
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
            </View>

            {this.state.loading
              ? <View style={styles.loadingView}>
                  <ActivityIndicator 
                    animating
                    color={COLORS.PURPLE}
                  />
                </View>
              : (!this.state.isInput && recentContacts && recentContacts.length > 0) && (
                  <View style={styles.inviteeListView}>
                    <View style={styles.titleView}>
                      <Text style={styles.titleText}>Contacts</Text>
                    </View>
                    <ScrollView style={styles.inviteeList} keyboardShouldPersistTaps="handled">
                      {recentContacts.map(item => (
                        <TouchableOpacity key={item.id} onPress={() => this.onSelectContact(item)}>
                          <View style={styles.inviteeItem}>
                            <InviteeItemComponent invitee={item} hideLike />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
              )
            }
          </View>
        </ScrollView>

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

        <Modal 
          isVisible={isSuccess}
          style={styles.successModal}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ isSuccess: false })}
        >
          <View style={styles.successView}>
            <Octicons name="check" style={styles.successIcon} />
          </View>
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
  inviteToHunt: (feedId, data) => dispatch(inviteToHunt(feedId, data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteeScreen)
