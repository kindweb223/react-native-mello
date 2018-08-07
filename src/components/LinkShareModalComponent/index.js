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
    const { shareModalType, shareInviteeData, isInviteeOnly } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          {shareModalType === 'share'
            ? <LinkShareItem isInviteeOnly={isInviteeOnly} />
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

        <TouchableOpacity onPress={() => this.onPressItem(3)}>
          <View style={[styles.listItem, styles.itemLast]}>
            {shareModalType === 'share'
              ? <Text style={[styles.title, styles.titleLast]}>
                  {isInviteeOnly ? 'Link sharing on' : 'Link sharing off'}
                </Text>
              : <Text style={[styles.title, styles.titleLast]}>
                  Remove
                </Text>
            }
          </View>
        </TouchableOpacity>

      </View>
    )
  }
}

LinkShareModalComponent.defaultProps = {
  shareInviteeData: {},
  isInviteeOnly: true,
}

LinkShareModalComponent.propTypes = {
  shareModalType: PropTypes.string.isRequired,
  shareInviteeData: PropTypes.objectOf(PropTypes.any),
  isInviteeOnly: PropTypes.bool,
  handleShareOption: PropTypes.func.isRequired
}

export default LinkShareModalComponent