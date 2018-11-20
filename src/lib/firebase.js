import firebase from 'react-native-firebase'

const Analytics = firebase.analytics()
Analytics.setAnalyticsCollectionEnabled(true)

export default Analytics