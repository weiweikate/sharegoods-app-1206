/**
 * @author xzm
 * @date 2018/11/23
 */

import React, { PureComponent } from 'react';
import {
  View,
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
const {px2dp} = ScreenUtils;
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text} from '../../../../components/ui'

export  default class CountDownView extends PureComponent {
  constructor(props) {
    super(props);

      this.date = Date.parse(new Date());
      if (this.date < this.props.endTime) {
          let seconds = parseInt((this.props.endTime - this.date) / 1000);
          this.state = {
              showCountDown:true,
              countDownStr: `剩余推广时间： ${this.timeFormat(seconds)}`,
          }
      }else {
          this.state = {
              showCountDown:false,
              countDownStr: ''
          }
      }
  }

    componentDidMount() {
        this.startTimer();
    }

    timeFormat(sec) {
        let days = Math.floor(sec / 24 / 60 / 60);
        let h = Math.floor(sec / 60 / 60 % 24);
        let m = Math.floor(sec / 60 % 60);
        let s = Math.floor(sec % 60);
        if(s < 10) {
            s = '0' + s;
        }
        if(m < 10) {
            m = '0' + m;
        }
        if(h < 10) {
            h = '0' + h;
        }
        return `${days}天${h}:${m}:${s}`;
    }



    startTimer = () => {
            this.date = Date.parse(new Date());
            if (this.date < this.props.endTime) {
                this.timer = setInterval(() => {
                    this.date = this.date + 1000;
                    if (this.date < this.props.endTime) {
                        let seconds = parseInt((this.props.endTime - this.date) / 1000);
                        this.setState({
                            showCountDown: true,
                            countDownStr: `剩余推广时间： ${this.timeFormat(seconds)}`,
                        });
                    } else {
                        this.setState({
                            showCountDown: false,

                        });
                        this.timer && clearTimeout(this.timer);
                    }
                }, 1000);
            }
    };

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }


    render(){

        if(this.state.showCountDown){
            return (
                <View style={{
                    width: ScreenUtils.width, height: px2dp(20), justifyContent: 'center',
                    alignItems: 'center', backgroundColor: DesignRule.mainColor
                }}>
                    <Text style={{ color: 'white', fontSize: px2dp(13), includeFontPadding: false }}>
                        {this.state.countDownStr}
                    </Text>
                </View>
            );
        }else {
            return <View/>
        }

  }
}



