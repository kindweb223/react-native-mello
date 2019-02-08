import React from 'react'
import {
  View,
  Animated
} from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import ClipboardToasterComponent from '../../components/ClipboardToasterComponent'
import CardNewScreen from '../../containers/CardNewScreen'
import PremiumConfirmAlert from '../../components/PremiumModalComponent/ConfirmAlert'
import PremiumModal from '../../components/PremiumModalComponent/PremiumModal'
import { closeClipboardToaster, handleHidePremiumAlert, handleShowPremiumModal, handleHidePremiumModal } from '../../redux/user/actions'
import styles from './styles'
import CONSTANTS from '../../service/constants'

class TabbarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleCard: false,
      isShowPremiumModal: false
    }
    this.animatedOpacity = new Animated.Value(0);
  }

  onDismissClipboardToaster() {
    this.props.closeClipboardToaster()
  }

  onAddClipboardLink() {
    this.setState({ isVisibleCard: true })
    this.onDismissClipboardToaster()

    this.animatedOpacity.setValue(0);
    Animated.timing(this.animatedOpacity, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start()
  }

  onCloseCardModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false
      })
    })
  }

  onClosePremiumAlert = (isShowPremiumModal) => {
    this.setState({ isShowPremiumModal }, () => {
      this.props.handleHidePremiumAlert()
    })
  }

  onHidePremiumAlertModal = () => {
    if (this.state.isShowPremiumModal) {
      this.props.handleShowPremiumModal()
    }
  }

  render () {
    const {
      showClipboardToaster,
      clipboardToasterPrevpage,
      clipboardToasterContent,
      showPremiumAlert,
      showPremiumModal
    } = this.props.user

    return (
      <View style={styles.container}>
        {showClipboardToaster && (
          <ClipboardToasterComponent
            description={clipboardToasterContent}
            onPress={() => this.onAddClipboardLink()}
            onClose={() => this.onDismissClipboardToaster()}
          />
        )}

        {this.state.isVisibleCard && (
          <Animated.View
            style={[
              styles.modalContainer,
              { opacity: this.animatedOpacity }
            ]}
          >
            <CardNewScreen 
              viewMode={CONSTANTS.CARD_NEW}
              cardMode={CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD}
              invitee={null}
              prevPage={clipboardToasterPrevpage}
              shareUrl={clipboardToasterContent}
              onClose={() => this.onCloseCardModal()}
            />
          </Animated.View>
        )}

        <Modal
          isVisible={showPremiumAlert}
          style={{ margin: 0 }}
          backdropColor='transparent'
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={100}
          onBackdropPress={() => {}}
          onModalHide={() => this.onHidePremiumAlertModal()}
        >
          <PremiumConfirmAlert
            onOk={() => this.onClosePremiumAlert(false)}
            onDiscover={() => this.onClosePremiumAlert(true)}
          />
        </Modal>

        <Modal
          isVisible={showPremiumModal}
          backdropColor='#656974'
          backdropOpacity={0.6}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          onBackdropPress={() => this.props.handleHidePremiumModal()}
          onModalShow={() => this.setState({ isShowPremiumModal: false })}
        >
          <PremiumModal
            onClose={() => this.props.handleHidePremiumModal()}
          />
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  closeClipboardToaster: (data) => dispatch(closeClipboardToaster(data)),
  handleHidePremiumAlert: () => dispatch(handleHidePremiumAlert()),
  handleShowPremiumModal: () => dispatch(handleShowPremiumModal()),
  handleHidePremiumModal: () => dispatch(handleHidePremiumModal())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabbarContainer)
