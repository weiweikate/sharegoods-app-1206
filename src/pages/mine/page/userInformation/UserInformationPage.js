import React ,{Component}from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'
import TakePhotoModal from "../../components/TakePhotoModal";
import {color} from '../../../../constants/Theme'
import UserSingleItem from '../../components/UserSingleItem'
import user from '../../../../model/user'
import BusinessUtils from '../../components/BusinessUtils'
import {observer} from 'mobx-react/native';
const dismissKeyboard = require('dismissKeyboard');

@observer
export default class UserInformationPage extends Component {

    static $PageOptions = {
        navigationBarOptions: {
            title: '个人资料',
        },
    };

    constructor(props) {
        super(props)
        this.state={
            hasVertifyID:false,
            isShowTakePhotoModal:false,
            nickName:'zhangsan'
        }
    }

    renderLine=()=>{
        return(
            <View style={{height:1,backgroundColor:color.line}}/>
        )
    }

    renderWideLine=()=>{
        return(
            <View style={{height:10,backgroundColor:color.page_background}}/>
        )
    }
    renderModal = () => {
        return (
            <View>
                <TakePhotoModal
                    isShow={this.state.isShowTakePhotoModal}
                    closeWindow={()=>{
                        this.setState({isShowTakePhotoModal:false})
                    }}
                    takePhoto={()=>{
                        this.setState({isShowTakePhotoModal:false})
                    }}
                    selectPhoto={()=>{
                        this.setState({isShowTakePhotoModal:false})
                    }}
                />
            </View>

        )
    }
    render() {
        return (
            <View style={{backgroundColor: color.white}}>

                {this.renderWideLine()}

                <UserSingleItem leftText={'头像'} rightText={''} rightTextStyle={styles.grayText} leftTextStyle={styles.blackText} headImage={user.headImg} onPress={()=>this.takePhoto()}/>
                <UserSingleItem leftText={'昵称'} rightText={user.nickName} rightTextStyle={styles.grayText} leftTextStyle={styles.blackText}  isLine={false} onPress={()=>this.jumpToNickNameModifyPage()}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={'授权ID'} rightText={user.code} rightTextStyle={styles.grayText} leftTextStyle={styles.blackText} isArrow={false}/>
                <UserSingleItem leftText={'会员等级'} rightText={user.levelName} rightTextStyle={[styles.grayText,{color:color.white}]} leftTextStyle={styles.blackText} isArrow={false} circleStyle={{borderRadius: 10, backgroundColor: "#ff7e00",paddingLeft:10,paddingRight:10,marginRight:15}}/>
                <UserSingleItem leftText={'手机号'} rightText={user.phone} rightTextStyle={styles.grayText} leftTextStyle={styles.blackText} isArrow={false} isLine={false}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={'所在区域'} rightText={(user.province || " ")+'-'+(user.city || ' ')+'-'+(user.area || ' ')} rightTextStyle={styles.grayText} leftTextStyle={styles.blackText} isLine={false} onPress={()=>this.renderGetCityPicker()}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={'实名认证'} rightText={user.isRealNameRegistration?'已实名认证':'未实名认证'} rightTextStyle={[styles.grayText,{color:color.white}]} leftTextStyle={styles.blackText} isArrow={false} isLine={false} circleStyle={this.state.hasVertifyID?styles.hasVertifyID:styles.notVertifyID} onPress={()=>this.jumpToIDVertify2Page()}/>

            </View>
        )
    }
    loadPageData(){
        BusinessUtils.setCityPicker()
    }
    takePhoto=()=>{
        // BusinessUtils.getImagePicker(callback=>{
        //     Toast.showLoading();
        //     MineApi.updateDealerHeadImgById({headImg:callback.imageUrl}).then((response)=>{
        //         Toast.hiddenLoading();
        //         if(response.ok ){
        //             user.saveUserInfo(response.data);
        //             NativeModules.commModule.toast('头像修改成功');
        //         } else {
        //             NativeModules.commModule.toast(response.msg);
        //         }
        //     }).catch(e=>{
        //         Toast.hiddenLoading();
        //         NativeModules.commModule.toast(e.toString());
        //     });
        // })
    };
    jumpToIDVertify2Page=()=>{
        if (!user.isRealNameRegistration){
            this.navigate('mine/realName/IDVertify2Page')
        }
    }
    jumpToNickNameModifyPage=()=>{
        this.props.navigation.navigate('mine/NickNameModifyPage',{oldNickName:user.nickname})
    }
    //{"cityId":330100,"cityName":"杭州","districId":330109,"districName":"萧山区","provinceId":330000,"provinceName":"浙江"}
    renderGetCityPicker=()=>{
        dismissKeyboard();
        // NativeModules.commModule.cityPicker((data) => {
        //     let dataJson= ScreenUtils.isIOS ? data : JSON.parse(data);
        //     let params={
        //         areaId:dataJson.districId,
        //         cityId:dataJson.cityId,
        //         provinceId:dataJson.provinceId,
        //     }
        //     Toast.showLoading()
        //     MineApi.updateDealerRegionById(params).then((response)=>{
        //         Toast.hiddenLoading()
        //         if(response.ok ){
        //             user.saveUserInfo(response.data)
        //             NativeModules.commModule.toast('修改成功')
        //         } else {
        //             NativeModules.commModule.toast(response.msg)
        //         }
        //     }).catch(e=>{
        //         Toast.hiddenLoading()
        //     });
        // })
    }
}

const styles = StyleSheet.create({
    blackText:{
        fontFamily: "PingFang-SC-Medium",
        fontSize: 15,
        color: "#222222",
    },
    grayText:{
        fontFamily: "PingFang-SC-Medium",
        fontSize: 15,
        color: "#999999"
    },
    whiteText:{
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#ffffff"
    },hasVertifyID:{
        borderRadius: 10, backgroundColor: "#0186f5",paddingLeft:10,paddingRight:10,marginRight:15
    },notVertifyID:{
        borderRadius: 10, backgroundColor: "#dddddd",paddingLeft:10,paddingRight:10,marginRight:15
    },
});


