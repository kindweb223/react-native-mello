import React from 'react'
import {
  View,
} from 'react-native'

import ShareExtension from '../shareExtension'

import styles from './styles'
import NewCardScreen from '../../containers/NewCardScreen' 


export default class ShareCardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    return (
      <View style={styles.container}>
        <NewCardScreen 
          onClose={() => this.onClosed()}
        />
      </View>
    );
  }
}
