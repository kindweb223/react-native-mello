import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
import CardActionBarComponent from '../../components/CardActionBarComponent'
import COLORS from '../../service/colors'

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
      this.props.onDelete(this.props.cardList)
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
    const { cardList } = this.props
    if (cardList.length === 0) {
      return null;
    }

    let plural = cardList.length > 1 ? 'these cards?' : 'this card?'

    return [
      <CardActionBarComponent
        key='1'
        onMove={this.onMoveCard.bind(this)}
        onHandleSettings={this.onHandleSettings.bind(this)}
      />,
      <ActionSheet
        key="2"
        ref={ref => this.ActionSheet = ref}
        title={'Cards are the start of great ideas. Are you sure want to delete ' + plural}
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
