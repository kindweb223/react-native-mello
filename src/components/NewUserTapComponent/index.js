import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'

const NewUserTap = ({ inputEmail, onHandleNewUserTap }) => {
  const isValidEmail = COMMON_FUNC.validateEmail(inputEmail)
  let item
  if (isValidEmail) {
    item = {
      userProfile: {
        firstName: inputEmail.match(/^([^@]*)@/)[1],
        lastName: '',
        email: inputEmail,
        id: COMMON_FUNC.generateRandomString()
      }
    }
  }

  return isValidEmail && (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onHandleNewUserTap(item)}
    >
      <InviteeItemComponent
        invitee={item}
        isOnlyTitle={true}
        isViewOnly={true}
      />
    </TouchableOpacity>
  )
}

NewUserTap.propTypes = {
  inputEmail: PropTypes.string,
  onHandleNewUserTap: PropTypes.func
}

export default NewUserTap