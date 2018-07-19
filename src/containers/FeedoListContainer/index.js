import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'

import PropTypes from 'prop-types'
import FeedItemComponent from '../../components/FeedItemComponent'

const FeedoListContainer = ({ loading, feedoList, handleFeedMenu }) => {
  if (loading) return <ActivityIndicator animating />

  return (
    <FlatList
      data={feedoList}
      keyExtractor={item => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          deplayLongPress={1000}
          onLongPress={() => handleFeedMenu(item)}
          activeOpacity={0.8}
        >
          <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} />
        </TouchableOpacity>
      )}
    />
  )
}

FeedoListContainer.defaultProps = {
  handleFeedMenu: () => {}
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleFeedMenu: PropTypes.func
}

export default FeedoListContainer