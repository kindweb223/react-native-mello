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
import CKEditor from '../../../components/CKEditor'
import CKEditorToolbar from '../../../components/CKEditor/Toolbar'
import COLORS from '../../../service/colors';
import CONSTANTS from '../../../service/constants';
import * as COMMON_FUNC from '../../../service/commonFunc'
import styles from './styles';

class CardEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idea: props.idea,
      bottomButtonsPadding: Platform.OS === 'android' ? 24 : 0,
      initHeight: 0
    }

    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      this.keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this.keyboardDidlShow(e));
      this.keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this.keyboardDidHide(e));
    }
    else {
      this.keyboardDidShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardDidlShow(e));
      this.keyboardDidHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardDidHide(e));
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    const { textSize, lineCount } = await COMMON_FUNC.getHtmlHeight(this.props.idea, CONSTANTS.SCREEN_SUB_WIDTH)
    this.setState({ initHeight: textSize + 300 })
  }

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.onCancelEditCard();
    return true;
  }

  keyboardDidlShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'android' ? 30 : e.duration,
      }
    ).start();
  }

  keyboardDidHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'android' ? 30 : e.duration,
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

  onKeyPressIdea() {
    this.props.checkUrls();
  }

  executeCKEditorCommand = (command) => {
    this.refCKEditor.executeCommand(command)
  }

  get renderFooter() {
    return (
      <View style={[styles.footerContainer, { marginBottom: this.state.bottomButtonsPadding + CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT }]}>
        <CKEditorToolbar
          isEdit={false}
          handleCKEditorToolbar={() => {}}
          executeCKEditorCommand={this.executeCKEditorCommand}
        />
      </View>
    )
  }

  get renderText() {
    const { idea } = this.props

    return (
      <CKEditor
        ref={c => this.refCKEditor = c}
        content={idea}
        initHeight={CONSTANTS.SCREEN_HEIGHT - 120}
        height={this.state.initHeight}
        onChange={value => this.onChangeIdea(value)}
        handleKeydown={() => this.onKeyPressIdea()}
      />
    )
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
      <ScrollView ref={c => this.scrollViewRef = c} style={styles.mainContainer}>
        {this.renderText}
      </ScrollView>
    );
  }

  onHideKeyboard() {
    Keyboard.dismiss();
  }

  render () {
    const contentContainerStyle = {
      paddingTop: CONSTANTS.STATUSBAR_HEIGHT,
      height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT - 55 - this.state.bottomButtonsPadding - CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT, this.animatedKeyboardHeight)
    }

    return (
      <View style={styles.container}>
        <Animated.View style={contentContainerStyle}>
          {this.renderHeader}
          {this.renderMainContent}
        </Animated.View>

        {this.renderFooter}
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