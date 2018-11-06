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
      const urls = value.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi);
      this.setState({
        type,
        value: urls[0],
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
          onClose={() => this.onClosed()}
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
