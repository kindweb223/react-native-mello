import { StyleSheet } from 'react-native'
import COLORS from '../../../service/colors'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  leftContainer: {
    width: 70,
    height: '100%'
  },
  thumbnailImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: COLORS.LIGHT_GREY_PLACEHOLDER
  },
  rightContainer: {
    flex: 1
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  statsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6
  },
  statsItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  feedIcon: {
    marginRight: 5
  },
  cardIcon: {
    height: 9,
    width: 13,
    marginRight: 5
  },
  profileIcon: {
    height: 11.67,
    width: 10,
    marginRight: 5,
    marginBottom: 0
  },
  feedText: {
    fontSize: 12,
    lineHeight: 21,
  },
  active: {
    color: COLORS.PURPLE
  },
  inActive: {
    color: COLORS.DARK_GREY
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarView: {
    marginLeft: 15
  },
  tagsView: {
    marginTop: 5,
    marginBottom: 4
  }
})

export default styles
