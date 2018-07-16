import React from 'react'
import {
  SafeAreaView,
  View,
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar';
import COLORS from '../../service/colors'
import styles from './styles'

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
                                  tabMargin={30}
                                  tabStyles={{ 'tab': { paddingBottom: 0 } }}
                                />}
          >
            <DashboardNavigationBar tabLabel={{label: 'All'}} />
            <DashboardNavigationBar tabLabel={{label: 'Pinned'}} />
            <DashboardNavigationBar tabLabel={{label: 'Shared with me'}} />
          </ScrollableTabView>
        </View>

        <DashboardActionBar />
      </SafeAreaView>
    )
  }
}

export default HomeScreen
