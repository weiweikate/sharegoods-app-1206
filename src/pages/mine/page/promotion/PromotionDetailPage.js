/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/19.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import EmptyUtils from '../../../../utils/EmptyUtils';
import RefreshList from '../../../../components/ui/RefreshList';
import DateUtils from '../../../../utils/DateUtils';
import StringUtils from '../../../../utils/StringUtils';
import apiEnvironment from '../../../../api/ApiEnvironment';
import DesignRule from 'DesignRule';
import {MRText as Text} from '../../../../components/ui'

const { px2dp } = ScreenUtils;
type Props = {};
import CommShareModal from '../../../../comm/components/CommShareModal'
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import CountDownView from "./CountDownView";
import user from '../../../../model/user';

export default class PromotionDetailPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEmpty: false,
            showCountDown: false,
            countDownStr: '',
            loadingState: PageLoadingState.loading,
        };
        this.date = null;
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


    componentDidMount() {
        this.getPromotionReceiveRecord();
    }


    getPromotionReceiveRecord = () => {
        MineApi.getPromotionReceiveRecord({
            page: this.currentPage,
            pageSize: 15,
            packageId: this.params.id
        }).then(res => {
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
            this.$toastShow(error.msg);
            this.setState({
                loadingState: PageLoadingState.fail
            })
        });
    };

    //下拉加载更多
    onLoadMore = () => {
        this.currentPage++;
        this.getPromotionReceiveRecord();
    };
    //刷新
    onRefresh = () => {
        this.currentPage = 1;
        this.getPromotionReceiveRecord();
    };


    /**************************viewpart********************************/

    _itemRender({ item }) {
        return (
            <View style={{ backgroundColor: 'white', marginBottom: px2dp(10) }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: px2dp(45),
                    justifyContent: 'space-between',
                    paddingHorizontal: px2dp(15),
                    borderBottomColor: DesignRule.lineColor_inGrayBg,
                    borderBottomWidth: px2dp(0.5)
                }}>
                    <Text style={styles.blackTextStyle}>
                        {StringUtils.encryptPhone(item.phone)}
                    </Text>
                    <Text style={styles.grayTextStyle}>
                        领取红包
                        <Text style={styles.redTextStyle}>
                            {`${item.price}元`}
                        </Text>
                    </Text>
                </View>
                <View style={styles.bottomTextWrapper}>
                    <Text style={styles.bottomTextStyle}>
                        领取时间：{DateUtils.formatDate(item.createTime)}
                    </Text>
                </View>
            </View>
        );
    }

    _bottomButtonRender() {
        return (
            <TouchableWithoutFeedback onPress={() => {this.shareModal.open()}}>
                <View style={styles.bottomButtonWrapper}>
                    <Text style={styles.bottomButtonTextStyle}>
                        分享我的推广
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _countDownRender() {
        return (
            <View style={{
                width: ScreenUtils.width, height: px2dp(20), justifyContent: 'center',
                alignItems: 'center', backgroundColor: DesignRule.mainColor
            }}>
                <Text style={{ color: 'white', fontSize: px2dp(13), includeFontPadding: false }}>
                    {this.state.countDownStr}
                </Text>
            </View>
        );
    }

    _render() {
        return (
            <View style={styles.container}>
                {/*{this.state.showCountDown ? this._countDownRender() : null}*/}
                {this.params.status === 1 ? <CountDownView endTime = {this.params.endTime} /> : null}
                <RefreshList
                    style={{marginBottom:ScreenUtils.safeBottom}}
                    data={this.state.data}
                    renderItem={this._itemRender}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    // extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据'}
                />
                {this._bottomButtonRender()}
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'promotionShare'}
                                webJson={{
                                    title: '分享好友免费领取福利',
                                    dec: '属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/promote?id=${this.params.id}&upuserid=${user.code || ''}`,
                                    thumImage: 'logo.png',
                                }}
                                miniProgramJson={{
                                    title: `分享好友免费领取福利`,
                                    dec:'属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    thumImage: 'logo.png',
                                    hdImageURL: '',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/promote?id=${this.params.id}&upuserid=${user.code || ''}`,
                                    miniProgramPath: `/pages/index/index?type=100&id=${this.params.id}&inviteId=${user.code || ''}`
                                }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        paddingBottom: px2dp(48)
    },
    grayButtonWrapper: {
        borderColor: DesignRule.lineColor_inGrayBg,
        borderWidth: px2dp(0.5),
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
        height: px2dp(67),
        paddingVertical: px2dp(15)
    },
    blackTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(16),
        fontWeight: 'bold'
    },
    grayTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13)
    },
    redTextStyle: {
        color: DesignRule.mainColor,
        fontSize: px2dp(13)
    },
    bottomTextWrapper: {
        height: px2dp(33),
        justifyContent: 'center',
        paddingHorizontal: px2dp(15)
    },
    bottomTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13)
    },
    bottomButtonWrapper: {
        height: px2dp(48),
        width: ScreenUtils.width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: ScreenUtils.safeBottom,
        backgroundColor: DesignRule.mainColor
    },
    bottomButtonTextStyle: {
        color: DesignRule.white,
        fontSize: px2dp(17)
    }
});
