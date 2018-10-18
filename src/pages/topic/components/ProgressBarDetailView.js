/**
 * Created by xiangchen on 2018/8/7.
 */
import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';

export default class ProgressBarDetailView extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageLength:this.props.imageLength,
            nav:this.props.nav,
            num:this.props.num
        }
    }

    render(){
        return(
            <View style={[styles.container,{alignItems:"center",justifyContent:'center'}]}>
                <View style={{width:this.state.nav * 98, height: 12, borderRadius: 6,backgroundColor:'#fffc00'
                    ,left:0,top:0,position:'absolute'}} />
                <Text style={{fontSize: 11,color:'#e60012'}}>{this.state.nav == 1 ? '已售完' : `还剩 ${this.state.num}件`}</Text>
            </View>
        )
    }

}
const  styles = StyleSheet.create({
    container:{
        width: 98,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#f1c11b"
    },
});
