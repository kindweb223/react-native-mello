import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { connect } from 'react-redux'

import MaterialCommunityIcons from 'react-native-vector-icons/Octicons'

import styles from './styles'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import ShareExtension from '../shareExtension'


class ShareSuccessScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    };
    this.animatedShow = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      setTimeout(() => {
        this.onClose();
      }, 300000);
    });
  }

  openFeedo() {
    console.log('FEED_ID: ', this.props.feedo.currentFeed.id)
    ShareExtension.goToMainApp(`demos.solvers.io://feed/${this.props.feedo.currentFeed.id}`);
    ShareExtension.close();
  }

  onClose() {
    this.animatedShow.setValue(1);
    Animated.timing(this.animatedShow, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      ShareExtension.close();
    });
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.onClose.bind(this)}
      >
        <Animated.View style={[
          styles.container,
          {opacity: this.animatedShow}
        ]}>
          <View style={styles.checkContainer}>
            <MaterialCommunityIcons name="check" size={90} color={COLORS.PURPLE} />
          </View>
          <TouchableOpacity
            style={styles.openFeedoButtonContainer}
            activeOpacity={0.7}
            onPress={this.openFeedo.bind(this)}
          >
            <Text style={styles.textButton}>Open Mello</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}


ShareSuccessScreen.defaultProps = {
}


ShareSuccessScreen.propTypes = {
}


const mapStateToProps = ({ feedo, }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(ShareSuccessScreen)