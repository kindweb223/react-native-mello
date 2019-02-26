import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types'

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
      title: 'Searching for Images',
    };
    this.shareUrl = '';
  }

  async componentDidMount() {
    try {
      var type_, value_;

      if (Platform.OS === 'ios') {
        const { type, value } = await ShareExtension.data();
        type_ = type
        value_ = value
      }
      else 
      {
        type_ = this.props.mode
        value_ = this.props.value
      }
      console.log('SHARE_DATA: ', type_, value_)
      if (type_ === 'url') {
        this.setState({initialized: true});
        const urls = value_.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
        if (urls === null)
        {
          const text = value_;
          if (text !== '') {
            Actions.ShareCardScreen({
              notesText: text,
            });
          }
        } else {
          this.shareUrl = urls[0]
          this.props.getOpenGraph(urls[0], true)
        }
      } else if (type_ === 'images') {
        const images = value_.split(" , ");
        if (images.length > 0) {
          Actions.ShareCardScreen({
            imageUrls: images,
          });
        }
      } 
      else {
        console.log('error: wrong share link', type_, value_)
      }
    } catch(error) {
      console.log('error : ', error)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
          title: 'Choose an image'
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
            error = 'Oops, we can\'t get the details from this link';
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
      imageUrls: [imageUrl],
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
        <Text style={styles.textTitle}>{this.state.title}</Text>
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
  mode: '',
  value: '',
}


ChooseLinkImageFromExtension.propTypes = {
  mode: PropTypes.string,
  value: PropTypes.string,
}


const mapStateToProps = ({ card }) => ({
  card,
})


const mapDispatchToProps = dispatch => ({
  getOpenGraph: (url, isSharing) => dispatch(getOpenGraph(url, isSharing)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChooseLinkImageFromExtension)