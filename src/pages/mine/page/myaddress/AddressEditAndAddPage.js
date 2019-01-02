import {
   View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import StringUtils from '../../../../utils/StringUtils';
import MineAPI from '../../api/MineApi';
import UIText from '../../../../components/ui/UIText';
import bridge from '../../../../utils/bridge';
import UIImage from '../../../../components/ui/UIImage';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import {MRText as Text, MRTextInput as TextInput} from '../../../../components/ui'

const addrSelectedIcon = res.button.selected_circle_red;
const addrUnSelectedIcon = res.button.unselected_circle;
/**
 * @author luoyongming
 * @date on 2018/9/18
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
const dismissKeyboard = require('dismissKeyboard');
const arrow_right = res.button.arrow_right;

export default class AddressEditAndAddPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        rightTitleStyle: { color: DesignRule.mainColor },
        rightNavTitle: '保存'
    };

    $NavBarRightPressed = () => {
        if (StringUtils.isEmpty(this.state.receiverText)) {
            bridge.$toast('请输入收货人');
            return;
        } else {
            if (this.state.receiverText.length > 16 || this.state.receiverText.length < 2) {
                bridge.$toast('收货人必须2～16位长度');
                return;
            }
        }
        if (StringUtils.isEmpty(this.state.telText)) {
            bridge.$toast('请输入手机号');
            return;
        } else {
            if (!StringUtils.checkPhone(this.state.telText)) {
                bridge.$toast('手机号格式不对');
                return;
            }
        }
        if (StringUtils.isEmpty(this.state.provinceCode)) {
            bridge.$toast('请选择地区');
            return;
        }
        if (StringUtils.isEmpty(this.state.addrText)) {
            bridge.$toast('请填写详细地址');
            return;
        }
        const { refreshing, id, from } = this.params;
        if (from === 'edit') {
            //编辑地址
            MineAPI.addOrEditAddr({
                id: id,
                address: this.state.addrText,
                receiver: this.state.receiverText,
                receiverPhone: this.state.telText,
                provinceCode: this.state.provinceCode,
                cityCode: this.state.cityCode,
                areaCode: this.state.areaCode,
                defaultStatus: this.state.isDefault ? '1' : '2'
            }).then((data) => {
                bridge.$toast('修改成功');
                refreshing && refreshing();
                this.$navigateBack();
            }).catch((data) => {
                bridge.$toast(data.msg);
            });
        } else if (from === 'add') {
            //保存地址
            MineAPI.addOrEditAddr({
                address: this.state.addrText,
                receiver: this.state.receiverText,
                receiverPhone: this.state.telText,
                provinceCode: this.state.provinceCode,
                cityCode: this.state.cityCode,
                areaCode: this.state.areaCode,
                defaultStatus: this.state.isDefault ? '1' : '2'
            }).then((data) => {
                bridge.$toast('添加成功');
                refreshing && refreshing();
                this.$navigateBack();
            }).catch((data) => {
                bridge.$toast(data.msg);
            });
        }
    };

    constructor(props) {
        super(props);
        const { receiver, tel, address, areaText, provinceCode, cityCode, areaCode, isDefault, from } = this.params;
        if (from === 'edit') {
            this.$navigationBarOptions.title = '编辑地址';
        } else if (from === 'add') {
            this.$navigationBarOptions.title = '添加地址';
        }
        this.state = {
            receiverText: receiver || '',
            telText: tel || '',
            areaText: areaText || '',
            addrText: address || '',
            provinceCode: provinceCode,
            provinceName: '',
            cityCode: cityCode,
            cityName: '',
            areaCode: areaCode,
            areaName: '',
            isDefault: isDefault || false,
            from
        };
    }

    _render() {
        return <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.horizontalItem}>
                <Text style={styles.itemLeftText}>收货人</Text>
                <TextInput
                    style={styles.itemRightInput}
                    onChangeText={(text) => this.setState({ receiverText: text })}
                    value={this.state.receiverText}
                />
            </View>
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
            <View style={styles.horizontalItem}>
                <Text style={styles.itemLeftText}>联系电话</Text>
                <TextInput
                    style={styles.itemRightInput} keyboardType={'numeric'}
                    onChangeText={(text) => this.setState({ telText: text })}
                    value={this.state.telText}
                />
            </View>
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
            <TouchableOpacity style={styles.horizontalItem} onPress={() => this._getCityPicker()}>
                <Text style={[styles.itemLeftText, ]}>所在地区</Text>
                <Text style={{flex:1}}>{this.state.areaText}</Text>
                <Image source={arrow_right} style={{ width: 9, height: 15, marginLeft: 4 }} resizeMode={'contain'}/>
            </TouchableOpacity>
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
            <View style={{ backgroundColor: 'white' }}>
                <TextInput
                    style={styles.itemAddressInput}
                    placeholder={'请输入详细地址~'}
                    placeholderTextColor={DesignRule.textColor_instruction}
                    maxLength={90}
                    multiline={true}
                    onChangeText={(text) => this.setState({ addrText: text })}
                    value={this.state.addrText}
                />
            </View>
            {
                this.state.from === 'add' ?
                    <View style={{
                        backgroundColor: 'white',
                        marginTop: 10,
                        flexDirection: 'row',
                        height: 44,
                        alignItems: 'center'
                    }}>
                        <UIText value={'是否设为默认地址'} style={[styles.itemLeftText, { flex: 1, marginLeft: 20 }]}/>
                        <UIImage source={this.state.isDefault ? addrSelectedIcon : addrUnSelectedIcon} style={{
                            width: 16,
                            height: 16,
                            paddingRight: 14,
                            marginRight: 16,
                            paddingLeft: 16,
                            paddingTop: 12,
                            paddingBottom: 12
                        }} resizeMode={'contain'} onPress={() => this.setState({ isDefault: !this.state.isDefault })}/>
                    </View> : null}
        </View>;
    }

    _getCityPicker = () => {
        dismissKeyboard();
        this.$navigate('mine/address/SelectAreaPage', {
            setArea: this.setArea.bind(this),
            tag: 'province',
            fatherCode: '0'
        });
    };

    setArea(provinceCode, provinceName, cityCode, cityName, areaCode, areaName, areaText) {
        console.log(areaText);
        this.setState({
            areaText: areaText,
            provinceCode: provinceCode,
            provinceName: provinceName,
            cityCode: cityCode,
            cityName: cityName,
            areaCode: areaCode,
            areaName: areaName
        });
    }
}

const styles = StyleSheet.create({
    horizontalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        height: 45,
        backgroundColor: 'white'
    },
    itemLeftText: {
        width: 64,
        marginRight: 6,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    itemRightInput: {
        flex: 1,
        height: 40,
        padding: 0,
        color: DesignRule.textColor_mainTitle_222,
        fontSize: 13
    },
    itemAddressInput: {
        height: 105,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        padding: 0,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 12,
        paddingBottom: 12,
        color: DesignRule.textColor_mainTitle,
        fontSize: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: DesignRule.lineColor_inColorBg
    }
});
