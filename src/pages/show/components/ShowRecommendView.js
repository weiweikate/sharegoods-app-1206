/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { Component } from 'react';
import { requireNativeComponent,findNodeHandle,UIManager } from 'react-native';

const RCTShowRecommendView = requireNativeComponent('ShowRecommendView', ShowRecommendView);
import NativeHeader from './ShowHeaderView'
const RCT_SHOWGROUND_REF = 'showGroundViewRef'


// public static final int SCROLL_STATE_IDLE = 0;//停止状态
// public static final int SCROLL_STATE_DRAGGING = 1;//拖动状态
// public static final int SCROLL_STATE_SETTLING = 2;//甩动状态
export default class ShowRecommendView extends Component {

    replaceData = (index, num) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowRecommendView.Commands.replaceData,
            [index,num]
        );    };

    getHandle = () => {
        return findNodeHandle(this.refs[RCT_SHOWGROUND_REF]);
    };

    render() {
        return (
            <RCTShowRecommendView {...this.props}
                               ref={RCT_SHOWGROUND_REF}
            >
                {this.props.renderHeader &&
                <NativeHeader>
                    {this.props.renderHeader}
                </NativeHeader>}
            </RCTShowRecommendView>
        );
    }
}

