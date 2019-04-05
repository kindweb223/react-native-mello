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
    width: 90,
    borderRadius: 7,
    marginRight: 15
  },
  acceptButtonView: {
    backgroundColor: COLORS.PURPLE
  },
  ignoreButtonView: {
    backgroundColor: COLORS.MEDIUM_GREY
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  acceptButtonText: {
    color: '#fff'
  },
  ignoreButtonText: {
    color: '#fff'
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
