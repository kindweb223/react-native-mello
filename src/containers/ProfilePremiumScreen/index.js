import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import _ from 'lodash'
import COLORS from '../../service/colors'
import styles from './styles'
import Analytics from '../../lib/firebase'
import PremiumModal from '../../components/PremiumModalComponent'

const UPLOAD_ICON = require('../../../assets/images/Premium/Upload_10MB.png')
const OFFLINE_ICON = require('../../../assets/images/Premium/MelloOffline.png')
const SEARCH_ICON = require('../../../assets/images/Premium/AdvancedSearch.png')
const EDIT_ICON = require('../../../assets/images/Premium/BetterEditing.png')
const TAG_ICON = require('../../../assets/images/Premium/Tagging.png')
const CONTROL_ICON = require('../../../assets/images/Premium/UserControls.png')

const PREMIUM_LIST = [
  {
    icon: <Image source={UPLOAD_ICON} style={styles.premiumIcon} />,
    title: 'Upload > 10 MB',
    description: 'Hella narwhal Cosby sweater kitsch before they sold out High Life.'
  },
  {
    icon: <Image source={OFFLINE_ICON} style={styles.premiumIcon} />,
    title: 'Work in Mello offline',
    description: 'Hella narwhal Cosby sweater kitsch before they sold out High Life.'
  },
  {
    icon: <Image source={SEARCH_ICON} style={styles.premiumIcon} />,
    title: 'Advanced search',
    description: 'Hella narwhal Cosby sweater kitsch before they sold out High Life.'
  },
  {
    icon: <Image source={EDIT_ICON} style={styles.premiumIcon} />,
    title: 'Better text editing',
    description: 'Hella narwhal Cosby sweater kitsch before they sold out High Life.'
  },
  {
    icon: <Image source={TAG_ICON} style={styles.premiumIcon} />,
    title: 'Tagging',
    description: 'Hella narwhal Cosby sweater kitsch before they sold out High Life.'
  },
  {
    icon: <Image source={CONTROL_ICON} style={styles.premiumIcon} />,
    title: 'Better user controls',
    description: 'Hella narwhal Cosby sweater kitsch before they sold out High Life.'
  }
]

class ProfilePremiumScreen extends React.Component {
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
      <Text style={styles.headerTitle}>Mello premium</Text>
    );
  }

  constructor(props) {
    super(props)
    this.state = {
      showPremiumModal: false
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('ProfilePremiumScren')
  }

  upgradeMe() {
    this.setState({ showPremiumModal: true })
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollInnerView} style={styles.scrollView}>
          <View style={styles.topView}>
            <Text style={styles.title}>Take control of your content with Premium</Text>
            <Text style={styles.description}>Hella narwhal Cosby sweater kitsch before they sold out High Life.</Text>
            <Text style={styles.subTitle}>What you can do with Premium:</Text>
          </View>

          <View style={styles.premiumList}>
            {
              PREMIUM_LIST.map((item, key) => (
                <View key={key} style={styles.premiumItem}>
                  {item.icon}
                  <Text style={styles.title}>
                    {item.title}
                  </Text>
                  <Text style={styles.description}>
                    {item.description}
                  </Text>
                </View>
              ))
            }
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => this.upgradeMe()} style={styles.buttonView}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Upgrade Me</Text>
          </View>
        </TouchableOpacity>

        <Modal
          isVisible={this.state.showPremiumModal}
          backdropColor='#656974'
          backdropOpacity={0.6}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          onBackdropPress={() => this.setState({ showPremiumModal: false })}
        >
          <PremiumModal
            onClose={() => this.setState({ showPremiumModal: false })}
          />
        </Modal>
      </View>
    )
  }
}

ProfilePremiumScreen.defaultProps = {
  onClose: () => {},
}

ProfilePremiumScreen.propTypes = {
  onClose: PropTypes.func
}

export default ProfilePremiumScreen
