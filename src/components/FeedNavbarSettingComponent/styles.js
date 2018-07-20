import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  settingView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  button: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingIcon: {
    fontSize: 20,
    color: '#fff',
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
