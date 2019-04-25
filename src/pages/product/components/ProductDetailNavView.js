import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import res from '../res/product';
import RouterMap, { navigateBack, navigate } from '../../../navigation/RouterMap';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import { observer } from 'mobx-react';
import ShopCartStore from '../../shopCart/model/ShopCartStore';

const { back, share, shopCar } = res.pDetailNav;
const { statusBarHeight } = ScreenUtils;

@observer
export default class ProductDetailNavView extends Component {
    render() {
        const { getAllGoodsClassNumber } = ShopCartStore;
        /*showNavTextT显示文字(优先) showNavText nav渐变时*/
        const { showAction, productDetailModel, showNavTextT } = this.props;
        const { name, showNavText } = productDetailModel;
        return (
            <View style={[styles.bgView, showNavTextT && { backgroundColor: 'white' }]}>
                <View style={styles.containerView}>
                    <View style={[styles.barItemContainer, { justifyContent: 'flex-start' }]}>
                        <NoMoreClick style={styles.btnContainer} onPress={() => {
                            navigateBack();
                        }}>
                            <Image source={back}/>
                        </NoMoreClick>
                    </View>
                    <View style={styles.centerView}>
                        {showNavTextT || showNavText && <MRText style={styles.centerText}
                                                                numberOfLines={1}>{name}</MRText>}
                    </View>
                    <View style={[styles.barItemContainer, { justifyContent: 'flex-end' }]}>
                        <NoMoreClick style={styles.btnContainer} onPress={() => {
                            navigate(RouterMap.ShopCart, { hiddeLeft: false });
                        }}>
                            <Image source={shopCar}/>
                            {getAllGoodsClassNumber !== 0 && <View style={styles.amountView}>
                                <MRText
                                    style={styles.amountText}>{getAllGoodsClassNumber > 99 ? 99 : getAllGoodsClassNumber}</MRText>
                            </View>}
                        </NoMoreClick>
                        <NoMoreClick style={styles.btnContainer} onPress={showAction}>
                            <Image source={share}/>
                        </NoMoreClick>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        zIndex: 1025,
        position: 'absolute', top: 0, left: 0, right: 0
    },
    containerView: {
        flexDirection: 'row', marginTop: statusBarHeight,
        height: 44
    },
    barItemContainer: {
        flexDirection: 'row',
        width: 88, height: 44
    },
    btnContainer: {
        justifyContent: 'center', alignItems: 'center',
        width: 44, height: 44
    },
    centerView: {
        flex: 1, justifyContent: 'center', alignItems: 'center', height: 44
    },
    centerText: {
        color: DesignRule.textColor_mainTitle, fontSize: 14, fontWeight: 'bold'
    },
    amountView: {
        position: 'absolute', top: 4, right: 8, height: 16,
        paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        borderRadius: 8
    },
    amountText: {
        color: 'white', fontSize: 10
    }
});
