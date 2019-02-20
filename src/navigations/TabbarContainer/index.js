import React from 'react'
import {
  View,
  Animated
} from 'react-native'
import { connect } from 'react-redux'
import ClipboardToasterComponent from '../../components/ClipboardToasterComponent'
import CardNewScreen from '../../containers/CardNewScreen'
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
      clipboardToasterContent
    } = this.props.user
    const { isVisibleCard } = this.state

    return (
      <View style={isVisibleCard ? styles.containerCard : styles.container}>
        {showClipboardToaster && (
          <ClipboardToasterComponent
            description={clipboardToasterContent}
            onPress={() => this.onAddClipboardLink()}
            onClose={() => this.onDismissClipboardToaster()}
          />
        )}

        {isVisibleCard && (
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
