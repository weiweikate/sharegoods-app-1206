import React from 'react';
import { Animated, StyleSheet, Image } from 'react-native';
import UIImage from '@mr/image-placeholder';
import NoMoreClick from '../../components/ui/NoMoreClick';
import ScreenUtils from '../../utils/ScreenUtils';
import { observable, action, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { MRText } from '../../components/ui';
import res from '../res';
import DesignRule from '../../constants/DesignRule';
import StringUtils from '../../utils/StringUtils';
import { navigate, backToHome, GoToTabItem} from '../../navigation/RouterMap';
import { track, trackEvent } from '../../utils/SensorsTrack';

const { white_go } = res.button;
const { headerHeight, width, px2dp } = ScreenUtils;
const maxTextWidth = width - (15 - 50) * 2;
const { isEmpty } = StringUtils;
const maxY = maxTextWidth + 15 + 50;

/*跳标全局数据*/
class IntervalMsgModel {
    @observable msgList = [];
    @observable pageType = undefined;
    @observable shopCode = undefined;

    @action setMsgData(content, shopCode) {
        const { params, pageType } = content || {};
        const { floatMsgs } = params || {};
        /*
        * {
        * pageType
        * params floatMsgs
        *
        * }
        * */
        this.pageType = pageType;
        this.shopCode = shopCode;
        if (pageType === IntervalType.shopDetail) {
            this.msgList = floatMsgs || [];
        } else {
            this.msgList = JSON.parse(floatMsgs) || [];
        }
        console.log(pageType, this.msgList);
    }
}

const intervalMsgModel = new IntervalMsgModel();
export default intervalMsgModel;

/*跳标UI*/
@observer
export class IntervalMsgView extends React.Component {

    IntervalMsgModel = new IntervalMsgViewModel();

    componentDidMount() {
        this.IntervalMsgModel.pageType = this.props.pageType;
        this.IntervalMsgModel.shopCode = this.props.shopCode;
    }

    _onPress = (showItem) => {
        const { needForward, forwardType, keyCode, content } = showItem;
        if (!needForward || !forwardType) {
            return;
        }
        IntervalMsgNavigate(forwardType, keyCode);

        track(trackEvent.SkipMarkClick, {
            belongsPage: this.IntervalMsgModel.pageType,
            pageAttributeCode: keyCode,
            skipMarkType: forwardType,
            skipMarkContent: content
        });
    };

    render() {
        const { translateX, opacity, showItem } = this.IntervalMsgModel;
        const { style } = this.props;
        const { headImg, content, needForward } = showItem;
        if (isEmpty(content)) {
            return null;
        }
        return (
            <Animated.View
                style={[styles.container, { ...style, opacity, transform: [{ translateX }] }]}>
                <NoMoreClick style={styles.btn} onPress={() => this._onPress(showItem)}>
                    <UIImage style={styles.image} source={{ uri: headImg }}
                             isAvatar={true}/>
                    <MRText style={[styles.text, { marginRight: needForward ? px2dp(4) : px2dp(7) }]}
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
        height: px2dp(22), borderRadius: px2dp(11), backgroundColor: 'rgba(0,0,0,0.6)'
    },
    image: {
        marginRight: px2dp(6), overflow: 'hidden',
        width: px2dp(22), height: px2dp(22), borderRadius: px2dp(11)
    },
    text: {
        maxWidth: maxTextWidth,
        fontSize: 10, color: DesignRule.white
    },
    arrow: {
        marginRight: px2dp(7),
        width: px2dp(4), height: px2dp(8)
    }
});

/*跳标数据模型*/
class IntervalMsgViewModel {
    showItems = [];
    messageIndex = 0;
    needUpdate = false;
    isAnimated = false;
    pageType = undefined;
    shopCode = undefined;
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
            this.messageIndex = 0;
        }

        if (this.messageIndex >= this.showItems.length) {
            this.isAnimated = false;
            return;
        }

        this.showItem = this.showItems[this.messageIndex] || {};
        const { content } = this.showItem;
        if (isEmpty(content)) {
            this.isAnimated = false;
            return;
        }

        Animated.sequence([
            Animated.delay(2000),
            Animated.timing(
                this.translateX,
                { toValue: 0, duration: 500, useNativeDriver: true }
            ),
            Animated.delay(5000),
            Animated.timing(
                this.opacity,
                { toValue: 0, duration: 1000, useNativeDriver: true }
            ),
            Animated.delay(3000)
        ]).start(
            () => {
                /*复原*/
                this.translateX = new Animated.Value(-maxY);
                this.opacity = new Animated.Value(1);
                /*循环,准备下一位贵宾*/
                this.messageIndex++;
                this.startAnimated();
            }
        );
    };

    autorun = autorun(() => {
        const list = intervalMsgModel.msgList;
        /*有当前页面类型的新数据*/
        if (list.length > 0 && intervalMsgModel.pageType === this.pageType) {
            //是店铺消息&&不是当前店铺页面的消息 不显示
            if (this.shopCode && this.shopCode !== intervalMsgModel.shopCode) {
                return;
            }
            //取新数据第一条匹配上一批消息 一样不显示
            if (this.showItems.length > 0) {
                const firstItem = list[0];
                const { keyCode } = firstItem || {};
                const filterList = this.showItems.filter((item) => {
                    return (item || {}).keyCode === keyCode;
                });
                if (filterList.length > 0) {
                    return;
                }
            }
            /*没有进行中的动画启动*/
            this.showItems = list;
            this.needUpdate = true;
            setTimeout(() => {
                !this.isAnimated && this.startAnimated();
            }, 500);
        }
    });
}

export const IntervalType = {
    home: 1,//首页
    productDetail: 2,//商品详情页
    xiuChang: 3,//秀场首页
    shopHome: 4,//拼店首页
    shopDetail: 5//拼店详情
};

export function IntervalMsgNavigate(forwardType, keyCode) {
    if (forwardType === IntervalMsgType.home) {
        backToHome();
    } else if (forwardType === IntervalMsgType.showList) {
        GoToTabItem(1)
    }  else if (forwardType === IntervalMsgType.alert) {
    }
    else {
        const router = IntervalMsgRouter[forwardType];
        if (router) {
            navigate(router, {
                productCode: keyCode,
                storeCode: keyCode,
                orderNo: keyCode,
                code: keyCode,
                id: keyCode,
                uri: keyCode
            });
        } else {
            // navigate('HtmlPage', {
            //     uri: keyCode
            // });
        }
    }
}

export const IntervalMsgType = {
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
    showDetail: 22,      //秀场动态
    richShowDetail: 25, //新秀场详情
    shopDetail: 23,     //拼店店铺详情页
    sign: 24, //签到
    mineShare: 10,      //分享好友
    web: 99 //网页
    /** 下面都是网页*/
    // page: 8,      //新人专享
    // page: 9,      //免费兑换
    // page: 11,      //秒杀专场
    // page: 13,      //超品活动
    // page: 16,      //奖池
    // page: 17,      //发起拼团
    // page: 18,      //发起助力砍价
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
    [IntervalMsgType.shopDetail]: 'spellShop/MyShop_RecruitPage',
    [IntervalMsgType.showDetail]: 'show/ShowDetailPage',
    [IntervalMsgType.richShowDetail]: 'show/ShowRichTextDetailPage',
    [IntervalMsgType.sign]: 'home/signIn/SignInPage',
    [IntervalMsgType.web]: 'HtmlPage',
    [IntervalMsgType.mineShare]: 'mine/InviteFriendsPage'
};
