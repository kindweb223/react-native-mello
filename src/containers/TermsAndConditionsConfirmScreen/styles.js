import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

export default {
  container: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: '#fff'
  },
  safeView: {
    flex: 1
  },
  navbarView: {
    height: 110,
    paddingHorizontal: CONSTANTS.PADDING * 2,
    paddingTop: 30,
    paddingBottom: 46
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: CONSTANTS.PADDING * 2
  },
  avatarView: {
    width: 94,
    height: 94,
    borderRadius: 47,
    overflow: 'hidden',
    marginBottom: 49
  },
  avatar: {
    width: '100%',
    height: '100%'
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
  },
  tcView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12
  },
  tcText: {
    color: COLORS.ACTION_SHEET_TITLE,
    fontSize: 14,
    lineHeight: 20
  },
  buttonView: {
    borderRadius: 14,
    width: '100%',
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PURPLE,
    marginTop: 116,
    marginBottom: 78
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff'
  },
}
