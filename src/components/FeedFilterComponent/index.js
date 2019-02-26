import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import _ from 'lodash'
import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class FeedFilterComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showType: 'all',
      sortType: 'recent'
    }
  }

  showFeeds = (showType) => {
    this.setState({ showType })
    this.props.onFilterShow(showType)
  }

  sortFeeds = (sortType) => {
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
        onBackdropPress={() => this.props.onClose()}
        onBackButtonPress={() => this.props.onClose()}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter and sort</Text>
            <TouchableOpacity onPress={() => this.props.onClose()} style={styles.closeButton}>
              <Image source={CLOSE_ICON} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.countText}>Filters</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => this.showFeeds('all')} style={styles.buttonView}>
                  <View style={[styles.button, showType === 'all' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, showType === 'all' ? styles.btnSelectText : styles.btnDeselectText]}>
                      All flows
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                <TouchableOpacity onPress={() => this.showFeeds('owned')} style={styles.buttonView}>
                  <View style={[styles.button, showType === 'owned' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, showType === 'owned' ? styles.btnSelectText : styles.btnDeselectText]}>
                      My flows
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                <TouchableOpacity onPress={() => this.showFeeds('shared')} style={styles.buttonView}>
                  <View style={[styles.button, showType === 'shared' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, showType === 'shared' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Shared with me
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.countText}>Sort by</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => this.sortFeeds('recent')} style={styles.buttonView}>
                  <View style={[styles.button, sortType === 'recent' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, sortType === 'recent' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Recent
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                <TouchableOpacity onPress={() => this.sortFeeds('headline')} style={styles.buttonView}>
                  <View style={[styles.button, sortType === 'headline' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, sortType === 'headline' ? styles.btnSelectText : styles.btnDeselectText]}>
                      A-Z
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.splitter} />

                <TouchableOpacity onPress={() => this.sortFeeds('date')} style={styles.buttonView}>
                  <View style={[styles.button, sortType === 'date' ? styles.buttonSelect : styles.buttonDeselect]}>
                    <Text style={[styles.btnText, sortType === 'date' ? styles.btnSelectText : styles.btnDeselectText]}>
                      Date
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

FeedFilterComponent.defaultProps = {
  show: false,
  onClose: () => {},
  onFilterShow: () => {},
  onFilterSort: () => {}
}

FeedFilterComponent.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onFilterShow: PropTypes.func,
  onFilterSort: PropTypes.func
}

export default FeedFilterComponent
