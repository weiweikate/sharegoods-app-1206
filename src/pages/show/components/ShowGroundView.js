/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { Component } from 'react';
import { requireNativeComponent, findNodeHandle, UIManager } from 'react-native';

const RCTShowGroundView = requireNativeComponent('ShowGroundView', ShowGroundView);
import NativeHeader from './ShowHeaderView';

const RCT_SHOWGROUND_REF = 'showGroundViewRef';


// public static final int SCROLL_STATE_IDLE = 0;//停止状态
// public static final int SCROLL_STATE_DRAGGING = 1;//拖动状态
// public static final int SCROLL_STATE_SETTLING = 2;//甩动状态
export default class ShowGroundView extends Component {

    replaceData = (index, num) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowGroundView.Commands.replaceData,
            [index, num]
        );
    };
    addDataToTop = (data) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowGroundView.Commands.addDataToTop,
            [data]
        );
    };

    getHandle = () => {
        return findNodeHandle(this.refs[RCT_SHOWGROUND_REF]);
    };

    render() {
        return (
            <RCTShowGroundView {...this.props}
                               ref={RCT_SHOWGROUND_REF}
            >
                {this.props.renderHeader &&
                <NativeHeader>
                    {this.props.renderHeader}
                </NativeHeader>}
            </RCTShowGroundView>
        );
    }
}

