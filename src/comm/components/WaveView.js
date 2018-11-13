/**
 * @author xzm
 * @date 2018/10/23
 * @providesModule WaveView
 */

import React, { PureComponent } from 'react';
import {
    requireNativeComponent
} from 'react-native';

const MRWaveView = requireNativeComponent('MRWaveView');
export default class WaveView extends PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <MRWaveView style={{height:100,width:100}} topTitle={'V1'}/>
        )
    }

}
