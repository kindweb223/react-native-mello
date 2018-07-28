import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdropContainer: {
    flex: 1,
  },
  mainContentContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 12,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 18,
  },
  itemSelectBackgroundContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.LIGHT_PURPLE_BACKGROUND,
    borderRadius: 18,
  },
  leftContentContainer: {
    paddingHorizontal: 12,
  },
  rightContentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    color: '#000',
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
});


export default styles
