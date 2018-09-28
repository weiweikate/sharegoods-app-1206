/**
 * Created by xiangchen on 2018/8/6.
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ColorUtil from '../../../../utils/ColorUtil';

export default class ProgressBarView extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {

        return (
            <View style={{
                width: ScreenUtils.width / 2 - 40,
                height: 12,
                borderRadius: 6,
                backgroundColor: 'rgba(230, 0, 18, 0.3)'
                , justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5
            }}>
                <View style={{
                    width: 0.5 * (ScreenUtils.width / 2 - 40),
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: ColorUtil.Color_d51243,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    position: 'absolute'
                }}>

                </View>
                {/*<Text style={{ fontSize: 11, marginLeft: 5 }}>{this.state.nav < 1 ? `已抢${this.state.num}件` : ''}</Text>*/}
                <Text style={{ fontSize: 11, marginLeft: 5,color:ColorUtil.Color_ffffff }}>
                    已抢10件
                </Text>
                {/*<Text style={{*/}
                    {/*fontSize: 11,*/}
                    {/*marginRight: 5*/}
                {/*}}>{this.state.nav < 1 ? `${this.state.nav * 100}%` : '已售完'}</Text>*/}
                <Text style={{
                    fontSize: 11,
                    marginRight: 5,
                    color:ColorUtil.Color_ffffff
                }}>50%</Text>

            </View>
        );
    }
}
