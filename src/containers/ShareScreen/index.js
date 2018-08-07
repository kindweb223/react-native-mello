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
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import LinkShareItem from '../../components/LinkShareModalComponent/LinkShareItem'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import InviteeScreen from '../InviteeScreen'
import { SERVER_URL } from '../../service/api'
import { updateSharingPreferences, deleteInvitee, updateInviteePermission } from '../../redux/feedo/actions'
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

class ShareScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      linkShareModal: false,
      shareModalType: 'share',
      shareInviteeData: {},
      isInviteeOnly: false,
      isInviteeModal: false
    }
  }

  componentDidMount() {
    const { data } = this.props
    const isInviteeOnly = data.sharingPreferences.level === 'INVITEES_ONLY'
    this.setState({ isInviteeOnly })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo } = nextProps

    if (feedo.loading === 'UPDATE_SHARING_PREFERENCES_FULFILLED') {
      return {
        isInviteeOnly: feedo.currentFeed.sharingPreferences.level === 'INVITEES_ONLY'
      }
    }

    return null
  }

  onShowInviteeModal = () => {
    this.setState({ isInviteeModal: true })
  }

  onLinkShare = (isInviteeOnly) => {
    this.setState({ linkShareModal: true, shareModalType: 'share', shareInviteeData: {} })
  }

  onPressInvitee = (data) => {
    this.setState({ linkShareModal: true, shareModalType: 'invitee', shareInviteeData: data })
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
          return
        case 1: // Add
          return
        case 2: // View
          return
        case 3: // Sharing Off
          updateSharingPreferences(
            data.id,
            {
              level: data.sharingPreferences.level === 'INVITEES_ONLY' ? 'PUBLIC' : 'INVITEES_ONLY'
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
            updateInviteePermission(data.id, shareInviteeData.id, 'Edit')
            return
          case 1: // Add
            updateInviteePermission(data.id, shareInviteeData.id, 'Add')
            return
          case 2: // View
            updateInviteePermission(data.id, shareInviteeData.id, 'View')
            return
          case 3: // Remove
            console.log('INVITEE_DATA: ', shareInviteeData)
            deleteInvitee(data.id, shareInviteeData.id)
            return
          default:
            return
        }
      }
    }
  }

  render () {
    const { data } = this.props
    const { linkShareModal, isInviteeOnly, shareModalType, shareInviteeData } = this.state

    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
            <Image source={CLOSE_ICON} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.showShareModal()}>
            <View style={styles.shareButtonView}>
              <Entypo name="share-alternative" style={styles.shareIcon} />
              <Text style={styles.shareButtonText}>Share link</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.listItemView}>
            <TouchableOpacity onPress={() => this.onShowInviteeModal()}>
              <View style={styles.listItem}>
                <InvitePeopleItemComponent />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => this.onLinkShare()}>
              <View style={styles.listItem}>
                <LinkShareItem isInviteeOnly={isInviteeOnly} isViewOnly={false} />
              </View>
            </TouchableOpacity>
          </View>

          {data.invitees && data.invitees.length > 0 && (
            <View style={styles.inviteeListView}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>Members</Text>
              </View>
              <ScrollView style={styles.inviteeList}>
                {data.invitees.map(item => (
                  <TouchableOpacity onPress={() => this.onPressInvitee(item)} key={item.id}>
                    <View style={styles.inviteeItem}>
                      <InviteeItemComponent invitee={item} isViewOnly={false} />
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
            isInviteeOnly={isInviteeOnly}
            handleShareOption={this.handleShareOption}
          />
        </Modal>

        <Modal 
          isVisible={this.state.isInviteeModal}
          style={{ margin: 0 }}
          backdropColor='#f5f5f5'
          backdropOpacity={0.9}
          animationIn="zoomInUp"
          animationOut="zoomOutDown"
          animationInTiming={500}
          onModalHide={() => {}}
        >
          <InviteeScreen onClose={() => this.setState({ isInviteeModal: false })} data={data} />
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

const mapStateToProps = ({ feedo }) => ({
  feedo
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