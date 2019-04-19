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
      fontSize: 'normal',
      commands: []
    }
  }

  moveNextToolbar = (isFirstToolbar) => {
    this.setState({ isFirstToolbar: !isFirstToolbar })
  }

  setFontSize = () => {
    let { commands } = this.state

    if (this.state.fontSize === 'normal') {
      this.setState({ fontSize: 'big' })
      this.props.executeCKEditorCommand('fontSize_big')
      this.setState({ commands: [...commands, 'fontsize'] })
    } else {
      this.setState({ fontSize: 'normal' })
      this.props.executeCKEditorCommand('fontSize_normal')
      this.setState({ commands: _.filter(commands, item => item !== 'fontsize') })
    }
  }

  setListCommands = (command) => {
    let { commands } = this.state

    this.props.executeCKEditorCommand(command)
    let newCommands = _.filter(commands, item => item !== 'numberedList' && item !== 'bulletedList')

    if (_.findIndex(commands, item => item === command) === -1) {
      this.setState({ commands: [...newCommands, command] })
    } else {
      this.setState({ commands: [...newCommands] })
    }
  }

  setCommands = (command) => {
    const { commands } = this.state

    this.props.executeCKEditorCommand(command)
    if (_.findIndex(commands, item => item === command) === -1) {
      this.setState({ commands: [...commands, command] })
    } else {
      this.setState({ commands: _.filter(commands, item => item !== command) })
    }
  }

  refreshCommands = (type) => {
    const { commands } = this.state

    if (type) {
      this.setState({ commands: [], fontSize: 'normal' })
    } else {
      this.setState({ commands: _.filter(commands, item => item === 'numberedList' || item === 'bulletedList'), fontSize: 'normal' })
    }
  }

  render() {
    const { isFirstToolbar, commands } = this.state;
    console.log('COMMANDS: ', commands)
  
    return (
      <View style={styles.container}>
        {this.props.isNew && (
          <View style={styles.iconView}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.props.handleCKEditorToolbar()}
            >
              <Image source={CLOSE_ICON} />
            </TouchableOpacity>
          </View>
        )}

        {isFirstToolbar
          ? <View style={[styles.firstToolbarView, this.props.isNew ? { paddingLeft: 25 } : { paddingLeft: 10 }]}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.setFontSize()}
              >
                <Image source={_.findIndex(commands, item => item === 'fontsize') !== -1 ? HEADLINE_PURPLE_ICON : HEADLINE_ICON} />
              </TouchableOpacity>
              <View style={styles.toolbarBorderView}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.setListCommands('bulletedList')}
                >
                  <Image source={_.findIndex(commands, item => item === 'bulletedList') !== -1 ? BULLET_PURPLE_ICON : BULLET_ICON} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.setListCommands('numberedList')}
                >
                  <Image source={_.findIndex(commands, item => item === 'numberedList') !== -1 ? NUMBER_PURPLE_ICON : NUMBER_ICON} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.setCommands('bold')}
                >
                  <Image source={_.findIndex(commands, item => item === 'bold') !== -1 ? BOLD_PURPLE_ICON : BOLD_ICON} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.setCommands('underline')}
              >
                <Image source={_.findIndex(commands, item => item === 'underline') !== -1 ? UNDERLINE_PURPLE_ICON : UNDERLINE_ICON} />
              </TouchableOpacity>
            </View>
          : <View style={styles.secondToolbarView}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.toolView}
                onPress={() => this.setCommands('italic')}
              >
                <Image source={_.findIndex(commands, item => item === 'italic') !== -1 ? ITALIC_PURPLE_ICON : ITALIC_ICON} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.toolView}
                onPress={() => this.setCommands('strikethrough')}
              >
                <Image source={_.findIndex(commands, item => item === 'strikethrough') !== -1 ? STRIKETHROUGH_PURPLE_ICON : STRIKETHROUGH_ICON} />
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