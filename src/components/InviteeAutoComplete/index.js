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
      invitees: [],
      filteredInvitees: [],
      inviteeEmails: [],
      isInput: false
    };
  }

  componentDidMount() {
    const { invitees } = this.props
    // let inviteeEmails = []
    // for (let i = 0; i < invitees.length; i ++) {
    //   inviteeEmails = [...inviteeEmails, invitees[i].userProfile.email]
    // }

    this.setState({
      invitees,
      filteredInvitees: invitees
    })
  }

  onCreateInvitee(text) {
    const { inviteeEmails } = this.state
    inviteeEmails.push(text)
    this.setState({ inviteeEmails })
  }

  onRemoveInvitee(invitee) {
    console.log('REMOVE: ', invitee)
  }

  onChangeText(text) {
    if (text.length > 0) {
      this.setState({ isInput: true })
    } else {
      this.setState({ isInput: false })
    }
  }

  renderFilteredInvitees = (invitees) => {
    return (
      <ScrollView style={styles.inviteeList}>
        {invitees.map(item => (
          <TouchableOpacity onPress={() => {}} key={item.id}>
            <View style={styles.inviteeItem}>
              <InviteeItemComponent invitee={item} isOnlyTitle={true} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  render () {
    const { filteredInvitees, inviteeEmails, isInput } = this.state
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
              onRemoveTag={(invitee) => this.onRemovInvitee(invitee)}
              inputStyle={{
                backgroundColor: 'white',
              }}
              tagContainerStyle={{
                backgroundColor: COLORS.PURPLE,
                opacity: 0.3
              }}
              tagTextStyle={{
                color: COLORS.DARK_GREY,
                fontSize: 14,
              }}
              activeTagContainerStyle={{
                backgroundColor: COLORS.PURPLE,
                opacity: 0.3
              }}
              activeTagTextStyle={{
                color: COLORS.PURPLE,
                fontSize: 14,
              }}
            />
            
            {isInput && (
              this.renderFilteredInvitees(filteredInvitees)
            )}

          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


InviteeAutoComplete.defaultProps = {
  invitees: []
}


InviteeAutoComplete.propTypes = {
  invitees: PropTypes.arrayOf(PropTypes.any)
}

export default InviteeAutoComplete