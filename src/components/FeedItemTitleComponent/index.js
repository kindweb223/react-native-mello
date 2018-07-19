import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import PropTypes from 'prop-types'
import { Foundation, Ionicons, Octicons } from 'react-native-vector-icons'
import Tags from "../../components/FeedTags";
import styles from './styles'
import COLORS from '../../service/colors'

const FeedItemTitleComponent = ({ data, pinFlag }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
        {pinFlag && (
          <View style={styles.pinView}>
            <Octicons name="pin" style={[styles.pinIcon, styles.active]} />
          </View>
        )}
      </View>

      <View style={styles.statsView}>
        <View style={styles.statsItemView}>
          <Ionicons name="md-person" style={[styles.feedIcon, data.metadata.newInvitees ? styles.active : styles.inActive]} />
          <Text style={[styles.feedText, data.metadata.newInvitees ? styles.active : styles.inActive]}>
            {data.metadata.invitees}
          </Text>
        </View>
        <View style={styles.statsItemView}>
          <Foundation name="credit-card"  style={[styles.feedIcon, data.metadata.newIdeas  ? styles.active : styles.inActive]} />
          <Text style={[styles.feedText, data.metadata.newIdeas  ? styles.active : styles.inActive]}>
            {data.metadata.ideasSubmitted}
          </Text>
        </View>
      </View>

      {data.tags.length > 0 && (
        <View style={styles.tagsView}>
          <Tags
            initialTags={data.tags}
            onChangeTags={() => {}}
            onTagPress={() => {}}
            inputStyle={{
              backgroundColor: 'white',
            }}
            tagContainerStyle={{
              backgroundColor: COLORS.LIGHT_ORANGE_BACKGROUND,
            }}
            tagTextStyle={{
              color: COLORS.DARK_ORANGE,
              fontSize: 16,
            }}
          />
        </View>
      )}
    </View>
  )
}

FeedItemTitleComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  pinFlag: PropTypes.bool.isRequired
}

export default FeedItemTitleComponent
