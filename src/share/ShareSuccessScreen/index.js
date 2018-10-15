import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons'

import styles from './styles'
import COLORS from '../../service/colors'
import ShareExtension from '../shareExtension'


class ShareSuccessScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
  }

  openFeedo() {
    ShareExtension.goToMainApp();
    ShareExtension.close();
  }

  onCancel() {
    ShareExtension.close();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.checkContainer}>
          <MaterialCommunityIcons name="check" size={90} color={COLORS.PURPLE} />
        </View>
        <TouchableOpacity
          style={styles.openFeedoButtonContainer}
          activeOpacity={0.7}
          onPress={this.openFeedo.bind(this)}
        >
          <Text style={styles.textButton}>Opne Feedo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


ShareSuccessScreen.defaultProps = {
}


ShareSuccessScreen.propTypes = {
}


const mapStateToProps = ({ card }) => ({
  card,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(ShareSuccessScreen)