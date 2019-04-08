import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

const CLOSE_ICON = require('../../../../assets/images/RichEditor/UIButtonRoundedX.png')
const HEADLINE_ICON = require('../../../../assets/images/RichEditor/IconMediumTtGrey.png')
const BULLET_ICON = require('../../../../assets/images/RichEditor/IconMediumBulletpointsGrey.png')
const NUMBER_ICON = require('../../../../assets/images/RichEditor/IconMediumNumbersGrey.png')
const CHECKBOX_ICON = require('../../../../assets/images/RichEditor/IconMediumCheckboxGrey.png')
const UNDERLINE_ICON = require('../../../../assets/images/RichEditor/IconMediumUnderlineGrey.png')
const ITALIC_ICON = require('../../../../assets/images/RichEditor/IconMediumItalicGrey.png')
const STRIKETHROUGH_ICON = require('../../../../assets/images/RichEditor/IconMediumStrikethroughGrey.png')
const BOLD_ICON = require('../../../../assets/images/RichEditor/IconMediumBoldGrey.png')
const ARROW_ICON = require('../../../../assets/images/RichEditor/UIButtonRoundedNext.png')

import styles from './styles'

class CKEditorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFirstToolbar: true,
      fontSize: 'normal'
    }
  }

  moveNextToolbar = (isFirstToolbar) => {
    this.setState({ isFirstToolbar: !isFirstToolbar })
  }

  setFontSize = () => {
    if (this.state.fontSize === 'normal') {
      this.setState({ fontSize: 'big' })
      this.props.executeCKEditorCommand('fontSize_big')
    } else {
      this.setState({ fontSize: 'normal' })
      this.props.executeCKEditorCommand('fontSize_normal')
    }
  }

  render() {
    const { isFirstToolbar } = this.state;
  
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
                <Image source={HEADLINE_ICON} />
              </TouchableOpacity>
              <View style={styles.toolbarBorderView}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.props.executeCKEditorCommand('bulletedList')}
                >
                  <Image source={BULLET_ICON} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.props.executeCKEditorCommand('numberedList')}
                >
                  <Image source={NUMBER_ICON} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.props.executeCKEditorCommand('underline')}
                >
                  <Image source={UNDERLINE_ICON} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.props.executeCKEditorCommand('bold')}
              >
                <Image source={BOLD_ICON} />
              </TouchableOpacity>
            </View>
          : <View style={styles.secondToolbarView}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.toolView}
                onPress={() => this.props.executeCKEditorCommand('italic')}
              >
                <Image source={ITALIC_ICON} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.toolView}
                onPress={() => this.props.executeCKEditorCommand('strikethrough')}
              >
                <Image source={STRIKETHROUGH_ICON} />
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