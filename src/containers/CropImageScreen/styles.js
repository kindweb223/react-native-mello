import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const CIRCLE_SIZE = 70

export default {
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroudnColor: '#fff'
  },
  body: {
    width: '100%',
    height: '100%',
    backgroudnColor: '#fff',
  },
  headerView: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GREY_LINE,
    marginBottom: 20,
  },
  closeButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  footerView: {
    width: '100%',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: CONSTANTS.PADDING
  },
  saveBtn: {
    height: 60,
    width: CONSTANTS.SCREEN_SUB_WIDTH,
    borderRadius: 14,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  box: {
    backgroundColor: "tomato",
    marginLeft: -(CIRCLE_SIZE / 2),
    marginTop: -(CIRCLE_SIZE / 2),
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: "#000"
  }
}
