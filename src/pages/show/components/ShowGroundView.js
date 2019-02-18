/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  Navigator,
  StatusBar,
  ScrollView,
  ToastAndroid,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  InteractionManager,
  ViewPagerAndroid,
  Image
} from 'react-native';
import { connect } from 'react-redux';

const FlyDimensions = require('FlyDimensions');
const FlySources = require('FlySources');
const FlyIconfonts = require('FlyIconfonts');
const FlyColors = require('FlyColors');
const FlyImage = require('FlyImage');
const FlyItem = require('FlyItem');
const FlyBase = require('FlyBase');
const ImageButton = require('ImageButton');
const FlyHeader = require('FlyHeader');
const SceneUtils = require('SceneUtils');
const FlyModal = require('FlyModal');
const Utils = require('Utils');
const FlyContainer = require('FlyContainer');
const FlyBottomButton = require('FlyBottomButton');
const FlyWebView = require('FlyWebView');
const FlyValues = require('FlyValues');
const {} = require('../../actions');

class ShowGroundView extends PureComponent {
  constructor(props) {
    super(props);
  }
}

var styles = StyleSheet.create({});

function select(store) {
  return {};
}

module.exports = connect(select)(ShowGroundView);
