import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import UserAvatar from 'react-native-user-avatar'
import { filter } from 'lodash'
import Image from 'react-native-image-progress'

import COLORS from '../../service/colors'
import { getDurationFromNow } from '../../service/dateUtils'
import styles from './styles'
import LikeComponent from '../LikeComponent';


class FeedCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onComment() {
  }

  get renderBottom() {
    const { invitees, idea } = this.props;
    const {
      comments,
    } = idea.metadata;
    const invitee = filter(invitees, item => item.id === idea.inviteeId)[0]
    const userName = `${invitee.userProfile.firstName} ${invitee.userProfile.lastName}`
    let isOnlyInvitee = false
    
    if (invitees.length === 1 && invitees[0].userProfile.id === invitee.userProfile.id) {
      isOnlyInvitee = true
    }
  
    return (
      <View style={styles.bottomContainer}>
        <View style={styles.subView}>
          {
            !isOnlyInvitee &&
              [
                <View key="0" style={styles.avatar}>
                  {
                    invitee.imageUrl ?
                      <UserAvatar
                        size="30"
                        name={userName}
                        color="#000"
                        textColor="#fff"
                        src={invitee.imageUrl}
                      />
                    : 
                      <UserAvatar
                        size="30"
                        name={userName}
                        color="#000"
                        textColor="#fff"
                      />
                  }
                </View>,
                <Text key="1" style={styles.text}>{invitee.userProfile.firstName}</Text>,
                <Entypo key="2" name="dot-single" style={styles.dotIcon} />
              ]
          }
          <Text style={styles.text}>
            {getDurationFromNow(idea.publishedDate)}
          </Text>
        </View>
        <View style={styles.subView}>
          <LikeComponent idea={this.props.idea} />
          <TouchableOpacity 
            style={styles.buttonWrapper}
            activeOpacity={0.7}
            onPress={() => this.onComment()}
          >
            <Feather name="message-square" style={styles.icon} />
            <Text style={styles.iconText}>{comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const {
      idea,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{idea.title}</Text>
        {
          idea.coverImage && idea.coverImage.length && 
            <View style={styles.thumbnailsView}>
              <Image
                style={styles.thumbnails}
                source={{ uri: idea.coverImage }}
              />
            </View>
        }
        {this.renderBottom}
      </View>
    )
  }
}

FeedCardComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
  invitees: PropTypes.arrayOf(PropTypes.any).isRequired
}

const mapStateToProps = ({ card, feedo }) => ({
  card,
  feedo,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(FeedCardComponent)
