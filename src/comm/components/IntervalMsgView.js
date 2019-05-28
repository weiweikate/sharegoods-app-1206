import React from 'react';
import { Animated, StyleSheet, Image, InteractionManager, Alert } from 'react-native';
import UIImage from '@mr/image-placeholder';
import NoMoreClick from '../../components/ui/NoMoreClick';
import ScreenUtils from '../../utils/ScreenUtils';
import { observable, action, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { MRText } from '../../components/ui';
import res from '../res';
import DesignRule from '../../constants/DesignRule';
import StringUtils from '../../utils/StringUtils';
import RouterMap, { navigate, backToHome } from '../../navigation/RouterMap';

const { white_go } = res.button;
const { headerHeight, px2dp } = ScreenUtils;
const maxTextWidth = px2dp(120);
const { isEmpty } = StringUtils;
const maxY = maxTextWidth + 15 + 50;

/*跳标全局数据*/
class IntervalMsgModel {
    @observable msgList = [];
    @observable pageType = undefined;
    @observable messageIndex = 0;

    @action setMsgData(content) {
        const { params, pageType } = content || {};
        const { floatMsgs } = params || {};
        /*
        * {
        * pageType
        * params floatMsgs
        *
        * }
        * */
        console.log(content);
        this.pageType = pageType;
        this.msgList = floatMsgs || [];
    }
}

const intervalMsgModel = new IntervalMsgModel();
export default intervalMsgModel;

/*跳标UI*/
@observer
export class IntervalMsgView extends React.Component {

    IntervalMsgModel = new IntervalMsgViewModel();

    componentDidMount() {
    }

    _onPress = (showItem) => {
        const { needForward, forwardType, keyCode } = showItem;
        if (!needForward || !forwardType) {
            return;
        }
        if (forwardType === IntervalMsgType.home) {
            backToHome();
        } else if (forwardType === RouterMap.alert) {
            Alert.alert('提示', '开启消息推送',
                [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {
                        text: '确定', onPress: () => {

                        }
                    }
                ]
            );
        } else {
            const router = IntervalMsgRouter[forwardType];
            if (router) {
                navigate(router, {
                    code: keyCode
                });
            } else {
                navigate('HtmlPage', {
                    uri: keyCode
                });
            }
        }
    };

    render() {
        const { translateX, opacity, showItem } = this.IntervalMsgModel;
        const { style } = this.props;
        const { headImg, content, needForward, type } = showItem;
        if (isEmpty(type)) {
            return null;
        }
        return (
            <Animated.View
                style={[styles.container, { ...style, opacity, transform: [{ translateX }] }]}>
                <NoMoreClick style={styles.btn} onPress={() => this._onPress(showItem)}>
                    <UIImage style={styles.image} source={{ uri: headImg }}
                             isAvatar={true}/>
                    <MRText style={styles.text}
                            numberOfLines={1}>{content || ''}</MRText>
                    {needForward && <Image style={styles.arrow} source={white_go}/>}
                </NoMoreClick>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', left: 15, top: headerHeight + 60
    },
    btn: {
        flexDirection: 'row', alignItems: 'center',
        height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.5)'
    },
    image: {
        marginRight: 5, overflow: 'hidden',
        width: 20, height: 20, borderRadius: 10
    },
    text: {
        marginRight: 3, maxWidth: maxTextWidth,
        fontSize: 10, color: DesignRule.white
    },
    arrow: {
        marginRight: 5.5,
        width: 10, height: 10
    }
});

/*跳标数据模型*/
class IntervalMsgViewModel {
    showItems = intervalMsgModel.msgList;
    needUpdate = false;
    isAnimated = false;
    /*
    *{
    * content  ush:发布了新动态
    * forwardType  22
    * headImg
    * keyCode show001
    * needForward true
    * type 9
    * userName
    *}
    * */
    @observable showItem = {};
    @observable translateX = new Animated.Value(-maxY);
    @observable opacity = new Animated.Value(1);

    @action startAnimated = () => {
        this.isAnimated = true;

        if (this.needUpdate) {
            this.needUpdate = false;
            intervalMsgModel.messageIndex = 0;
        }

        this.showItem = this.showItems[intervalMsgModel.messageIndex] || {};
        const { type } = this.showItem;
        if (isEmpty(type)) {
            this.isAnimated = false;
            return;
        }

        Animated.sequence([
            Animated.delay(5000),
            Animated.timing(
                this.translateX,
                { toValue: 0, duration: 500, useNativeDriver: true }
            ),
            Animated.delay(5000),
            Animated.timing(
                this.opacity,
                { toValue: 0, duration: 1000, useNativeDriver: true }
            )
        ]).start(
            () => {
                /*复原*/
                this.translateX = new Animated.Value(-maxY);
                this.opacity = new Animated.Value(1);
                /*循环,准备下一位贵宾*/
                intervalMsgModel.messageIndex++;
                this.startAnimated();
            }
        );
    };

    autorun = autorun(() => {
        /*有新数据*/
        this.showItems = intervalMsgModel.msgList || [];
        /*没有进行中的动画启动*/
        this.needUpdate = true;
        InteractionManager.runAfterInteractions(() => {
            !this.isAnimated && this.startAnimated();
        });
    });
}

const IntervalMsgType = {
    home: 1,      //首页
    alert: 21,      //弹框系统 开启通知

    userInfo: 2,   //个人资料
    setting: 3,      //账号安全
    mine: 4,     //我的
    address: 5,   //地址管理
    bankCard: 6,       //绑定银行卡
    mentor: 7,     //绑定顾问
    shopList: 12,      //拼店
    showList: 14,      //秀场推荐
    showReleaseNotes: 15,      //秀场发布动态
    productDetail: 19,      //商品详情
    orderDetail: 20,      //订单
    shopDetail: 23      //拼店店铺详情页

    // page: 8,      //新人专享
    // page: 9,      //免费兑换
    // page: 10,      //分享好友
    // page: 11,      //秒杀专场
    // page: 13,      //超品活动
    // page: 16,      //奖池
    // page: 17,      //发起拼团
    // page: 18,      //发起助力砍价
    // page: 22,      //秀场动态
};

const IntervalMsgRouter = {
    [IntervalMsgType.userInfo]: 'mine/userInformation/UserInformationPage',
    [IntervalMsgType.setting]: 'mine/setting/AccountSettingPage',
    [IntervalMsgType.mine]: 'mine/Mine',
    [IntervalMsgType.address]: 'mine/address/AddressManagerPage',
    [IntervalMsgType.bankCard]: 'mine/bankCard/AddBankCardPage',
    [IntervalMsgType.mentor]: 'mine/SetMentorPage',

    [IntervalMsgType.shopList]: 'spellShop/recommendSearch/RecommendPage',

    [IntervalMsgType.showList]: 'show/ShowListPage',
    [IntervalMsgType.showReleaseNotes]: 'show/ReleaseNotesPage',

    [IntervalMsgType.productDetail]: 'product/ProductDetailPage',
    [IntervalMsgType.orderDetail]: 'order/order/MyOrdersDetailPage',
    [IntervalMsgType.shopDetail]: 'spellShop/MyShop_RecruitPage'
};
