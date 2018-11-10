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
    Text,
    ImageBackground,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import bg from './res/tuiguang_bg_nor.png';
import MineApi from '../../api/MineApi';
import RefreshList from '../../../../components/ui/RefreshList';
import EmptyUtils from '../../../../utils/EmptyUtils';
import DesignRule from 'DesignRule';

const { px2dp, autoSizeWidth } = ScreenUtils;
type Props = {};
export default class InvitePromotionPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEmpty: false
        };
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '邀请推广',
        show: true// false则隐藏导航
    };

    //下拉加载更多
    onLoadMore = () => {
        this.currentPage++;
        this.loadPageData();
    };
    //刷新
    onRefresh = () => {
        this.currentPage = 1;
        this.loadPageData();
    };


    loadPageData = () => {
        MineApi.getPromotionPackageList({ page: this.currentPage, pageSize: 15 }).then((res) => {
            let arrs = this.currentPage == 1 ? [] : this.state.viewData;
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
        }).catch(error => {
            this.$toastShow(error.msg);
        });
    };


    componentDidMount() {
        this.loadPageData();
    }


    _itemRender = ({ item }) => {
        let tip = (
            <Text style={styles.itemTextStyle}>
                库存不足
            </Text>
        );
        let limit = (
            <Text style={styles.itemTextStyle}>
                {`每人限购${item.buyLimit}份`}
            </Text>
        );
        return (
            <View style={{ height: px2dp(63), width: ScreenUtils.width }}>
                <TouchableWithoutFeedback onPress={() => {
                    if (item.userBuy && item.status === 1) {
                        this.$navigate('mine/promotion/PromotionPayPage', item);
                    }
                }}>
                    <View style={[styles.itemWrapper, { backgroundColor: item.userBuy && (item.status === 1 )? 'white' : '#CCCCCC' }]}>
                        <Text style={styles.itemTextStyle}>
                            {item.name}{`/推广周期${item.cycle}天`}
                        </Text>
                        {item.status === 2 ? tip : null}
                        {(!item.userBuy && item.lime !== -1) ? limit : null}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };


    _render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={bg} style={styles.imageStyle}>
                    <Text style={{ color: 'white', fontSize: px2dp(20) }}>
                        邀请推广是什么？
                    </Text>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: px2dp(13) }}>
                        平台拥有很多没有上级用户的会员，{`\n`}
                        您可以通过发送红包的方式进行绑定，{`\n`}
                        平台提供分享通道
                    </Text>
                </ImageBackground>
                <RefreshList data={this.state.data}
                             renderItem={this._itemRender}
                             style={{ marginTop: px2dp(15) }}
                             isEmpty={this.state.isEmpty}
                             onRefresh={this.onRefresh}
                             onLoadMore={this.onLoadMore}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1


    },
    imageStyle: {
        width: ScreenUtils.width,
        height: autoSizeWidth(150),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: px2dp(25),
        paddingBottom: px2dp(32)
    },
    itemWrapper: {
        height: px2dp(48),
        width: ScreenUtils.width - px2dp(30),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 2,
        borderRadius: px2dp(5),
        shadowColor: DesignRule.mainColor,
        shadowOffset: { h: 2, w: 2 },
        shadowRadius: px2dp(6),
        shadowOpacity: 0.1
    },
    itemTextStyle: {
        color: 'black',
        fontSize: px2dp(13)
    }
});
