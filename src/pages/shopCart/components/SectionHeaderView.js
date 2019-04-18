/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huyufeng on 2019/1/3.
 *
 */


'use strict';

import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Alert
} from 'react-native';
import {
    UIText,
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import shopCartCacheTool from '../model/ShopCartCacheTool';

export default class SectionHeaderView extends Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }

    render() {
        const { sectionData } = this.props;
        return (
            <View>
                {
                    sectionData.type === 8 ? this._renderNormalHeaderView(sectionData) : this._renderView(sectionData)
                }
            </View>
        );
    }

    _renderView = (sectionData) => {
        return (
            <View>
                {sectionData.type === -1 ? this._renderInvaildView(sectionData) : null}
            </View>

        );
    };
    _renderInvaildView = (sectionData) => {
        return (
            <View
                style={styles.bgViewStyle}
            >
                <View
                    style={styles.invaildTopContentBgStyle}
                >
                    {/*中部文字*/}
                    <View
                        style={styles.middleTextBgStyle}
                    >
                        <UIText
                            style={styles.middleTextStyle}
                            numberOfLines={2}
                            value={'失效宝贝' + sectionData.data.length + '件'}
                        />
                    </View>
                    <View
                        style={
                            styles.rightTextBgView
                        }
                    >
                        <UIText
                            value={'清空失效宝贝'}
                            style={
                                styles.rightTextStyle
                            }
                            onPress={() => {
                                this.clearAllInvaildGood();
                            }}
                        />
                    </View>
                </View>
                {/*底部分割线*/}
                <View
                    style={styles.bottomLineStyle}
                >
                </View>
            </View>
        );

    };
    _renderNormalHeaderView = (sectionData) => {
        return (
            <View
                style={styles.bgViewStyle}
            >
                <View
                    style={styles.topContentBgStyle}
                >
                    <View
                        style={styles.leftTipBgStyle}
                    >
                        <UIText
                            value={'经验翻倍'}
                            style={styles.leftTextStyle}
                        />
                    </View>
                    {/*中部文字*/}
                    <View
                        style={styles.middleTextBgStyle}
                    >
                        <UIText
                            style={styles.middleTextStyle}
                            numberOfLines={2}
                            value={sectionData.middleTitle}
                        />
                    </View>
                    <View
                        style={
                            styles.rightTextBgView
                        }
                    >
                        <UIText
                            value={'去凑单 >'}

                            style={
                                styles.rightTextStyle
                            }
                            onPress={() => {
                                this.collectBills();
                            }}
                        />
                    </View>
                </View>
                {/*底部分割线*/}
                <View
                    style={styles.bottomLineStyle}
                >
                </View>
            </View>
        );
    };
    /**
     * 清除当前组失效商品
     */
    clearAllInvaildGood = () => {

        Alert.alert(
            '是否清空失效商品',
            '',
            [
                {text: '确定', onPress: () =>
                    {
                        const { sectionData } = this.props;
                        let  deleteSkuCodes = [];
                        sectionData.data.map(item=>{
                            deleteSkuCodes.push({
                                'skuCode':item.skuCode
                            })
                        })
                        shopCartCacheTool.deleteShopCartGoods(deleteSkuCodes);

                    }, style: 'cancel'},
                {text: '取消', onPress: () => {}},
            ],
            { cancelable: false }
        )
    };
    /**
     * 去凑单
     */
    collectBills = () => {
        const { sectionData } = this.props;
        this.props&&this.props.gotoCollectBills&&this.props.gotoCollectBills(sectionData);
    };
}

SectionHeaderView.propTypes = {
    //cell 数据
    sectionData: PropTypes.object.isRequired,
    gotoCollectBills:PropTypes.func,
};
const styles = StyleSheet.create({
    bgViewStyle: {
        height: 40,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    topContentBgStyle: {
        flex: 1,
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    invaildTopContentBgStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftTipBgStyle: {
        backgroundColor: DesignRule.mainColor,
        borderRadius: 7,
        width: 70,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 14
    },
    leftTextStyle: {
        color: '#fff',
        fontSize: 11
    },
    middleTextBgStyle: {
        marginLeft: 20,
        width: ScreenUtils.width - 180,
        height: 25,
        justifyContent: 'center'
    },
    middleTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: 10
    },
    bottomLineStyle: {
        height: 1,
        backgroundColor: DesignRule.bgColor
    },
    rightTextBgView: {
        marginLeft: 20
    },
    rightTextStyle: {
        fontSize: 10,
        color: DesignRule.mainColor,
        marginRight: 10
    }
});
