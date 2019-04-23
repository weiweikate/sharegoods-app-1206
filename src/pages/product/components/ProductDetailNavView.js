import React, { Component } from 'react';
import { View, StyleSheet, Image, Clipboard } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import res from '../res/product';
import RouterMap, { navigateBack, navigate } from '../../../navigation/RouterMap';
import { MRText } from '../../../components/ui';
import bridge from '../../../utils/bridge';
import DesignRule from '../../../constants/DesignRule';
import { observer } from 'mobx-react';

const { back, share, shopCar } = res.pDetailNav;
const { statusBarHeight } = ScreenUtils;

@observer
export default class ProductDetailNavView extends Component {
    render() {
        const { showAction, productDetailModel } = this.props;
        const { name, showNavText } = productDetailModel;
        return (
            <View style={styles.bgView}>
                <View style={[styles.barItemContainer, { justifyContent: 'flex-start' }]}>
                    <NoMoreClick style={styles.btnContainer} onPress={() => {
                        navigateBack();
                    }}>
                        <Image source={back}/>
                    </NoMoreClick>
                </View>
                <View style={styles.centerView}>
                    {showNavText && <MRText style={styles.centerText}
                                            numberOfLines={1}
                                            onLongPress={() => {
                                                Clipboard.setString(name);
                                                bridge.$toast('已将商品名称复制至剪贴板');
                                            }}>{name}</MRText>}
                </View>
                <View style={[styles.barItemContainer, { justifyContent: 'flex-end' }]}>
                    <NoMoreClick style={styles.btnContainer} onPress={() => {
                        navigate(RouterMap.ShopCart, { hiddeLeft: false });
                    }}>
                        <Image source={shopCar}/>
                    </NoMoreClick>
                    <NoMoreClick style={styles.btnContainer} onPress={showAction}>
                        <Image source={share}/>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        zIndex: 1025,
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', paddingTop: statusBarHeight,
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
    }
});
