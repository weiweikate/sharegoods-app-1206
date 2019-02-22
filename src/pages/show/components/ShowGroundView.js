/**
 * @author xzm
 * @date 2019/2/18
 */

import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

 const RCTShowGroundView = requireNativeComponent('ShowGroundView', ShowGroundView);
const NativeHeader = requireNativeComponent("ShowHeaderView");

export default class ShowGroundView extends Component {

    render() {
        return (
            <RCTShowGroundView {...this.props}>
                {this.props.renderHeader &&
                <NativeHeader>
                    {this.props.renderHeader}
                </NativeHeader>}
            </RCTShowGroundView>
        );
    }
}

