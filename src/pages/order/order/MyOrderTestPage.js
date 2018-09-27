
import React,{Component} from 'react';
import {View,Image,Text ,TouchableOpacity} from 'react-native';

export default class MyOrderTestPage extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    //src_comm_res_icon_header_back
    render(){
        return(
            <View>
                <Image source={{uri:'src_page_coupons_src_icon2_03'}} style={{width:139,height:45}}/>
                <TouchableOpacity><Text>
                    nihao
                </Text></TouchableOpacity>
            </View>
        )
    }
}
