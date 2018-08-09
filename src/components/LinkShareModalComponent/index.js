import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import LinkShareItem from './LinkShareItem'
import InviteeItemComponent from './InviteeItemComponent'
import styles from './styles'

const LIST_ITEM = [
  {
    id: 0,
    title: 'Edit',
    desc: 'Can edit, post and collaborate'
  },
  {
    id: 1,
    title: 'Add',
    desc: 'Can post and collaborate'
  },
  {
    id: 2,
    title: 'View',
    desc: 'Can view only'
  }
]

class LinkShareModalComponent extends React.Component {
  onPressItem = (index) => {
    this.props.handleShareOption(index)
  }

  render() {
    const { shareModalType, shareInviteeData, feed } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          {shareModalType === 'share'
            ? <LinkShareItem feed={feed} />
            : <InviteeItemComponent invitee={shareInviteeData} />
          }
        </View>

        {LIST_ITEM.map(item => (
          <TouchableOpacity key={item.id} onPress={() => this.onPressItem(item.id)}>
            <View style={[styles.listItem, styles.itemNormal]}>
              <Text style={[styles.title, styles.titleNormal]}>
                {item.title}
              </Text>
              <Text style={styles.description}>
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {shareModalType === 'share'
          ? 
            feed.sharingPreferences.level !== 'INVITEES_ONLY' && (
              <TouchableOpacity onPress={() => this.onPressItem(3)}>
                <View style={[styles.listItem, styles.itemLast]}>
                  <Text style={[styles.title, styles.titleLast]}>
                    Link sharing off
                  </Text>
                </View>
              </TouchableOpacity>
            )
          : <TouchableOpacity onPress={() => this.onPressItem(3)}>
              <View style={[styles.listItem, styles.itemLast]}>
                <Text style={[styles.title, styles.titleLast]}>
                  Remove
                </Text>
              </View>
            </TouchableOpacity>
        }

      </View>
    )
  }
}

LinkShareModalComponent.defaultProps = {
  shareInviteeData: {},
  feed: {},
}

LinkShareModalComponent.propTypes = {
  shareModalType: PropTypes.string.isRequired,
  shareInviteeData: PropTypes.objectOf(PropTypes.any),
  feed: PropTypes.objectOf(PropTypes.any),
  handleShareOption: PropTypes.func.isRequired
}

export default LinkShareModalComponent