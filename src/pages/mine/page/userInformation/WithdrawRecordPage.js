/**
 * @author xzm
 * @date 2019/8/20
 */

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import MineAPI from '../../api/MineApi';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import DateUtils from '../../../../utils/DateUtils';
import RouterMap from '../../../../navigation/RouterMap';
import EmptyUtils from '../../../../utils/EmptyUtils';
import StringUtils from '../../../../utils/StringUtils';

const { px2dp } = ScreenUtils;

export default class WithdrawRecordPage extends BasePage {
    constructor(props) {
        super(props);
        this.currentYear = null;
        this.data = null;
    }

    $navigationBarOptions = {
        title: '提现记录',
        show: true // false则隐藏导航
    };

    _listItemRender = ({ item, index }) => {

        if (item.app_record_header) {
            return (
                <View style={{ height: px2dp(50), marginLeft: px2dp(15), flexDirection: 'row', alignItems: 'center' }}>
                    <MRText
                        style={{ color: DesignRule.textColor_mainTitle, fontSize: DesignRule.fontSize_threeTitle_28 }}>
                        {`${item.year}年`}
                    </MRText>
                </View>
            );
        }

        let showLine = true;
        if (index === this.data.length-1) {
            showLine = false;
        } else if (this.data[index + 1].app_record_header) {
            showLine = false;
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._goDetail(item);
            }}>
                <View key={`withdraw_record_${index}`} style={styles.itemWrapper}>
                    <View style={[styles.rowWrapper, { marginTop: px2dp(10) }]}>
                        <MRText style={styles.codeStyle}>
                            {item.withdrawNum}
                        </MRText>
                        <MRText style={styles.codeStyle}>
                            {StringUtils.numberFormat(item.withdrawBalance)}
                        </MRText>
                    </View>
                    <View style={[styles.rowWrapper, { marginTop: px2dp(5), marginBottom: px2dp(10) }]}>
                        <MRText style={styles.textColor_instruction}>
                            {DateUtils.formatDate(item.applyTime)}
                        </MRText>
                        <MRText style={{
                            fontSize: DesignRule.fontSize_24,
                            color: this._getRemarkColor(item.withdrawRemark)
                        }}>
                            {item.withdrawRemark}
                        </MRText>
                    </View>
                    {
                        showLine ? <View style={{
                            height: 1,
                            width: DesignRule.width - px2dp(15),
                            backgroundColor: DesignRule.lineColor_inWhiteBg
                        }}/> : null
                    }

                </View>
            </TouchableWithoutFeedback>
        );
    };

    _goDetail = (data) => {
        this.$navigate(RouterMap.WithdrawRecordDetailPage, data);
    };

    _handleRequestResult = (result, isRefresh) => {
        if (isRefresh) {
            this.currentYear = null;
        }
        let data = result.data.data || [];
        if (EmptyUtils.isEmptyArr(data)) {
            return [];
        }
        if (EmptyUtils.isEmpty(this.currentYear)) {
            let date = new Date(data[0].applyTime);
            let year = date.getFullYear();
            this.currentYear = year;
            let header = { app_record_header: true, year };
            data.splice(0, 0, header);
        }

        data.forEach((item, index) => {
            if (!item.app_record_header) {
                let date = new Date(item.applyTime);
                let year = date.getFullYear();
                if (year !== this.currentYear) {
                    this.currentYear = year;
                    let header = { app_record_header: true, year };
                    data.splice(index, 0, header);
                }
            }
        });
        return data;
    };

    //后台建议字符串判断
    _getRemarkColor = (text) => {
        let color = DesignRule.textColor_instruction;
        if (text === '审核中') {
            color = '#3187FF';
        } else if (text === '提现成功') {
            color = '#57CF1C';
        } else if (text === '提现失败') {
            color = '#FF0050';
        }
        return color;
    };

    _render() {
        return (
            <View style={styles.contain}>
                <RefreshFlatList
                    style={styles.container}
                    url={MineAPI.queryWithdrawRecord}
                    renderItem={this._listItemRender}
                    handleRequestResult={this._handleRequestResult}
                    dataChangeListener={(data) => {
                        this.data = data;
                    }}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    contain: {
        flex: 1
    },
    container: {
        marginTop: 0
    },
    itemWrapper: {
        paddingLeft: px2dp(15),
        width: ScreenUtils.width,
        backgroundColor: DesignRule.white
    },
    rowWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: px2dp(15),
        alignItems: 'center'
    },
    codeStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle_28
    },
    timeStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_24
    }
});


