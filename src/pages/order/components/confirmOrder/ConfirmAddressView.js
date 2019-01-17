import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import {
    UIText, UIImage
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { observer } from 'mobx-react/native';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';

const position = res.dizhi;
const arrow_right = res.arrow_right;
const colorLine = res.addressLine;


@observer
export default class ConfirmAddressView extends Component {


    render() {
        return (
            <View>
                {this.renderAddress()}
                {this.renderSelectImage()}
            </View>
        );
    }

    renderAddress = () => {
        console.log('renderAddress');
        return (StringUtils.isNoEmpty(confirmOrderModel.addressId) ?
                <TouchableOpacity
                    style={styles.addressSelectStyle}
                    onPress={this.props.selectAddress}>
                    <UIImage source={position} style={{
                        height: ScreenUtils.autoSizeHeight(20),
                        width: ScreenUtils.autoSizeWidth(20),
                        marginLeft: ScreenUtils.autoSizeWidth(20)
                    }} resizeMode={'contain'}/>
                    <View style={{
                        flex: 1,
                        marginLeft: ScreenUtils.autoSizeWidth(15),
                        marginRight: ScreenUtils.autoSizeWidth(15)
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={[styles.commonTextStyle, { flex: 1 }]}
                                  allowFontScaling={false}>收货人：{confirmOrderModel.addressData.receiver}</Text>
                            <Text style={styles.commonTextStyle}
                                  allowFontScaling={false}>{confirmOrderModel.addressData.receiverPhone}</Text>
                        </View>
                        <UIText
                            value={
                                '收货地址：' + confirmOrderModel.addressData.province
                                + confirmOrderModel.addressData.city
                                + confirmOrderModel.addressData.area
                                + confirmOrderModel.addressData.address
                            }
                            style={styles.receiverAddressStyle}/>
                    </View>
                    <Image source={arrow_right} style={styles.arrowRightStyle} resizeMode={'contain'}/>
                </TouchableOpacity> :
                <TouchableOpacity
                    style={{
                        height: ScreenUtils.autoSizeWidth(87),
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onPress={this.props.selectAddress}>
                    <UIImage source={position} style={{
                        height: ScreenUtils.autoSizeWidth(20),
                        width: ScreenUtils.autoSizeWidth(20),
                        marginLeft: ScreenUtils.autoSizeWidth(20)
                    }} resizeMode={'contain'}/>
                    <View style={{
                        flex: 1,
                        marginLeft: ScreenUtils.autoSizeWidth(15),
                        marginRight: ScreenUtils.autoSizeWidth(20)
                    }}>
                        <UIText value={'请添加一个收货人地址'} style={styles.hintStyle}/>
                    </View>
                    <Image source={arrow_right} style={styles.arrowRightStyle} resizeMode={'contain'}/>
                </TouchableOpacity>
        );
    };
    renderSelectImage = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginBottom: ScreenUtils.autoSizeWidth(10) }}>
                    <Image source={colorLine} style={{ height: 3, width: ScreenUtils.width }}/>
                </View>
                {confirmOrderModel.orderParamVO.orderType === 3 ?
                    <View style={styles.giftOutStyle}>
                        <View style={styles.giftInnerStyle}>
                            <Text style={styles.giftTextStyles} allowFontScaling={false}>礼包</Text>
                        </View>
                    </View>
                    :
                    null}
            </View>
        );
    };
}
const styles = StyleSheet.create({
    addressSelectStyle: {
        minHeight: ScreenUtils.autoSizeWidth(80),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ScreenUtils.autoSizeWidth(10),
        paddingBottom: ScreenUtils.autoSizeWidth(10)
    },
    commonTextStyle: {
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.textColor_mainTitle
    },
    arrowRightStyle: {
        width: ScreenUtils.autoSizeWidth(10),
        height: ScreenUtils.autoSizeWidth(14),
        marginRight: ScreenUtils.autoSizeWidth(15)
    },

    receiverAddressStyle: {
        fontSize: ScreenUtils.px2dp(13),
        color: DesignRule.textColor_mainTitle,
        marginTop: ScreenUtils.autoSizeWidth(5)
    },
    giftOutStyle: {
        marginTop: ScreenUtils.autoSizeWidth(20),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    giftInnerStyle: {
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: DesignRule.mainColor,
        marginLeft: ScreenUtils.autoSizeWidth(20)
    },
    giftTextStyles: {
        fontSize: ScreenUtils.px2dp(11),
        color: DesignRule.mainColor,
        padding: ScreenUtils.autoSizeWidth(3)
    }
});
