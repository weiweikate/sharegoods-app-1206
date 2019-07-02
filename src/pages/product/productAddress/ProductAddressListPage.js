import React from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import res from '../res/product';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import ScreenUtils from '../../../utils/ScreenUtils';
import RouterMap, { routePush, popToRouteName } from '../../../navigation/RouterMap';
import { observer } from 'mobx-react';

const { pAddress } = res;
const { px2dp, safeBottom } = ScreenUtils;

@observer
export class ProductAddressPage extends BasePage {
    $navigationBarOptions = {
        title: '配送至'
    };

    _renderItem = ({ item }) => {
        const { receiverPhone, receiver, province, city, area, address, areaCode } = item;
        return (
            <NoMoreClick style={styles.itemView} onPress={() => {
                const { productDetailAddressModel } = this.params;
                productDetailAddressModel.addressSelectedText = `${province || ''}${city || ''}${area || ''}`;
                productDetailAddressModel.addressSelectedCode = areaCode;
                popToRouteName(RouterMap.ProductDetailPage);
            }}>
                <View style={styles.itemTopView}>
                    <MRText style={styles.itemNameText}>{receiver || ''}</MRText>
                    <MRText style={styles.itemPhoneText}>{receiverPhone || ''}</MRText>
                </View>
                <MRText
                    style={styles.itemAddressText}>{`${province || ''}${city || ''}${area || ''}${address || ''}`}</MRText>
            </NoMoreClick>
        );
    };

    _keyExtractor = (item, index) => {
        return item.areaCode + index;
    };

    _render() {
        const { productDetailAddressModel } = this.params;
        const { showAreaText, addressList } = productDetailAddressModel;
        return (
            <View style={{ flex: 1 }}>
                <MRText style={styles.sectionText}>当前配送至</MRText>
                <View style={styles.section1View}>
                    <Image source={pAddress} style={styles.addressImg}/>
                    <MRText style={styles.section1ViewText}>{showAreaText}</MRText>
                </View>
                <MRText style={styles.sectionText}>从我的收货地址选择</MRText>
                <FlatList data={addressList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          showsVerticalScrollIndicator={false}/>
                <View style={styles.bottomView}>
                    <NoMoreClick style={styles.bottomBtn} onPress={() => {
                        routePush(RouterMap.AddressSelectPage, { productDetailAddressModel });
                    }}>
                        <MRText style={styles.bottomText}>选择其他地区</MRText>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sectionText: {
        paddingLeft: 15, paddingVertical: 10,
        color: DesignRule.textColor_instruction, fontSize: 12
    },
    section1View: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 15,
        backgroundColor: 'white', borderRadius: 5
    },
    addressImg: {
        marginRight: 6, marginLeft: 12,
        width: 11, height: 14
    },
    section1ViewText: {
        flex: 1, paddingVertical: 15,
        color: DesignRule.textColor_mainTitle, fontSize: 14
    },

    itemView: {
        marginHorizontal: 15, marginBottom: 10,
        backgroundColor: 'white', borderRadius: 5
    },
    itemTopView: {
        flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10
    },
    itemNameText: {
        marginLeft: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },
    itemPhoneText: {
        marginRight: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },
    itemAddressText: {
        paddingBottom: 10, paddingHorizontal: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 14
    },

    bottomView: {
        height: 49 + safeBottom, alignItems: 'center'
    },
    bottomBtn: {
        marginTop: 4.5, justifyContent: 'center', alignItems: 'center',
        height: 40, backgroundColor: DesignRule.mainColor, borderRadius: 20, width: px2dp(345)
    },
    bottomText: {
        fontSize: 17, color: 'white'
    }
});

export default ProductAddressPage;
