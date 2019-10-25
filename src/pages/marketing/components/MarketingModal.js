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
import {observer} from 'mobx-react';
import ActivityView from './ActivityView';
import SmashEggView from './SmashEggView';
import marketingUtils from '../MarketingUtils';
import ModalType from './ModalType';
import {homeModule} from '../../home/model/Modules';
import {routePush} from '../../../navigation/RouterMap';

@observer
export default class MarketingModal extends PureComponent {

    _contentRender() {
        return (<SmashEggView/>)
    }

    _activityRender(){
        if(!marketingUtils.currentContent || !marketingUtils.currentContent.image){
            return null;
        }

        const {currentContent} = marketingUtils;

        return (
            <ActivityView
                source={{uri: currentContent.image}}
                onPress={()=>{
                    const router = homeModule.homeNavigate(currentContent.linkType, currentContent.linkTypeCode);
                    let params = homeModule.paramsNavigate(currentContent);
                    routePush(router, params);
                }}
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
                    {marketingUtils.type === ModalType.egg ? this._contentRender() : null}
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
