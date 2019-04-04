import { StyleSheet, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'


export default styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    searchContainer: {
        marginTop: Platform.OS === 'ios' ? ifIphoneX(60, 44) : 16,
        marginLeft: 16,
        marginRight: 16
    },
    feedContainer: {

    },
    itemContainer: {
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textItemTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        marginLeft: 16
      },
})
