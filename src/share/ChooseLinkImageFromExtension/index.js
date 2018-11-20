import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles'
import { 
  getOpenGraph,
} from '../../redux/card/actions'
import * as types from '../../redux/card/types'

import CONSTANTS from '../../service/constants'
import ShareExtension from '../shareExtension'
import ShareModalScreen from '../ShareModalScreen';
import LoadingScreen from '../../containers/LoadingScreen';


class ChooseLinkImageFromExtension extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      images: [],
      selectedIndex: -1,
      isVisibleAlert: false,
      errorMessage: '',
      initialized: false,
    };
    this.shareUrl = '';
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data();
      if (type === 'text/plain') {
        this.setState({initialized: true});
        const urls = value.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+((?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9]))|(?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9])(?:[a-zA-Z0-9]))))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi);
        this.shareUrl = urls[0]
        this.props.getOpenGraph(urls[0], true)
      } else {
        Actions.ShareCardScreen({
          imageUrl: value,
        });
      }
    } catch(error) {
      console.log('error : ', error)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('UNSAFE_componentWillReceiveProps : ', nextProps.card)
    if (Actions.currentScene !== 'ChooseLinkImageFromExtension') {
      return;
    }
    let loading = false;
    if (this.props.card.loading !== types.GET_OPEN_GRAPH_PENDING && nextProps.card.loading === types.GET_OPEN_GRAPH_PENDING) {
      // getting open graph
      loading = true;
    } else if (this.props.card.loading !== types.GET_OPEN_GRAPH_FULFILLED && nextProps.card.loading === types.GET_OPEN_GRAPH_FULFILLED) {
      // success in getting open graph
      this.shareUrl = nextProps.card.currentOpneGraph.url;
      const images = nextProps.card.currentOpneGraph.images;
      if (images && images.length > 0) {
        this.setState({
          images,
        });
      } else {
        this.onSkip();
      }
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (this.props.card.loading !== nextProps.card.loading) {
      if (nextProps.card.error) {
        let error = null;
        if (nextProps.card.error && nextProps.card.error.error) {
          error = nextProps.card.error && nextProps.card.error.error;
        } else {
          error = nextProps.card.error && nextProps.card.error.message;
        }
        if (error) {
          if (nextProps.card.loading === types.GET_OPEN_GRAPH_REJECTED) {
            error = 'Sorry, this link cannot be read';
          }
          if (!this.state.isVisibleAlert) {
            this.setState({
              isVisibleAlert: true,
              errorMessage: error,
            });
          }
        }
        return;
      }
    }
  }

  onSelectItem(imageUrl, index) {
    this.setState({
      selectedIndex: index,
    });
    Actions.ShareCardScreen({
      imageUrl,
      shareUrl: this.shareUrl,
    });
  }

  onCancel() {
    ShareExtension.close();
  }

  onSkip() {
    Actions.ShareCardScreen({
      shareUrl: this.shareUrl,
    });
  }

  renderIcon(index) {
    if (this.state.selectedIndex === index) {
      return (
        <View style={styles.selectedIcon}>
          <Ionicons style={styles.checkIcon} name='ios-checkmark-circle' /> 
        </View>
      );
    }
    return (
      <View style={styles.icon} />
    );
  }

  renderImage({item, index}) {
    return (
      <TouchableOpacity 
        style={styles.imageContainer}
        activeOpacity={0.6}
        onPress={() => this.onSelectItem(item, index)}
      >
        <Image style={styles.imageItem} source={{uri: item}} resizeMode='cover' />
        {this.renderIcon(index)}
      </TouchableOpacity>
    );
  }

  get renderHeader() {
    return (
      <View style={styles.topContainer}>
        <Text style={styles.textTitle}>Choose an image</Text>
        <TouchableOpacity 
          style={styles.cancelButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onCancel.bind(this)}
        >
          <Text style={styles.textCancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  get renderFooter() {
    return (
      <TouchableOpacity 
        style={styles.bottomContainer}
        activeOpacity={0.8}
        onPress={this.onSkip.bind(this)}
      >
        <Text style={[styles.textCancel, {fontWeight: 'bold'}]}>Skip</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      images,
      initialized,
    } = this.state;
    if (!initialized) {
      return (
        <View style={styles.container}>
          <LoadingScreen />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {this.renderHeader}
          <View style={styles.line} />
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={images}
            renderItem={this.renderImage.bind(this)}
            keyExtractor={(item, index) => index}
            extraData={this.state}
            numColumns={3}
          />
        </View>
        {this.renderFooter}
        {this.state.loading && <LoadingScreen />}
        {
          this.state.isVisibleAlert &&
          <View style={styles.modalContainer}>
            <ShareModalScreen
              buttons={CONSTANTS.MODAL_OK}
              message={this.state.errorMessage}
              onOk={() => this.onCancel()}
              okLabel='OK'
            />
          </View>
        }
      </View>
    );
  }
}


ChooseLinkImageFromExtension.defaultProps = {
}


ChooseLinkImageFromExtension.propTypes = {
}


const mapStateToProps = ({ card }) => ({
  card,
})


const mapDispatchToProps = dispatch => ({
  getOpenGraph: (url, isSharing) => dispatch(getOpenGraph(url, isSharing)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChooseLinkImageFromExtension)