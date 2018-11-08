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
    Text
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import EmptyUtils from '../../../../utils/EmptyUtils';
import RefreshList from '../../../../components/ui/RefreshList';
import DateUtils from '../../../../utils/DateUtils';
import StringUtils from '../../../../utils/StringUtils';
import apiEnvironment from '../../../../api/ApiEnvironment';

const { px2dp } = ScreenUtils;
type Props = {};
import CommShareModal from '../../../../comm/components/CommShareModal'

export default class PromotionDetailPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEmpty: false,
            showCountDown: false,
            countDownStr: ''
        };
        this.date = null;
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '我的推广订单',
        show: true// false则隐藏导航
    };


    componentDidMount() {
        this.getPromotionReceiveRecord();
        this.startTimer();

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    startTimer = () => {
        if (this.params.status === 1) {
            this.date = Date.parse(new Date());
            if (this.date < this.params.endTime) {
                this.timer = setInterval(() => {
                    this.date = this.date + 1000;
                    if (this.date < this.params.endTime) {
                        let seconds = parseInt((this.params.endTime - this.date) / 1000);
                        this.setState({
                            showCountDown: true,
                            countDownStr: `剩余推广时间： ${this.timeFormat(seconds)}`
                        });
                    } else {
                        this.setState({
                            showCountDown: false
                        });
                        this.timer && clearTimeout(this.timer);
                    }
                }, 1000);
            }

        }
    };

    timeFormat(sec) {
        let days = Math.floor(sec / 24 / 60 / 60);
        let h = Math.floor(sec / 60 / 60 % 24);
        let m = Math.floor(sec / 60 % 60);
        let s = Math.floor(sec % 60);
        if(s < 10) {
            s = "0" + s;
        }
        if(m < 10) {
            m = "0" + m;
        }
        if(h < 10) {
            h = "0" + h;
        }
        return `${days}天${h}:${m}:${s}`;
    }

    getPromotionReceiveRecord = () => {
        MineApi.getPromotionReceiveRecord({
            page: this.currentPage,
            pageSize: 15,
            packageId: this.params.id
        }).then(res => {
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
                    borderBottomColor: '#DDDDDD',
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
                alignItems: 'center', backgroundColor: '#D51243'
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
                {this.state.showCountDown ? this._countDownRender() : null}
                <RefreshList
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
                                    title: '邀请好友免费领取福利',
                                    dec: '属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}?id=${this.params.id}`,
                                    thumImage: 'logo.png',
                                }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingBottom: px2dp(48)
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
        height: px2dp(67),
        paddingVertical: px2dp(15)
    },
    blackTextStyle: {
        color: '#222222',
        fontSize: px2dp(16),
        fontWeight: 'bold'
    },
    grayTextStyle: {
        color: '#999999',
        fontSize: px2dp(13)
    },
    redTextStyle: {
        color: '#D51243',
        fontSize: px2dp(13)
    },
    bottomTextWrapper: {
        height: px2dp(33),
        justifyContent: 'center',
        paddingHorizontal: px2dp(15)
    },
    bottomTextStyle: {
        color: '#999999',
        fontSize: px2dp(13)
    },
    bottomButtonWrapper: {
        height: px2dp(48),
        width: ScreenUtils.width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#D51243'
    },
    bottomButtonTextStyle: {
        color: 'white',
        fontSize: px2dp(13)
    }
});
