/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/28.
 *
 */
'use strict';

import React,{Component} from 'react';

import {
    View,
    TouchableOpacity,
    Text,
    Animated
} from 'react-native';

// import {
//   UIText,
//   UIImage,
// } from '../../../components/ui';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';

// import PropTypes from 'prop-types';

export default class MentorItemView extends Component {
    state = {
        isSelected:false,
        ImageWith: new Animated.Value(ScreenUtils.width/5 - 20),
        ImageRadius : new Animated.Value((ScreenUtils.width/5-20)/2)
    };

    constructor(props) {
        super(props);
        this.state={
            isSelect:true
        }
    }

    render() {
        let ImageWidth = this.state.isSelect?Animated.Value(ScreenUtils.width/5):Animated.Value(ScreenUtils.width/5 - 20)
        return (
          <View
              style={{
                  width: ScreenUtils.width / 5,
                   height: 100,
                   alignItems: 'center',
                   justifyContent: 'center'
          }}
           >

             <TouchableOpacity
                  onPress={() => {
                   // this.state.isSelected? this._resetAnimation(): this._startAnimation();
                   // this.state.isSelected = !this.state.isSelected;
                   //    this.props.clickItemAction&&this.props.clickItemAction();
                  }
                    }
                >
                    <Animated.Image
                    style={{
                    backgroundColor: 'red',
                    height: ImageWidth,
                    width: ImageWidth,
                    borderRadius: this.state.ImageRadius
                    }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        marginTop: 15,
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle
                    }}
                >
                    导师
                </Text>
            </View>
        );
    }

    _startAnimation = () => {
        console.log('执行了动画');
        Animated.timing(
            this.state.ImageWith,
            {
                toValue: ScreenUtils.width/5,
                duration: 100
            }
        ).start();

        Animated.timing(
            this.state.ImageRadius,
            {
                toValue: ScreenUtils.width/5/2,
                duration: 100
            }
        ).start();
    };
    _resetAnimation=()=>{
        console.log('执行了动画');
        Animated.timing(
            this.state.ImageWith,
            {
                toValue: ScreenUtils.width/5 - 20,
                duration: 100
            }
        ).start();
        Animated.timing(
            this.state.ImageRadius,
            {
                toValue: (ScreenUtils.width/5-20)/2,
                duration: 100
            }
        ).start();
    }

}

// MentorItemView.prototype = {
//     // image Url 直接传字符串即可 http/https 必传
//     clickItemAction: PropTypes.func.isRequired
//     // //加载失败显示的图片 require 形式 可选
//     // errImage: PropTypes.number,
//     // //预加载展示的图片  require 形式 可选
//     // defaultImage: PropTypes.number,
//     // //图片的回调事件 可选 此控件点击时候的回调
//     // onClickAction: PropTypes.func
// };
// const styles = StyleSheet.create({});
