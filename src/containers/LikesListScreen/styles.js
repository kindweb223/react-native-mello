import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 38,
    height: '100%',
    justifyContent: 'center',
  },
  likeContainer: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: COLORS.DARK_GREY,
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.16,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItemName: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  textItemTime: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: COLORS.DARK_GREY,
  },
})


export default styles
