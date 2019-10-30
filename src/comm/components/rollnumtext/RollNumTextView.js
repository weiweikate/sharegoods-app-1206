/**
 * @author xzm
 * @date 2019/10/24
 */

import React, {Component} from 'react';
import {
  View,
} from 'react-native';
import SingleNumView from './SingleNumView';

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default class RollNumTextView extends Component {

  renderAllNum = ()=>{
      const {num,speed} = this.props;
      const {fontSize,singleStyle} = this.props;
      const numStr = `${num}`;
      let views = [];
      for(let i = 0;i<numStr.length;i++){
          if(nums.indexOf(numStr.charAt(i)) != -1){
              views.push(<SingleNumView speed={speed} singleStyle={singleStyle} fontSize={fontSize} num={parseInt(numStr.charAt(i))}/>)
          }
      }
      return views;
  }

  render(){
      const {fontSize,contentStyle} = this.props;
      const fontHeight = fontSize * 1.4;
      return(
          <View style={[{flexDirection:'row',height:fontHeight,alignItems:'center'},contentStyle]}>
              {this.renderAllNum()}
          </View>
      )
  }


}


