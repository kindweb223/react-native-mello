import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import { fonts } from '../../themes'

export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    paddingTop: CONSTANTS.STATUSBAR_HEIGHT,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 50,
    paddingHorizontal: CONSTANTS.PADDING,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h3: {
    ...fonts.style.h3
  },
  loadingView: {
    marginTop: 24,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    ...fonts.style.h3,
    color: COLORS.PRIMARY_BLACK,
    alignItems: 'center',
  },
  cancelText: {
    ...fonts.style.h3,
    color: COLORS.PURPLE,
    fontWeight: 'normal'
  },
  inviteeListView: {
    maxHeight: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.STATUSBAR_HEIGHT - CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT - 60 - 110
  },
  inviteeList: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  inviteeItem: {
    paddingVertical: 7,
  },
  buttonView: {
    paddingHorizontal: CONSTANTS.PADDING
  },
  button: {
    marginTop: 30,
    height: 60,
    marginBottom: CONSTANTS.STATUS_BOTTOM_BAR_HEIGHT + 20,
    width: '100%'
  }
}
