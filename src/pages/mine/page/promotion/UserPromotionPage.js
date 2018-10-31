/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/18.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import RefreshList from '../../../../components/ui/RefreshList';
import EmptyUtils from '../../../../utils/EmptyUtils';
import DateUtils from '../../../../utils/DateUtils';

const { px2dp } = ScreenUtils;

type Props = {};
export default class UserPromotionPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEmpty: false
        };
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '我的推广订单',
        show: true// false则隐藏导航
    };


    componentDidMount() {
        this.getUserPromotionPromoter();
    }

    getUserPromotionPromoter = () => {
        MineApi.getUserPromotionPromoter({ page: this.currentPage, pageSize: 15 }).then(res => {
            let arrs = this.currentPage == 1 ? [] : this.state.data;
            if (!EmptyUtils.isEmptyArr(res.data.data)) {
                res.data.data.map((item, index) => {
                    arrs.push(item);
                });
                this.setState({
                    data: arrs
                });
            } else {
                if (EmptyUtils.isEmptyArr(this.state.data)) {
                    this.setState({
                        isEmpty: true
                    });
                }
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //下拉加载更多
    onLoadMore = () => {
        this.currentPage++;
        this.getUserPromotionPromoter();
    };
    //刷新
    onRefresh = () => {
        this.currentPage = 1;
        this.getUserPromotionPromoter();
    };


    /**************************viewpart********************************/

    _itemRender=({item}) =>{
        return (
            <View style={{ backgroundColor: 'white', marginBottom: px2dp(10) }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: px2dp(15),
                    borderBottomColor: '#DDDDDD',
                    borderBottomWidth: px2dp(0.5)
                }}>
                    <View style={styles.itemInfoWrapper}>
                        <Text style={styles.blackTextStyle}>
                            {item.packageName}
                        </Text>
                        <View style={{height:px2dp(10)}}/>
                        <Text style={styles.grayTextStyle}>
                            {`剩余推广金额￥${item.remain * item.price}`}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.$navigate('mine/promotion/PromotionDetailPage',item)
                    }}>
                        <View style={styles.grayButtonWrapper}>
                            <Text style={styles.grayTextStyle}>
                                推广详情
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.bottomTextWrapper}>
                    <Text style={styles.bottomTextStyle}>
                        {`购买时间：${DateUtils.formatDate(item.startTime)}`}
                    </Text>
                </View>
            </View>
        );
    }

    _bottomButtonRender() {
        return (
            <TouchableWithoutFeedback onPress={() => this.$navigate('mine/promotion/InvitePromotionPage')}>
                <View style={styles.bottomButtonWrapper}>
                    <Text style={styles.bottomButtonTextStyle}>
                        发起邀请推广
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <RefreshList
                        data={this.state.data}
                        renderItem={this._itemRender}
                        onRefresh={this.onRefresh}
                        onLoadMore={this.onLoadMore}
                        // extraData={this.state}
                        isEmpty={this.state.isEmpty}
                        emptyTip={'暂无发起推广'}
                    />
                </View>
                {this._bottomButtonRender()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingTop: px2dp(10),
    },
    grayButtonWrapper: {
        borderColor: '#DDDDDD',
        borderWidth: px2dp(0.5),
        borderRadius: px2dp(5),
        width: px2dp(80),
        height: px2dp(35),
        justifyContent: 'center',
        alignItems: 'center'
    },
    redButtonWrapper: {
        borderColor: '#D51243',
        borderWidth: px2dp(1),
        borderRadius: px2dp(5),
        width: px2dp(80),
        height: px2dp(35),
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemInfoWrapper: {
        justifyContent: 'space-between',
        paddingVertical: px2dp(15)
    },
    blackTextStyle: {
        color: '#222222',
        fontSize: px2dp(16),
        fontFamily:'PingFangSC-Regular',
        includeFontPadding:false
    },
    grayTextStyle: {
        color: '#999999',
        fontSize: px2dp(13),
        includeFontPadding:false
    },
    bottomTextWrapper: {
        height: px2dp(33),
        justifyContent: 'center',
        paddingHorizontal: px2dp(15)
    },
    bottomTextStyle: {
        color: '#999999',
        fontSize: px2dp(13),
        includeFontPadding:false
    },
    bottomButtonWrapper: {
        height: px2dp(48),
        width: ScreenUtils.width,
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        // left: 0,
        // bottom: 0,
        backgroundColor: '#D51243'
    },
    bottomButtonTextStyle: {
        color: 'white',
        fontSize: px2dp(13)
    }


});
