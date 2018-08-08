import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: CONSTANTS.PADDING,
  },
  animationBar: {
    position: 'absolute',
    width: 60,
    height: '100%',
    backgroundColor: '#fff',
    opacity: 0.3
  },
  subContainer: {
    marginVertical: 11,
    width: '100%'
  },
  thumbnailsView: {
    width: '100%',
    height: 133,
    borderRadius: 6,
    backgroundColor: 'rgba(219, 220, 223, .32)'
  },
  feedInfoView: {
    width: '100%',
    height: 14,
    borderRadius: 2,
    marginTop: 13,
    backgroundColor: 'rgba(219, 220, 223, .32)',
  },
  titleView: {
    width: 48,
    height: '100%',
    backgroundColor: 'rgba(219, 220, 223, .67)',
  },
  bottomView: {
    width: '100%',
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 8,
    flexDirection: 'row'
  },
  actionView: {
    width: 29,
    height: '100%',
    marginRight: 16,
    backgroundColor: 'rgba(219, 220, 223, .32)',
  }
})

export default styles
