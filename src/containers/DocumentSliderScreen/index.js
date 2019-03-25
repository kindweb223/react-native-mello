import React from 'react'
import {
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  WebView,
  Text,
  Platform,
  Share
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ActionSheet from 'react-native-actionsheet'
import Swiper from 'react-native-swiper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import styles from './styles'
import COLORS from '../../service/colors'
import LoadingScreen from '../LoadingScreen'
import DocumentNotSupportedScreen from '../DocumentNotSupportedScreen'
import * as feedTypes from '../../redux/feedo/types'
import * as cardTypes from '../../redux/card/types'
import AlertController from '../../components/AlertController'
import COMMON_STYLES from '../../themes/styles'

import Analytics from '../../lib/firebase'

class DocumentSliderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('DocumentSliderScreen')
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if ((this.props.feedo.loading !== feedTypes.DELETE_FILE_PENDING && nextProps.feedo.loading === feedTypes.DELETE_FILE_PENDING)
      || (this.props.card.loading !== cardTypes.DELETE_FILE_PENDING && nextProps.card.loading === cardTypes.DELETE_FILE_PENDING)) {
      // deleting a file
      loading = true;
    } else if ((this.props.feedo.loading !== feedTypes.DELETE_FILE_FULFILLED && nextProps.feedo.loading === feedTypes.DELETE_FILE_FULFILLED)
      || (this.props.card.loading !== cardTypes.DELETE_FILE_FULFILLED && nextProps.card.loading === cardTypes.DELETE_FILE_FULFILLED)) {
      // fullfilled in deleting a file
    }

    this.setState({
      loading,
    });

    // showing error alert
    let error = nextProps.feedo.error;
    if (!error) {
      error = nextProps.card.error;
    }
    if (error) {
      let errorMessage = null;
      if (error.error) {
        errorMessage = error.error;
      } else {
        errorMessage = error.message;
      }
      if (errorMessage) {
        AlertController.shared.showAlert('Error', errorMessage, [
          {
            text: 'Close',
            onPress: () => AlertController.shared.didDimsiss() 
          },
        ]);
      }
      return;
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  onShare() {
    Share.share({
      title: "Open in",
      url: `${this.props.docFile.accessUrl}`
      
    })
  }

  onOptions() {
    setTimeout(() => {
      this.deleteActionSheet.show()
    }, 200)
  }

  onTapActionSheet(index) {
    if (index == 0) {
      this.onDelete()
    }
  }

  onDelete() {
    const {
      docFile,
    } = this.props;
    if (this.props.onRemove) {
      this.props.onRemove(docFile.id);
    }
  }

  onRefreshWebView = () => {
    this.props.onClose()
  }

  render() {
    const {
      docFile,
    } = this.props;

    if (this.state.loading) { 
      setTimeout(() => { this.setState({ error: true }) }, 15000);
    }

    return (
      <View style={styles.container}>
        <View style={styles.topBarWrapper}>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.6}
            onPress={this.onClose.bind(this)}
          >
            <MaterialCommunityIcons name="close" size={25} color={COLORS.PURPLE} />
          </TouchableOpacity>
          <Text style={styles.headerTitleLabel}> 
            {docFile.name}
          </Text>
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.6}
            onPress={this.onShare.bind(this)}
          >
            <Feather name="share" size={20} color={COLORS.PURPLE} />
          </TouchableOpacity>
          {
            this.props.removal &&
          <TouchableOpacity 
            style={styles.closeButtonWrapper}
            activeOpacity={0.6}
            onPress={this.onOptions.bind(this)}
          >
             <Feather name="trash-2" size={20} color={COLORS.PURPLE} />
          </TouchableOpacity>
          }
        </View>
        <View style={styles.webViewContainer}>
          {this.state.loading && <LoadingScreen />}
          {this.state.error && <DocumentNotSupportedScreen />}
          <ScrollView
            style={styles.scrollViewContainer}
            contentContainerStyle={styles.scrollViewContentContainer}
            refreshControl={
              <RefreshControl
                tintColor="white"
                onRefresh={() => this.onRefreshWebView()}
              />
            }
          >
            <WebView 
              source={{uri: docFile.accessUrl}}
              onLoadStart={() =>  this.setState({ loading: true })}
              onLoadEnd={() =>  this.setState({ loading: false })}
              onError={()  => this.setState({ error: true, loading: false }) }
            />
          </ScrollView>
        </View>
        <ActionSheet
          ref={ref => this.deleteActionSheet = ref}
          title={
            Platform.OS === 'ios'
            ? 'Are you sure want to delete?'
            : <Text style={COMMON_STYLES.actionSheetTitleText}>Are you sure want to delete?</Text>
          }
          options={['Delete', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapActionSheet(index)}
        />
      </View>
    );
  }
}


DocumentSliderScreen.defaultProps = {
  docFile: null,
  removal: true,
  onRemove: () => {},
  onClose: () => {},
}

DocumentSliderScreen.propTypes = {
  docFile: PropTypes.object,
  removal: PropTypes.bool,
  onRemove: PropTypes.func,
  onClose: PropTypes.func,
}


const mapStateToProps = ({ feedo, card }) => ({
  feedo,
  card,
})


const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(DocumentSliderScreen)