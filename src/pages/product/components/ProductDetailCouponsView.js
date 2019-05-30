import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import ProductApi from '../api/ProductApi';
import { observable } from 'mobx';
import bridge from '../../../utils/bridge';
import res from '../res/product';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';

const { arrow_right_black } = res.button;
const { width, height } = ScreenUtils;

export default class ProductDetailCouponsView extends React.Component {

    render() {
        const { onPress } = this.props;
        return (
            <NoMoreClick style={styles.container} onPress={onPress}>
                <View>
                    <MRText style={styles.leftText}>优惠</MRText>
                </View>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15,
        height: 44, backgroundColor: 'white'
    },
    leftText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    }
});

export class ProductDetailCouponsViewModel {
    @observable couponsList = [];
    spuCode = '';
    /*请求*/
    requestListProdCoupon = (spuCode) => {
        this.spuCode = spuCode;
        ProductApi.listProdCoupon({ spuCode }).then(() => {
            this.couponsList = [];
        }).catch((e) => {
        });
    };

    requestGetProdCoupon = (item) => {
        const { couponId } = item || {};
        ProductApi.getProdCoupon({ couponId: couponId }).then(() => {
            this.requestGetProdCoupon(this.spuCode);
        }).catch((e) => {
            this.requestGetProdCoupon(this.spuCode);
            bridge.$toast(e.msg);
        });
    };
}


export class ProductDetailCouponsWindowView extends React.Component {
    state = {
        hidden: true
    };

    showWindowView = () => {
        this.setState({
            hidden: false
        });
    };

    render() {
        const { hidden } = this.state;
        if (hidden) {
            return null;
        }
        return (
            <NoMoreClick style={windowStyles.container} onPress={() => {
                this.setState({ hidden: true });
            }}>

            </NoMoreClick>
        );
    }
}

const windowStyles = StyleSheet.create({
    container: {
        zIndex: 2000,
        position: 'absolute', width, height, left: 0, top: 0,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
});
