/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { Component } from 'react';
import { requireNativeComponent,findNodeHandle,UIManager } from 'react-native';

const RCTShowActivityView = requireNativeComponent('ShowActivityView', ShowActivityView);
import NativeHeader from './ShowHeaderView'
const RCT_SHOWGROUND_REF = 'showGroundViewRef'

export default class ShowActivityView extends Component {

    replaceData = (index, num) => {
        UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            UIManager.ShowActivityView.Commands.replaceData,
            [index,num]
        );    };

    getHandle = () => {
        return findNodeHandle(this.refs[RCT_SHOWGROUND_REF]);
    };

    render() {
        return (
            <RCTShowActivityView {...this.props}
                               ref={RCT_SHOWGROUND_REF}
            >
                {this.props.renderHeader &&
                <NativeHeader>
                    {this.props.renderHeader}
                </NativeHeader>}
            </RCTShowActivityView>
        );
    }
}

