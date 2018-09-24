import React from 'react'
import {
  View,
  Text, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Image,
  Share,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import LinkShareItem from '../../components/LinkShareModalComponent/LinkShareItem'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import InviteeScreen from '../InviteeScreen'
import { SERVER_URL } from '../../service/api'
import { updateSharingPreferences, deleteInvitee, updateInviteePermission } from '../../redux/feedo/actions'
import COLORS from '../../service/colors'
import * as COMMON_FUNC from '../../service/commonFunc'
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

class ShareScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      linkShareModal: false,
      shareModalType: 'share',
      shareInviteeData: {},
      isInviteeModal: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, user } = nextProps
    const { shareInviteeData } = this.state

    if (this.props.feedo.loading === 'DELETE_INVITEE_PENDING' && feedo.loading === 'DELETE_INVITEE_FULFILLED') {
      if (COMMON_FUNC.isFeedEditor(feedo.currentFeed) ||
        COMMON_FUNC.isFeedContributor(feedo.currentFeed) ||
        COMMON_FUNC.isFeedGuest(feedo.currentFeed)) {
          if (user.userInfo.id === shareInviteeData.userProfile.id) {
            Actions.HomeScreen()
          }
      }
    }

    if (this.props.feedo.loading === 'UPDATE_INVITEE_PERMISSION_PENDING' && feedo.loading === 'UPDATE_INVITEE_PERMISSION_FULFILLED') {
      if (COMMON_FUNC.isFeedEditor(feedo.currentFeed)) {
        if (user.userInfo.id === shareInviteeData.userProfile.id) {
          this.props.onClose()
          Actions.HomeScreen()
        }
      }
    }
  }

  onShowInviteeModal = (feed) => {
    if (COMMON_FUNC.isFeedOwnerEditor(feed)) {
      this.setState({ isInviteeModal: true })
    }
  }

  onLinkShare = (feed) => {
    if (COMMON_FUNC.isFeedOwnerEditor(feed)) {
      this.setState({ linkShareModal: true, shareModalType: 'share', shareInviteeData: {} })
    }
  }

  onPressInvitee = (feed, invitee) => {
    const { user } = this.props
    if (!COMMON_FUNC.isInviteeOwner(feed, invitee)) {
      if (COMMON_FUNC.isFeedOwnerEditor(feed)) {
        this.setState({ linkShareModal: true, shareModalType: 'invitee', shareInviteeData: invitee })
      } else {
        if (user.userInfo.id === invitee.userProfile.id) {
          this.setState({ linkShareModal: true, shareModalType: 'invitee', shareInviteeData: invitee })
        }
      }
    }
  }

  showShareModal = () => {
    const { data } = this.props

    Share.share({
      message: data.summary,
      url: `${SERVER_URL}${data.id}`,
      title: data.headline
    },{
      dialogTitle: data.headline,
      tintColor: COLORS.PURPLE,
      subject: data.headline
    })
  }

  handleShareOption = (index) => {
    const { data, updateSharingPreferences, deleteInvitee, updateInviteePermission } = this.props
    const { shareModalType } = this.state
    this.setState({ linkShareModal: false })

    if (shareModalType === 'share') {
      switch(index) {
        case 0: // Edit
          updateSharingPreferences(
            data.id,
            {
              level: 'REGISTERED_ONLY',
              permissions: 'EDIT'
            }
          )
          return
        case 1: // Add
          updateSharingPreferences(
            data.id,
            {
              level: 'REGISTERED_ONLY',
              permissions: 'ADD'
            }
          )
          return
        case 2: // View
          updateSharingPreferences(
            data.id,
            {
              level: 'REGISTERED_ONLY',
              permissions: 'VIEW'
            }
          )
          return
        case 3: // Sharing Off
          updateSharingPreferences(
            data.id,
            {
              level: 'INVITEES_ONLY'
            }
          )
          return
        default:
          return
      }
    } else if (shareModalType === 'invitee') {
      const { shareInviteeData } = this.state

      if (data.owner.id !== shareInviteeData.userProfile.id) {
        switch(index) {
          case 0: // Edit
            updateInviteePermission(data.id, shareInviteeData.id, 'EDIT')
            return
          case 1: // Add
            updateInviteePermission(data.id, shareInviteeData.id, 'ADD')
            return
          case 2: // View
            updateInviteePermission(data.id, shareInviteeData.id, 'VIEW')
            return
          case 3: // Remove
            deleteInvitee(data.id, shareInviteeData.id)
            return
          default:
            return
        }
      }
    }
  }

  handleModal = () => {
    this.setState({ isInviteeModal: false }, () => {
      this.props.onClose()
    })
  }

  render () {
    const { data } = this.props
    const { linkShareModal, shareModalType, shareInviteeData } = this.state
    let { invitees } = data

    invitees = _.sortBy(invitees, invitee => invitee.dateCreated)

    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
            <Image source={CLOSE_ICON} />
          </TouchableOpacity>
          
          {data.sharingPreferences.level === 'INVITEES_ONLY'
            ? <TouchableOpacity onPress={() => this.onLinkShare(data)}>
                <View style={styles.shareButtonView}>
                  <Entypo name="share-alternative" size={16} color={COLORS.LIGHT_GREY} />
                  <Text style={[styles.shareButtonText, { color: COLORS.LIGHT_GREY }]}>Share link</Text>
                </View>
              </TouchableOpacity>
            : <TouchableOpacity onPress={() => this.showShareModal()}>
                <View style={styles.shareButtonView}>
                  <Entypo name="share-alternative" size={16} color={COLORS.PURPLE} />
                  <Text style={[styles.shareButtonText, { color: COLORS.PURPLE }]}>Share link</Text>
                </View>
            </TouchableOpacity>
          }
        </View>

        <View style={styles.body}>
          <View style={styles.listItemView}>
            <TouchableOpacity onPress={() => this.onShowInviteeModal(data)}>
              <View style={styles.listItem}>
                <InvitePeopleItemComponent />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => this.onLinkShare(data)}>
              <View style={styles.listItem}>
                <LinkShareItem isViewOnly={false} feed={data} />
              </View>
            </TouchableOpacity>
          </View>

          {invitees && invitees.length > 0 && (
            <View style={styles.inviteeListView}>
              <View style={styles.titleContainer}>
                <View style={styles.titleView}>
                  <Text style={styles.titleText}>Members</Text>
                </View>
              </View>
              <ScrollView style={styles.inviteeList}>
                {invitees.map(invitee => (
                  <TouchableOpacity onPress={() => this.onPressInvitee(data, invitee)} key={invitee.id}>
                    <View style={styles.inviteeItemView}>
                      <View style={styles.inviteeItem}>
                        <InviteeItemComponent
                          invitee={invitee}
                          isViewOnly={false}
                          hideLike={true}
                          isOwnerInvitee={COMMON_FUNC.isInviteeOwner(data, invitee)}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <Modal 
          isVisible={linkShareModal}
          style={{ margin: 0 }}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ linkShareModal: false })}
        >
          <LinkShareModalComponent
            shareModalType={shareModalType}
            shareInviteeData={shareInviteeData}
            feed={data}
            handleShareOption={this.handleShareOption}
          />
        </Modal>

        <Modal
          isVisible={this.state.isInviteeModal}
          style={{ margin: 0 }}
          backdropColor='#f5f5f5'
          backdropOpacity={0.9}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationInTiming={500}
          onModalHide={() => {}}
          onBackdropPress={() => this.setState({ isInviteeModal: false })}
        >
          <InviteeScreen
            data={data}
            onClose={() => this.setState({ isInviteeModal: false })}
            handleModal={() => this.handleModal()}
          />
        </Modal>

      </View>
    )
  }
}

ShareScreen.defaultProps = {
  onClose: () => {},
  data: {},
  updateSharingPreferences: () => {},
  deleteInvitee: () => {},
  updateInviteePermission: () => {}
}

ShareScreen.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  updateSharingPreferences: PropTypes.func,
  deleteInvitee: PropTypes.func,
  updateInviteePermission: PropTypes.func
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

const mapDispatchToProps = dispatch => ({
  updateSharingPreferences: (feedId, data) => dispatch(updateSharingPreferences(feedId, data)),
  deleteInvitee: (feedId, inviteeId) => dispatch(deleteInvitee(feedId, inviteeId)),
  updateInviteePermission: (feedId, inviteeId, type) => dispatch(updateInviteePermission(feedId, inviteeId, type)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareScreen)
