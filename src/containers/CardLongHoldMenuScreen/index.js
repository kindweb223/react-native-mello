import React from 'react'
import { Platform, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
import _ from 'lodash'
import CardActionBarComponent from '../../components/CardActionBarComponent'
import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import COMMON_STYLES from '../../themes/styles'
class CardLongHoldMenuScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  onHandleSettings(item) {
    switch(item) {
      case 'Delete':
        setTimeout(() => {
          this.deleteActionSheet.show()
        }, 200)
        return
      case 'Edit':
        // this.props.onEdit(this.props.idea)
        return;
      case 'Report':
        setTimeout(() => {
          this.reportActionSheet.show()
        }, 200)
        return;
    }
  }

  onTapActionSheet(index) {
    if (index === 0) {
      this.props.onDelete(this.props.cardList)
    }
  }

  onTapActionReportSheet(index) {
    if (index === 0) {
      this.props.onReport(this.props.cardList)
    }
  }

  onMoveCard() {
    if (this.props.onMove) {
      this.props.onMove(this.props.cardList);
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render () {
    const { cardList, currentFeed } = this.props
    if (cardList.length === 0) {
      return null;
    }

    let plural = cardList.length > 1 ? 'these cards?' : 'this card?'
    let hasViewModeCard = false

    if (_.find(cardList, card => COMMON_FUNC.getCardViewMode(currentFeed, card.idea) === CONSTANTS.CARD_VIEW)) {
      hasViewModeCard = true
    }

    return [
      <CardActionBarComponent
        key='1'
        hasViewModeCard={hasViewModeCard}
        onMove={this.onMoveCard.bind(this)}
        onHandleSettings={this.onHandleSettings.bind(this)}
      />,
      <ActionSheet
        key="2"
        ref={ref => this.deleteActionSheet = ref}
        title={'Cards are the start of great ideas. Are you sure want to delete ' + plural}
        options={['Delete', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        tintColor={COLORS.PURPLE}
        onPress={(index) => this.onTapActionSheet(index)}
      />,
      <ActionSheet
        key="3"
        ref={ref => this.reportActionSheet = ref}
        title={
          Platform.OS === 'ios'
          ? 'Are you sure you want to report this card?'
          : <Text style={COMMON_STYLES.actionSheetTitleText}>Are you sure you want to report this card?</Text>
        }
        options={['Report', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        tintColor={COLORS.PURPLE}
        onPress={(index) => this.onTapActionReportSheet(index)}
      />
    ]
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
})

CardLongHoldMenuScreen.propTypes = {
  cardList: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardLongHoldMenuScreen)
