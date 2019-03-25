import React from 'react';
import Analytics from "../../lib/firebase";
import styles from './styles';

import {
    Text,
    SafeAreaView,
    ViewPropTypes
} from 'react-native'

export default class DocumentNotSupportedScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = { };
    }

    componentDidMount() {
        Analytics.setCurrentScreen('DocumentNotSupportedScreen')
    }

    render () {
        return (
          <SafeAreaView style={[styles.container, this.props.containerStyle]}>
            <Text style={styles.topText}>
                File can't be previewed
            </Text>
            <Text style={styles.bottomText}>
                To view this file, open it in another app.
            </Text>
          </SafeAreaView>
        )
      }
}

DocumentNotSupportedScreen.defaultProps = {
    containerStyle: {},
}
  
  
DocumentNotSupportedScreen.propTypes = {
    containerStyle: ViewPropTypes.style
}