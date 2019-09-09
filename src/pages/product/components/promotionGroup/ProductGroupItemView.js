/**
 * @author 陈阳君
 * @date on 2019/09/03
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import UIImage from '@mr/image-placeholder';
import { MRText } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import StringUtils from '../../../../utils/StringUtils';

const { px2dp } = ScreenUtils;
const { isNoEmpty } = StringUtils;

@observer
export class GroupPersonItem extends Component {

    state = {
        timeOutTime: ''
    };

    componentWillUnmount() {
        this.timeInterval && clearInterval(this.timeInterval);
    }

    timeAutorun = autorun(() => {
        const { nowTime, endTime } = this.props.itemData;
        if (!isNoEmpty(endTime)) {
            return;
        }
        this.timeInterval && clearInterval(this.timeInterval);
        if (isNoEmpty(nowTime) && isNoEmpty(endTime)) {
            let countdownDate = new Date().getTime() + ((endTime + 500) - nowTime);
            this.timeInterval = setInterval(() => {
                let timeOut = countdownDate - new Date().getTime();
                if (timeOut <= 0) {
                    timeOut = 0;
                    this.timeInterval && clearInterval(this.timeInterval);
                }
                this.setState({
                    timeOutTime: this.getDataText(timeOut)
                });
            }, 200);
        }
    });

    getDataText = (timeLeave) => {
        //天数
        let days = Math.floor(timeLeave / (24 * 3600 * 1000));
        //去除天数
        let leave1 = timeLeave % (24 * 3600 * 1000);
        //小时
        let hours = Math.floor(leave1 / (3600 * 1000));
        //去除小时
        let leave2 = leave1 % (3600 * 1000);
        //分钟
        let minutes = Math.floor(leave2 / (60 * 1000));
        //去除分钟
        let leave3 = leave2 % (60 * 1000);
        //秒
        let second = Math.floor(leave3 / 1000);
        //mill
        // let leave4 = Math.floor(leave3 % 1000 / 100);

        hours = days * 24 + hours;
        hours = hours >= 10 ? hours : hours === 0 ? '00' : `0${hours}`;
        minutes = minutes >= 10 ? minutes : minutes === 0 ? '00' : `0${minutes}`;
        second = second >= 10 ? second : second === 0 ? '00' : `0${second}`;

        return `${hours}:${minutes}:${second}`;
    };

    render() {
        const { initiatorUserImg, initiatorUserName, surplusPerson } = this.props.itemData || {};
        const { timeOutTime } = this.state;
        return (
            <View style={stylesPerson.container}>
                <View style={stylesPerson.nameView}>
                    <UIImage style={stylesPerson.nameImg}
                             borderRadius={20}
                             source={{ uri: initiatorUserImg }}/>
                    <MRText style={stylesPerson.nameText}>{initiatorUserName}</MRText>
                </View>
                <View style={stylesPerson.rightView}>
                    <View>
                        <MRText style={stylesPerson.midNumText}>还差<MRText
                            style={{ color: DesignRule.textColor_redWarn }}>{surplusPerson}</MRText>人成团</MRText>
                        <MRText style={stylesPerson.midTimeText}>剩余{timeOutTime}</MRText>
                    </View>
                    <LinearGradient style={stylesPerson.linearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={stylesPerson.linearText}>去凑团</MRText>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}

const stylesPerson = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 64
    },
    nameView: {
        flexDirection: 'row', alignItems: 'center',
        width: px2dp(157), marginLeft: 15
    },
    nameImg: {
        width: 40, height: 40
    },
    nameText: {
        flex: 1, paddingHorizontal: 10,
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },

    rightView: {
        flex: 1, marginRight: 15,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    midNumText: {
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    midTimeText: {
        fontSize: 12, color: DesignRule.textColor_instruction
    },

    linearGradient: {
        justifyContent: 'center', alignItems: 'center',
        height: 28, width: 64, borderRadius: 14
    },
    linearText: {
        fontSize: 14, color: 'white'
    }
});

@observer
export class GroupProductItem extends Component {
    render() {
        return (
            <NoMoreClick style={[stylesProduct.container, this.props.style]} onPress={() => {
            }}>
                <UIImage style={stylesProduct.img}
                         borderRadius={5}
                         source={{ uri: 'https://cdn.sharegoodsmall.com/sharegoods/cc49225d27ae4c35ac62b4fbe6718b55.png' }}/>
                <MRText style={stylesProduct.nameText} numberOfLines={1}>每日坚果商主每</MRText>
                <View style={stylesProduct.bottomView}>
                    <MRText style={stylesProduct.bottomText} numberOfLines={1}>¥233</MRText>
                    <LinearGradient style={stylesProduct.bottomBtn}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={stylesProduct.btnText}>抢购</MRText>
                    </LinearGradient>
                </View>
            </NoMoreClick>
        );
    }
}

const stylesProduct = StyleSheet.create({
    container: {
        width: px2dp(112),
        marginRight: 5, backgroundColor: 'white'
    },
    img: {
        width: px2dp(112), height: px2dp(112)
    },
    nameText: {
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    bottomView: {
        flexDirection: 'row', alignItems: 'center'
    },
    bottomText: {
        flex: 1, paddingLeft: 5,
        fontSize: 14, color: DesignRule.textColor_redWarn, fontWeight: '500'
    },
    bottomBtn: {
        justifyContent: 'center', alignItems: 'center', marginRight: 5,
        height: 16, width: 32, borderRadius: 8
    },
    btnText: {
        fontSize: 11, color: 'white'
    }
});
