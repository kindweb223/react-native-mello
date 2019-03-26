import React from 'react';
import Analytics from "../../lib/firebase";
import styles from './styles';

import {
    Text,
    SafeAreaView,
    ViewPropTypes,
    Image,
    TouchableOpacity,
    Platform
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
            <Image source={require('../../../assets/images/DocumentPlaceholder/IconDocumentPlaceholder.png')}  style={styles.documentImage}/>
            <Text style={styles.topText}>
                File can't be previewed
            </Text>
            <Text style={styles.bottomText}>
                To view this file, open it in another app.
            </Text>
            {
                Platform.OS === 'android' && 
                <TouchableOpacity 
                    style={styles.closeButtonWrapper}
                    activeOpacity={0.6}
                    onPress={this.props.onOpenIn}
                >
                    <Text style={styles.openIn}>
                        Open in...
                    </Text>
                </TouchableOpacity>
            }
          </SafeAreaView>
        )
      }
}

DocumentNotSupportedScreen.defaultProps = {
    containerStyle: {}
}
  
  
DocumentNotSupportedScreen.propTypes = {
    containerStyle: ViewPropTypes.style
}