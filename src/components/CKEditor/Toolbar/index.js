import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import _ from 'lodash'

const CLOSE_ICON = require('../../../../assets/images/RichEditor/UIButtonRoundedX.png')
const HEADLINE_ICON = require('../../../../assets/images/RichEditor/IconMediumTtGrey.png')
const HEADLINE_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumTtPurple.png')
const BULLET_ICON = require('../../../../assets/images/RichEditor/IconMediumBulletpointsGrey.png')
const BULLET_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumBulletpointsPurple.png')
const NUMBER_ICON = require('../../../../assets/images/RichEditor/IconMediumNumbersGrey.png')
const NUMBER_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumNumbersPurple.png')
const CHECKBOX_ICON = require('../../../../assets/images/RichEditor/IconMediumCheckboxGrey.png')
const UNDERLINE_ICON = require('../../../../assets/images/RichEditor/IconMediumUnderlineGrey.png')
const UNDERLINE_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumUnderlinePurple.png')
const ITALIC_ICON = require('../../../../assets/images/RichEditor/IconMediumItalicGrey.png')
const ITALIC_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumItalicPurple.png')
const STRIKETHROUGH_ICON = require('../../../../assets/images/RichEditor/IconMediumStrikethroughGrey.png')
const STRIKETHROUGH_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumStrikethroughPurple.png')
const BOLD_ICON = require('../../../../assets/images/RichEditor/IconMediumBoldGrey.png')
const BOLD_PURPLE_ICON = require('../../../../assets/images/RichEditor/IconMediumBoldPurple.png')
const ARROW_ICON = require('../../../../assets/images/RichEditor/UIButtonRoundedNext.png')

import styles from './styles'

class CKEditorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFirstToolbar: true,
      commands: []
    }
  }

  moveNextToolbar = (isFirstToolbar) => {
    this.setState({ isFirstToolbar: !isFirstToolbar })
  }

  setFontSize = () => {
    let { commands } = this.state
    console.log('COMMANDS: ', commands)

    if (_.findIndex(commands, item => item === 'fontSize,big') === -1 && _.findIndex(commands, item => item === 'fontSize,normal') === -1) {
      this.props.executeCKEditorCommand('fontSize_big')
    } else {
      if (_.findIndex(commands, item => item === 'fontSize,big') === -1) {
        this.props.executeCKEditorCommand('fontSize_big')
      } else {
        this.props.executeCKEditorCommand('fontSize_normal')
      }
    }
  }

  executeCommands = (command) => {
    this.props.executeCKEditorCommand(command)
  }

  handleCommands = (commands) => {
    console.log('HANDLE: ', commands)
    this.setState({ commands })
  }

  splitCommand = str => {
    return { key: str.split(',')[0], type: str.split(',')[1] }
  }

  render() {
    const { isFirstToolbar, commands } = this.state;
  
    return (
      <View style={styles.container}>
        {this.props.isNew && (
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.props.handleCKEditorToolbar()}
            >
              <Image source={CLOSE_ICON} />
            </TouchableOpacity>
          </View>
        )}

        {isFirstToolbar
          ? <View style={[styles.firstToolbarView]}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.setFontSize()}
                style={styles.firstIcon}
              >
                {_.findIndex(commands, item => this.splitCommand(item).key === 'fontSize') === -1
                  ? <Image source={HEADLINE_ICON} />
                  : _.findIndex(commands, item => this.splitCommand(item).type === 'big') !== -1
                    ? <Image source={HEADLINE_PURPLE_ICON} />
                    : <Image source={HEADLINE_ICON} />
                }
              </TouchableOpacity>
              <View style={styles.toolbarBorderView}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.executeCommands('bulletedList')}
                >
                  <Image source={_.findIndex(commands, item => this.splitCommand(item).key === 'bulleted') !== -1 ? BULLET_PURPLE_ICON : BULLET_ICON} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.executeCommands('numberedList')}
                >
                  <Image source={_.findIndex(commands, item => this.splitCommand(item).key === 'numbered') !== -1 ? NUMBER_PURPLE_ICON : NUMBER_ICON} />
                </TouchableOpacity>
              </View>
              <View style={styles.toolbarBorderView}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.executeCommands('bold')}
                >
                  <Image source={_.findIndex(commands, item => this.splitCommand(item).key === 'bold') !== -1 ? BOLD_PURPLE_ICON : BOLD_ICON} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.executeCommands('underline')}
                >
                  <Image source={_.findIndex(commands, item => this.splitCommand(item).key === 'underline') !== -1 ? UNDERLINE_PURPLE_ICON : UNDERLINE_ICON} />
                </TouchableOpacity>
              </View>
            </View>
          : <View style={styles.secondToolbarView}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.firstIcon}
                onPress={() => this.executeCommands('italic')}
              >
                <Image source={_.findIndex(commands, item => this.splitCommand(item).key === 'italic') !== -1 ? ITALIC_PURPLE_ICON : ITALIC_ICON} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.executeCommands('strikethrough')}
              >
                <Image source={_.findIndex(commands, item => this.splitCommand(item).key === 'strikethrough') !== -1 ? STRIKETHROUGH_PURPLE_ICON : STRIKETHROUGH_ICON} />
              </TouchableOpacity>
            </View>
        }

        <View style={styles.iconView}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>this.moveNextToolbar(isFirstToolbar)}
            >
            <Image source={ARROW_ICON} style={isFirstToolbar ? styles.rightIcon : styles.leftIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default CKEditorToolbar