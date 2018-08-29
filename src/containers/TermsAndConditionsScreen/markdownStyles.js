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
  },
  heading1: {
    display: 'none'
  },
  heading2: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  hr: {
    backgroundColor: '#ccc',
    height: 1,
  },
  inlineCode: {
    backgroundColor: 'rgba(128, 128, 128, 0.25)',
    fontFamily: 'Courier',
    fontWeight: '500',
  },
  link: {
    color: '#0366d6',
  },
  list: {
    margin: 8,
  },
  listItem: {
    flexDirection: 'row',
  },
  listItemNumber: {
    minWidth: 32,
    paddingRight: 4,
  },
  listItemBullet: {
    minWidth: 32,
    paddingRight: 4,
  },
  listItemOrderedContent: {
    flex: 1,
  },
  listItemUnorderedContent: {
    flex: 1,
  },
  paragraph: {
    fontSize: 14,
    marginTop: 0,
    marginBottom: 20,
    color: COLORS.DARK_GREY
  },
  strong: {
    fontWeight: 'bold',
  }
}
