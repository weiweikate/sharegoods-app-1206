import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText, NoMoreClick } from '../../../components/ui';
import res from '../res/product';
import DesignRule from '../../../constants/DesignRule';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import RouterMap, { navigate } from '../../../navigation/RouterMap';
import MineAPI from '../../mine/api/MineApi';

const { arrow_right_black } = res.button;
const { pAddress } = res;

@observer
export class ProductDetailSetAddressView extends React.Component {
    render() {
        const { productDetailAddressModel } = this.props;
        const { addressText } = productDetailAddressModel;
        return (
            <NoMoreClick style={pStyles.containerView} onPress={() => {
                navigate(RouterMap.ProductAddressListPage, { productDetailAddressModel });
            }}>
                <MRText style={pStyles.nameText}>选择</MRText>
                <MRText style={pStyles.valueText}>配送至:{addressText}</MRText>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
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
        const { addressText } = productDetailAddressModel;
        return (
            <View style={sStyles.containerView}>
                <View style={sStyles.lineView}/>
                <View style={sStyles.contentView}>
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
                            }}>{addressText}</MRText>
                        </View>
                    </View>
                    <Image source={arrow_right_black}/>
                </View>
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
    }
});

export class ProductDetailAddressModel {
    @observable addressText = '杭州市 萧山区';
    @observable addressCode = '330109';
    @observable addressList = [];

    requestAddress = () => {
        MineAPI.queryAddrList().then((data) => {
            this.addressList = data.data || [];
        });
    };
}
