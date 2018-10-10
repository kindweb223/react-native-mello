import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 30
  },
  bubbleView: {
    width: '100%'
  },
  bubble: {
    width: '100%'
  },
  bubbleContent: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 40,
    bottom: 20,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    marginRight: 50
  },
  videoBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  videoBtnText: {
    fontWeight: 'bold',
    color: COLORS.PURPLE,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
    flex: 1,
  },
  closeBtnView: {
    position: 'absolute',
    right: 35,
    borderWidth: 2,
    width: 24,
    height: 24,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default styles
