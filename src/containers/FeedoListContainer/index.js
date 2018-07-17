import React from 'react'
import {
  ScrollView,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedItemComponent from '../../components/FeedItemComponent'

const FeedoListContainer = ({ loading, feedoList }) => {
  if (loading) return <ActivityIndicator animating />

  return (
    <ScrollView>
      <View style={styles.feedContainer}>
        <FlatList
          data={feedoList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FeedItemComponent
              item={item}
            />
          )}
        />
      </View>
    </ScrollView>
  )
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default FeedoListContainer