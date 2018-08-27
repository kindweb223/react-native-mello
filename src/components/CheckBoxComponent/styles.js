import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkboxView: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightTextView: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightText: {
    fontSize: 14
  }
});


export default styles
