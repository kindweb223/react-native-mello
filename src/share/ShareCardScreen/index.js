import React from 'react'
import {
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import ShareExtension from '../shareExtension'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import CardNewShareScreen from '../../containers/CardNewShareScreen'
import CardNewScreen from '../../containers/CardNewScreen'

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
    const { imageUrls, shareUrl, notesText } = this.props;
    console.log('imageUrls: ', imageUrls)
    console.log('shareUrl: ', shareUrl)
    return (
      <View style={styles.container}>
        {shareUrl !== ''
        ? <CardNewShareScreen
            cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
            shareUrl={shareUrl}
            shareImageUrls={imageUrls}
            shareText={notesText}
            onClose={() => this.onClosed()}
          />
        : <CardNewScreen
            cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
            shareUrl={shareUrl}
            shareImageUrls={imageUrls}
            shareText={notesText}
            onClose={() => this.onClosed()}
          />
        }
      </View>
    );
  }
}


ShareCardScreen.defaultProps = {
  imageUrls: [],
  shareUrl: '',
  notesText: '',
}


ShareCardScreen.propTypes = {
  imageUrls: PropTypes.array,
  shareUrl: PropTypes.string,
  notesText: PropTypes.string,
}
