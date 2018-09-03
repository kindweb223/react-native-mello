import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modalbox'

import NewCardScreen from '../../containers/NewCardScreen' 
import ShareExtension from 'react-native-share-extension'


export default class ShareCardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    }
  }

  onClosed() {
    ShareExtension.close();
  }

  onCloseModal() {
    this.setState({ isOpen: false });
  }

  render() {
    return (
        <Modal
          backdrop={false}
          style={{ backgroundColor: 'transparent'}}
          position="center"
          isOpen={this.state.isOpen}
          onClosed={this.onClosed.bind(this)}
        >
          <View style={{ alignItems: 'center', justifyContent:'center', flex: 1, }}>
            <NewCardScreen 
              onClose={() => this.onCloseModal()}
            />

            {/* <View style={{ borderColor: 'green', borderWidth: 1, backgroundColor: 'white', height: 200, width: 300 }}>
              <TouchableOpacity onPress={this.onCloseModal.bind(this)}>
                <Text>Close</Text>
                <Text>type: { this.state.type }</Text>
                <Text>value: { this.state.value }</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </Modal>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});
