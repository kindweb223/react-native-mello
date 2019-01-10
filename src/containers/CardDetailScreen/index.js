import React from 'react'
import CardViewScreen from './CardViewScreen'
import CardEditScreen from './CardEditScreen'
import CONSTANTS from '../../service/constants'

class CardDetailScreen extends React.Component {
  render () {
    const { viewMode } = this.props
    if (viewMode === CONSTANTS.CARD_VIEW) {
      return (
        <CardViewScreen {...this.props} />
      );
    } else {
      return (
        <CardEditScreen {...this.props} />
      );
    }
  }
}

export default CardDetailScreen