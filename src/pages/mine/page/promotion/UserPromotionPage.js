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
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import RefreshList from '../../../../components/ui/RefreshList';
import EmptyUtils from '../../../../utils/EmptyUtils';
import DateUtils from '../../../../utils/DateUtils';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import DesignRule from 'DesignRule';
import {MRText as Text} from '../../../../components/ui'

const { px2dp } = ScreenUtils;
// const url = '/static/protocol/extensionExplain.html'
import apiEnvironment from '../../../../api/ApiEnvironment';
import StringUtils from "../../../../utils/StringUtils";

type Props = {};
export default class UserPromotionPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEmpty: false,
            loadingState:PageLoadingState.loading,
        };
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '我的推广订单',
        show: true// false则隐藏导航
    };


    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
        };
    };

    goExplicationPage = () => {
        this.$navigate('HtmlPage', {
            title: '推广说明',
            uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/extensionExplain.html`
        });
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.goExplicationPage}>
                <Text style={{ color: DesignRule.textColor_secondTitle, fontSize: px2dp(12) }}>
                    推广说明
                </Text>
            </TouchableOpacity>
        );
    };

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener("payPromotionSuccess",()=>{
            this.onRefresh();
        })
        // if(this.params.callback && this.params.callback.reload){
        //     alert();
        //     this.onRefresh();
        // }else {
        //     this.getUserPromotionPromoter();
        // }
        this.getUserPromotionPromoter();

    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    getUserPromotionPromoter = () => {
        MineApi.getUserPromotionPromoter({ page: this.currentPage, pageSize: 15 }).then(res => {
            let arrs = this.currentPage === 1 ? [] : this.state.data;
            if (!EmptyUtils.isEmptyArr(res.data.data)) {
                res.data.data.map((item, index) => {
                    arrs.push(item);
                });
                this.setState({
                    data: arrs,
                    loadingState: PageLoadingState.success
                });
            } else {
                if (EmptyUtils.isEmptyArr(this.state.data)) {
                    this.setState({
                        isEmpty: true,
                        loadingState: PageLoadingState.success
                    });
                }
            }
        }).catch((error) => {
            if(this.currentPage === 1 && EmptyUtils.isEmptyArr(this.state.data)){
                this.setState({
                    loadingState: PageLoadingState.fail
                })
            }
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
        let text;
        if(item.status === 2){
            text = (
                <Text style={styles.grayTextStyle}>
                    已结束
                </Text>
            )
        }else if(item.status === 3){
            text = (
                <Text style={styles.grayTextStyle}>
                    已取消
                </Text>
            )
        }else {
            text = (
                <Text style={styles.grayTextStyle}>
                    {`剩余推广金额${StringUtils.formatMoneyString(item.remain * item.price)}`}
                </Text>
            )
        }
        return (
            <View style={{ backgroundColor: 'white', marginBottom: px2dp(10) }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: px2dp(15),
                    borderBottomColor: DesignRule.lineColor_inGrayBg,
                    borderBottomWidth: ScreenUtils.onePixel
                }}>
                    <View style={styles.itemInfoWrapper}>
                        <Text style={styles.blackTextStyle}>
                            {item.packageName}
                        </Text>
                        <View style={{height:px2dp(10)}}/>
                        {text}
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
                        {`购买时间：${DateUtils.formatDate(item.createTime)}`}
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
        backgroundColor: DesignRule.bgColor,
        paddingTop: px2dp(10),
    },
    grayButtonWrapper: {
        borderColor: DesignRule.lineColor_inGrayBg,
        borderWidth: ScreenUtils.onePixel,
        borderRadius: px2dp(5),
        width: px2dp(80),
        height: px2dp(35),
        justifyContent: 'center',
        alignItems: 'center'
    },
    redButtonWrapper: {
        borderColor: DesignRule.mainColor,
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
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(16),
        includeFontPadding:false
    },
    grayTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        includeFontPadding:false
    },
    bottomTextWrapper: {
        height: px2dp(33),
        justifyContent: 'center',
        paddingHorizontal: px2dp(15)
    },
    bottomTextStyle: {
        color: DesignRule.textColor_instruction,
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
        backgroundColor: DesignRule.mainColor,
        marginBottom:ScreenUtils.safeBottom
    },
    bottomButtonTextStyle: {
        color: 'white',
        fontSize: px2dp(17)
    }


});
