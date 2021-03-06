import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal'
import _ from 'lodash'
import COLORS from '../../service/colors'
import styles from '../FeedFilterComponent/styles'
import { COMMENT_FEATURE } from '../../service/api'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class CardFilterComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showType: 'all',
      sortType: 'date'
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showType: nextProps.filterShowType })
  }

  showCards = (showType) => {
    this.setState({ showType })
    this.props.onFilterShow(showType)
  }

  sortCards = (sortType) => {
    this.setState({ sortType })
    this.props.onFilterSort(sortType)
  }

  render () {
    const { show, totalCardCount, cardCount } = this.props
    const { showType, sortType } = this.state

    let showText = ''
    if (totalCardCount === cardCount) {
      if (totalCardCount === 1) {
        if (showType === 'all' && sortType === 'date') {
          showText = `Showing all cards`  
        } else {
          showText = `Showing 1 card`
        }
      } else {
        showText = `Showing all ${cardCount} cards`
      }
    } else {
      if (cardCount === 1) {
        showText = `Showing 1 card`  
      } else {
        showText = `Showing ${cardCount} cards`
      }
    }

    return (
      <Modal
        isVisible={show}
        style={{ margin: 0 }}
        backdropColor={COLORS.MODAL_BACKDROP}
        backdropOpacity={0.4}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        onBackdropPress={() => this.props.onClose()}
        onBackButtonPress={() => this.props.onClose()}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter cards</Text>
            <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
              <Image source={CLOSE_ICON} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.labelText}>{showText}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => this.showCards('all')} style={styles.buttonView}>
                  <View style={[styles.button, showType === 'all' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, showType === 'all' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Show all
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                <TouchableOpacity onPress={() => this.showCards('like')} style={styles.buttonView}>
                  <View style={[styles.button, showType === 'like' ? styles.buttonSelect : styles.buttonDeselect]}>
                    {/* <FontAwesome name='heart' size={15} color={COLORS.RED} style={styles.heartIcon} /> */}
                    <Text style={[styles.btnText, showType === 'like' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Show liked
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.labelText}>Sort by</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => this.sortCards('date')} style={styles.buttonView}>
                  <View style={[styles.button, sortType === 'date' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, sortType === 'date' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Date
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                <TouchableOpacity onPress={() => this.sortCards('like')} style={styles.buttonView}>
                  <View style={[styles.button, sortType === 'like' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, sortType === 'like' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Likes
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                {COMMENT_FEATURE && (
                  <TouchableOpacity onPress={() => this.sortCards('comment')} style={styles.buttonView}>
                    <View style={[styles.button, sortType === 'comment' ? styles.buttonSelect : styles.buttonDeselect]}>
                      <Text style={[styles.btnText, sortType === 'comment' ? styles.btnSelectText : styles.btnDeselectText]}>
                        Comments
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

CardFilterComponent.defaultProps = {
  show: false,
  cardCount: 0,
  onClose: () => {},
  onFilterShow: () => {},
  onFilterSort: () => {}
}

CardFilterComponent.propTypes = {
  show: PropTypes.bool,
  cardCount: PropTypes.number,
  totalCardCount: PropTypes.number.isRequired,
  onClose: PropTypes.func,
  onFilterShow: PropTypes.func,
  onFilterSort: PropTypes.func
}

export default CardFilterComponent
