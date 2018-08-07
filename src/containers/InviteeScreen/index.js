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
import _ from 'lodash'
import InviteeAutoComplete from '../../components/InviteeAutoComplete'
import LinkShareModalComponent from '../../components/LinkShareModalComponent'
import LinkShareItem from '../../components/LinkShareModalComponent/LinkShareItem'
import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
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

class InviteeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      suggestions : [ { name:'Mickey Mouse' }, ],
      tagsSelected : []
    }
  }

  componentDidMount() {
    const { data } = this.props
    let emails = []
    for (let i = 0; i < data.invitees.length; i ++) {
      emails = [...emails, data.invitees[i].userProfile.email]
    }
    console.log('INVITEE_DATA: ', emails)
  }

  handleDelete = index => {
    let tagsSelected = this.state.tagsSelected;
    tagsSelected.splice(index, 1);
    this.setState({ tagsSelected });
  }
 
  handleAddition = suggestion => {
    this.setState({ tagsSelected: this.state.tagsSelected.concat([suggestion]) });
  }

  render () {
    const { data } = this.props
    const { isEdit } = this.state

    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
            <Image source={CLOSE_ICON} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.onSendInvitation()}>
            <View style={[styles.sendButtonView, isEdit ? styles.sendEnableButtonView : styles.sendDisableButtonView]}>
              <Text style={[styles.sendButtonText, isEdit ? styles.sendEnableButtonText : styles.sendDisableButtonText]}>Send</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.inputFieldView}>
            <View style={styles.inputItem}>
              <InviteeAutoComplete
                suggestions={this.state.suggestions}
                tagsSelected={this.state.tagsSelected}
                handleAddition={this.handleAddition}
                handleDelete={this.handleDelete}
                placeholder="Add a contact.."
              />
            </View>
            <View style={styles.inputItem}>
            </View>
          </View>

          {data.invitees && data.invitees.length > 0 && (
            <View style={styles.inviteeListView}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>Recent</Text>
              </View>
              <ScrollView style={styles.inviteeList}>
                {data.invitees.map(item => (
                  <TouchableOpacity onPress={() => this.onPressInvitee(item)} key={item.id}>
                    <View style={styles.inviteeItem}>
                      <InviteeItemComponent invitee={item} isOnlyTitle={true} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

      </View>
    )
  }
}

InviteeScreen.defaultProps = {
  onClose: () => {},
  data: {},
}

InviteeScreen.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

export default connect(
  mapStateToProps,
  null
)(InviteeScreen)
