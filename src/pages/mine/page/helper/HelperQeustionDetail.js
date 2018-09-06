/**
 * Created by xiangchen on 2018/7/12.
 */
import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    WebView
} from 'react-native'
import BasePage from '../../../../BasePage'
import ScreenUtils from "../../../../utils/ScreenUtils";
import { color} from "../../../../constants/Theme";
const headerbar='<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>Title</title> </head> <body><div>';
const botombar='</div></body></html>';
export default class HelperQuestionDetail extends BasePage{
    constructor(props){
        super(props);
        this.state={
            id:"",
            content:""
        }
    }

    _render = ()=>{
        return(
            <View style={{backgroundColor:'#F6F6F6',flex:1}}>
                <View style={{width:ScreenUtils.width,height:ScreenUtils.height/4}}>
                <WebView automaticallyAdjustContentInsets={true} source={{html:headerbar+this.state.content+botombar,baseUrl:''}} />
                </View>
                <View style={{ width:ScreenUtils.width,flex:1,alignItems:'center',justifyContent:'flex-end',marginBottom:40}}>
                    <TouchableOpacity activeOpacity={0.6} onPress={()=>this.feedbackNoUse()} style={{width:150,height:48,marginBottom:20,borderRadius:5,borderWidth:1,borderColor:color.red,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:16,color:color.red}}>没啥帮助?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={()=>this.feedbackGoodUse()} style={{width:150,height:48,borderRadius:5,backgroundColor:color.red,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:16,color:color.white}}>有用</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    loadPageData(){
    }
    feedbackNoUse(){
    }
    feedbackGoodUse(){
    }

}
