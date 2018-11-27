import React from 'react'
import { 
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
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
        setTimeout(() => {
          this.ActionSheet.show()
        }, 200)
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
      this.props.onMove(this.props.idea.id);
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render () {
    const { idea, invitees, listType } = this.props
    return [
      <View key='0' style={styles.cardContainer}>
        <FeedCardComponent 
          idea={idea}
          invitees={invitees}
          listType={listType}
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
        key="2"
        ref={ref => this.ActionSheet = ref}
        title={'This will permanentely delete your card'}
        options={['Delete card', 'Cancel']}
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
