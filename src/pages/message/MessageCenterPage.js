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
// import HomeApi from '../home/api/HomeAPI';
// import Toast from '../../utils/bridge';

import MessageApi from './api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils'
const { px2dp } = ScreenUtils;


export default class MessageCenterPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData:[],
            explain:"",
            shopMessageCount:0,
            noticeCount:0,
            messageCount:0
        }
    }
    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title:'消息中心'
    };


    componentDidMount() {
        this.loadPageData();
        DeviceEventEmitter.addListener("contentViewed",this.loadPageData)
    }

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
        MessageApi.getNewNoticeMessageCount().then(res => {
                if(!EmptyUtils.isEmpty(res.data)){
                    this.setState({
                        shopMessageCount:res.data.shopMessageCount,
                        noticeCount:res.data.noticeCount,
                        messageCount:res.data.messageCount,
                    })
                }
        }).catch((error)=>{
            this.$toastShow(error.msg)
        });
    }

    componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners();
    }
    // refreshContentNum=()=>{
    //     HomeApi.queryPushNum().then(res => {
    //         if(res.ok&&typeof res.data ==='object'){
    //             let arrs=[];
    //             arrs.push(res.data.noticeNum);
    //             arrs.push(res.data.messageNum);
    //             arrs.push(res.data.storeMessageNum);
    //             this.setState({
    //                 viewData:arrs
    //             })
    //         }else{
    //             Toast.toast(res.msg);
    //         }
    //     });
    // };
    orderMenuJump(i){
        switch(i){
            case 0:
              this.$navigate("message/NotificationPage");
                break;
            case 1:
                this.$navigate("message/MessageGatherPage",{type:100});
                break;

            case 2:
                this.$navigate("message/ShopMessagePage",{type:200});
                break;
        }
    }
    renderBodyView=()=>{
        let leftImage = [noticeIcon,newsIcon,spellIcon];
        let leftText = ['通知','消息','拼店消息'];
        let arr = [];
        for (let i = 0;i < leftImage.length;i++){
            let count;
            if(i === 0){
                count = this.state.noticeCount;
            }
            if(i === 1){
                count = this.state.messageCount;
            }
            if(i === 2){
                count = this.state.shopMessageCount;
            }


            arr.push(
                <View key={i} style={{width:ScreenUtils.width,height:60,marginTop:11}}>
                    <TouchableOpacity  style={{flex:1,justifyContent:'space-between',alignItems:'center',height:44,paddingLeft:21,paddingRight:28,backgroundColor:color.white,flexDirection:'row'}} onPress={()=>this.orderMenuJump(i)}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={leftImage[i]} style={{height:35,}} resizeMode={'contain'}/>
                            <UIText value={leftText[i]} style={[{fontSize:15,marginLeft:5}]}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {count ? <View style={{marginRight:7,backgroundColor:color.red,borderRadius:px2dp(8.5),height:px2dp(17),paddingHorizontal:px2dp(9),alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:"white",includeFontPadding:false, fontSize: px2dp(13)}}>{count}</Text>
                            </View> : null}
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
