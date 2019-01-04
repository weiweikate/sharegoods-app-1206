import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DateUtils from '../../../utils/DateUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
const {icon_3_09: arrowIcon } = res;
import {MRText as Text} from '../../../components/ui'

export default class ShopMessageRow extends Component {

    static propTypes = {
        item: PropTypes.object.isRequired,
        pushShop: PropTypes.func.isRequired,
        rejectAction: PropTypes.func.isRequired,
        allowAction: PropTypes.func.isRequired
    };

    renderShopTypeItem = ({ item }) => {
        //type  1:邀请入店 2:申请加入 3:请出消息 4:招募消息 5:拼店成功 6:拼店失败 7:店铺申请同意  8:店铺申请拒绝
        return (
            <View style={{ width: ScreenUtils.width }}>
                <View style={{ height: 37, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        color: '#999999',
                        fontSize: 13
                    }}>{DateUtils.getFormatDate(item.createTime / 1000)}</Text>
                </View>
                <View style={{ height: 49, justifyContent: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 15, fontSize: 16, color: '#222222' }}>{item.title}</Text>
                </View>
                <View
                    style={{ height: StyleSheet.hairlineWidth, width: ScreenUtils.width, backgroundColor: '#f7f7f7' }}/>
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{
                        marginHorizontal: 15,
                        marginTop: 22,
                        fontSize: 15,
                        color: '#222222'
                    }}>{item.content}</Text>
                    <Text style={{
                        marginTop: 10, marginBottom: 12, fontSize: 13, color: '#999999'
                    }}>{item.type === 1 ? '邀请' : '申请'}时间 {DateUtils.getFormatDate(item.createTime / 1000)}
                    </Text>
                </View>
                <View
                    style={{ height: StyleSheet.hairlineWidth, width: ScreenUtils.width, backgroundColor: '#f7f7f7' }}/>
                {
                    item.type === 1 ? <View style={{ height: 41, backgroundColor: 'white' }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {
                            this.props.pushShop && this.props.pushShop(item);
                        }}
                                          style={{
                                              height: 41,
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                          }}>
                            <Text style={{ fontSize: 13, color: '#999999' }}>查看详情</Text>
                            <Image source={arrowIcon} style={{ width: 11, height: 10, marginLeft: 5 }}/>
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    item.type === 1 ? <View style={{
                        height: StyleSheet.hairlineWidth,
                        width: ScreenUtils.width,
                        backgroundColor: '#f7f7f7'
                    }}/> : null
                }
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    backgroundColor: 'white', height: 60
                }}>
                    <TouchableOpacity onPress={() => {
                        this.props.rejectAction && this.props.rejectAction(item);
                    }}
                                      style={[styles.selectText, { borderWidth: 0.5, borderColor: DesignRule.mainColor }]}>
                        <Text style={{
                            fontSize: 16,
                            color: DesignRule.mainColor
                        }}>拒绝</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.allowAction && this.props.allowAction(item);
                    }}
                                      style={[styles.selectText, { backgroundColor: DesignRule.mainColor }]}>
                        <Text style={{
                            fontSize: 16,
                            color: 'white'
                        }}>{item.type === 1 ? '加入' : '同意'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderDealedItem = ({ item }) => {
        const { dealStatus } = item;
        const bydealStatus = (dealStatus === 2 || dealStatus === 3);
        return (
            <View style={{ width: ScreenUtils.width }}>
                <View style={{ height: 37, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        color: '#999999',
                        fontSize: 13
                    }}>{DateUtils.getFormatDate(item.createTime / 1000)}</Text>
                </View>
                <View style={{ height: 49, justifyContent: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 15, fontSize: 16 }}>{item.title}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: '#f7f7f7' }}/>
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{
                        marginHorizontal: 15,
                        marginTop: 22,
                        fontSize: 15,
                        color: '#222222'
                    }}>{item.content}</Text>
                    <Text style={{
                        marginTop: 10,
                        marginBottom: 20,
                        fontSize: 13,
                        color: '#999999'
                    }}>邀请时间 {DateUtils.getFormatDate(item.createTime / 1000)}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: '#f7f7f7' }}/>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white', height: 60
                }}>
                    <View style={[styles.selectText, { backgroundColor: DesignRule.lineColor_inGrayBg }]}>
                        <Text style={{
                            fontSize: 16,
                            color: '#ffffff'
                        }}>{
                            bydealStatus ? (dealStatus === 2 ? `${'已同意'}` : `${'已拒绝'}`) :
                                (item.type === 7 ? `${'已同意'}` : `${'已拒绝'}`)
                        }</Text>
                    </View>
                </View>
            </View>
        );
    };

    renderDefaultItem = ({ item }) => {
        return (
            <View style={{ width: ScreenUtils.width }}>
                <View style={{ height: 37, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        color: '#999999',
                        fontSize: 13
                    }}>{DateUtils.getFormatDate(item.createTime / 1000)}</Text>
                </View>
                <View style={{ height: 49, justifyContent: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 15, fontSize: 16 }}>{item.title}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: '#f7f7f7' }}/>
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{
                        marginHorizontal: 15,
                        marginBottom: 22,
                        marginTop: 22,
                        fontSize: 15,
                        color: '#222222'
                    }}>{item.content}</Text>
                </View>
                {
                    this.props.item.type === 4 && <View style={{ height: 41, backgroundColor: 'white' }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {
                            this.props.pushShop && this.props.pushShop(item);
                        }}
                                          style={{
                                              height: 41,
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                          }}>
                            <Text style={{ fontSize: 13, color: DesignRule.textColor_instruction }}>查看详情</Text>
                            <Image source={arrowIcon} style={{ width: 11, height: 10, marginLeft: 5 }}/>
                        </TouchableOpacity>
                    </View>
                }
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: '#f7f7f7' }}/>
            </View>
        );
    };

    render() {
        //type          1:邀请入店 2:申请加入   3:请出消息 4:招募消息 5:拼店成功 6:拼店失败 7:店铺申请同意  8:店铺申请拒绝、
        //dealStatus    1：未处理  2：已同意   3：已拒绝   4：开启    5：暂不开启'
        let item = this.props.item;
        const { dealStatus } = item;
        if (dealStatus === 2 || dealStatus === 3) {
            return this.renderDealedItem({ item });
        }
        switch (item.type) {
            case 1://邀请入店
            case 2://申请加入
                return this.renderShopTypeItem({ item });
            case 7:
            case 8:
                return this.renderDealedItem({ item });
            default://4:招募消息（查看详情） 5:拼店成功 6:拼店失败 等等3:请出
                return this.renderDefaultItem({ item });
        }
    }
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white'
    },
    selectText: {
        width: 138,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

