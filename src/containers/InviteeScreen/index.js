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
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import Modal from 'react-native-modal'
import _ from 'lodash'
import InviteeAutoComplete from '../../components/InviteeAutoComplete'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import { getContactList } from '../../redux/user/actions'
import { inviteToHunt } from '../../redux/feedo/actions'
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
      contactList: [],
      isPermissionModal: false,
      inviteePermission: 'ADD',
      isSuccess: false
    }
  }

  componentDidMount() {
    const userId = '62743b5d-54f1-4b16-b0fb-a29dc816501c'
    this.props.getContactList(userId)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, feedo } = nextProps
    if (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') {
      this.setState({ isSuccess: true, inviteeEmails: [], isAddInvitee: false })
    }

    if (this.props.user.loading === 'GET_CONTACT_LIST_PENDING' && user.loading === 'GET_CONTACT_LIST_FULFILLED') {
      this.setState({ contactList: user.contactList })
    }
  }

  filterContactList = (feed, contactList) => {
    const { invitees } = feed
    const filteredList = _.filter(contactList, item =>
                          _.findIndex(invitees, invitee => invitee.userProfile.id === item.userProfile.id) === -1)
    return filteredList
  }

  onChangeMessage = (text) => {
    this.setState({ message: text })
  }

  handleInvitees = (inviteeEmails) => {
    if (inviteeEmails.length > 0) {
      this.setState({ isAddInvitee: true, inviteeEmails })
    }
  }

  onSendInvitation = () => {
    const { data, inviteToHunt } = this.props
    const { inviteeEmails, message, inviteePermission } = this.state

    const params = {
      message,
      invitees: inviteeEmails,
      permissions: inviteePermission
    }
    console.log('INVITEES_EMAIL: ', params)
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

  render () {
    const { data } = this.props
    const { isAddInvitee, contactList, inviteePermission, isPermissionModal, isSuccess } = this.state
    const filteredContactList = this.filterContactList(data, contactList)
    console.log('Feed: ', data)

    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
            <Image source={CLOSE_ICON} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.onSendInvitation()}>
            <View style={[styles.sendButtonView, isAddInvitee ? styles.sendEnableButtonView : styles.sendDisableButtonView]}>
              <Text style={[styles.sendButtonText, isAddInvitee ? styles.sendEnableButtonText : styles.sendDisableButtonText]}>Send</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.inputFieldView}>
            <View style={styles.inputItem}>
              <InviteeAutoComplete
                contactList={filteredContactList}
                handleInvitees={this.handleInvitees}
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

            <View style={styles.inputItem}>
              <TextInput
                ref={ref => this.messageRef = ref}
                value={this.state.message}
                placeholder="Add message"
                style={[styles.textInput]}
                onChangeText={this.onChangeMessage}
                underlineColorAndroid='transparent'
              />
            </View>
          </View>

          {filteredContactList && filteredContactList.length > 0 && (
            <View style={styles.inviteeListView}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>Contacts</Text>
              </View>
              <ScrollView style={styles.inviteeList}>
                {filteredContactList.map(item => (
                  <TouchableOpacity onPress={() => {}} key={item.id}>
                    <View style={styles.inviteeItem}>
                      <InviteeItemComponent invitee={item} isOnlyTitle={true} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

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
