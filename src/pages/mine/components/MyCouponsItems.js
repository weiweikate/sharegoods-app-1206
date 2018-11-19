/**
 * Created by xiangchen on 2018/7/23.
 */
import React, { Component } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    NativeModules
} from 'react-native';
// import RefreshList from './../../../components/ui/RefreshList';
import ScreenUtils from '../../../utils/ScreenUtils';
import { formatDate } from '../../../utils/DateUtils';
import NoMessage from '../res/couponsImg/coupons_no_data.png';
import usedBg from '../res/couponsImg/youhuiquan_bg_zhihui.png';
import unuesdBg from '../res/couponsImg/youhuiquan_bg_nor.png';
import tobeActive from '../res/couponsImg/youhuiquan_icon_daijihuo_nor.png';
import ActivedIcon from '../res/couponsImg/youhuiquan_icon_yishixiao_nor.png';
import usedRIcon from '../res/couponsImg/youhuiquan_icon_yishiyong_nor.png';
import limitIcon from '../res/couponsImg/youhuiquan_limit.png';
import plusIcon from '../res/couponsImg/youhuiquan_icon_jia_nor.png';
import jianIcon from '../res/couponsImg/youhuiquan_icon_jian_nor.png';
import API from '../../../api';
import UI from '../../../utils/bridge';
import { observer } from 'mobx-react';
import StringUtils from '../../../utils/StringUtils';
import user from '../../../model/user';
import { UIImage, UIText } from '../../../components/ui';
import DesignRule from 'DesignRule';
import { NavigationActions } from 'react-navigation';
import MineApi from '../api/MineApi';

const { px2dp } = ScreenUtils;

@observer
export default class MyCouponsItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            pageStatus: this.props.pageStatus,
            isEmpty: true,
            explainList: [],
            showDialogModal: false,
            tokenCoinNum: this.props.justOne,
            isFirstLoad: true
        };
        this.currentPage = 0;
        this.isLoadMore = false;
        this.isEnd = false;
        // setTimeout(() => this.onRefresh(), 10);
    }

    componentDidMount() {
        this.onRefresh();
    }

    fmtDate(obj) {
        return formatDate(obj, 'yyyy.MM.dd');
    }


    renderItem = ({ item, index }) => {
        // 优惠券状态 status  0-未使用 1-已使用 2-已失效 3-未激活
        let BG = item.status === 0 && !item.levelimit ? unuesdBg : usedBg;
        let BGR = item.status === 3 ? tobeActive : (item.status === 0 ? (item.levelimit ? limitIcon : '') : (item.status == 1 ? usedRIcon : ActivedIcon));
        return (
            <TouchableOpacity style={{ backgroundColor: DesignRule.bgColor }}
                              onPress={() => this.clickItem(index, item)}>
                <ImageBackground style={{
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(109),
                    margin: 2
                }} source={BG} resizeMode='stretch'>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: px2dp(73) }}>
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: px2dp(80)
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    item.type === 3 || item.type === 4 ? null :
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: DesignRule.textColor_mainTitle,
                                                    marginBottom: 4
                                                }}>￥</Text>
                                        </View>}
                                <View>
                                    <Text style={{
                                        fontSize: item.type === 4 ? 20 : 34,
                                        color: DesignRule.textColor_mainTitle
                                    }}>{item.value}</Text>
                                </View>
                                {
                                    item.type === 3 ?
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: DesignRule.textColor_mainTitle,
                                                    marginBottom: 4
                                                }}>折</Text>
                                        </View> : null}
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}>
                                {item.name}{item.type !== 99 ? null : <UIText value={'（可叠加使用）'} style={{
                                fontSize: 11,
                                color: DesignRule.textColor_instruction
                            }}/>}
                            </Text>
                            <Text style={{
                                fontSize: 11,
                                color: DesignRule.textColor_instruction,
                                marginTop: 6
                            }}>使用有效期：{item.timeStr}</Text>
                        </View>
                        <Image style={{ marginRight: 5, width: px2dp(70), height: px2dp(70) }} source={BGR}/>
                        {item.type === 99 ?
                            <UIText value={'x' + user.tokenCoin}
                                    style={{
                                        marginRight: 15,
                                        marginTop: 15,
                                        fontSize: 14,
                                        color: DesignRule.textColor_mainTitle
                                    }}/> : null}
                    </View>

                    <View style={{ height: px2dp(33), justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction }}>{item.limit}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };
    onRequestClose = () => {
        this.setState({ showDialogModal: false });
    };

    renderDialogModal() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={() => this.onRequestClose()}
                visible={this.state.showDialogModal}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }

    renderContent = () => {
        return (
            <View style={{
                marginRight: px2dp(44),
                width: ScreenUtils.width - px2dp(88),
                marginLeft: px2dp(44),
                height: px2dp(165),
                backgroundColor: '#FCFCFC',
                borderRadius: 8,
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        marginTop: px2dp(20),
                        width: px2dp(123),
                        height: px2dp(24),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: px2dp(17), color: 'black' }}>请选择券数</Text>
                    </View>

                    <View style={{
                        marginTop: px2dp(24),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UIImage source={jianIcon} style={{
                            width: px2dp(24),
                            height: px2dp(24),
                            marginLeft: px2dp(39)
                        }} resizeMode={'contain'} onPress={this.reduceTokenCoin}/>
                        <TextInput

                            keyboardType={'numeric'}
                            underlineColorAndroid='transparent'
                            autoFocus={true}
                            defaultValue={'' + (this.state.tokenCoinNum < user.tokenCoin ? this.state.tokenCoinNum : user.tokenCoin)}
                            value={'' + this.state.tokenCoinNum}
                            onChangeText={this._onChangeText}
                            onFocus={this._onFocus}
                            style={{
                                padding: 0,
                                paddingLeft: 5,
                                alignItems: 'center',
                                marginLeft: 5,
                                marginRight: 5,
                                borderColor: DesignRule.textColor_placeholder,
                                backgroundColor: DesignRule.white,
                                borderWidth: 1,
                                height: px2dp(24),
                                width: px2dp(136),
                                fontSize: px2dp(15)
                            }}/>
                        <UIImage source={plusIcon} style={{
                            width: px2dp(24),
                            height: px2dp(24),
                            marginRight: px2dp(39)
                        }} onPress={this.plusTokenCoin}/>
                    </View>
                </View>

                <View style={{ width: '100%', height: 0.5, backgroundColor: 'grey' }}/>
                <View style={{ height: px2dp(43), flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                      onPress={this.quitTokenCoin}>
                        <Text style={{ color: '#0076FF', fontSize: px2dp(17) }}>取消</Text>
                    </TouchableOpacity>
                    <View style={{ height: '100%', width: 0.5, backgroundColor: 'grey' }}/>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                      onPress={this.commitTokenCoin}>
                        <Text style={{ color: '#0076FF', fontSize: px2dp(17) }}>确定</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    };
    quitTokenCoin = () => {
        this.setState({ showDialogModal: false });
    };
    commitTokenCoin = () => {
        this.props.useCoupons(this.state.tokenCoinNum);
    };
    reduceTokenCoin = () => {
        let num = this.state.tokenCoinNum;
        if (num >= 1) {
            this.setState({ tokenCoinNum: (num - 1) });
        }
    };
    plusTokenCoin = () => {
        let num = this.state.tokenCoinNum;
        if (num <= (user.tokenCoin - 1)) {
            this.setState({ tokenCoinNum: (num + 1) });
        }
    };
    _onChangeText = (num) => {
        console.log('coupons', num);
        if ((num >= 0) && (num <= user.tokenCoin)) {
            this.setState({ tokenCoinNum: num });
        }
        if (num == '') {
            this.setState({ tokenCoinNum: 0 });
        }
        if (parseInt(num) > user.tokenCoin) {
            NativeModules.commModule.toast(`最多选择${user.tokenCoin}张!`);
            this.setState({ tokenCoinNum: user.tokenCoin });
        }
    };
    _onFocus = () => {
        let nums = (this.state.tokenCoinNum < user.tokenCoin) ? this.state.tokenCoinNum : user.tokenCoin;
        this.setState({
            tokenCoinNum: parseInt(nums)
        });
    };
    _keyExtractor = (item, index) => index;
    // 空布局
    _renderEmptyView = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={NoMessage} style={{ width: 110, height: 110, marginTop: 112 }}/>
                <Text style={{ color: DesignRule.textColor_instruction, fontSize: 15, marginTop: 11 }}>还没有优惠券哦</Text>
                <Text style={{ color: DesignRule.textColor_instruction, fontSize: 12, marginTop: 3 }}>快去商城逛逛吧</Text>
                <TouchableOpacity
                    onPress={() => {
                        this._gotoLookAround();
                    }}>
                    <View style={{
                        marginTop: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: DesignRule.mainColor,
                        borderWidth: 1,
                        borderRadius: 25,
                        width: 150,
                        height: 50
                    }}>
                        <Text style={{
                            color: DesignRule.mainColor,
                            fontSize: 17
                        }}>
                            去逛逛
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _gotoLookAround = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Tab'
                })
            ]
        });
        this.props.nav.dispatch(resetAction);
    };

    render() {
        console.log('this.state.viewDat' + this.state.viewData.length);
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.viewData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={10}
                    onEndReached={() => this.onLoadMore()}
                    ListEmptyComponent={this._renderEmptyView}
                    refreshing={false}
                    onRefresh={this.onRefresh}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                />
                {this.renderDialogModal()}
                {this.props.isgiveup ?
                    <View style={{
                        position: 'absolute',
                        bottom: 0, height: 48, borderTopColor: DesignRule.bgColor, borderTopWidth: 1
                    }}>
                        <TouchableOpacity style={{
                            width: ScreenUtils.width,
                            height: 48,
                            backgroundColor: 'white',
                            borderStyle: 'solid'
                            , alignItems: 'center', justifyContent: 'center'
                        }} activeOpacity={0.5} onPress={this.props.giveupUse}>
                            <Text style={{
                                fontSize: 14,
                                color: DesignRule.textColor_secondTitle
                            }}>放弃使用优惠券</Text>
                        </TouchableOpacity></View> : null}

            </View>
        );
    }

    /*
        1.单品类 标注品类 例如，一级品类，二级品类，三级分类
        例如：限数码家电分类可用，限美容美妆分类可用，限手机分类可用，
        2、多品类 标注品类，例如，限指定分类商品可用
        3、单产品、限iphone手机商品可用（产品名称，名称过长则超过6个字后...限iphone手机...商品可用）
        4、多产品、则直接显示，限指定商品可使用
        5、产品+分类的情况下，则显示，限指定商品可使用
    * */
    parseCoupon = (item) => {
        let products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
        let result = null;
        if (products.length) {
            if ((cat1.length || cat2.length || cat3.length)) {
                return '限商品：限指定商品可使用';
            }
            if (products.length > 1) {
                return '限商品：限指定商品可使用';
            }
            if (products.length === 1) {
                return `限商品：限${products[0]}可用`;
            }
        }
        else if ((cat1.length + cat2.length + cat3.length) === 1) {
            result = [...cat1, ...cat2, ...cat3];
            return `限品类：限${result[0]}品类可用`;
        }
        else if ((cat1.length + cat2.length + cat3.length) > 1) {
            return `限品类：限指定品类商品可用`;
        } else {
            return '全品类：全场通用券';
        }
    };
    parseData = (dataList) => {

        let arrData = [];
        if (this.currentPage === 1) {//refresh
            if (!StringUtils.isEmpty(user.tokenCoin) && user.tokenCoin !== 0 && this.state.pageStatus === 0 && !this.props.fromOrder) {
                arrData.push({
                    status: 0,
                    name: '1元现金券',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '全品类：无金额门槛',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99, //以type=99表示1元券
                    levelimit: false
                });
            }
            dataList.map((item) => {
                arrData.push({
                    id: item.id,
                    status: item.status,
                    name: item.name,
                    timeStr: this.fmtDate(item.startTime) + '-' + this.fmtDate(item.expireTime),
                    value: item.type === 3 ? (item.value / 10) : (item.type === 4 ? '商品\n抵扣' : item.value),
                    limit: this.parseCoupon(item),
                    couponConfigId: item.couponConfigId,
                    remarks: item.remarks,
                    type: item.type,
                    levelimit: item.levels ? (item.levels.indexOf(user.levelId) !== -1 ? false : true) : false
                });
            });
            this.setState({ viewData: arrData });
        } else {//more
            dataList.map((item) => {
                arrData.push({
                    id: item.id,
                    status: item.status,
                    name: item.name,
                    timeStr: this.fmtDate(item.startTime) + '-' + this.fmtDate(item.expireTime),
                    value: item.type === 3 ? (item.value / 10) : (item.type === 4 ? '商品\n抵扣' : item.value),
                    limit: this.parseCoupon(item),
                    couponConfigId: item.couponConfigId,
                    remarks: item.remarks,
                    type: item.type,
                    levelimit: item.levels ? (item.levels.indexOf(user.levelId) !== -1 ? false : true) : false
                });
            });
            this.setState({ viewData: this.state.viewData.concat(arrData) });

        }

    };

    // 1表示刷新，2代表加载
    getDataFromNetwork = () => {
        let status = this.state.pageStatus;
        if (this.props.fromOrder && status == 0) {
            let arr = [];
            // ProductPriceIdPair=this.props.productIds;
            // priceId  productId
            this.props.orderParam.orderProducts.map((item, index) => {
                arr.push({
                    priceId: item.priceId,
                    productId: item.productId,
                    amount: item.num
                });
            });
            this.isLoadMore = true;
            API.listAvailable({ page: this.currentPage, pageSize: 10, productPriceIds: arr }).then(res => {
                this.setState({
                    isFirstLoad: false
                });
                let data = res.data || {};
                let dataList = data.data || [];
                console.log('dataList');
                this.isLoadMore = false;
                this.parseData(dataList);
                if (dataList.length === 0) {
                    this.isEnd = true;
                    return;
                }

            }).catch(result => {
                this.setState({
                    isFirstLoad: false
                });
                this.isLoadMore = false;
                UI.$toast(result.msg);
            });
        } else if (this.props.justOne && status == 0) {
            let arrData = [];
            if (!StringUtils.isEmpty(user.tokenCoin) && user.tokenCoin !== 0 && status === 0) {
                arrData.push({
                    status: 0,
                    name: '1元现金券',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '全品类：无金额门槛',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99,//以type=99表示1元券
                    levelimit: false
                });
            }
            this.setState({ viewData: arrData });
            this.isEnd = true;
            return;
        }
        else {
            API.userCouponList({
                page: this.currentPage,
                status,
                pageSize: 10
            }).then(result => {
                this.setState({
                    isFirstLoad: false
                });
                let data = result.data || {};
                let dataList = data.data || [];
                this.isLoadMore = false;
                this.parseData(dataList);
                if (dataList.length === 0) {
                    this.isEnd = true;
                    return;
                }
                // if (dataList.length === 0&&!StringUtils.isEmpty(user.tokenCoin) && user.tokenCoin !== 0 ) {
                //     this.isEnd = true;
                //     return;
                // }

            }).catch(result => {
                this.setState({
                    isFirstLoad: false
                });
                this.isLoadMore = false;
                UI.$toast(result.msg);
            });
        }
    };

    //当父组件Tab改变的时候让子组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTab < 8) {
            console.log(nextProps.selectTab + '=======================');
        }
    }

    onLoadNumber = () => {
        this.props.onLoadNumber && this.props.onLoadTabNumber();
    };

    onRefresh = () => {
        console.log('refresh');
        this.isEnd = false;
        this.currentPage = 1;
        this.getUserInfo();
        this.getDataFromNetwork();
    };

    getUserInfo() {
        MineApi.getUser().then(res => {
            let data = res.data;
            user.saveUserInfo(data);
        }).catch(err => {
            console.log(err);
        });
    }

    onLoadMore = () => {
        console.log('onLoadMore', this.isEnd);
        if (!this.isLoadMore && !this.isEnd && !this.state.isFirstLoad) {
            this.currentPage++;
            this.getDataFromNetwork();
        }
    };

    clickItem = (index, item) => {
        // 优惠券状态 status  0-未使用 1-已使用 2-已失效 3-未激活
        // 跳转时type = 99 表示一元券
        // if (item.type === 99) {
        //     // 一元券，弹出选择数量框
        //     this.setModalVisible(true);
        //     return;
        // }
        if (this.props.fromOrder) {
            this.props.useCoupons(item);
        } else if (this.props.justOne) {
            this.setState({ showDialogModal: true });
        } else {
            this.props.nav.navigate('mine/coupons/CouponsDetailPage', { item: item });
            // if (index == 0) {
            //     this.setState({ showDialogModal: true });
            // }
        }
    };
}

const styles = StyleSheet.create(
    {
        container: {
            paddingTop: 15,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: DesignRule.bgColor
        },
        imgBg: {
            width: px2dp(345),
            height: px2dp(110),
            marginBottom: 10
        },
        couponHeader: {
            width: px2dp(105),
            alignItems: 'center'
        },
        modalStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
        }
    }
);
