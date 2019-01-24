import React from 'react'
import { View, Text, Switch, Image } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import styles from './styles'
import COLORS from '../../../service/colors'
const LOGO_ICON = require('../../../../assets/images/Login/icon_40pt.png')

class ShareWidgetTipsModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.itemView}>
          <View style={styles.numberView}>
            <Text style={[styles.text, styles.numberText]}>1</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>Swipe the top row and tap More</Text>
            <View style={styles.iconView}>
              <Entypo name="dots-three-horizontal" size={18} color={COLORS.MEDIUM_GREY} style={styles.dotIcon} />
            </View>
          </View>
        </View>
        <View style={styles.itemView}>
          <View style={styles.numberView}>
            <Text style={[styles.text, styles.numberText]}>2</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>Enable Mello and drag it to the top</Text>
            <View style={styles.switchView}>
              <Switch
                style={styles.switchIcon}
                value={true}
                disabled
              />
            </View>
          </View>
        </View>
        <View style={styles.itemView}>
          <View style={styles.numberView}>
            <Text style={[styles.text, styles.numberText]}>3</Text>
          </View>
          <View style={styles.textView}>
            {/* <Text style={styles.text}>Tab Mello in the share panel</Text> */}
            <Text style={styles.text}>Tab cancel when you are done</Text>
            <View style={styles.iconView}>
              <Image source={LOGO_ICON} style={styles.icon} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default ShareWidgetTipsModal