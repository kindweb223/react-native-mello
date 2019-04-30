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
import constants from '../../../service/constants';

class CardEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idea: props.idea,
      bottomButtonsPadding: Platform.OS === 'android' ? 24 : 0,
      keyboardHeight: 0,
      isShowKeyboardButton: false
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
    this.setState({ keyboardHeight: e.endCoordinates.height })

    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'android' ? 30 : e.duration,
      }
    ).start(() => {
      this.setState({
        isShowKeyboardButton: true,
      });
    });
  }

  keyboardDidHide(e) {
    this.setState({ keyboardHeight: 0 })
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'android' ? 30 : e.duration,
      }
    ).start(() => {
      this.setState({
        isShowKeyboardButton: false,
      });
    });
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
    // this.refCKEditor.config.height = '800px'
  }

  onKeyPressIdea() {
    this.props.checkUrls();
  }

  handleCommands = (commands) => {
    if (this.refCKEditorToolbar) {
      this.refCKEditorToolbar.handleCommands(commands)
    }
  }

  executeCKEditorCommand = (command) => {
    this.refCKEditor.executeCommand(command)
  }

  get renderFooter() {
    return (
      <View style={[styles.footerContainer]}>
        <CKEditorToolbar
          ref={c => this.refCKEditorToolbar = c}
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
        backgroundColor={'white'}
        onChange={value => this.onChangeIdea(value)}
        handleKeydown={() => this.onKeyPressIdea()}
        handleCommands={this.handleCommands}
        hideKeyboardAccessoryView={true}
        scrollEnabled={true}
        automaticallyAdjustContentInsets={true}
        style={{ flex: 1 }}
        //height={ CONSTANTS.SCREEN_HEIGHT - this.state.keyboardHeight - 175 }
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

  onHideKeyboard() {
    this.refCKEditor.hideKeyboard()
    Keyboard.dismiss();
  }

  render () {
    const contentContainerStyle = {
      paddingTop: CONSTANTS.STATUSBAR_HEIGHT,
      top: 0,
      position: 'absolute',
      height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT, this.animatedKeyboardHeight)
    }

    return (
      <View style={[{height: constants.SCREEN_HEIGHT, width: constants.SCREEN_WIDTH, backgroundColor: 'white'}]}>
        <Animated.View style={[contentContainerStyle]}>
          <View style={styles.container}>
            {this.renderHeader}
            {this.renderText}
            { this.state.keyboardHeight > 0 && this.renderFooter }

            {this.state.isShowKeyboardButton && (
              <View style={styles.hideKeyboardContainer}>
                <TouchableOpacity
                  style={[
                    styles.buttonItemContainer,
                    {
                      backgroundColor: COLORS.PURPLE,
                      borderRadius: 8,
                    },
                  ]}
                  activeOpacity={0.6}
                  onPress={this.onHideKeyboard.bind(this)}
                >
                  <MaterialCommunityIcons name="keyboard-close" size={20} color={'#fff'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
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
