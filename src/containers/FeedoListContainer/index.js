import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native'

import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import ReactNativeHaptic from 'react-native-haptic'

import FeedItemComponent from '../../components/FeedItemComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import CONSTANTS from '../../service/constants'

class ListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleValue: new Animated.Value(0),
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
  constructor(props) {
    super(props)
    this.state = {
      selectedLongHoldFeedoIndex: -1,
    }
    this.animatedSelectFeedo = new Animated.Value(1);
  }

  onLongPressFeedo(index, item) {
    ReactNativeHaptic.generate('impactHeavy')
    this.setState({
      selectedLongHoldFeedoIndex: index,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelectFeedo, {
          toValue: 0.95,
          duration: 100,
        }),
        Animated.timing(this.animatedSelectFeedo, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        this.setState({
          selectedLongHoldFeedoIndex: -1,
        });
        if (this.props.handleFeedMenu) {
          this.props.handleFeedMenu(item)
        }
      });
    });
  }

  renderItem({ item, index }) {
    return (
      <Animated.View 
        style={
          this.state.selectedLongHoldFeedoIndex === index && 
          {
            transform: [
              { scale: this.animatedSelectFeedo },
            ],
          }
        }
      >
        <ListRow index={index}>
          <TouchableOpacity
            activeOpacity={0.8}
            delayLongPress={1000}
            onLongPress={() => this.onLongPressFeedo(index, item)}
            onPress={() => {
              Actions.FeedDetailScreen({
                data: item
              })
            }}
          >
            <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} page={this.props.page} />
          </TouchableOpacity>
        </ListRow>
      </Animated.View>
    )
  }

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
        renderItem={this.renderItem.bind(this)}
        keyboardShouldPersistTaps="never"
      />
    )
  }
}

FeedoListContainer.defaultProps = {
  handleFeedMenu: () => {},
  page: 'detail'
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleFeedMenu: PropTypes.func,
  page: PropTypes.string
}

export default FeedoListContainer