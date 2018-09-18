import React from 'react';
import {
    View,Text,TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import Toast from '../../../../utils/bridge';
export default class WithdrawCashPage extends BasePage{
    constructor(props){
        super(props);
    }
    $navigationBarOptions = {
        title: '提现',
        show: true // false则隐藏导航
    };
    componentDidMount(){
        // this.$toastShow('nihaoa')
        setTimeout(()=>{
            Toast.$toast('ffff')
        },3000)
    }
    showDebug(){
        // Toast.showLoading('tttt')
        this.$loadingShow('loading')
        setTimeout(()=>{
            this.$loadingDismiss(()=>alert('ddd'))
            // Toast.hiddenLoading()
        },4000);

    }
    _render(){
        return(
            <View>
                <TouchableOpacity onPress={()=>this.showDebug()}>
                    <Text>提现</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
