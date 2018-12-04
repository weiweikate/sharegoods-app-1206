import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SectionList } from 'react-native';
import BasePage from '../../../BasePage';
// import { UIImage, UIText } from '../../../components/ui';
// import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
// import OrderApi from '../api/orderApi';
import DesignRule from 'DesignRule';

export default class CheckLogisticsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            AllArr: [{
                name: '百世汇通：12345676',
                data: [{ name: '螃蟹' }, { name: '龙虾' }, { name: '车厘子' }, { name: '百香果' }, { name: '草莓' }]
            }, {
                name: '订单正在处理中...',
                data: [{ name: '超薄电视' }, { name: '空调' }, { name: '机器人' }, { name: '洗衣机' }, { name: '取暖器' }]
            }],
        }
    }

    $navigationBarOptions = {
        title: '查看物流',
        show: true// false则隐藏导航
    };

    //去除警告
    extraUniqueKey(item, index) {
        return index + item;
    }
    show(data){
        // NativeModules.commModule.toast('?');
        this.$toastShow('3333')
    }

    //列表分组的header
    Header=({ section })=> {
        console.log('header',section);
        return (
            <TouchableOpacity style={{ height: 40, backgroundColor: DesignRule.white, justifyContent: 'center' }}
                              onPress={() => {this.show(section)}}>
                <View>
                    <Text style={{ fontSize: 12,color:DesignRule.textColor_mainTitle ,marginLeft:15}}>{section.name}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderItem=({item})=> {
        console.log('itemdata',item);
        return (
            <View style={{ height: 40, backgroundColor: 'green', justifyContent: 'center' }}>
            <View style={{ height: 39, backgroundColor: 'pink', justifyContent: 'center' }}>
                <Text>{item.name}</Text>
            </View>
            </View>)
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={{height:20,width:ScreenUtils.width,backgroundColor:DesignRule.mainColor,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:13,color:DesignRule.white}}>2个包裹已发出</Text>
                </View>
                <View style={{paddingHorizontal:54,marginTop:8,marginBottom:8,width:ScreenUtils-108,height:17}}>
                    <Text style={{fontSize:12,color:DesignRule.textColor_instruction}}>——— 以下商品被拆分成两个包裹 ————</Text>
                </View>
                <SectionList
                    sections={this.state.AllArr}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    renderSectionHeader={this.Header}
                    keyExtractor={this.extraUniqueKey}//去除警告
                />
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
