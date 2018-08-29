import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  View
} from 'react-native'

import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import FeedItemComponent from '../../components/FeedItemComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import CONSTANTS from '../../service/constants'

class ListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleValue: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
      toValue: 1,
      duration: 150,
      delay: this.props.index * 100
    }).start()
  }

  render() {
    const { item } = this.props
    
    return (
      <Animated.View style={{ opacity: this.state.scaleValue }}>
        { this.props.children }
      </Animated.View>
    )
  }
}

class FeedoListContainer extends React.Component {
  render() {
    const {loading, feedoList, handleFeedMenu, tabLabel} = this.props;
    if (loading) return <FeedLoadingStateComponent animating />
    return (
      <FlatList
        style={{paddingBottom: CONSTANTS.ACTION_BAR_HEIGHT + 50}}
        data={feedoList}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        automaticallyAdjustContentInsets={false}
        renderItem={({ item, index }) => (
          <ListRow index={index}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayLongPress={1000}
              onLongPress={() => handleFeedMenu(item)}
              onPress={() => {
                Actions.FeedDetailScreen({
                  data: item
                })
              }}
            >
              <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} />
            </TouchableOpacity>
          </ListRow>
        )}
      />
    )
  }
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