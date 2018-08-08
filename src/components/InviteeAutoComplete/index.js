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
import Tags from '../../components/TagComponent';
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'

class InviteeAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: [],
      filteredContacts: [],
      inviteeEmails: [],
      isInput: false
    };
  }

  componentDidMount() {
    const { contactList } = this.props

    this.setState({
      contactList
    })
  }

  onCreateInvitee(text) {
    let { inviteeEmails } = this.state
    inviteeEmails.push({ 'text': text })
    this.setState({ inviteeEmails })
  }

  onRemoveInvitee(invitee) {
    console.log('REMOVE: ', invitee)
  }

  onChangeText(text) {
    let { contactList } = this.state

    if (text.length > 0) {
      this.setState({ isInput: true })
    } else {
      this.setState({ isInput: false })
    }

    let filteredContacts = []

    for (let i = 0; i < contactList.length; i ++) {
      const email = contactList[i].userProfile.email
      const name = `${contactList[i].userProfile.firstName} ${contactList[i].userProfile.lastName}`

      if (email.includes(text.toLowerCase()) || name.includes(text.toLowerCase())) {
        filteredContacts.push(contactList[i])
      }
    }

    this.setState({ filteredContacts })
  }

  onSelectContact = (contact) => {
    let { inviteeEmails } = this.state
    inviteeEmails.push({ 'text': contact.userProfile.email })
    this.setState({ inviteeEmails })
  }

  renderFilteredContacts = (filteredContacts) => {
    return (
      <ScrollView style={styles.contactList}>
        {filteredContacts.map(item => (
          <TouchableOpacity onPress={() => this.onSelectContact(item)} key={item.id}>
            <View style={styles.contactItem}>
              <InviteeItemComponent invitee={item} isOnlyTitle={true} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  render () {
    const { filteredContacts, inviteeEmails, isInput } = this.state
    console.log('INVITEE_EMAILS: ', inviteeEmails)

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='always'
        >
          <View style={styles.mainContentContainer}>
            <Tags
              tags={inviteeEmails}
              placeHolder="Email or name"
              onCreateTag={(text) => this.onCreateInvitee(text)}
              onChangeText={(text) => this.onChangeText(text)}
              onRemoveTag={(invitee) => this.onRemoveInvitee(invitee)}
              inputStyle={{
                backgroundColor: 'white',
              }}
              tagContainerStyle={{
                backgroundColor: '#f00',
              }}
              tagTextStyle={{
                color: COLORS.DARK_GREY,
                fontSize: 14,
              }}
              activeTagContainerStyle={{
                backgroundColor: 'rgba(74, 0, 205, .2)'
              }}
              activeTagTextStyle={{
                color: COLORS.PURPLE,
                fontSize: 14,
              }}
            />
            
            {isInput && (
              this.renderFilteredContacts(filteredContacts)
            )}

          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


InviteeAutoComplete.defaultProps = {
  contactList: []
}


InviteeAutoComplete.propTypes = {
  contactList: PropTypes.arrayOf(PropTypes.any)
}

export default InviteeAutoComplete