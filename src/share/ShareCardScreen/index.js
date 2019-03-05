import React from 'react'
import {
  View,
  Platform,
} from 'react-native'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'

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
    if (Platform.OS === 'ios')
      ShareExtension.close();
    else {
      //go to previous scene
      Actions.pop()
      Actions.pop()
      setTimeout(() => {
        ShareExtension.close();
      }, 500)
    }
  }

  render() {
    const { imageUrls, shareUrl, notesText } = this.props;

    return (
      <View style={styles.container}>
        <CardNewScreen
          cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
          shareUrl={shareUrl}
          shareImageUrls={imageUrls}
          shareText={notesText}
          onClose={() => this.onClosed()}
          prevPage={'shareExtension'}
        />

        {/* {shareUrl !== ''
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
            prevPage={'shareExtension'}
          />
        }  */}
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
