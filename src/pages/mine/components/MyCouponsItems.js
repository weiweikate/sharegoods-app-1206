/**
 * Created by xiangchen on 2018/7/23.
 */
import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, Image } from 'react-native';
import RefreshList from './../../../components/ui/RefreshList';
import ScreenUtils from '../../../utils/ScreenUtils';
import { formatDate } from '../../../utils/DateUtils';
import NoMessage from '../res/couponsImg/icon3_03.png';
import unactivatedBg from '../res/couponsImg/youhuiquan_bg_zhihui.png';
import usedBg from '../res/couponsImg/youhuiquan_bg_zhihui.png';
import unuesdBg from '../res/couponsImg/youhuiquan_bg_nor.png';
import tobeActive from '../res/couponsImg/youhuiquan_icon_daijihuo_nor.png';
import ActivedIcon from '../res/couponsImg/youhuiquan_icon_yishixiao_nor.png';
import usedRIcon from '../res/couponsImg/youhuiquan_icon_yishiyong_nor.png';

import API from '../../../api';
import UI from '../../../utils/bridge';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;

@observer
export default class MyCouponsItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            pageStatus: this.props.pageStatus,
            isEmpty: true,
            currentPage: 1,
            explainList: []
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
                                <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                    <Text style={{ fontSize: 8, color: '#222222', marginBottom: 2 }}>￥</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 20, color: '#222222' }}>{item.value}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                            <Text style={{ fontSize: 15, color: '#222222' }}>{item.name} </Text>
                            <Text style={{
                                fontSize: 11,
                                color: '#999999',
                                marginTop: 5
                            }}>使用有效期：{this.fmtDate(item.startTime)}-{this.fmtDate(item.outTime)}</Text>
                        </View>
                        <Image style={{ marginRight: 5, width: px2dp(70), height: px2dp(70) }} source={BGR}/>
                    </View>

                    <View style={{ height: px2dp(33), justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ fontSize: 11, color: '#999999' }}>{item.limit}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <RefreshList
                    style={{ backgroundColor: '#f7f7f7' }}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    emptyTip={'暂无优惠券！'}
                    emptyIcon={NoMessage}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    isHideFooter={true}
                />
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
            return '';
        }
    };
    parseData = (dataList) => {
        let arrData = [];
        let explainList = [];
        dataList.map((item) => {
            switch (item.status) {
                case 0:
                    explainList = ['', '', '', ''];
                    break;
                case 1:
                    explainList = ['已', '使', '用'];
                    break;
                case 2:
                    explainList = ['已', '失', '效'];
                    break;
                case 3:
                    explainList = ['未', '激', '活'];
                    break;
            }

            arrData.push({
                id: item.id,
                status: item.status,
                name: item.name,
                startTime: item.startTime,
                outTime: item.expireTime,
                value: item.value,
                useConditions: item.useConditions,
                limit: this.parseCoupon(item),
                discountCouponId: '',
                explainList: explainList,
                remarks: item.remarks
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
        let page = this.state.currentPage || 1;
        API.userCouponList({
            page,
            status,
            pageSize: 20
        }).then(result => {
            let data = result.data || {};
            let dataList = data.data || [];
            this.parseData(dataList);

        }).catch(result => {
            if (result.code === 10009) {
                this.props.nav.navigate('login/login/LoginPage', { callback: this.getDataFromNetwork });
            }
            UI.$toast(result.msg);
        });

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
        this.setState({
            currentPage: 1
        }, () => {
            this.getDataFromNetwork();
        });

    };

    onLoadMore = (page) => {
        this.setState({
            currentPage: this.state.currentPage + 1
        }, () => {
            this.getDataFromNetwork();
        });

    };

    clickItem = (index, item) => {
        // 优惠券状态 status  0-未使用 1-已使用 2-已失效 3-未激活
        this.props.nav.navigate('mine/coupons/CouponsDetailPage', { item: item });
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
        }
    }
);
