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
import LoadingScreen from '../LoadingScreen'
import COLORS from '../../service/colors'
import styles from './styles'
import markdownStyles from './markdownStyles'
import { TNC_URL } from '../../service/api'
import Analytics from '../../lib/firebase'

class TermsAndConditionsScreen extends React.Component {
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
      <Text style={styles.textTitle}>Terms & Conditions</Text>
    );
  }

  constructor(props) {
    super(props)
    this.state = {
      isScrollTop: true,
      loading: false,
      markdownText: ''
    }
  }

  async componentWillMount() {
    Analytics.setCurrentScreen('TermsAndConditionsScreen')

    this.setState({ loading: true })
    await RNFetchBlob.fetch('GET', TNC_URL)
    .then((res) => {
      this.setState({ loading: false })
      let status = res.info().status
      if (status === 200) {
        let text = res.text()
        this.setState({ markdownText: text })
      }
    })
    .catch((errorMessage, statusCode) => {
      this.setState({ loading: false })
      console.log('errorMessage: ', errorMessage)
    })
  }

  onScrollDown = () => {
    this.setState(prevState => ({ isScrollTop: !prevState.isScrollTop }))
    if (this.state.isScrollTop) {
      this.scrollView.scrollToEnd()
    } else {
      this.scrollView.scrollTo({ x: 0, y: 0 })
    }
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

          {/* <View style={styles.arrowView}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onScrollDown()}
            >
              <View style={styles.arrow}>
                {this.state.isScrollTop
                  ? <Ionicons name="ios-arrow-down" size={30} color="#fff" style={{ marginTop: 5 }} />
                  : <Ionicons name="ios-arrow-up" size={30} color="#fff" />
                }
              </View>
            </TouchableOpacity>
          </View> */}
        </View> 
      </View>
    )
  }
}

export default TermsAndConditionsScreen
