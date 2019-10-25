/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { Component } from 'react';
import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import NativeHeader from './ShowHeaderView';

const RCTShowAttention = requireNativeComponent('ShowAttentionView', ShowAttentionView);

const RCT_SHOWGROUND_REF = 'showGroundViewRef';


// public static final int SCROLL_STATE_IDLE = 0;//停止状态
// public static final int SCROLL_STATE_DRAGGING = 1;//拖动状态
// public static final int SCROLL_STATE_SETTLING = 2;//甩动状态
export default class ShowAttentionView extends Component {

    replaceData = (index, num) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowAttentionView.Commands.replaceData,
            [index, num]
        );
    };
    addDataToTop = (data) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowAttentionView.Commands.addDataToTop,
            [data]
        );
    };

    replaceItemData = (index, data) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowAttentionView.Commands.replaceItemData,
            [index, data]
        );
    };

    scrollToTop = () => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowAttentionView.Commands.scrollToTop,
            []
        );
    };


    getHandle = () => {
        return findNodeHandle(this.refs[RCT_SHOWGROUND_REF]);
    };

    render() {
        return (
            <RCTShowAttention
                {...this.props}
                ref={RCT_SHOWGROUND_REF}
            >
                {this.props.renderHeader &&
                <NativeHeader>
                    {this.props.renderHeader}
                </NativeHeader>}
            </RCTShowAttention>
        );
    }
}

