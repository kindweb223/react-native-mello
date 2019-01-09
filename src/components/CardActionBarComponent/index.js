import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const TRASH_ICON = require('../../../assets/images/Trash/White.png')

const SELECT_NONE = 0
const SELECT_MOVE = 1
const SELECT_DELETE = 2


class CardActionBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleMenu: false,
      selectedButton: SELECT_NONE,
    }
    this.animatedSelect = new Animated.Value(1);
  }

  onMove() {
    this.setState({
      selectedButton: SELECT_MOVE,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.8,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        if (this.props.onMove) {
          this.props.onMove()
        }
      });
    });
  }

  onDelete() {
    this.setState({
      selectedButton: SELECT_DELETE,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.8,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        if (this.props.onHandleSettings) {
          this.props.onHandleSettings('Delete')
        }
      });
    });
  }

  render() {
    const { feedo, idea } = this.props

    let canDelete = true
    if (COMMON_FUNC.isFeedGuest(feedo.currentFeed)) {
      canDelete = false
    }

    if (COMMON_FUNC.isFeedContributor(feedo.currentFeed) && !COMMON_FUNC.isCardOwner(idea)) {
      canDelete = false
    }

    let canMoveCard = false
    if (COMMON_FUNC.isFeedOwnerEditor(feedo.currentFeed) || (COMMON_FUNC.isFeedContributor(feedo.currentFeed) && COMMON_FUNC.isCardOwner(idea))) {
      canMoveCard = true
    }

    if (!canDelete && !canMoveCard) {
      return null
    }

    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {canMoveCard && (
            <Animated.View
              style={
                this.state.selectedButton === SELECT_MOVE &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ]
                }
              }
            >
              <TouchableOpacity
                style={styles.buttonView}
                activeOpacity={0.7}
                onPress={this.onMove.bind(this)}
              >
                <Ionicons name='md-arrow-forward' size={22} color='#fff' style={styles.arrowIcon} />
                <Text style={styles.buttonText}>Move</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {canDelete && (
            <Animated.View
              style={
                this.state.selectedButton === SELECT_DELETE &&
                {
                  transform: [
                    { scale: this.animatedSelect },
                  ]
                }
              }
            >
              <TouchableOpacity
                style={styles.buttonView}
                activeOpacity={0.7}
                onPress={this.onDelete.bind(this)}
              >
                <Image source={TRASH_ICON} />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

CardActionBarComponent.propTypes = {
  onMove: PropTypes.func.isRequired,
  onHandleSettings: PropTypes.func.isRequired,
  idea: PropTypes.object,
}

export default connect(
  mapStateToProps,
  null
)(CardActionBarComponent)
