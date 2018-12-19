import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import styles from './styles'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import InviteeTag from './InviteeTag';
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'

class InviteeAutoComplete extends React.Component {
  constructor(props) {
    super(props);
  }

  onCreateInvitee(text) {
    let { inviteeEmails } = this.props

    if (text.length > 0) {
      inviteeEmails.push({ text, name: text, email: text })
      this.props.handleInvitees(inviteeEmails)
    }

  }

  onRemoveInvitee(invitee) {
    let { inviteeEmails } = this.props
    inviteeEmails = _.filter(inviteeEmails, item => item.text !== invitee.text)
    this.props.handleInvitees(inviteeEmails)
  }

  onChangeText(text) {
    this.props.handleChange(text)
  }

  render () {
    const { inviteeEmails, invalidEmail, tagText } = this.props

    return (
      <View style={styles.container}>
        <InviteeTag
          tagText={this.props.tagText}
          invalidEmail={invalidEmail}
          tags={inviteeEmails}
          placeHolder="Email or name"
          onCreateTag={(text) => this.onCreateInvitee(text)}
          onChangeText={(text) => this.onChangeText(text)}
          onRemoveTag={(invitee) => this.onRemoveInvitee(invitee)}
          inputStyle={{
            backgroundColor: 'transparent',
          }}
          tagContainerStyle={{
            backgroundColor: 'rgba(74, 0, 205, .1)',
          }}
          tagTextStyle={{
            color: COLORS.PURPLE,
            fontSize: 14,
          }}
          activeTagContainerStyle={{
            backgroundColor: 'rgba(74, 0, 205, .3)'
          }}
          activeTagTextStyle={{
            fontSize: 14,
          }}
        />
      </View>
    );
  }
}


InviteeAutoComplete.defaultProps = {
  handleChange: () => {}
}

InviteeAutoComplete.propTypes = {
  invalidEmail: PropTypes.arrayOf(PropTypes.any).isRequired,
  inviteeEmails: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleChange: PropTypes.func
}

export default InviteeAutoComplete
