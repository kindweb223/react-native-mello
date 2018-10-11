import React from 'react'
import {
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import SelectHuntScreen from '../../containers/SelectHuntScreen' 


export default class ShareSelectHuntScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { imageUrl } = this.props;
    return (
      <View style={styles.container}>
        <SelectHuntScreen
          selectMode={CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION_FIRST}
          imageUrl={imageUrl}
        />
      </View>
    );
  }
}


ShareSelectHuntScreen.defaultProps = {
  imageUrl: '',
}


ShareSelectHuntScreen.propTypes = {
  imageUrl: PropTypes.string,
}
