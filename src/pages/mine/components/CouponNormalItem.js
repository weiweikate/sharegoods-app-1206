import React, { Component } from 'react';
import {
    ImageBackground,
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import {   MRText as Text,UIText, NoMoreClick} from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import LinearGradient from 'react-native-linear-gradient';

const { px2dp } = ScreenUtils;
const unUsedBg = res.couponsImg.youhuiquan_bg_unUseBg;
const usedBg = res.couponsImg.youhuiquan_bg_usedBg;


export default class CouponNormalItem extends Component {


    render(){
        let {item,index} = this.props;
        console.log('item',item)
        let stateImg = item.status === 1 ? res.couponsImg.youhuiquan_icon_yishiyong :
            (item.status === 2 ? res.couponsImg.youhuiquan_icon_yishixiao : item.status === 3 ? (res.couponsImg.youhuiquan_icon_daijihuo) : null);

        return(
            <TouchableOpacity style={{ backgroundColor: DesignRule.bgColor, marginBottom: 5 }}
                              onPress={() => {console.log('item',item);this.props.ticketClickItem && this.props.ticketClickItem()}}>
                <ImageBackground style={{
                    width: ScreenUtils.width - px2dp(30),
                    margin: 2,
                }} source={item.status === 0 ? (item.levelimit ? usedBg : unUsedBg) : usedBg} resizeMode='stretch'>
                    <View style={{display:'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.itemFirStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    item.type === 3 || item.type === 4 ||  item.type === 5 || item.type === 12 ? null :
                                        <View style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: item.status === 0 ? (item.levelimit ? '#FF80A7' : '#FF0050') : '#FF80A7',
                                                }} allowFontScaling={false}>￥</Text>
                                        </View>}
                                <View>
                                    <Text style={{
                                        fontSize: (item.value && item.value.length < 3 ? 34 : 20),
                                        fontWeight:'bold',
                                        color: item.status === 0 ? (item.levelimit ? '#FF80A7' : '#FF0050') : '#FF80A7',
                                    }} allowFontScaling={false}>{item.value}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{
                            flex: 2,
                            alignItems: 'flex-start',
                            marginLeft: 10,
                            justifyContent: 'center',
                            marginTop: 15,
                            marginBottom: 15
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: item.status === 0 ? DesignRule.textColor_mainTitle : DesignRule.textColor_instruction,
                                }} allowFontScaling={false} numberOfLines={0}>
                                    {item.name}</Text>
                                {/*{item.type === 12 ? <UIText value={'x' + item.number} style={{*/}
                                    {/*fontSize: 15,*/}
                                    {/*color: DesignRule.textColor_mainTitle*/}
                                {/*}}/> : null}*/}
                            </View>
                            <UIText style={{ fontSize: 11, color: DesignRule.textColor_placeholder, marginTop: 1 }}
                                    value={item.limit}/>
                            {item.timeStr ? <Text style={{
                                fontSize: 11,
                                color: DesignRule.textColor_placeholder,
                                marginTop: 1
                            }} allowFontScaling={false}>限{item.timeStr}使用</Text> : null}

                        </View>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            marginLeft: 5,
                            justifyContent: 'center',}}>
                            {item.status === 0 ? (item.levelimit ?
                                <View style={{marginRight: 15, justifyContent: 'center', alignItems: 'center'}}>
                                    <UIText value={'等级受限'}
                                            style={{
                                                fontSize: 13,
                                                color: DesignRule.textColor_instruction,
                                                marginRight: 15
                                            }}/>
                                    {item.count > 1 ? <UIText value={'x' + item.count}
                                                              style={styles.xNumsStyle}/> : null}
                                </View> :
                                    (item.redirectType && item.redirectType != 0 ?
                                            <NoMoreClick style={{
                                            height: ScreenUtils.autoSizeWidth(27),
                                            width: ScreenUtils.autoSizeWidth(60),
                                            borderRadius: ScreenUtils.autoSizeWidth(14),
                                            overflow: 'hidden'
                                        }} onPress={() => { this.props.clickItem(index, item)}}>
                                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                            colors={['#FC5D39', '#FF0050']}
                                                            style={{
                                                                alignItems: 'center',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                flex: 1
                                                            }}
                                            >
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: 'white',
                                                }} allowFontScaling={false}>去使用</Text>
                                            </LinearGradient>
                                        </NoMoreClick> : (item.count > 1 ? <UIText value={'x' + item.count}
                                                                                   style={styles.xNumsStyle}/>:null))
                                ) :
                                (stateImg ? <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style={{width: 55, height: 55}}
                                           source={stateImg}/>
                                    {item.count > 1 ? <UIText value={'x' + item.count}
                                                              style={styles.xNumsStyle}/> : null}

                                </View> : null)}
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    xNumsStyle: {
        // marginRight: 15,
        // marginBottom: 5,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle_222
    },
    itemFirStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: px2dp(80)
    }
});
