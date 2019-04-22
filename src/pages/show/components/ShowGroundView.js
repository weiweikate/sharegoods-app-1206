/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { Component } from 'react';
import { requireNativeComponent,findNodeHandle,UIManager } from 'react-native';

const RCTShowGroundView = requireNativeComponent('ShowGroundView', ShowGroundView);
const NativeHeader = requireNativeComponent('ShowHeaderView');
const RCT_SHOWGROUND_REF = 'showGroundViewRef'
export default class ShowGroundView extends Component {

    replaceData = (index, num) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowGroundView.Commands.replaceData,
            [index,num]
        );    };

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

