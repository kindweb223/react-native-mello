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
      value: '',
    }
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
    } catch(e) {
      console.log('error : ', e)
    }
  }

  onClosed() {
    ShareExtension.close();
  }

  render() {
    const { imageUrl } = this.props;
    return (
      <View style={styles.container}>
        <NewCardScreen
          cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
          shareUrl={this.state.value}
          shareImageUrl={imageUrl}
          // onClose={() => this.onClosed()}
        />
      </View>
    );
  }
}


ShareCardScreen.defaultProps = {
  imageUrl: '',
}


ShareCardScreen.propTypes = {
  imageUrl: PropTypes.string,
}
