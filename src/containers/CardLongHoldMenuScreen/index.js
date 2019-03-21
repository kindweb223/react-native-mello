import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
import CardActionBarComponent from '../../components/CardActionBarComponent'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import * as COMMON_FUNC from '../../service/commonFunc'

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
          this.ActionSheet.show()
        }, 200)
        return
      case 'Edit':
        // this.props.onEdit(this.props.idea)
        return;
    }
  }

  onTapActionSheet(index) {
    if (index === 0) {
      // this.props.onDelete(this.props.idea.id)
    }
  }

  onMoveCard() {
    if (this.props.onMove) {
      console.log('CARD_LIST: ', this.props.cardList)
      // this.props.onMove(this.props.idea.id);
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render () {
    const { currentFeed } = this.props

    let viewMode = CONSTANTS.CARD_VIEW
    // if (COMMON_FUNC.isFeedOwnerEditor(currentFeed) || (COMMON_FUNC.isFeedContributor(currentFeed) && COMMON_FUNC.isCardOwner(idea))) {
    //   viewMode = CONSTANTS.CARD_EDIT
    // }

    return [
      <CardActionBarComponent
        key='1'
        onMove={this.onMoveCard.bind(this)}
        onHandleSettings={this.onHandleSettings.bind(this)}
        idea={idea}
        viewMode={viewMode}
      />,
      <ActionSheet
        key="2"
        ref={ref => this.ActionSheet = ref}
        title={'Cards are the start of great ideas. Are you sure want to delete?'}
        options={['Delete', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        tintColor={COLORS.PURPLE}
        onPress={(index) => this.onTapActionSheet(index)}
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
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardLongHoldMenuScreen)
