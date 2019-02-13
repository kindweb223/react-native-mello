import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import InviteeItemComponent from '../../components/LinkShareModalComponent/InviteeItemComponent'
import Button from '../../components/Button'
import { getContactList } from '../../redux/user/actions'
import styles from './styles'
import COLORS from '../../service/colors'
import * as COMMON_FUNC from '../../service/commonFunc'
import Analytics from '../../lib/firebase'

class FollowMemberScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      contactList: [],
      recentContacts: [],
      currentMembers: []
    }
    this.isMount = false
  }

  componentDidMount() {
    Analytics.setCurrentScreen('FollowMemberScreen')

    const { userInfo } = this.props.user
    this.isMount = true
    this.setState({ loading: true })
    this.props.getContactList(userInfo.id)
    this.setState({ currentMembers: COMMON_FUNC.filterRemovedInvitees(this.props.data.invitees) })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user, feedo, data } = nextProps

    if (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') {
      if (this.props.feedo.error) {
        Alert.alert(
          'Error',
          feedo.error
        )
      } else {
        this.props.onClose()
      }
    }

    if (this.props.user.loading === 'GET_CONTACT_LIST_PENDING' && user.loading === 'GET_CONTACT_LIST_FULFILLED') {
      if (this.isMount) {
        this.setState({ loading: false })
        this.setState({
          contactList: this.getRecentContactList(data, user.contactList),
          recentContacts: this.getRecentContactList(data, user.contactList)
        })
      }
    }
  }

  componentWillUnmount() {
    this.isMount = false
  }

  getRecentContactList = (feed, contactList) => {
    const invitees = COMMON_FUNC.filterRemovedInvitees(feed.invitees)
    const filteredList = _.filter(contactList, item =>
                          _.findIndex(invitees, invitee => invitee.userProfile.id === item.userProfile.id) === -1)
    return filteredList
  }

  render() {
    const {
      currentMembers
    } = this.state

    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onClose()}>
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>Flow members</Text>
          <Text style={{opacity:0}}>Close</Text>
        </View>

        {this.state.loading
          ? <View style={styles.loadingView}>
              <ActivityIndicator 
                animating
                color={COLORS.PURPLE}
              />
            </View>
          : (currentMembers && currentMembers.length > 0) && (
              <View style={styles.inviteeListView}>
                <ScrollView style={styles.inviteeList} keyboardShouldPersistTaps="handled">
                  {currentMembers.map(item => (
                    <View key={item.id} style={styles.inviteeItem}>
                      <InviteeItemComponent invitee={item} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )
        }

        <View style={styles.buttonView}>
          <Button
            style={styles.button}
            color='#F4F4F4'
            labelColor={COLORS.PURPLE}
            borderRadius={14}
            label="Leave flow"
            isLoading={this.props.feedo.loading === 'DELETE_INVITEE_PENDING'}
            onPress={() => this.props.deleteInvitee()}
          />
        </View>
      </View>
    )
  }
}

FollowMemberScreen.defaultProps = {
  onClose: () => {},
  data: {},
  getContactList: () => {}
}

FollowMemberScreen.propTypes = {
  onClose: PropTypes.func,
  deleteInvitee: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  getContactList: PropTypes.func,
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

const mapDispatchToProps = dispatch => ({
  getContactList: (userId) => dispatch(getContactList(userId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowMemberScreen)