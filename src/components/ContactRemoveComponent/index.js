import React from 'react'
import { View, Modal, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'
import Button from '../Button'
import COLORS from '../../service/colors'

class ContactRemove extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { isRemoveModal, selectedContact, onRemove } = this.props
    return (
      <Modal
        isVisible={isRemoveModal}
        style={{ margin: 0 }}
        backdropColor={COLORS.MODAL_BACKDROP}
        backdropOpacity={0.4}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        onBackdropPress={() => this.props.onRemove()}
        onBackButtonPress={() => this.props.onRemove()}
      >
        <View style={styles.overlay}>
          {selectedContact &&
            <InviteeItemComponent
              invitee={selectedContact}
              hideLike={false}
            />
          }
          <Button
            style={styles.button}
            color='rgba(255, 0, 0, 0.1)'
            labelColor={COLORS.RED}
            label="Remove"
            borderRadius={14}
          />
        </View>
      </Modal>
    )
  }
}

ContactRemove.propTypes = {
  isRemoveModal: PropTypes.bool,
  selectedContact: PropTypes.object,
  onRemove: PropTypes.func
}

export default ContactRemove