/**
 * @author xzm
 * @date 2019/10/16
 */
import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import {marketingUtils, ModalType} from '../MarketingUtils';
import {autorun} from 'mobx';
import {observer} from 'mobx-react';
import ActivityView from './ActivityView';
import SmashEggView from './SmashEggView';

@observer
export default class MarketingModal extends PureComponent {

    constructor(props) {
        super(props);
        autorun(this._contentRender);
    }

    _contentRender() {
        // return this._eggRender();
        return (<SmashEggView/>)

    }

    _activityRender(){
        //TODO
        let url = 'https://c-ssl.duitang.com/uploads/item/201208/30/20120830173930_PBfJE.thumb.700_0.jpeg';
        let target = 'https://test2h5.sharegoodsmall.com/cycle-coupon?debug';
        return (
            <ActivityView
                source={{uri: url}}
                traget={target}
                onClose={() => {
                    marketingUtils.closeModal();
                }}/>
        )
    }

    _eggRender(){
        return (<SmashEggView/>)
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                marketingUtils.closeModal();
            }}>
                <View style={styles.contain}>
                    {marketingUtils.type === ModalType.activity ? this._activityRender() : null}
                    {marketingUtils.type === ModalType.egg ? this._eggRender() : null}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.width,
        height: ScreenUtils.height,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
