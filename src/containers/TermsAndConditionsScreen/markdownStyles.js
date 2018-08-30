import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors'

export default {
  blockQuote: {
    marginLeft: 10,
    opacity: 0.8,
  },
  codeBlock: {
    fontFamily: 'Courier',
    fontWeight: '500'
  },
  del: {
    textDecorationLine: 'line-through',
  },
  em: {
    fontStyle: 'italic',
  },
  heading: {
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 0,
    color: '#000'
  },
  heading1: {
    fontSize: 18
  },
  heading2: {
    fontSize: 16
  },
  hr: {
    backgroundColor: COLORS.LIGHT_GREY_LINE,
    height: 1,
  },
  inlineCode: {
    backgroundColor: 'rgba(128, 128, 128, 0.25)',
    fontFamily: 'Courier',
    fontWeight: '500',
  },
  link: {
    color: COLORS.PURPLE,
  },
  list: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  listItem: {
    flexDirection: 'row',
  },
  listItemNumber: {
    minWidth: 20,
    paddingRight: 4,
    color: COLORS.DARK_GREY,
  },
  listItemBullet: {
    minWidth: 20,
    paddingRight: 4,
    color: COLORS.DARK_GREY,
  },
  listItemOrderedContent: {
    flex: 1,
  },
  listItemUnorderedContent: {
    color: COLORS.DARK_GREY,
    flex: 1,
  },
  paragraph: {
    fontSize: 14,
    marginTop: 0,
    marginBottom: 10,
    color: COLORS.DARK_GREY
  },
  strong: {
    fontWeight: 'bold',
  }
}
