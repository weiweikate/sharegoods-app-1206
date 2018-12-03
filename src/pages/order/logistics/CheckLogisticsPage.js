import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SectionList ,Image} from 'react-native';
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
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:15,paddingRight:15}}>
                    <Text style={{ fontSize: 12,color:DesignRule.textColor_mainTitle }}>{section.name}</Text>
                    <Image source={res.button.arrow_right_black}/>
                </View>
            </TouchableOpacity>)
    }

    renderItem=({item})=> {
        console.log('itemdata',item);
        return (
        <GoodsGrayItem
            uri={'http://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/app/bangzu_kefu%403x.png'}
            goodsName={'天台康说'}
            salePrice={10}
            category={'ccc'}
            goodsNum={2}
            bgColor={{backgroundColor:'white'}}
            />
        )
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={{height:20,width:ScreenUtils.width,backgroundColor:DesignRule.mainColor,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:13,color:DesignRule.white}}>2个包裹已发出</Text>
                </View>
                <View style={{alignItems:'center',marginTop:8,marginBottom:8,height:17,justifyContent:'center'}}>
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
