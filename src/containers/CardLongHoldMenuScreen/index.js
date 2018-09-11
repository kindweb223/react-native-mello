import React from 'react'
import { 
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import FeedCardComponent from '../../components/FeedCardComponent'
import CardActionBarComponent from '../../components/CardActionBarComponent'
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

  onHandleSettings(item) {
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
      this.props.onDelete(this.props.idea.id)
    }
  }

  onMoveCard() {
    if (this.props.onMove) {
      this.props.onMove();
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render () {
    const { idea, invitees } = this.props
    return [
      <View key='0' style={styles.cardContainer}>
        <FeedCardComponent 
          idea={idea} 
          invitees={invitees}
          onComment={this.onClose.bind(this)}
        />
      </View>,
      <CardActionBarComponent
        key='1'
        onMove={this.onMoveCard.bind(this)}
        onHandleSettings={this.onHandleSettings.bind(this)}
        idea={idea}
      />,
      <ActionSheet
        key='2' 
        ref={ref => this.actionSheetRef = ref}
        title={
          <Text style={styles.titleText}>This will permanentely delete your card</Text>
        }
        options={
          [
            <Text key="0" style={styles.actionButtonText}>Delete card</Text>,
            'Cancel'
          ]
        }
        cancelButtonIndex={1}
        destructiveButtonIndex={2}
        tintColor={COLORS.PURPLE}
        styles={styles}
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
  idea: PropTypes.object.isRequired,
  invitees: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardLongHoldMenuScreen)
