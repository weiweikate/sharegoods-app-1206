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
import { observer } from 'mobx-react';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';

const position = res.dizhi;
const arrow_right = res.arrow_right;


@observer
export default class ConfirmAddressView extends Component {


    render() {
        return (
            <View style={{ marginVertical: 10, marginHorizontal: DesignRule.margin_page, borderRadius: 10, overflow: 'hidden'}}>
                {this.renderAddress()}
            </View>
        );
    }

    renderAddress = () => {

      let {receiver,
          receiverPhone,
          province,
          city,
          area,
          street,
          address,
          id
      } =  confirmOrderModel.receiveInfo;
        province = province || '';
        city = city || '';
        area = area || '';
        street = street || '';
        address = address || '';
        return (StringUtils.isNoEmpty(id) ?
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.addressSelectStyle}
                    onPress={this.props.selectAddress}>
                    <UIImage source={position} style={{
                        height: ScreenUtils.autoSizeHeight(30),
                        width: ScreenUtils.autoSizeWidth(30),
                        marginLeft: ScreenUtils.autoSizeWidth(20)
                    }} resizeMode={'contain'}/>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginLeft: ScreenUtils.autoSizeWidth(15),
                        marginRight: ScreenUtils.autoSizeWidth(15)
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.commonTextStyle, { marginRight: ScreenUtils.autoSizeWidth(15) }]}
                                  allowFontScaling={false}>{receiver}</Text>
                            <Text style={styles.commonTextStyle}
                                  allowFontScaling={false}>{receiverPhone}</Text>
                        </View>
                        <UIText
                            value={
                                '收货地址：' + province
                                + city
                                + area
                                + street
                                + address
                            }
                            style={styles.receiverAddressStyle}/>
                    </View>
                    <Image source={arrow_right} style={styles.arrowRightStyle} resizeMode={'contain'}/>
                </TouchableOpacity> :
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        height: ScreenUtils.autoSizeWidth(87),
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onPress={this.props.selectAddress}>
                    <UIImage source={position} style={{
                        height: ScreenUtils.autoSizeWidth(30),
                        width: ScreenUtils.autoSizeWidth(30),
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
}
const styles = StyleSheet.create({
    addressSelectStyle: {
        minHeight: ScreenUtils.autoSizeWidth(80),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ScreenUtils.autoSizeWidth(10),
        paddingBottom: ScreenUtils.autoSizeWidth(10),
    },
    commonTextStyle: {
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.textColor_mainTitle
    },
    arrowRightStyle: {
        height: ScreenUtils.autoSizeWidth(12),
        marginRight: ScreenUtils.autoSizeWidth(15)
    },

    receiverAddressStyle: {
        fontSize: ScreenUtils.px2dp(12),
        color: DesignRule.textColor_instruction,
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
