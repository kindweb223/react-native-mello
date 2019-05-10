import { StyleSheet, Platform } from 'react-native'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50 + 40,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent'
  },
  rowContainer: {
    height: 50,
    paddingHorizontal: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.TOASTER_GREY,
    borderRadius: 8
  },
  buttonView: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonReportText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600'
  },
  arrowIcon: {
    marginRight: 8
  },
  settingMenuView: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: 135,
    position: 'absolute',
    bottom: 80,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
      },
      android: {
        elevation: 20
      }
    })
  },
  settingItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  settingButtonText: {
    color: COLORS.PURPLE,
    fontSize: 14,
    marginLeft: 10
  },
})

export default styles
