import React from 'react'
import {
  View,
  Text, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Image,
  Share
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import LinkShareItem from '../../components/LinkShareModalComponent/LinkShareItem'
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
      linkShareModal: false
    }
  }

  onInviteePeople = () => {
  }

  onLinkShare = (isInviteeOnly) => {
    this.setState({ linkShareModal: true })
  }

  showShareModal = () => {
    const { data } = this.props

    Share.share({
      message: data.summary,
      url: '',
      title: data.headline
    },{
      dialogTitle: data.headline,
      tintColor: COLORS.PURPLE,
      subject: data.headline
    })
  }

  handleShareOption = (index) => {
    this.setState({ linkShareModal: false })

    switch(index) {
      case 0: // Edit
        return
      case 1: // Add
        return
      case 2: // View
        return
      case 3: // Sharing Off
        return
      default:
        return
    }
  }

  render () {
    const { data } = this.props
    console.log('DATA: ', data)
    const isInviteeOnly = data.sharingPreferences.level === 'INVITEES_ONLY'

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
          <TouchableOpacity onPress={() => this.onInviteePeople()}>
            <View style={styles.listItem}>
              <InvitePeopleItemComponent />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => this.onLinkShare()}>
            <View style={styles.listItem}>
              <LinkShareItem isInviteeOnly={isInviteeOnly} />
            
              <View style={styles.rightView}>
                <Text style={[styles.viewText, isInviteeOnly ? styles.viewDisableText : styles.viewEnableText]}>
                  {isInviteeOnly ? 'Off' : 'View'}
                </Text>
                <Entypo name="cog" style={[styles.cogIcon, isInviteeOnly ? styles.cogDisableIcon : styles.cogEnableIcon]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Modal 
          isVisible={this.state.linkShareModal}
          style={{ margin: 0 }}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={500}
          onBackdropPress={() => this.setState({ linkShareModal: false })}
        >
          <LinkShareModalComponent isInviteeOnly={isInviteeOnly} handleShareOption={this.handleShareOption} />
        </Modal>

      </View>
    )
  }
}

ShareScreen.defaultProps = {
  onClose: () => {},
  data: {}
}

ShareScreen.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any)
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

export default connect(
  mapStateToProps,
  null
)(ShareScreen)
