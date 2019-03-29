import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginBottom: 21,
  },
  backdropContainer: {
    flex: 1,
  },
  mainContentContainer: {
    paddingBottom: 16,
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
    marginRight: 12
  },
  rightContentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  textTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '600',
    color: '#000',
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.DARK_GREY,
  },
  headerView: {
    paddingVertical: 14,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_GREY,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.DARK_GREY
  },
  separator: {
    marginHorizontal: 5,
    marginVertical: 5,
    height: 1,
    backgroundColor: COLORS.SEPARATOR_GREY,
  },
  image: {
    width: 35,
    height: 35
  }
});


export default styles
