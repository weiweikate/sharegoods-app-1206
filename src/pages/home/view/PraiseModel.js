/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/5/27.
 *
 */


'use strict';

import React from 'react';

import {
  StyleSheet,
  View,
    ImageBackground,
  TouchableOpacity
} from 'react-native';

import {
  MRText
} from '../../../components/ui';
import HomeModalManager from '../manager/HomeModalManager'
import Modal from '../../../comm/components/CommModal';

import res from '../res'
import ScreenUtils from '../../../utils/ScreenUtils';
const {btn_bg, unwin, win} = res
import { observer } from 'mobx-react';
@observer
export default class PraiseModel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }



    renderContent() {
      let data = HomeModalManager.prizeData || {}
      let title = null;
      let image = null;
      if (data.popUp) {
          title = '本期您共中了'+data.userShowpeas+'枚秀豆';
         image = win
      }else {
          title = '很遗憾您尚未中奖\n下次再接再厉';
          image = unwin
      }
      return(
          <View style={styles.modal}>
              <ImageBackground source={image} style={styles.bg}>
                  <MRText style={styles.title}>{title}</MRText>
                  <TouchableOpacity onPress={()=> {HomeModalManager.closePrize()}}>
                      <ImageBackground source={btn_bg} style={styles.btn}>
                          <MRText style={styles.btnText}>确认</MRText>
                      </ImageBackground>
                  </TouchableOpacity>
              </ImageBackground>
          </View>
      )
  }


  render() {
    return (
        <Modal
            animationType='slide'
            ref={(ref) => {
                this.modal = ref;
            }}
            onRequestClose={() => {
                HomeModalManager.closePrize()
            }}
            visible={HomeModalManager.isShowPrize && HomeModalManager.isHome}>
                {this.renderContent()}
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    modal:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',

    },
    bg: {
        height: ScreenUtils.autoSizeWidth(290),
        width: ScreenUtils.autoSizeWidth(240),
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    btn: {
        height: ScreenUtils.autoSizeWidth(40),
        width: ScreenUtils.autoSizeWidth(180),
        alignItems: 'center',
        justifyContent: 'center' ,
        marginBottom: ScreenUtils.autoSizeWidth(30)
    },
    btnText: {
        fontSize: 16,
        color: '#9B5A19'
    },
    title: {
        fontSize: 16,
        color: 'white',
        marginBottom: ScreenUtils.autoSizeWidth(30),
        textAlign: 'center'
    }
});
