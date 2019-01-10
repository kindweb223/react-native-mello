import React from 'react'
import {
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native'

import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import COLORS from '../../../service/colors';
import CONSTANTS from '../../../service/constants';
import styles from './styles';

class CardEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowKeyboardButton: false,
      textByCursor: ''
    }

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
  }

  async componentDidMount() {
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration,
      }
    ).start(() => {      
      this.textInputIdeaRef.focus();
    });
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: e.duration,
      }
    ).start();
  }

  onClose() {
    if (this.props.onUpdateCard) {
      this.props.onUpdateCard();
    }
  }

  onKeyPressIdea(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.props.checkUrls();
    }
  }

  onFocus() {
    this.setState({
      isShowKeyboardButton: true,
    });
  }

  onBlurIdea() {
    this.setState({
      isShowKeyboardButton: false,
    });
  }

  // scroll functions for TextInput
  scrollContent() {
    const yPosition = this.textInputPositionY + this.textInputHeightByCursor;
    if (this.scrollViewHeight > 0 && yPosition > this.scrollViewHeight) {
      this.scrollViewRef.scrollTo({x: 0, y: yPosition - this.scrollViewHeight + CONSTANTS.TEXT_INPUT_LINE_HEIGHT});
    }
  }

  onContentSizeChange({nativeEvent}) {
    const height = nativeEvent.contentSize.height;
    if (this.textInputHeightByCursor !== height) {
      this.textInputHeightByCursor = height;
      this.scrollContent();
    }
  }

  onSelectionChange({nativeEvent}) {
    const cursorPosition = nativeEvent.selection.end;
    setTimeout(() => {
      const textByCursor = this.state.idea && this.state.idea.substring(0, cursorPosition);
      this.setState({
        textByCursor,
      });
    }, 0);    
  }

  onLayoutTextInput({nativeEvent: { layout }}) {
    this.textInputPositionY = layout.y;
  }

  onLayoutScrollView({nativeEvent: {layout}}) {
    this.scrollViewHeight = layout.height;
    this.scrollContent();
  }

  get renderText() {
    const { idea } = this.props

    return (
      <View 
        style={{ flex: 1 }}
        onLayout={this.onLayoutTextInput.bind(this)}
      >
        <TextInput
          style={[styles.textInputIdea, {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            opacity: 0,
          }]}
          autoCorrect={false}
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.textByCursor}
          onContentSizeChange={this.onContentSizeChange.bind(this)}
        />
        <TextInput
          ref={ref => this.textInputIdeaRef = ref}
          style={styles.textInputIdea}
          autoCorrect={true}
          placeholder='Type text or paste a link'
          multiline={true}
          underlineColorAndroid='transparent'
          value={idea}
          onChangeText={(value) => this.props.onChangeIdea(value)}
          onKeyPress={this.onKeyPressIdea.bind(this)}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlurIdea()}
          onSelectionChange={this.onSelectionChange.bind(this)}
          selectionColor={COLORS.PURPLE}
        />
      </View>
    );
  }

  get renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.closeButtonView}
          activeOpacity={0.7}
          onPress={() => this.onClose()}
        >
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    )
  }

  get renderMainContent() { 
    return (
      <ScrollView
        ref={ref => this.scrollViewRef = ref}
        onLayout={this.onLayoutScrollView.bind(this)}
      >
        <View style={styles.ideaContentView}>
          {this.renderText}
        </View>
      </ScrollView>
    );
  }

  onHideKeyboard() {
    Keyboard.dismiss();
  }

  render () {
    const contentContainerStyle = {
      paddingTop: 0,
      paddingBottom: this.animatedKeyboardHeight,
      height: CONSTANTS.SCREEN_HEIGHT,
      backgroundColor: '#fff',
    }

    return (
      <View style={styles.container}>
        <Animated.View style={contentContainerStyle}>
          <SafeAreaView style={styles.cardContainer}>
            {this.renderHeader}
            {this.renderMainContent}

            {this.state.isShowKeyboardButton && (
              <Animated.View style={styles.keyboardContainer}>
                <TouchableOpacity
                  style={styles.keyboardButtonView}
                  activeOpacity={0.6}
                  onPress={() => this.onHideKeyboard()}
                >
                  <MaterialCommunityIcons name="keyboard-close" size={20} color={'#fff'} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    );
  }
}


CardEditScreen.defaultProps = {
}


CardEditScreen.propTypes = {
}

export default CardEditScreen