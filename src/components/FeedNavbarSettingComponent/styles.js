import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  settingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingLeft: 1
  },
  settingIcon: {
    fontSize: 20,
    color: COLORS.ACTION_SHEET_TITLE
  },
  zapButton: {
    marginRight: 10
  },
  zapButtonView: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 17,
    justifyContent: 'center',
    marginLeft: 10
  },
  zapIcon: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 10
  }
})

export default styles
