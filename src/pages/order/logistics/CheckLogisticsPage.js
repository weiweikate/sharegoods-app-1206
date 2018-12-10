import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image} from 'react-native';
import BasePage from '../../../BasePage';
// import { UIImage, UIText } from '../../../components/ui';
// import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
// import OrderApi from '../api/orderApi';
import DesignRule from 'DesignRule';
import res from '../res';
import GoodsGrayItem from '../components/GoodsGrayItem'

export default class CheckLogisticsPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: '查看物流',
        show: true// false则隐藏导航
    };

    show(expressNo){
        this.$navigate("order/logistics/LogisticsDetailsPage", {
            expressNo: "3831428737475"
        });
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={{height:20,width:ScreenUtils.width,backgroundColor:DesignRule.mainColor,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:13,color:DesignRule.white}}>{`${this.params.expressList.length}个包裹已发出`}</Text>
                </View>
                <View style={{alignItems:'center',marginTop:8,marginBottom:8,height:17,justifyContent:'center'}}>
                    <Text style={{fontSize:12,color:DesignRule.textColor_instruction}}>{`——— 以下商品被拆分成${this.params.expressList.length}个包裹 ————`}</Text>
                </View>
                {this.params.expressList.map((item)=>{
               return (
                    <View>
                        <TouchableOpacity style={{ height: 40, backgroundColor: DesignRule.white, justifyContent: 'center' }}
                                          onPress={() => {this.show(item.expressNo)}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:15,paddingRight:15}}>
                                <Text style={{ fontSize: 12,color:DesignRule.textColor_mainTitle }}>{item.expressName}</Text>
                                <Image source={res.button.arrow_right_black}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{backgroundColor:'#E4E4E4',height:0.5,width:ScreenUtils.width}}/>
                    <GoodsGrayItem
                        uri={item.specImg}
                        goodsName={item.productName}
                        salePrice={10}
                        category={item.specValues}
                        goodsNum={item.quantity}
                        style={{backgroundColor:'white'}}
                    />
                        <View style={{backgroundColor:'#E4E4E4',height:10,width:ScreenUtils.width}}/>
                    </View>
               )
                })}
                {/*<SectionList*/}
                    {/*sections={this.state.AllArr}*/}
                    {/*renderItem={this.renderItem}*/}
                    {/*onRefresh={this.onRefresh}*/}
                    {/*onLoadMore={this.onLoadMore}*/}
                    {/*renderSectionHeader={this.Header}*/}
                    {/*keyExtractor={this.extraUniqueKey}//去除警告*/}

                {/*/>*/}
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }
});
