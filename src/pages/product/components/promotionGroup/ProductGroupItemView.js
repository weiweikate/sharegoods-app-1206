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
import ProductApi from '../../api/ProductApi';
import { routePush } from '../../../../navigation/RouterMap';
import RouterMap from '../../../../navigation/RouterMap';
import bridge from '../../../../utils/bridge';

const { px2dp } = ScreenUtils;
const { isNoEmpty } = StringUtils;

@observer
export class TimeLabelText extends Component {
    state = {
        timeOutTime: ''
    };

    componentWillUnmount() {
        this.timeInterval && clearInterval(this.timeInterval);
    }

    timeAutorun = autorun(() => {
        const { endTime, endCallBack } = this.props;
        if (!isNoEmpty(endTime)) {
            return;
        }
        this.timeInterval && clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => {
            let timeOut = (endTime + 500) - new Date().getTime();
            if (timeOut <= 0) {
                timeOut = 0;
                this.timeInterval && clearInterval(this.timeInterval);
                endCallBack && endCallBack();
            }
            this.setState({
                timeOutTime: this.getDataText(timeOut)
            });
        }, 200);
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
        return <MRText style={stylesPerson.midTimeText}>{this.state.timeOutTime}</MRText>;
    }
}

/*
* 商详发起拼团的人item
* */

export class GroupPersonItem extends Component {

    requestGroupPerson = ({ groupId }) => {
        const { showGroupJoinView, itemData, close } = this.props;
        bridge.showLoading();
        ProductApi.promotion_group_joinUser({ groupId }).then((data) => {
            bridge.hiddenLoading();
            close && close();
            showGroupJoinView && showGroupJoinView({
                itemData,
                joinList: data.data
            });
        }).catch(e => {
            bridge.hiddenLoading();
            bridge.$toast(e.msg);
        });
    };

    render() {
        const { itemData, requestGroupList } = this.props;
        const { initiatorUserImg, initiatorUserName, surplusPerson, id, endTime } = itemData || {};
        return (
            <View style={[stylesPerson.container, this.props.style]}>
                <View style={stylesPerson.nameView}>
                    <UIImage style={stylesPerson.nameImg}
                             isAvatar={true}
                             source={{ uri: initiatorUserImg }}/>
                    <MRText style={stylesPerson.nameText}>{initiatorUserName}</MRText>
                </View>
                <NoMoreClick style={stylesPerson.rightView} onPress={() => {
                    this.requestGroupPerson({ groupId: id });
                }}>
                    <View>
                        <MRText style={stylesPerson.midNumText}>还差<MRText
                            style={{ color: DesignRule.textColor_redWarn }}>{surplusPerson}</MRText>人成团</MRText>
                        <MRText style={stylesPerson.midTimeText}>剩余<TimeLabelText endTime={endTime}
                                                                                  endCallBack={requestGroupList}/></MRText>
                    </View>
                    <LinearGradient style={stylesPerson.linearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={stylesPerson.linearText}>去凑团</MRText>
                    </LinearGradient>
                </NoMoreClick>
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
        width: 40, height: 40, borderRadius: 20, overflow: 'hidden'
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

/*
* 商详大家都在拼的商品item
* */
@observer
export class GroupProductItem extends Component {
    render() {
        const { image, goodsName, skuPrice, prodCode } = this.props.itemData;
        return (
            <NoMoreClick style={[stylesProduct.container, this.props.style]} onPress={() => {
                routePush(RouterMap.ProductDetailPage, { productCode: prodCode });
            }}>
                <UIImage style={stylesProduct.img}
                         borderRadius={5}
                         source={{ uri: image }}/>
                <MRText style={stylesProduct.nameText} numberOfLines={1}>{goodsName}</MRText>
                <View style={stylesProduct.bottomView}>
                    <MRText style={stylesProduct.bottomText} numberOfLines={1}>¥{skuPrice}</MRText>
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
