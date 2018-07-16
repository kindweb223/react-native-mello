import React from 'react'
import {
  SafeAreaView,
  View,
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import COLORS from '../../service/colors'
import styles from './styles'

const TAB_STYLES = {
  height: '100%',
  paddingTop: 10,
  paddingHorizontal: 10,
}

class HomeScreen extends React.Component {
  render () {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DashboardNavigationBar />
        
        <View style={styles.container}>
          <ScrollableTabView
            tabBarActiveTextColor={COLORS.PURPLE}
            tabBarInactiveTextColor={COLORS.MEDIUM_GREY}
            renderTabBar={() => <TabBar
                                  underlineHeight={0}
                                  underlineBottomPosition={0}
                                  tabBarStyle={styles.tabBarStyle}
                                  tabBarTextStyle={styles.tabBarTextStyle}
                                  tabMargin={10}
                                  tabStyles={{ 'tab': TAB_STYLES }}
                                />}
          >
            <FeedoListContainer tabLabel={{label: 'All'}} data={[]} />
            <FeedoListContainer tabLabel={{label: 'Pinned'}} data={[]} />
            <FeedoListContainer tabLabel={{label: 'Shared with me'}} data={[]} />
          </ScrollableTabView>
        </View>

        <DashboardActionBar />
      </SafeAreaView>
    )
  }
}

export default HomeScreen
