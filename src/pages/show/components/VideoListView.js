/**
 * @author xzm
 * @date 2019/7/12
 */

import React, { PureComponent } from 'react';
import {
    View,
    Dimensions
} from 'react-native';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class VideoListView extends PureComponent {
    constructor(props) {
        super(props);
    }



    render() {
        return(
            <View >
                <View ref={(ref)=>{this.ref1 = ref}} style={{width,height,position:'absolute',left:0,top:this.state.lastY,backgroundColor:'red'}}/>
                <View ref={(ref)=>{this.ref2 = ref}} style={{width,height,position:'absolute',left:0,top:this.state.currentY,backgroundColor:'blue'}}/>
                <View ref={(ref)=>{this.ref3 = ref}} style={{width,height,position:'absolute',left:0,top:this.state.perY,backgroundColor:'green'}}/>
            </View>
        )
    }
}

// var styles = StyleSheet.create({});

