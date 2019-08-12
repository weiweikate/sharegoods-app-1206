/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/7.
 *
 */


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';

import {
    MRText
} from '../../../components/ui';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import RouterMap, { routePush } from '../../../navigation/RouterMap';
import DesignRule from '../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';
const autoSizeWidth = ScreenUtils.autoSizeWidth;

export default class GoodsCustomView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {
    }

    renderGoods(data)
    {
        let height = GoodsCustomViewGetItemHeight(data);
        switch (data.layout){
            case 1:
                return this.renderGoodsList(data,height)
            case 2:
                return this.renderTwoGoods(data,height)
        }
    }

    renderGoodsList(data, height)
    {
        let style = GoodsCustomViewGetItemStyle(data, height, );
        return [{},{},{}].map((item => {
            return(
                <TouchableWithoutFeedback onPress={()=> {this.gotoProduceDetail(item)}}>
                    <View style = {style}>
                        <ImageLoader style={{height, width: height, backgroundColor: 'red'}}/>
                        <View style={{flex: 1, marginHorizontal: autoSizeWidth(10)}}>
                            <MRText style={{fontSize: autoSizeWidth(14),
                                color: DesignRule.textColor_mainTitle,
                                marginTop: autoSizeWidth(4)}}
                                    numberOfLines={1}>{'分身乏术发生的范德萨发放松放松'}</MRText>
                            <MRText style={{fontSize: autoSizeWidth(12),
                                color: DesignRule.textColor_instruction}}
                                    numberOfLines={1}
                            >{'分身乏术发生的范德萨发放松放松'}</MRText>
                            <MRText style={{fontSize: autoSizeWidth(12),
                                color: DesignRule.mainColor}}>{'佣金¥9.5'}</MRText>
                            <View style={{flex: 1}}/>
                            <View style={{flexDirection: 'row'}}>
                                <MRText style={styles.tip}>{'拼店价'}</MRText>
                                <MRText style={[styles.oldPrice, {marginLeft: 5}]}>{'100'}</MRText>
                            </View>
                            <MRText style={{fontSize: autoSizeWidth(12),
                                color: DesignRule.mainColor,
                                marginBottom: autoSizeWidth(5),
                                marginTop: autoSizeWidth(5)
                            }}>
                                ¥<MRText  style={{fontSize: autoSizeWidth(18),
                                color: DesignRule.mainColor, fontWeight: '600'}}>2222</MRText>起
                            </MRText>
                            {this.renderGoodsListBtn(data)}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }))
    }

    renderTwoGoods(data, height){
        let style = GoodsCustomViewGetItemStyle(data, height);

        return (
            <View style={{flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems:'flex-start',
                width: ScreenUtils.width - ScreenUtils.autoSizeWidth(30),
                justifyContent: 'space-between',
                marginTop: autoSizeWidth(10)
            }}>
                {[{},{},{}].map((item => {
                    return(
                        <TouchableWithoutFeedback onPress={()=> {this.gotoProduceDetail(item)}}>
                            <View style = {style}>
                                <ImageLoader style={{height: style.width, width: style.width, marginBottom: autoSizeWidth(5)}}/>
                                <MRText style={{fontSize: autoSizeWidth(14),
                                    color: DesignRule.textColor_mainTitle,
                                    height: autoSizeWidth(20),
                                    marginHorizontal: autoSizeWidth(5)
                                }}
                                        numberOfLines={1}>{'分身乏术发生的范德萨发放松放松'}</MRText>
                                <MRText style={{fontSize: autoSizeWidth(12),
                                    color: DesignRule.textColor_instruction,
                                    height: autoSizeWidth(33/2),
                                    marginHorizontal: autoSizeWidth(5)
                                }}
                                        numberOfLines={1}
                                >{'分身乏术发生的范德萨发放松放松'}</MRText>
                                <View style={{height: autoSizeWidth(5)}}/>
                                <View style={{flexDirection: 'row',  marginLeft: autoSizeWidth(5), height: autoSizeWidth(14), alignItems: 'center'}}>
                                    <MRText style={styles.tip}>{'拼店价'}</MRText>
                                    <MRText style={{fontSize: autoSizeWidth(12),
                                        color: DesignRule.mainColor,
                                        marginLeft: 4
                                    }}>{'佣金¥9.5'}</MRText>
                                </View>
                                <View style={{flexDirection: 'row', height: autoSizeWidth(20), marginTop: autoSizeWidth(5), marginLeft: autoSizeWidth(5)}}>
                                <MRText style={{fontSize: autoSizeWidth(12),
                                    color: DesignRule.mainColor,
                                }}>
                                    ¥<MRText  style={{fontSize: autoSizeWidth(18),
                                    color: DesignRule.mainColor, fontWeight: '600'}}>2222</MRText>起
                                </MRText>
                                    <MRText style={[styles.oldPrice, {marginLeft: 5, marginTop: 2}]}>{'100'}</MRText>
                                </View>
                                <MRText style={[styles.oldPrice, {marginLeft: 5, height: autoSizeWidth(14)}]}>{'100'}</MRText>
                                {this.renderTwoGoodsBtn(data)}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }))}
            </View>
        )
    }

    renderGoodsListBtn(item){
        if (0){
            return (
                <TouchableWithoutFeedback onPress={() => this.addShopCar(item)}>
                    <ImageBackground style={{
                        width: autoSizeWidth(20),
                        height: autoSizeWidth(20),
                        position: 'absolute',
                        right: autoSizeWidth(5),
                        bottom: autoSizeWidth(10),
                        backgroundColor: 'red'}}/>
                </TouchableWithoutFeedback>
            )
        }else if(1){
            return (
                <TouchableWithoutFeedback onPress={() => this.addShopCar(item)}>
                    <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}
                                    style={{borderRadius: 14, overflow: 'hidden', paddingHorizontal: autoSizeWidth(14),
                                        height: autoSizeWidth(28),
                                        position: 'absolute',
                                        right: autoSizeWidth(5),
                                        bottom: autoSizeWidth(10),
                                        justifyContent: 'center'
                                    }}
                    >
                        <MRText style={{fontSize: autoSizeWidth(14), color: 'white'}}>{'立即购买'}</MRText>
                    </LinearGradient>
                </TouchableWithoutFeedback>
            )
        }
    }

    renderTwoGoodsBtn(item){
        if (1){
            return (
                <TouchableWithoutFeedback onPress={() => this.addShopCar(item)}>
                    <ImageBackground style={{
                        width: autoSizeWidth(20),
                        height: autoSizeWidth(20),
                        position: 'absolute',
                        right: autoSizeWidth(10),
                        bottom: autoSizeWidth(10),
                        backgroundColor: 'red'}}/>
                </TouchableWithoutFeedback>
            )
        }else if(1){
            return (
                <TouchableWithoutFeedback onPress={() => this.addShopCar(item)}>
                    <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}
                                    style={{borderRadius: 14, overflow: 'hidden',
                                        height: autoSizeWidth(28),
                                        marginTop: autoSizeWidth(5),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: autoSizeWidth(5),
                                    }}
                    >
                        <MRText style={{fontSize: autoSizeWidth(14), color: 'white'}}>{'立即购买'}</MRText>
                    </LinearGradient>
                </TouchableWithoutFeedback>
            )
        }
    }

    gotoProduceDetail(item){
        routePush(RouterMap.ProductDetailPage, {productCode: item.prodCode})
    }
    //添加购物车
    addShopCar(item){

    }



    render() {
        let data = this.props.data;
        let height = data.itemHeight;
        if (height === 0){
            return <View />;
        }
        return (
            <View style={{height,
                width: ScreenUtils.width - autoSizeWidth(30),
                marginLeft: autoSizeWidth(15),
            }}>
                {this.renderGoods(data)}
            </View>
        );
    }
}

export function GoodsCustomViewGetItemHeight(data) {

    // if (!data || !data.imgs || data.imgs.length === 0){
    //     return 0;
    // }
    let height = 0;
    switch (data.layout){
        case  1 :
            return ScreenUtils.autoSizeWidth(120)
        case  2 :
            height = ScreenUtils.autoSizeWidth(335/2);
            height +=  ScreenUtils.autoSizeWidth(5)//间距
            height +=  ScreenUtils.autoSizeWidth(20)//title
            height +=  ScreenUtils.autoSizeWidth(33/2)//detail
            height +=  ScreenUtils.autoSizeWidth(5)//间距
            height +=  ScreenUtils.autoSizeWidth(14)//拼店
            height +=  ScreenUtils.autoSizeWidth(20)//价格
            if (1){
                height +=  ScreenUtils.autoSizeWidth(14)//老价格
            } else {
                height +=  ScreenUtils.autoSizeWidth(5)//间距
                height +=  ScreenUtils.autoSizeWidth(28)//立即购买
            }
            height +=  ScreenUtils.autoSizeWidth(10)//间距
            return height
        case  3 :
            height = ScreenUtils.autoSizeWidth(224/2);
            height +=  ScreenUtils.autoSizeWidth(5)//间距
            height +=  ScreenUtils.autoSizeWidth(20)//title
            height +=  ScreenUtils.autoSizeWidth(15)//detail
            height +=  ScreenUtils.autoSizeWidth(14)//拼店
            height +=  ScreenUtils.autoSizeWidth(33/2)//价格
            if (1){
                height +=  ScreenUtils.autoSizeWidth(14)//老价格
            } else {
                height +=  ScreenUtils.autoSizeWidth(5)//间距
                height +=  ScreenUtils.autoSizeWidth(24)//立即购买
            }
            height +=  ScreenUtils.autoSizeWidth(10)//间距
            return height
        case  8 :
            return ScreenUtils.autoSizeWidth(100)
    }
    return 0;
}

export function GoodsCustomViewGetHeight(data) {

    // if (!data || !data.imgs || data.imgs.length === 0){
    //     return 0;
    // }
    let height = GoodsCustomViewGetItemHeight(data);
    let count = 3;
    switch (data.layout){
        case  1 :
            count = 3
            return height * count + autoSizeWidth(10)*(count - 1)
        case  2 :
            count = Math.ceil(count/2);
            return  height * count + autoSizeWidth(10)*(count - 1) + autoSizeWidth(10)
        case  3 :
            count = Math.ceil(count/3);
            return  height * count + autoSizeWidth(10)*(count - 1) + autoSizeWidth(10)
        case  8 :
            return height + 10
    }
    return 0;
}



export function GoodsCustomViewGetItemStyle(data, height){
    let padding = ScreenUtils.autoSizeWidth(5)
    let width = ScreenUtils.width - ScreenUtils.autoSizeWidth(30);
    switch (data.layout){
        case 1:
            padding = ScreenUtils.autoSizeWidth(10)
            return {width, height, marginTop: padding, flexDirection: 'row', backgroundColor: 'white', borderRadius: 5}
        case 2:
            return  {width : (width - padding)/2, height, backgroundColor: 'white', marginTop: padding}
        case 3:
            return {width : (width - 2*padding)/3, height, marginRight: padding}
        case 8:
            return {width : (width - 3*padding)/4, height, marginRight: padding}
    }
    return {};
}


const styles = StyleSheet.create({
    tip: {
        fontSize: autoSizeWidth(10),
        color: DesignRule.mainColor,
        backgroundColor: 'rgba(250,0,80,0.1)',
        paddingHorizontal: 3,
        borderRadius: 3,
        overflow: 'hidden'
    },
    oldPrice: {
        textDecorationLine:'line-through',
        fontSize: autoSizeWidth(10),
        color: DesignRule.textColor_instruction,
    }
});
