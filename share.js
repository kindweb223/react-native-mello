import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'

// import Modal from 'react-native-modalbox'
// import ShareExtension from 'react-native-share-extension'


export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: true,
      type: '',
      value: ''
    }
  }

  async componentDidMount() {
    console.log('ShareExtension componentDidMount...');
    // try {
    //   const { type, value } = await ShareExtension.data()
    //   this.setState({
    //     type,
    //     value
    //   })
    // } catch(e) {
    //   console.log('errrr', e)
    // }
  }

  // onClose = () => ShareExtension.close()

  // closing = () => this.setState({ isOpen: false });

  render() {
    console.log('ShareExtension render...');
    return (
      // <Modal
      //   backdrop={false}
      //   style={{ backgroundColor: 'red' }}
      //   position="center"
      //   isOpen={this.state.isOpen}
      //   onClosed={this.onClose}
      // >
        <View style={{ alignItems: 'center', justifyContent:'center', flex: 1 }}>
          <View style={{ borderColor: 'green', borderWidth: 1, backgroundColor: 'white', height: 200, width: 300 }}>
            <TouchableOpacity onPress={this.closing}>
              <Text>Close</Text>
              <Text>type: { this.state.type }</Text>
              <Text>value: { this.state.value }</Text>
            </TouchableOpacity>
          </View>
        </View>
      // </Modal>
    );
  }
}
