import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: CONSTANTS.PADDING,
    paddingVertical: 30
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 5,
  },
  textBack: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    marginLeft: 5,
    color: COLORS.PURPLE,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonView: {
    position: 'absolute',
    width: '100%',
    bottom: 30,
    left: CONSTANTS.PADDING
  },
  button: {
    borderRadius: 14,
    width: '100%',
    height: 60,
    marginTop: 10,
    backgroundColor: COLORS.PURPLE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  passwordPreview: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  passwordScoreView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 15,
    marginTop: 5,
    paddingHorizontal: 10,
    width: '100%'
  },
  passwordScoreText: {
    fontSize: 12,
    color: COLORS.DARK_GREY
  },
  errorView: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    width: '100%'
  },
  errorText: {
    color: COLORS.MEDIUM_RED,
    fontWeight: '600',
    fontSize: 12
  },
  forgotView: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotText: {
    color: COLORS.PURPLE,
    fontWeight: '600'
  }
})


export default styles
