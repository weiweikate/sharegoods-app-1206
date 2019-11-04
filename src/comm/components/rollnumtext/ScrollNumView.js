/**
 * @author xzm
 * @date 2019/11/4
 */

import React, { PureComponent } from 'react';
import {
    requireNativeComponent,
    processColor
} from 'react-native';

const MrScrollNumberView = requireNativeComponent('MrScrollNumberView');
export default class ScrollNumView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render(){
      let {color = '#000',num,fontSize,...attributes } = this.props;
      let data = {
          color:processColor(color),
          num,
          fontSize
      }
      return(<MrScrollNumberView {...attributes} data={data}/>)
  }
}
