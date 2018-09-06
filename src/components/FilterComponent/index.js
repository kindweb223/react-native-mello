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
import styles from './styles'
const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class FilterComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showType: 'all',
      sortType: 'date'
    }
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
    const { show } = this.props
    const { showType, sortType } = this.state

    return (
      <Modal
        isVisible={show}
        style={{ margin: 0 }}
        backdropColor='#e0e0e0'
        backdropOpacity={0.9}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        // onBackdropPress={() => this.props.onClose()}
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
              <Text style={styles.countText}>Showing all {this.props.cardCount} cards</Text>
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
                    <FontAwesome name='heart' size={15} color={COLORS.RED} style={styles.heartIcon} />
                    <Text style={[styles.btnText, showType === 'like' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Show liked
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.countText}>Sort by</Text>
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

                <TouchableOpacity onPress={() => this.sortCards('comment')} style={styles.buttonView}>
                  <View style={[styles.button, sortType === 'comment' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, sortType === 'comment' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Comments
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

FilterComponent.defaultProps = {
  show: false,
  cardCount: 0,
  onClose: () => {},
  onFilterShow: () => {},
  onFilterSort: () => {}
}

FilterComponent.propTypes = {
  show: PropTypes.bool,
  cardCount: PropTypes.number,
  onClose: PropTypes.func,
  onFilterShow: PropTypes.func,
  onFilterSort: PropTypes.func
}

export default FilterComponent
