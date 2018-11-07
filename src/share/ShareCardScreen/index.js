import React from 'react'
import {
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import ShareExtension from '../shareExtension'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import NewCardScreen from '../../containers/NewCardScreen' 


export default class ShareCardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  onClosed() {
    ShareExtension.close();
  }

  render() {
    const { imageUrl, shareUrl } = this.props;
    return (
      <View style={styles.container}>
        <NewCardScreen
          cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
          shareUrl={shareUrl}
          shareImageUrl={imageUrl}
          onClose={() => this.onClosed()}
        />
      </View>
    );
  }
}


ShareCardScreen.defaultProps = {
  imageUrl: '',
  shareUrl: '',
}


ShareCardScreen.propTypes = {
  imageUrl: PropTypes.string,
  shareUrl: PropTypes.string,
}
