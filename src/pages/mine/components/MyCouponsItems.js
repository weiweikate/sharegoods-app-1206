/**
 * Created by xiangchen on 2018/7/23.
 */
import React, { Component } from 'react';
import {
    StyleSheet, View, ImageBackground,
    Text, TouchableOpacity, Image, Modal, TextInput, FlatList
} from 'react-native';
// import RefreshList from './../../../components/ui/RefreshList';
import ScreenUtils from '../../../utils/ScreenUtils';
import { formatDate } from '../../../utils/DateUtils';
import NoMessage from '../res/couponsImg/icon3_03.png';
import unactivatedBg from '../res/couponsImg/youhuiquan_bg_zhihui.png';
import usedBg from '../res/couponsImg/youhuiquan_bg_zhihui.png';
import unuesdBg from '../res/couponsImg/youhuiquan_bg_nor.png';
import tobeActive from '../res/couponsImg/youhuiquan_icon_daijihuo_nor.png';
import ActivedIcon from '../res/couponsImg/youhuiquan_icon_yishixiao_nor.png';
import usedRIcon from '../res/couponsImg/youhuiquan_icon_yishiyong_nor.png';
import plusIcon from '../res/couponsImg/youhuiquan_icon_jia_nor.png';
import jianIcon from '../res/couponsImg/youhuiquan_icon_jian_nor.png';
import API from '../../../api';
import UI from '../../../utils/bridge';
import { observer } from 'mobx-react';
import StringUtils from '../../../utils/StringUtils';
import user from '../../../model/user';
import { UIText, UIImage } from '../../../components/ui';

const { px2dp } = ScreenUtils;

@observer
export default class MyCouponsItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            pageStatus: this.props.pageStatus,
            refreshing: false,
            currentPage: 1,
            isEmpty: true,
            explainList: [],
            showDialogModal: false,
            tokenCoinNum: this.props.justOne
        };
    }

    fmtDate(obj) {
        return formatDate(obj, 'yyyy.MM.dd');
    }

    renderItem = ({ item, index }) => {

        // 优惠券状态 status  0-未使用 1-已使用 2-已失效 3-未激活
        let BG = item.status === 0 ? unuesdBg : (item.status === 3 ? unactivatedBg : usedBg);
        let BGR = item.status === 0 ? '' : (item.status === 3 ? tobeActive : (item.status == 1 ? usedRIcon : ActivedIcon));
        return (
            <TouchableOpacity style={{ backgroundColor: '#f7f7f7' }} onPress={() => this.clickItem(index, item)}>
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
                                                style={{ fontSize: 14, color: '#222222', marginBottom: 4 }}>￥</Text>
                                        </View>}
                                <View>
                                    <Text style={{
                                        fontSize: item.type === 4 ? 20 : 34,
                                        color: '#222222'
                                    }}>{item.value}</Text>
                                </View>
                                {
                                    item.type === 3 ?
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{ fontSize: 14, color: '#222222', marginBottom: 4 }}>折</Text>
                                        </View> : null}
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 15, color: '#222222' }}>{item.name} </Text>
                            <Text style={{
                                fontSize: 11,
                                color: '#999999',
                                marginTop: 6
                            }}>使用有效期：{item.timeStr}</Text>
                        </View>
                        <Image style={{ marginRight: 5, width: px2dp(70), height: px2dp(70) }} source={BGR}/>
                        {item.type === 99 ?
                            <UIText value={'x' + user.tokenCoin}
                                    style={{ marginRight: 15, marginTop: 15, fontSize: 14, color: '#222' }}/> : null}
                    </View>

                    <View style={{ height: px2dp(33), justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ fontSize: 11, color: '#999999' }}>{item.limit}</Text>
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
                            onChangeText={this._onChangeText}
                            onFocus={this._onFocus}
                            style={{
                                padding: 0,
                                paddingLeft: 5,
                                alignItems: 'center',
                                marginLeft: 5,
                                marginRight: 5,
                                borderColor: '#4D4D4D',
                                backgroundColor: 'white',
                                borderWidth: 1,
                                height: px2dp(24),
                                width: px2dp(136),
                                fontSize: px2dp(15)
                            }}>
                        </TextInput>
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
        // if (this.state.isEmpty) {
        //     return (
        //         <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
        //             <Text style={{ color: '#999999', fontSize: 15, marginTop: 15 }}>数据加载中...</Text>
        //         </View>
        //     )
        // } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={NoMessage} style={{ width: 110, height: 110, marginTop: 112 }}/>
                    <Text style={{ color: '#999999', fontSize: 15, marginTop: 15 }}>暂无优惠券</Text></View>
            );
        // }
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.viewData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.onLoadMore}
                    ListEmptyComponent={this._renderEmptyView}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
                {this.renderDialogModal()}
                {this.props.isgiveup ?
                    <View style={{
                        position: 'absolute',
                        bottom: 0, height: 48, borderTopColor: '#f7f7f7', borderTopWidth: 1
                    }}>
                        <TouchableOpacity style={{
                            width: ScreenUtils.width,
                            height: 48,
                            backgroundColor: '#ffffff',
                            borderStyle: 'solid'
                            , alignItems: 'center', justifyContent: 'center'
                        }}
                                          activeOpacity={0.5} onPress={this.props.giveupUse}>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 14,
                                color: '#666666'
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
        let arrData;
         if(this.state.currentPage==1){
             arrData = this.state.viewData || [];
         }
        arrData = this.state.viewData || [];
        if (!StringUtils.isEmpty(user.tokenCoin) && user.tokenCoin !== 0 && this.state.pageStatus === 0 && !this.props.fromOrder) {
            if (arrData.length > 0 && arrData[0].type == 99) {
                //不在重复显示一元券
            } else {
                arrData.push({
                    status: 0,
                    name: '可叠加使用',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '全品类：无金额门槛',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99 //以type=99表示1元券
                });
            }
        }
        dataList.map((item) => {
            arrData.push({
                id: item.id,
                status: item.status,
                name: item.name,
                timeStr: this.fmtDate(item.startTime) + '-' + this.fmtDate(item.outTime),
                value: item.type === 3 ? (item.value / 10) : (item.type === 4 ? '商品\n抵扣' : item.value),
                limit: this.parseCoupon(item),
                couponConfigId: item.couponConfigId,
                remarks: item.remarks,
                type: item.type
            });

        });
        this.setState({ viewData: arrData });

    };

    componentDidMount() {
        //网络请求，业务处理
        this.getDataFromNetwork();

    }

    getDataFromNetwork = () => {
        let status = this.state.pageStatus;
        /**

         "page": 1,
         "pageSize": 10,
         "productPriceIds": [
         {
           "priceId": 1,
           "productId": 1
         }
         */
        if (this.props.fromOrder && status == 0) {
            let arr = [];
            // ProductPriceIdPair=this.props.productIds;
            // priceId  productId
            let data = {
                priceId: this.props.productIds.orderProducts[0].priceId,
                productId: this.props.productIds.orderProducts[0].productId
            };

            arr.push(data);
            API.listAvailable({ page: this.state.currentPage, pageSize: 20, productPriceIds: arr }).then(res => {
                let data = res.data || {};
                let dataList = data.data || [];
                this.setState({isEmpty: false},this._renderEmptyView)
                this.parseData(dataList);
            }).catch(result => {
                if (result.code === 10009) {
                    this.props.nav.navigate('login/login/LoginPage', { callback: this.getDataFromNetwork });
                }
                UI.$toast(result.msg);
            });
        } else if (this.props.justOne && status == 0) {
            let arrData = [];
            if (!StringUtils.isEmpty(user.tokenCoin) && user.tokenCoin !== 0 && this.state.pageStatus === 0) {
                arrData.push({
                    status: 0,
                    name: '可叠加使用',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '全品类：无金额门槛',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99 //以type=99表示1元券
                });
            }
            this.setState({ viewData: arrData ,isEmpty:false},this._renderEmptyView);
        }
        else {
            API.userCouponList({
                page: this.state.currentPage,
                status,
                pageSize: 10
            }).then(result => {
                let data = result.data || {};
                let dataList = data.data || [];
                this.setState({isEmpty: false,},this._renderEmptyView)
                this.parseData(dataList);

            }).catch(result => {
                if (result.code === 10009) {
                    this.props.nav.navigate('login/login/LoginPage', { callback: this.getDataFromNetwork });
                }
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
        this.setState({
            // viewData: [],
            currentPage: 1
        }, () => {
            this.getDataFromNetwork();
        });

    };

    onLoadMore = () => {
        console.log('onLoadMore');
        let currentpage = this.state.currentPage + 1;
        this.setState({
            currentPage: currentpage
        }, () => {
            this.getDataFromNetwork();
        });

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
            backgroundColor: '#f7f7f7'
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
