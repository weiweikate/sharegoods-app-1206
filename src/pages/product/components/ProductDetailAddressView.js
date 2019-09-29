import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText, NoMoreClick } from '../../../components/ui';
import res from '../res/product';
import DesignRule from '../../../constants/DesignRule';
import { observable, computed, autorun, action } from 'mobx';
import { observer } from 'mobx-react';
import RouterMap, { routeNavigate, routePush } from '../../../navigation/RouterMap';
import MineAPI from '../../mine/api/MineApi';
import ProductApi from '../api/ProductApi';
import user from '../../../model/user';
import { SectionLineView } from './ProductDetailSectionView';

const { arrow_right_black } = res.button;
const { pAddress } = res;

@observer
export class ProductDetailSetAddressView extends React.Component {
    render() {
        const { productDetailAddressModel } = this.props;
        const { showAreaText } = productDetailAddressModel;
        return (
            <View>
                <SectionLineView/>
                <NoMoreClick style={pStyles.containerView} onPress={() => {
                    if (!user.isLogin) {
                        routeNavigate(RouterMap.LoginPage);
                        return;
                    }
                    routePush(RouterMap.ProductAddressListPage, { productDetailAddressModel });
                }}>
                    <MRText style={pStyles.nameText}>选择</MRText>
                    <MRText style={pStyles.valueText}>配送至: {showAreaText}</MRText>
                    <Image resizeMode={'contain'} source={arrow_right_black} style={{ height: 10 }}/>
                </NoMoreClick>
            </View>
        );
    }
}

const pStyles = StyleSheet.create({
    containerView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
        backgroundColor: 'white', height: 44
    },
    nameText: {
        paddingRight: 10,
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    valueText: {
        flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 13
    }
});

@observer
export class ProductDetailSkuAddressView extends React.Component {
    render() {
        const { productDetailAddressModel } = this.props;
        const { showAreaText, areaSkuList } = productDetailAddressModel;
        return (
            <View style={sStyles.containerView}>
                <View style={sStyles.lineView}/>
                <NoMoreClick style={sStyles.contentView} onPress={() => {
                    if (!user.isLogin) {
                        routeNavigate(RouterMap.LoginPage);
                        return;
                    }
                    routePush(RouterMap.ProductAddressListPage, { productDetailAddressModel });
                }}>
                    <View style={sStyles.content1View}>
                        <MRText style={{ color: DesignRule.textColor_mainTitle, fontSize: 14 }}>配送区域 <MRText style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: 10
                        }}>(配送地可能会影响库存，请正确选择)</MRText></MRText>
                        <View style={sStyles.addressView}>
                            <Image source={pAddress} style={sStyles.addressImg}/>
                            <MRText style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 12,
                                flex: 1
                            }}>{showAreaText}</MRText>
                        </View>
                    </View>
                    <Image resizeMode={'contain'} source={arrow_right_black} style={{ height: 10 }}/>
                </NoMoreClick>
                {(areaSkuList && areaSkuList.length === 0) && <MRText style={sStyles.noSkuAlert}>该地区不支持配送</MRText>}
                <View style={sStyles.lineView}/>
            </View>
        );
    }
}

const sStyles = StyleSheet.create({
    containerView: {
        marginHorizontal: 15
    },
    lineView: {
        backgroundColor: DesignRule.lineColor_inWhiteBg, height: 0.5
    },
    contentView: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 9
    },
    content1View: {
        flex: 1
    },
    addressView: {
        marginTop: 10,
        flexDirection: 'row', alignItems: 'center'
    },
    addressImg: {
        marginRight: 8,
        width: 11, height: 14
    },
    noSkuAlert: {
        paddingLeft: 20, paddingBottom: 9,
        color: DesignRule.textColor_redWarn, fontSize: 12
    }
});

export class ProductDetailAddressModel {

    @observable prodCode = null;
    @observable templateCode = null;
    /*个人地址列表*/
    @observable addressList = [];
    /*手动选择的区域*/
    @observable addressSelectedText = null;
    @observable provinceCode = null;
    @observable cityCode = null;
    @observable areaCode = null;

    paramAddressItem = {
        province: '浙江省', city: '杭州市', area: '萧山区',
        provinceCode: '330000000', cityCode: '330100000', areaCode: '330109000'
    };

    /*区域库存(地区变化就需要更新)  未请求成功为null*/
    @observable areaSkuList = null;

    @observable freightPrice = null;

    @action setAddressItem = (item) => {
        this.paramAddressItem = item;

        const { province, city, provinceCode, cityCode, area, areaCode } = item;
        this.addressSelectedText = `${province || ''}${city || ''}${area || ''}`;
        this.provinceCode = provinceCode;
        this.cityCode = cityCode;
        this.areaCode = areaCode;
    };

    @computed get showAreaText() {
        if (this.addressSelectedText) {
            return this.addressSelectedText;
        }
        for (const item of this.addressList) {
            if (item.defaultStatus === 1) {
                return item.province + item.city + item.area;
            }
        }
        return '杭州市萧山区';
    }

    @computed get getProvinceCode() {
        if (this.provinceCode) {
            return this.provinceCode;
        }
        for (const item of this.addressList) {
            if (item.defaultStatus === 1) {
                return item.provinceCode;
            }
        }
        return '330000000';
    }

    @computed get getCityCode() {
        if (this.cityCode) {
            return this.cityCode;
        }
        for (const item of this.addressList) {
            if (item.defaultStatus === 1) {
                return item.cityCode;
            }
        }
        return '330100000';
    }

    @computed get getAreaCode() {
        if (this.areaCode) {
            return this.areaCode;
        }
        for (const item of this.addressList) {
            if (item.defaultStatus === 1) {
                return item.areaCode;
            }
        }
        return '330109000';
    }

    /*地址变化自动更新库存*/
    requestSkuByAreaCode = autorun(() => {
        const { prodCode, getAreaCode } = this;
        if (!prodCode) {
            return;
        }
        ProductApi.getProductSkuStockByAreaCode({
            prodCode: prodCode,
            areaCode: getAreaCode
        }).then((data) => {
            this.areaSkuList = data.data || [];
        });

        const { templateCode } = this;
        ProductApi.freightByTemplateAndArea({
            prodCode,
            templateCode,
            provinceCode: this.getProvinceCode,
            cityCode: this.getCityCode,
            areaCode: getAreaCode
        }).then((data) => {
            this.freightPrice = data.data;
        });
    });

    /*获取收货地址*/
    requestAddress = () => {
        MineAPI.queryAddrList().then((data) => {
            this.addressList = data.data || [];
            for (const item of this.addressList) {
                if (item.defaultStatus === 1) {
                    this.paramAddressItem = item;
                }
            }
        });
    };
}
