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
  BackHandler,
  Platform,
  ActivityIndicator
} from 'react-native'

import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import COLORS from '../../../service/colors';
import CONSTANTS from '../../../service/constants';
import Button from '../../../components/Button';
import styles from './styles';

class CardEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowKeyboardButton: false,
      textByCursor: '',
      idea: props.idea
    }

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
  }

  async componentDidMount() {
    this.textInputIdeaRef.focus();
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e))
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e))
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.scrollViewRef.scrollToEnd()
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.onCancelEditCard();
    return true;
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration,
      }
    ).start();
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: e.duration,
      }
    ).start();
  }

  onDoneEditCard() {
    if (this.props.onChangeIdea) {
      this.props.onChangeIdea(this.state.idea);
    }

    if (this.props.onDoneEditCard) {
      this.props.onDoneEditCard();
    }
  }

  onCancelEditCard() {
    if (this.props.onCancelEditCard) {
      this.props.onCancelEditCard();
    }
  }

  onChangeIdea(idea) {
    this.setState({ idea });
  }

  onKeyPressIdea(event) {
    if (event.nativeEvent.key === ' ' || event.nativeEvent.key === ',' || event.nativeEvent.key === 'Enter') {
      this.props.checkUrls();
    }
  }

  onFocus = () => {
    this.setState({
      isShowKeyboardButton: true
    });
  }

  onBlurIdea = () => {
    this.setState({
      isShowKeyboardButton: false
    });
  }

  // scroll functions for TextInput
  scrollContent() {
    const yPosition = this.textInputPositionY + this.textInputHeightByCursor;
    if (this.scrollViewHeight > 0 && yPosition > this.scrollViewHeight) {
      this.scrollViewRef.scrollTo({ x: 0, y: yPosition - this.scrollViewHeight + CONSTANTS.TEXT_INPUT_LINE_HEIGHT });
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
          placeholder='Let your ideas flow. Type text, paste a link, add an image, video or audio'
          multiline={true}
          underlineColorAndroid='transparent'
          defaultValue={idea}
          onChangeText={(idea) => this.onChangeIdea(idea)}
          onKeyPress={this.onKeyPressIdea.bind(this)}
          onFocus={this.onFocus}
          onBlur={this.onBlurIdea}
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
          onPress={() => this.onCancelEditCard()}
        >
          <Text style={[styles.textButton, { color: COLORS.PURPLE, fontWeight: 'normal' }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.textButton}>Edit card</Text>
        {this.props.card.loading === 'UPDATE_CARD_PENDING'
          ? <View style={[styles.closeButtonView, { alignItems: 'flex-end' }]}>
              <ActivityIndicator color={COLORS.PURPLE} size="small" style={styles.loadingIcon} />
            </View>
          : <TouchableOpacity
              style={[styles.closeButtonView, { alignItems: 'flex-end' }]}
              activeOpacity={0.7}
              onPress={() => this.onDoneEditCard()}
            >
              <Text style={[styles.textButton, { color: COLORS.PURPLE }]}>Done</Text>
            </TouchableOpacity>
        }
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

            {Platform.OS === 'ios' && this.state.isShowKeyboardButton && (
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

// TODO define props
CardEditScreen.defaultProps = {
}


CardEditScreen.propTypes = {
}

export default CardEditScreen