import React from 'react'
import {
  View,
  Animated,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { Actions } from 'react-native-router-flux'
import ClipboardToasterComponent from '../../components/ClipboardToasterComponent'
import CardNewScreen from '../../containers/CardNewScreen'
import PremiumModal from '../../components/PremiumModalComponent'
import { closeClipboardToaster } from '../../redux/user/actions'
import styles from './styles'
import CONSTANTS from '../../service/constants'

class TabbarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleCard: false
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

  render () {
    const {
      showClipboardToaster,
      clipboardToasterPrevpage,
      clipboardToasterContent,
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
          isVisible={showPremiumModal}
          backdropColor='#656974'
          backdropOpacity={0.6}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          onBackdropPress={() => this.props.handleHidePremiumModal()}
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
  closeClipboardToaster: (data) => dispatch(closeClipboardToaster(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabbarContainer)
