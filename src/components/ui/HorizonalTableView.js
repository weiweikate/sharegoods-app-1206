/**
 * @author ZhangLei
 * @date 2018/6/7
 * @appType crm_app
 * @Description:个人中心常用的ItemUI控件
 */
import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import {color} from "../../constants/Theme";
import ScreenUtils from "../../utils/ScreenUtils";
const HorizonalTableView = props => {

    const {
        tableData=this.props.tableData,
        commonViewStyle={
            height:35,width:(ScreenUtils.width-30)/(tableData[0].value.length+1),justifyContent:'center',backgroundColor:color.gray_FFF,alignItems:'center',borderWidth:0.5,borderColor:color.gray_DDD
        },
        specialViewStyle={
            height:35,width:(ScreenUtils.width-30)/(tableData[0].value.length+1),justifyContent:'center',backgroundColor:color.gray_EEE,alignItems:'center',borderWidth:0.5,borderColor:color.gray_DDD
        },
        commonTextStyle= {
            color: color.black_999, fontSize: 12,
        },
        specialTextStyle={
            color:color.black_222,fontSize:12,
        },
    } = props


    renderListView=()=>{
        let arr=[]
        for (let i=0;i<tableData.length;i++){
            arr.push(
                this.renderItemListView(i)
            )
        }
        return arr
    }
    renderItemListView=(index)=>{
        let arr=[]
        arr.push(
            //剩余宽度345
            <View style={specialViewStyle}>
                <Text style={specialTextStyle}>{tableData[index].name}</Text>
            </View>
        )
        for (let i=0;i<tableData[index].value.length;i++){
            arr.push(
                //剩余宽度345
                <View style={commonViewStyle} key={i}>
                    <Text style={commonTextStyle}>{tableData[index].value[i]}</Text>
                </View>
            )
        }
        return (
            <View style={{flexDirection:'row'}}>
                {arr}
            </View>
        )
    }

    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {this.renderListView()}
        </View>
    )

}

export default HorizonalTableView
