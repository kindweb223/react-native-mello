import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MarkdownView } from 'react-native-markdown-view'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import LoadingScreen from '../LoadingScreen'
import COLORS from '../../service/colors'
import styles from './styles'
import markdownStyles from './markdownStyles'
import { PRIVACY_POLICY_URL } from '../../service/api'
import Analytics from '../../lib/firebase'
import CONSTANTS from '../../service/constants'

const filePath = RNFS.DocumentDirectoryPath + CONSTANTS.PRIVACY_POLICE;

class PrivacyPolicyScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        activeOpacity={0.6}
        onPress={() => Actions.pop()}
      >
        <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
      </TouchableOpacity>
    );
  }

  static renderTitle(props) {
    return (
      <Text style={styles.textTitle}>Privacy Policy</Text>
    );
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      markdownText: '',
    }
  }

  async componentWillMount() {
    Analytics.setCurrentScreen('PrivacyPolicyScreen')

    this.setState({ loading: true })

    await RNFS.readFile(filePath, 'utf8')
    .then((contents) => {
      // read the file contents
      console.log('read success');
      this.setState({ markdownText: contents })
      this.setState({ loading: false })
    })
    .catch((err) => {

      RNFetchBlob.fetch('GET', PRIVACY_POLICY_URL)
      .then((res) => {
        let status = res.info().status
        if (status === 200) {
          let text = res.text()
          this.setState({ markdownText: text })

          // write the file
          RNFS.writeFile(filePath, text, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log(err.message);
          });
          this.setState({ loading: false })
        }
      })
      .catch((errorMessage, statusCode) => {
        this.setState({ loading: false })
        console.log('errorMessage: ', errorMessage)
      })
  
    });
  }


  render () {
    const { userEmail } = this.props

    return (
      <View style={styles.container}>
        {this.state.loading && (
          <LoadingScreen />
        )}

        <View style={styles.modalContainer}>
          <ScrollView
            ref={c => this.scrollView = c}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollView}
          >
            <View style={styles.innerContainer}>
              <MarkdownView
                styles={markdownStyles}
              >
                {this.state.markdownText}
              </MarkdownView>
            </View>
          </ScrollView>
        </View> 
      </View>
    )
  }
}

export default PrivacyPolicyScreen
