/**
 * @author xzm
 * @date 2018/10/23
 * @providesModule WaveView
 */

import React, { PureComponent } from 'react';
import {
    requireNativeComponent,
    processColor
} from 'react-native';

const MRWaveView = requireNativeComponent('MRWaveView');
export default class WaveView extends PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <MRWaveView
                style={{height:40,width:40}}
                topTitle={this.props.topTitle}
                waveBackgroundColor={processColor(this.props.waveBackgroundColor)}
                waveColor = {processColor(this.props.waveColor)}
                waveLightColor = {processColor(this.props.waveLightColor)}
                topTitleColor = {processColor(this.props.topTitleColor)}
                topTitleSize = {this.props.topTitleSize}
                progressValue = {this.props.progressValue}
            />
        )
    }

}
