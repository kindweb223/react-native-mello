import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 475,
    borderRadius: 18,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  headerView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16
  },
  closeButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  mainView: {
    padding: 24,
    position: 'absolute',
    bottom: 68
  },
  iconView: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: COLORS.LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 21
  },
  title: {
    fontSize: 22,
    lineHeight: 26
  }
})

export default styles
