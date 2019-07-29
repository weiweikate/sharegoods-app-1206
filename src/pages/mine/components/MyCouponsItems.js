import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MRText as Text } from '../../../components/ui';
import Modal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DateUtils from '../../../utils/DateUtils';
import API from '../../../api';
import bridge from '../../../utils/bridge';
import { observer } from 'mobx-react';
import StringUtils from '../../../utils/StringUtils';
import user from '../../../model/user';
import DesignRule from '../../../constants/DesignRule';
import MineApi from '../api/MineApi';
import res from '../res';
import couponsModel from '../model/CouponsModel';
import CouponExplainItem from './CouponExplainItem';
import CouponNormalItem from './CouponNormalItem';
import RouterMap, { backToHome, routePush } from '../../../navigation/RouterMap';

const NoMessage = res.placeholder.noCollect;
// const plusIcon = res.couponsImg.youhuiquan_icon_jia_nor;
// const jianIcon = res.couponsImg.youhuiquan_icon_jian_nor;

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
            isFirstLoad: true,
            isLoadMore: false,
            isEnd: false,
            invokeData:{},
            canInvoke:true
        };
        this.currentPage = 0;
        this.addData = true;
        this.dataSel = {};
    }

    componentDidMount() {
        this.onRefresh();
    }

    renderItem = ({ item, index }) => {
        // 优惠券状态 status  0-未使用 1-已使用 2-已失效 3-未激活
        if (item.remarks) {
            return (
                <CouponExplainItem item={item} index={index} toExtendData={() => this.toExtendData(item)}
                                   pickUpData={() => this.pickUpData(item)}
                                   clickItem={() => this.clickItem(index, item)}
                                   onActivity={(item)=>{this.canInvoke(item)}}
                />
            );
        } else {
            return (
                <CouponNormalItem item={item} index={index} clickItem={() => this.clickItem(index, item)}
                                  onActivity={(item)=>{this.canInvoke(item)}}
                />
            );
        }
    };
    onRequestClose = () => {
        this.setState({ showDialogModal: false, invokeData:{}});
    };

    canInvoke=(item)=>{
        API.checkCanInvoke({userCouponCode:item.code || ''})
            .then(res=>{
                this.setState({
                    showDialogModal: true,
                    canInvoke:true,
                    invokeData:item
                });
            }).catch(error=>{
            this.setState({
                showDialogModal: true,
                canInvoke:false,
                invokeData:item
            });
        });
    }

    renderDialogModal=()=> {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={() => this.onRequestClose()}
                visible={this.state.showDialogModal}>
                <View style={styles.modalStyle}>
                    {this.renderModalContent()}
                </View>
            </Modal>
        );
    }

    renderModalContent = () => {
        const {invokeData,canInvoke} = this.state;
        console.log('time',DateUtils.getDateDiff(invokeData.startTime))
        let time = invokeData.startTime ? DateUtils.getDateDiff(invokeData.startTime) : '';
        return (
            <View style={styles.contentStyle}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginHorizontal:16 }}>
                    <Text style={{fontSize:17}}>激活兑换券</Text>
                    {canInvoke ?
                        <Text style={{fontSize:13,textAlign:'center'}}>现手动激活此券后，此券有效期为 {time}，确定要激活吗？</Text> :
                        <Text style={{fontSize:13,textAlign:'center'}}>不要贪心呦，一次只能激活1张，先去使用才能再次激活呦</Text>
                    }
                </View>
                <View style={{ width: '100%', height: 0.5, backgroundColor: DesignRule.textColor_placeholder }}/>
                <View style={{ height: px2dp(43), flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                      onPress={this.quitTokenCoin}>
                        <Text style={{ color: '#0076FF', fontSize: px2dp(17) }} allowFontScaling={false}>取消</Text>
                    </TouchableOpacity>
                    <View style={{ height: '100%', width: 0.5, backgroundColor: DesignRule.textColor_placeholder }}/>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                                      onPress={() => this.commitTokenCoin(invokeData)}>
                        <Text style={{color: '#0076FF', fontSize: px2dp(17)}} allowFontScaling={false}>
                            {canInvoke ? '确定' : '去使用'}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    };
    quitTokenCoin = () => {
        this.setState({ showDialogModal: false,invokeData:{} });
    };
    commitTokenCoin = () => {
        const {invokeData,canInvoke} = this.state;
        console.log('canInvoke',canInvoke)
        if(canInvoke) {
            this.setState({showDialogModal: false}, () => {
                API.invokeCoupons({userCouponCode: invokeData.code || ''}).then(res => {
                    bridge.$toast('激活成功');
                    this.onRefresh();
                }).catch(err => {
                    bridge.$toast('激活失败');
                });
            });
        }else {
            this.setState({showDialogModal: false}, () => {
                this.clickItem(0, invokeData);
            });
        }
    };


    _keyExtractor = (item, index) => index;
    // 空布局
    _renderEmptyView = () => {
        if (this.state.isFirstLoad) {
            return (
                <View style={styles.footer_container}>
                    <ActivityIndicator size="small" color={DesignRule.mainColor} style={{ marginRight: 6 }}/>
                    <Text style={styles.footer_text}>加载中…</Text>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={NoMessage} style={{ marginTop: 101 }}/>
                    <Text style={{ color: DesignRule.textColor_instruction, fontSize: 15, marginTop: 11 }}
                          allowFontScaling={false}>还没有优惠券哦</Text>
                    <Text style={{ color: DesignRule.textColor_instruction, fontSize: 12, marginTop: 3 }}
                          allowFontScaling={false}>快去商城逛逛吧</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this._gotoLookAround();
                        }}>
                        <View style={styles.guangStyle}>
                            <Text style={{
                                color: DesignRule.mainColor,
                                fontSize: 15
                            }} allowFontScaling={false}>
                                去逛逛
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

    };

    _footer = () => {
        if (this.state.isFirstLoad || !this.state.viewData || (this.state.viewData && this.state.viewData.length === 0)) {
            return null;
        }
        return (<View style={styles.footer}>
            <ActivityIndicator
                animating={this.state.isLoadMore ? false : (this.state.isEnd ? false : true)}
                size={'small'}
                color={DesignRule.mainColor}/>
            <Text style={styles.text}
                  allowFontScaling={false}>{this.state.isEnd ? '我也是有底线的~' : '加载更多中...'}</Text>
        </View>);
    };
    toExtendData = (item) => {
        let index = this.state.viewData.indexOf(item);
        let viewData = this.state.viewData;
        viewData[index].tobeextend = false;
        this.setState({ viewData: viewData });
    };
    pickUpData = (item) => {
        let index = this.state.viewData.indexOf(item);
        let viewData = this.state.viewData;
        viewData[index].tobeextend = true;
        this.setState({ viewData: viewData });

    };

    _gotoLookAround = () => {
        backToHome();
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.viewData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => this.onLoadMore()}
                    ListFooterComponent={this._footer}
                    ListEmptyComponent={this._renderEmptyView}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    refreshControl={<RefreshControl refreshing={false}
                                                    onRefresh={() => this.onRefresh(this.dataSel)}
                                                    colors={[DesignRule.mainColor]}/>}
                />
                {this.renderDialogModal()}
                {this.props.isgiveup ?
                    <View style={{
                        position: 'absolute',
                        bottom: 0, height: 48, borderTopColor: DesignRule.bgColor, borderTopWidth: 1
                    }}>
                        <TouchableOpacity style={styles.giveUpTouStyle} activeOpacity={1} onPress={() => {
                            bridge.showLoading('加载中');
                            this.props.giveupUse();
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: DesignRule.textColor_secondTitle
                            }} allowFontScaling={false}>放弃使用优惠券</Text>
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
        6。如果产品是周期券，直接返回'限指定商品可使用'
    * */
    parseCoupon = (item) => {
        let products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
        let result = null;
        if (item.type === 5) {
            return '限指定商品可用';
        }
        if (products.length) {
            if ((cat1.length || cat2.length || cat3.length)) {
                return '限指定商品可用';
            }
            if (products.length > 1) {
                return '限指定商品可用';
            }
            if (products.length === 1) {
                let productStr = products[0];
                if (productStr.length > 15) {
                    productStr = productStr.substring(0, 15) + '...';
                }
                return `限${productStr}商品可用`;
            }
        } else if ((cat1.length + cat2.length + cat3.length) === 1) {
            result = [...cat1, ...cat2, ...cat3];
            return `限${result[0]}品类可用`;
        } else if ((cat1.length + cat2.length + cat3.length) > 1) {
            return '限指定品类商品可用';
        } else {
            return '全场通用券（特殊商品除外）';
        }
    };
    parseData = (dataList) => {
        let arrData = [];
        console.log('parseData', this.dataSel, couponsModel.params);
        if (this.currentPage === 1) {//refresh
            if (!StringUtils.isEmpty(user.tokenCoin)
                && (user.tokenCoin !== 0)
                && this.state.pageStatus === 0
                && !this.props.fromOrder
                && !couponsModel.params.type) {
                arrData.push({
                    status: 0,
                    name: '1元现金券',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '无金额门槛\n任意商品可用\n可叠加使用',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99, //以type=99表示1元券
                    levelimit: false,
                    redirectType: 0,
                    redirectUrl: null
                });
            }
            if (!this.props.fromOrder && ((couponsModel.params.type || 0) > 6) || (!this.props.fromOrder && couponsModel.params.type === null)) {
                API.queryCoupons({
                    status: this.state.pageStatus
                }).then(result => {
                    let data = result.data || [];
                    data.forEach((item) => {
                        arrData.push({
                            status: item.status,
                            name: item.name,
                            timeStr: '使用有效期：敬请期待',
                            value: item.type === 11 ? item.value : '拼店',
                            limit: item.type === 11 ? '靓号代金券' : '全场通用券（特殊商品除外）',
                            remarks: item.remarks,
                            type: item.type, //以type=99表示1元券
                            levelimit: false,
                            count: item.number || 0,
                            redirectType: item.type === 11 ? 0 : item.redirectType,
                            redirectUrl: item.type === 11 ? null : item.redirectUrl,
                            canInvoke: item.canInvoke || false,         //是不是可以展示 激活按钮
                            startTime: item.startTime || '',          //优惠券开始时间
                            expireTime :item.startTime || '',         //优惠券结束时间

                        });
                    });
                    this.handleList(dataList, arrData);
                    this.setState({ viewData: arrData, isFirstLoad: false, isLoadMore: false });
                }).catch(err => {
                    console.log(err);
                    this.handleList(dataList, arrData);
                    this.setState({ viewData: arrData, isFirstLoad: false });
                });
            } else {
                this.handleList(dataList, arrData);
                this.setState({ viewData: arrData, isFirstLoad: false });
            }
        } else {//more
            this.handleList(dataList, arrData);
            this.setState({ viewData: this.state.viewData.concat(arrData) });
        }

    };

    handleList = (dataList, arrData) => {
        dataList.forEach((item) => {
            arrData.push({
                code: item.code,
                id: item.id,
                status: item.status,
                name: item.name,
                timeStr: item.couponTime,
                value: item.type === 3 ? '折' : (item.type === 4 ? '抵' : (item.type === 5 ? '兑' : item.value)),
                limit: this.parseCoupon(item),
                couponConfigId: item.couponConfigId,
                remarks: item.remarks,
                type: item.type,
                levelimit: item.levels ? (item.levels.indexOf(user.levelId) !== -1 ? false : true) : false,
                count: item.count || 0,
                redirectType: item.redirectType,
                redirectUrl: item.redirectUrl,
                canInvoke: item.canInvoke || false,         //是不是可以展示 激活按钮
                startTime: item.startTime,          //优惠券开始时间
                expireTime :item.startTime ,         //优惠券结束时间

        });
        });
    };

    // 1表示刷新，2代表加载
    getDataFromNetwork = (par) => {
        let status = this.state.pageStatus;
        if (this.props.fromOrder && status === 0) {
            let arr = [];
            let params = {};
            if (this.props.orderParam.orderType === 99 || this.props.orderParam.orderType === 98) {
                this.props.orderParam.orderProducts.map((item, index) => {
                    arr.push({
                        priceCode: item.skuCode,
                        productCode: item.prodCode,
                        amount: item.quantity
                    });
                });
                params = { productPriceIds: arr };
            } else if (this.props.orderParam.orderType === 1 || this.props.orderParam.orderType === 2 || this.props.orderParam.orderType === 3) {
                this.props.orderParam.orderProducts.map((item, index) => {
                    arr.push({
                        priceCode: item.skuCode,
                        productCode: item.productCode || item.prodCode,
                        amount: 1
                    });
                });
                params = {
                    productPriceIds: arr,
                    activityCode: this.props.orderParam.activityCode,
                    activityType: this.props.orderParam.orderType
                };
            }
            this.setState({
                isLoadMore: true
            }, () => {
                API.listAvailable({
                    page: this.currentPage, pageSize: 10,
                    sgAppVersion: 310,
                    ...params
                }).then(res => {
                    bridge.hiddenLoading();
                    let data = res.data || {};
                    let dataList = data.data || [];
                    this.setState({
                        isLoadMore: false
                    });
                    this.parseData(dataList);
                    if (this.currentPage === data.totalPage || data.totalPage === 0) {
                        if (!this.state.isEnd) {
                            this.setState({
                                isEnd: true
                            });
                        }
                    }
                }).catch(result => {
                    bridge.hiddenLoading();
                    this.setState({
                        isFirstLoad: false, viewData: [], isLoadMore: false
                    });
                    bridge.$toast(result.msg);
                });
            });
        } else if (this.props.justOne && status === 0 || this.dataSel.type === 99) {
            let arrData = [];
            bridge.hiddenLoading();
            if (!StringUtils.isEmpty(user.tokenCoin) && (user.tokenCoin !== 0)
                && status === 0) {
                arrData.push({
                    status: 0,
                    name: '1元现金券',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '无金额门槛\n任意商品可用\n可叠加使用',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99, //以type=99表示1元券
                    levelimit: false,
                    redirectType: 0,
                    redirectUrl: null
                });
            }
            this.setState({ viewData: arrData, isEnd: true });
        } else if (this.dataSel.type === 7) {
            bridge.hiddenLoading();
            let dataList = [];
            this.parseData(dataList);
        } else {
            API.userCouponList({
                page: this.currentPage,
                status,
                pageSize: 10,
                sgAppVersion: 310,
                type: couponsModel.params.type
            }).then(result => {
                bridge.hiddenLoading();
                let data = result.data || {};
                let dataList = data.data || [];
                this.setState({
                    isLoadMore: false
                });
                this.parseData(dataList);
                if (this.currentPage === data.totalPage || data.totalPage === 0) {
                    if (!this.state.isEnd) {
                        this.setState({
                            isEnd: true
                        });
                    }
                }
            }).catch(result => {
                bridge.hiddenLoading();
                this.setState({
                    isFirstLoad: false, viewData: [], isLoadMore: false
                });
                bridge.$toast(result.msg);
            });
        }
    };

    //当父组件Tab改变的时候让子组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTab !== this.state.pageStatus) {
            this.onRefresh(couponsModel.params);
        }
    }

    onRefresh = (params = {}) => {
        this.dataSel = couponsModel.params || {};
        console.log('refresh');
        if (this.state.isEnd) {
            this.setState({
                isEnd: false
            });
        }
        this.addData = true;
        this.currentPage = 1;
        if (user.isLogin) {
            this.getUserInfo();
        }
        this.getDataFromNetwork(params);
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
        // if (this.state.isEnd) {
        //     return;
        // }
        if (this.state.isFirstLoad) {
            return;
        }
        console.log('onLoadMore', this.state.isLoadMore, this.state.isEnd, this.state.isFirstLoad);
        if (!this.state.isLoadMore && !this.state.isEnd && !this.state.isFirstLoad) {
            this.currentPage++;
            this.getDataFromNetwork(this.dataSel);
        } else if (this.state.pageStatus === 0 && this.addData && (this.dataSel.type === 99 || !this.dataSel.type)) {
            if (!StringUtils.isEmpty(user.blockedTokenCoin) && (user.blockedTokenCoin !== 0)) {
                let arrData = this.state.viewData;
                arrData.push({
                    status: 3,
                    name: '1元现金券',
                    timeStr: '无时间限制',
                    value: 1,
                    limit: '无金额门槛\n任意商品可用\n可叠加使用',
                    remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',
                    type: 99, //以type=99表示1元券
                    levelimit: false,
                    redirectType: 0,
                    redirectUrl: null
                });
                this.addData = false;
                this.setState({ viewData: arrData });
            }
        }
    };

    clickItem = (index, item) => {
        //礼包
        if (item.redirectType && item.redirectType === 10) {
            routePush(RouterMap.TopicDetailPage, { activityType: 3, activityCode: item.redirectUrl });
        }

        //专题(老版)
        if (item.redirectType && item.redirectType === 11) {
            routePush(RouterMap.DownPricePage, { linkTypeCode: item.redirectUrl });
        }

        //商品
        if (item.redirectType && item.redirectType === 12) {
            routePush(RouterMap.ProductDetailPage, { productCode: item.redirectUrl });
        }

        //秀场
        if (item.redirectType && item.redirectType === 13) {
            routePush(RouterMap.ShowRichTextDetailPage, { code: item.redirectUrl });
        }

        //h5链接
        if (item.redirectType && item.redirectType === 14) {
            routePush('HtmlPage', { uri: item.redirectUrl });
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
        },
        contentStyle: {
            marginRight: px2dp(44),
            width: ScreenUtils.width - px2dp(88),
            marginLeft: px2dp(44),
            height: px2dp(165),
            backgroundColor: '#FCFCFC',
            borderRadius: 12,
            justifyContent: 'flex-end',
            alignItems: 'center',
            opacity: 0.8
        },
        couNumStyle: {
            width: px2dp(123),
            height: px2dp(24),
            justifyContent: 'center',
            alignItems: 'center'
        },
        itemFirStyle: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            width: px2dp(80)
        },
        xNumStyle: {
            marginRight: 15,
            marginTop: 15,
            fontSize: 14,
            color: DesignRule.textColor_mainTitle
        },
        guangStyle: {
            marginTop: 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: DesignRule.mainColor,
            borderWidth: 1,
            borderRadius: 18,
            width: 115,
            height: 36
        },
        tnStyle: {
            padding: 0,
            paddingLeft: 5,
            alignItems: 'center',
            height: px2dp(24),
            width: px2dp(136),
            fontSize: px2dp(15),
            color: DesignRule.textColor_mainTitle
        },
        giveUpTouStyle: {
            width: ScreenUtils.width,
            height: 48,
            backgroundColor: 'white',
            borderStyle: 'solid'
            , alignItems: 'center', justifyContent: 'center'
        },
        xNumsStyle: {
            marginRight: 15,
            marginBottom: 5,
            fontSize: 13,
            color: DesignRule.textColor_mainTitle_222
        },
        footer_container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 44
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50
        },
        text: {
            marginLeft: 6,
            color: DesignRule.textColor_instruction,
            fontSize: DesignRule.fontSize_24
        }
    }
);
