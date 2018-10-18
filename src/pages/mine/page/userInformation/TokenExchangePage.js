
import React from 'react'
import {
    NativeModules,
    StyleSheet,
    View,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity,
} from 'react-native'
import BasePage from '../../../../BasePage'
import {
    UIText, UIButton,UIImage
} from '../../../../components/ui'
import { color} from "../../../../constants/Theme";
import StringUtils from "../../../../utils/StringUtils";
import arrow_right from '../../../order/res/arrow_right.png'
import ScreenUtils from "../../../../utils/ScreenUtils";
import CommonTwoChoiceModal from "../../../order/components/CommonTwoChoiceModal";
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import CashImg from '../../res/userInfoImg/cash.png'

export default class TokenExchangePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            money:'',
            thirdType:1,
            passwordDis:false,
            phoneError:false,
            passwordError:false,
            isShowModal:false,
            waitingForWithdrawMoney:0,
            tokenCanWithdraw:0,
            restTokenCanWithdraw:0,
        }
    }
    //**********************************ViewPart******************************************
    _render(){
        return (
            <View style={styles.container}>
                {this.renderBonus()}
                {this.renderBonusMoney()}
                {this.renderButtom()}
                {this.renderModal()}
            </View>
        )
    }


    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title:'秀豆兑换'
    };
    renderLine=()=>{
        return(
            <View style={{height:1,backgroundColor:color.line,marginLeft:48,marginRight:48}}/>
        )
    }
    renderButtom=()=>{
        return(
            <UIButton
                value={'提交兑换'}
                style={{marginTop: 16, backgroundColor: color.red,width:ScreenUtils.width - 96,height:48,marginLeft:48,marginRight:48}}
                onPress={() => this.commit()}/>
        )
    }
    onChangeText=(text)=>{
        if (!StringUtils.checkIsPositionNumber(text)){
            this.setState({money: text.substring(0,text.length - 1)})

        }else{
            if (parseInt(text) > parseInt(this.state.tokenCanWithdraw)){
                NativeModules.commModule.toast('您目前可兑换秀豆数为' + this.state.tokenCanWithdraw)
            }else{
                this.setState({
                    money:text,
                    restTokenCanWithdraw:parseInt(this.state.tokenCanWithdraw) - parseInt(text)
                })
            }
        }
    }
    renderBonusMoney=()=>{
        return(
            <View style={{backgroundColor:color.white}}>
                <UIText value={'兑换秀豆'} style={{color:color.black_light,fontSize:15,marginLeft:15,marginTop:20}}/>
                <View style={{height:56,width:ScreenUtils.width,flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
                    <Text style={{marginLeft:15,color:color.loginTextBlack,fontSize:30}}>{'¥'}</Text>
                    <RNTextInput
                        style={{marginLeft:20,height: 40, flex:1,backgroundColor:'white',fontSize:14}}
                        onChangeText={(text) =>this.onChangeText(text)}
                        placeholder={''}
                        value={this.state.money}
                        underlineColorAndroid={'transparent'}
                        keyboardType='numeric'
                    />
                </View>
                <View style={{height:1,backgroundColor:color.white,}}>
                    <View style={{height:1,backgroundColor:color.line,marginLeft:15}}/>
                </View>
                <UIText value={'剩余可兑换：' + this.state.restTokenCanWithdraw + '枚'} style={{color:color.black_light,fontSize:15,marginLeft:15,height:30}}/>
            </View>
        )
    }
    renderModal = () => {
        return (
            <CommonTwoChoiceModal
                isShow={this.state.isShowModal}
                detail={{title:'是否兑换',context:'请确认是否兑换',no:'稍后再说',yes:'马上兑换'}}
                closeWindow={()=>{
                    this.setState({isShowModal:false})
                }}
                yes={()=>{
                    NativeModules.commModule.toast('马上兑换')
                    if (this.state.tokenCanWithdraw == 0){
                        NativeModules.commModule.toast('暂无可提现秀豆')
                        return
                    }
                    Toast.showLoading()
                    MineApi.addDetailTokenCoinByCarry({}).then((response)=>{
                        Toast.hiddenLoading()
                        if(response.ok ){
                            NativeModules.commModule.toast('兑换成功')
                            this.$navigateBack()
                        } else {
                            NativeModules.commModule.toast(response.msg)
                        }
                    }).catch(e=>{
                        Toast.hiddenLoading()
                    });
                }}
                no={()=>{
                    this.setState({isShowModal:false})
                }}
            />
        )
    }
    returnIntegerString=(object)=>{
        let str = object + ''
        if (StringUtils.isEmpty(str)){
            return 0
        }else{
            return str
        }
    }
    renderBonus=()=>{
        return(
            <TouchableOpacity style={{height:70,backgroundColor:color.white,justifyContent:'space-between',flexDirection:'row',marginTop:10,marginBottom:10}}>
                <View style={{flexDirection:'row',alignItems:'center',}}>
                    <UIImage source={CashImg} style={{width:49,height:49,marginLeft:16}}/>
                    <View style={{marginLeft:10,alignItems:'center'}}>
                        <UIText value={'有待提现金：' + StringUtils.formatMoneyString(this.state.waitingForWithdrawMoney,false) + '元'} style={{fontSize:15,color:color.black000}}/>
                        <UIText value={'可兑换代币：' + this.state.tokenCanWithdraw + '枚'} style={{fontSize:13,color:color.black_999}}/>
                    </View>
                </View>
                <View style={{justifyContent:'center',marginRight:15}}>
                    <UIImage source={arrow_right} style={{height:10,width:7}}/>
                </View>
            </TouchableOpacity>
        )
    }
    //**********************************BusinessPart******************************************
    loadPageData(){
        MineApi.findSettlementTotalByBalance({id:this.state.id}).then((response)=>{
            if(response.ok ){
                this.setState({waitingForWithdrawMoney:response.data})
            } else {
                NativeModules.commModule.toast(response.msg)
            }
        }).catch(e=>{
            Toast.hiddenLoading()
        });
        MineApi.findSettlementTotalByToken({id:this.state.id}).then((response)=>{
            if(response.ok ){
                this.setState({
                    tokenCanWithdraw:this.returnIntegerString(response.data),
                    restTokenCanWithdraw:this.returnIntegerString(response.data),
                })
            } else {
                NativeModules.commModule.toast(response.msg)
            }
        }).catch(e=>{
            Toast.hiddenLoading()
        });
    }
    commit=()=>{
        this.setState({
            isShowModal:true
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1, backgroundColor:color.page_background,
    },
});
