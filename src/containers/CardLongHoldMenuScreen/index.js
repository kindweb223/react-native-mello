import React from 'react'
import { 
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import FeedCardComponent from '../../components/FeedCardComponent'
import COLORS from '../../service/colors'
import styles from './styles'


class CardLongHoldMenuScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  handleSetting(item) {
    switch(item) {
      case 'Delete':
        this.actionSheetRef.show()
        return
      case 'Edit':
        this.props.onEdit(this.props.idea)
        return;
    }
  }

  onTapActionSheet(index) {
    if (index === 0) {
      this.props.onDelete(this.props.idea)
    }
  }

  onMoveCard() {
  }

  render () {
    const { idea, invitees } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <FeedCardComponent idea={idea} invitees={invitees} />
        </View>
        {/* <FeedActionBarComponent
          handleShare={this.onMoveCard.bind(this)}
          handleSetting={this.handleSetting.bind(this)}
          data={feedData}
          pinFlag={this.state.pinFlag}
        /> */}
        <ActionSheet
          ref={ref => this.actionSheetRef = ref}
          title={
            <Text style={styles.titleText}>Are you sure you want to delete this card, everything will be gone ...</Text>
          }
          options={
            [
              <Text key="0" style={styles.actionButtonText}>Delete feed</Text>,
              'Cancel'
            ]
          }
          cancelButtonIndex={1}
          destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          styles={styles}
          onPress={(index) => this.onTapActionSheet(index)}
        />
      </View>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
})

CardLongHoldMenuScreen.propTypes = {
  idea: PropTypes.object.isRequired,
  invitees: PropTypes.array.isRequired,
  onMove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardLongHoldMenuScreen)
