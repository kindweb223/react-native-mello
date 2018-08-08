import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  WebView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
import LoadingScreen from '../LoadingScreen';
import * as feedTypes from '../../redux/feedo/types'
import * as cardTypes from '../../redux/card/types'


class DocumentSliderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.props.position,
      loading: false,
    };
  }

  componentDidMount() {
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
        Alert.alert('Error', errorMessage, [
          {text: 'Close'},
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

  onDelete() {
    const {
      docFiles,
    } = this.props;
    if (this.props.onRemove) {
      this.props.onRemove(docFiles[this.state.position].id);
    }
  }

  render () {
    const {
      docFiles,
    } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onClose.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={30} color={'#fff'} />
        </TouchableOpacity>
        <View style={styles.webViewContainer}>
          <Swiper 
            loop={false}
            index={this.state.position}
            paginationStyle={{ bottom: 0 }}
            activeDotColor='#fff'
            dotColor={COLORS.MEDIUM_GREY}
            onIndexChanged={(index) => this.setState({position: index})}
          >
            {
              docFiles.map((file, index) => {
                return (
                  <View key={index} style={styles.slideContainer}>
                    <WebView 
                      source={{uri: file.accessUrl}}
                      onLoadStart={() =>  this.setState({loading: true})}
                      onLoadEnd={() =>  this.setState({loading: false})}
                    />
                  </View>
                )
              })
            }
          </Swiper>
        </View>
        {
          this.props.removal && (
          <TouchableOpacity 
            style={styles.borderButtonWrapper}
            activeOpacity={0.6}
            onPress={this.onDelete.bind(this)}
          >
            <Text style={styles.textButton}>Delete</Text>
          </TouchableOpacity>
        )}
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


DocumentSliderScreen.defaultProps = {
  docFiles: [],
  position: 0,
  removal: true,
  onRemove: () => {},
  onClose: () => {},
}


DocumentSliderScreen.propTypes = {
  docFiles: PropTypes.array,
  position: PropTypes.number,
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