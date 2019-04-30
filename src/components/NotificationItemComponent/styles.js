import { StyleSheet } from 'react-native'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CONSTANTS.PADDING,
    flexDirection: 'row'
  },
  rightContainer: {
    flex: 1
  },
  titleView: {
    marginBottom: 5
  },
  title: {
    fontSize: 14,
    fontWeight: '600'
  },
  thumbnailsView: {
    width: '100%',
    height: (CONSTANTS.SCREEN_SUB_WIDTH - 55 - 3) / 4,
    marginTop: 3,
    marginBottom: 8
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row'
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 70,
    borderRadius: 6,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  acceptButtonView: {
    backgroundColor: COLORS.PURPLE
  },
  ignoreButtonView: {
    backgroundColor: COLORS.LIGHT_SOFT_GREY
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  acceptButtonText: {
    color: '#fff'
  },
  ignoreButtonText: {
    color: COLORS.PRIMARY_BLACK
  },
  timeView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 12,
    color: COLORS.DARK_GREY
  },
})

export default styles
