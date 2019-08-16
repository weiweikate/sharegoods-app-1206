/**
 * @author xzm
 * @date 2019/7/8
 */

import React, { PureComponent } from 'react';
import {
    requireNativeComponent,
    processColor
} from 'react-native';

const MRDottedLine = requireNativeComponent('MRDottedLine');

/**
 *  <DottedLine color={'red'} style={{width:200,height:20,backgroundColor:'green'}} space={30} itemWidth={10} isRow={true}/>
 *  <DottedLine color={'red'} style={{width:20,height:200,backgroundColor:'green'}} space={30} itemWidth={10} isRow={false}/>
 */
export default class DottedLine extends PureComponent {
    render(){
        return(
            <MRDottedLine
                {...this.props}
                color={processColor(this.props.color)}
            />
        )
    }
}

