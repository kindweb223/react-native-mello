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
    paddingHorizontal: CONSTANTS.PADDING,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 50,
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
  },
  inviteeList: {
    marginTop: 15
  },
  inviteeItem: {
    paddingVertical: 7,
  },
  button: {
    marginTop: 50
  }
}
