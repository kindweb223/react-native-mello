/* global require */
import React from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Analytics from '../../lib/firebase'
import NotificationItemComponent from '../../components/NotificationItemComponent'

import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class NotificationScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => Actions.pop()} style={styles.buttonWrapper}>
        <Image source={CLOSE_ICON} />
      </TouchableOpacity>
    );
  }

  static renderTitle() {
    return (
      <Text style={styles.textTitle}>Notifications</Text>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      invitedFeedList: []
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    const { feedo } = this.props
    this.setState({ invitedFeedList: feedo.invitedFeedList })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo } = nextProps
    if (this.props.feedo.loading === 'UPDTE_FEED_INVITATION_PENDING' && feedo.loading === 'UPDTE_FEED_INVITATION_FULFILLED') {
      this.setState({ invitedFeedList: feedo.invitedFeedList })
    }
  }

  renderItem({ item }) {
    return (
      <View style={styles.itemView}>
        <NotificationItemComponent item={item} />

        {this.state.invitedFeedList.length > 0 && (
          <View style={[styles.separator, { marginTop: 14 }]} />
        )}
      </View>
    )
  }

  render () {
    const { invitedFeedList } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.contentFlatList}
          data={invitedFeedList}
          keyExtractor={item => item.id}
          automaticallyAdjustContentInsets={true}
          renderItem={this.renderItem.bind(this)}
          keyboardShouldPersistTaps="handled"
        />

      </View>
    )
  }
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

NotificationScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  null
)(NotificationScreen)

