import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 30
  },
  bubbleImageView: {
    flex: 1
  },
  bubbleView: {
    width: '100%'
  },
  bubbleContent: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 30,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    marginRight: 20,
    lineHeight: 24
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
    lineHeight: 24,
    width: '100%'
  },
  closeBtnView: {
    position: 'absolute',
    right: 30,
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
