import { StyleSheet, Platform } from 'react-native'
import CONSTANTS from '../../../service/constants'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 138,
    borderRadius: 14,
    backgroundColor: COLORS.LIGHT_SOFT_GREY,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 480,
    left: 0,
    zIndex: 100,
    padding: 15,
    justifyContent: 'space-between'
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 32,
  },
  numberView: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.MEDIUM_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  numberText: {
    color: '#fff'
  },
  textView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#444',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600'
  },
  iconView: {
    marginLeft: 15,
    borderRadius: 7,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 25,
    height: 25
  },
  dotIcon: {
    marginTop: 2
  },
  switchView: {
    width: 32,
    height: 32
  },
  switchIcon: {
    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
    right: 10
  },
})

export default styles
