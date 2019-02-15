/**
 * Created by xiangchen on 2018/7/24.
 */
import React from 'react';
import {
     StyleSheet, View,  DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
import StringUtils from "../../utils/StringUtils";
import DateUtils from '../../utils/DateUtils';
import BasePage from '../../BasePage';
import {RefreshList} from "../../components/ui";
import MessageAPI from '../message/api/MessageApi';
import Toast from '../../utils/bridge';
import EmptyUtils from "../../utils/EmptyUtils";
const { px2dp } = ScreenUtils;
import CommonUtils from '../../utils/CommonUtils'
import MessageUtils from './utils/MessageUtils'
import DesignRule from '../../constants/DesignRule';
import RES from './res';
const emptyIcon = RES.message_empty;
import {MRText as Text} from '../../components/ui'

export default class MessageGatherPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            isEmpty: false,
            // currentPage: 1,
        }
        this.displayTime = null;
        this.currentPage = 1;
    }
    $navigationBarOptions = {
        title:'消息',
        show: true // false则隐藏导航
    };

    $isMonitorNetworkStatus(){
        return true;
    }


    componentDidMount() {
        this.loadPageData();
    }



    loadPageData =()=> {
        Toast.showLoading()
        MessageAPI.queryMessage({page: 1, pageSize: 10, type:100}).then(res => {
            DeviceEventEmitter.emit("contentViewed");
            Toast.hiddenLoading()
            if(StringUtils.isNoEmpty(res.data.data)){
                let arrData = [];
                res.data.data.map((item, index) => {
                    arrData.push(item);
                });
                if(!EmptyUtils.isEmptyArr(arrData)){
                    this.displayTime = arrData[arrData.length - 1].displayTime;
                }
                this.setState({viewData: arrData})
            }else{
                Toast.toast(res.msg);
                this.setState({isEmpty:true})
            }
        }).catch(error=>{
            this.$toastShow(error.msg);
            this.setState({isEmpty:true})
            Toast.hiddenLoading()

        });
    }

    renderItem = ({item, index})=> {
        let btn = (
            <TouchableWithoutFeedback onPress={()=>{MessageUtils.goDetailPage(this.$navigate,item.paramType,item.param,item.displayTime)}}>
                <View style={{height:33,width:ScreenUtils.width, alignItems: 'center',justifyContent:'center',backgroundColor:'white',borderTopColor: DesignRule.lineColor_inGrayBg,borderTopWidth:ScreenUtils.onePixel}}>
                    <Text style={{color:DesignRule.textColor_secondTitle,fontSize:px2dp(13)}}>
                        查看详情>>
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );

        return (
            <View style={{ width: ScreenUtils.width,backgroundColor:'white' }}>
                <View style={styles.itemContents}>
                    <Text style={styles.timeStyle}>{DateUtils.getFormatDate(item.displayTime / 1000 ,'MM/dd hh:mm')}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop:px2dp(15)}}>
                    <Text style={{ marginHorizontal: 15, fontSize: 15, color: DesignRule.textColor_mainTitle }}>{item.title}</Text>
                </View>
                <View style={{ backgroundColor: 'white',marginTop:px2dp(10),marginBottom:px2dp(15) }}>
                    <Text style={{ marginLeft: 15, fontSize: 13,color:DesignRule.textColor_secondTitle ,lineHeight:23}}>{item.content}</Text>
                </View>
                {item.messageType === 200 ? btn : null}
            </View>
        );
    };

    onLoadMore = () => {
        this.currentPage++;
        this.getDataFromNetwork();
    }
    onRefresh = () => {
        this.currentPage = 1;
        this.displayTime = null;
        this.getDataFromNetwork()
    }

    getDataFromNetwork = ()=> {
        MessageAPI.queryMessage({page: this.currentPage, pageSize: 10,type:100,createdTime:this.displayTime}).then(res => {
            if(!EmptyUtils.isEmpty(res)){
                let arrData = CommonUtils.deepClone(this.state.viewData);
                if(this.currentPage === 1){
                    arrData = [];
                }
                res.data.data.map((item, index) => {
                    arrData.push(item);
                });

                if(!EmptyUtils.isEmptyArr(arrData)){
                    this.displayTime = arrData[arrData.length - 1].displayTime;
                }
                this.setState({viewData: arrData});
            }
        }).catch((error)=>{
            this.$toastShow(error.msg);
        })
    }


    _render=()=> {
        return (
            <View style={styles.container}>
                <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyIcon={emptyIcon}
                    emptyTip={'暂无消息通知~'}
                />
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        paddingBottom:20
    },
    typetitleStyle:{
        height: 49,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white"
    },
    typeContentstyle:{
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    typecommentstyle:{
        height: 80,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 15
    },
    bottomlookstyle:{
        height: 41,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    commonttext:{
        marginLeft: 5,
        fontSize: 15
    },
    tilteposition:{
        marginLeft: 15,
        fontSize: 15
    },
    typecontent2:{
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    itemContents: {
        alignItems: 'center',
        backgroundColor:DesignRule.bgColor,
        paddingTop:px2dp(20),
        paddingBottom:px2dp(10)
    },
    timeStyle:{
        color:DesignRule.textColor_instruction,
        fontSize:DesignRule.fontSize_threeTitle
    },
});
