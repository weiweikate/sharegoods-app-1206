/**
 * Created by nuomi on 2018/7/18.
 * 消息中心页面
 */
import React from 'react'
import { StyleSheet, View, Text, Image,DeviceEventEmitter,
    TouchableOpacity,  ScrollView} from 'react-native'
import {
    UIText,
} from '../../components/ui'
import {color} from "../../constants/Theme";
import ScreenUtils from '../../utils/ScreenUtils'
import BasePage from '../../BasePage';
import noticeIcon from "./src/icon_03.png";
import newsIcon from "./src/icon_06.png"
import spellIcon from  "./src/icon_08.png"
import arrow_right from '../order/res/arrow_right.png'
import HomeApi from '../home/api/HomeAPI';
import Toast from '../../utils/bridge';
export default class MessageCenterPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData:[],
            explain:"",
            storeMessageNum:0,
            noticeNum:0,
            messageNum:0
        }
    }
    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title:'消息中心'
    };

    _render(){
        return(
           // <View style={styles.container}>
             //   {this.renderBodyView()}
           // </View>

            <ScrollView style={styles.container}>
                {this.renderBodyView()}
            </ScrollView>

        )
    }
    loadPageData(){
        HomeApi.queryPushNum().then(res => {
            if(res.ok&&typeof res.data ==='object'){
                let arrs=[];
                arrs.push(res.data.noticeNum);
                arrs.push(res.data.messageNum);
                arrs.push(res.data.storeMessageNum);
                this.setState({
                    viewData:arrs
                })
            }else{
               Toast.toast(res.msg);
            }
        });
    }
    _componentDidMount(){
        DeviceEventEmitter.addListener("contentViewed",this.refreshContentNum)
    }
    _componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners();
    }
    refreshContentNum=()=>{
        HomeApi.queryPushNum().then(res => {
            if(res.ok&&typeof res.data ==='object'){
                let arrs=[];
                arrs.push(res.data.noticeNum);
                arrs.push(res.data.messageNum);
                arrs.push(res.data.storeMessageNum);
                this.setState({
                    viewData:arrs
                })
            }else{
                Toast.toast(res.msg);
            }
        });
    };
    orderMenuJump(i){
        switch(i){
            case 0:
              this.$navigate("message/NotificationPage");
                break;
            case 1:
                this.$navigate("message/MessageGatherPage");
                break;

            case 2:
                this.$navigate("message/ShopMessagePage");
                break;
        }
    }
    renderBodyView=()=>{
        let leftImage=[noticeIcon,newsIcon,spellIcon];
        let leftText=['通知','消息','拼店消息'];
        let arr=[];
        for (let i=0;i<leftImage.length;i++){
            arr.push(
                <View key={i} style={{width:ScreenUtils.width,height:60,marginTop:11}}>
                    <TouchableOpacity  style={{flex:1,justifyContent:'space-between',alignItems:'center',height:44,paddingLeft:21,paddingRight:28,backgroundColor:color.white,flexDirection:'row'}} onPress={()=>this.orderMenuJump(i)}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={leftImage[i]} style={{height:35,}} resizeMode={'contain'}/>
                            <UIText value={leftText[i]} style={[{fontSize:15,marginLeft:5}]}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {!this.state.viewData[i]?null: <View style={{marginLeft:5,marginRight:7,backgroundColor:color.red,borderRadius:5}}>
                                <Text style={{color:"white",margin:3}}>{this.state.viewData[i]}</Text>
                            </View>}
                            <Image source={arrow_right} style={{height:14,}} resizeMode={'contain'}/>
                        </View>
                    </TouchableOpacity>
                </View>

            )
        }
        return arr
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    }
});
