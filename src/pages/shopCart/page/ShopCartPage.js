import React from 'react'

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ListView,TouchableHighlight,
    TextInput as RNTextInput,

} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import ColorUtil from '../../../utils/ColorUtil';
import {
UIText,
UIImage,
}from'../../../components/ui/index'
export  default class ShopCartPage extends BasePage{

    // 导航配置
    $navigationBarOptions = {
        title: '购物车',

    };
    constructor(props){
        super(props)
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            viewData:[
                {a:11},
                {a:22},
                {a:22},
                {a:22},
                {a:22}
            ]
        }
    }



    _render(){
        return(
            <View style={{flex:1,justifyContent:'space-between',flexDirection:'column'}}>

                <SwipeListView
                    dataSource={this.ds.cloneWithRows(this.state.viewData)}
                    // dataSource={this.state.viewData}
                    disableRightSwipe={true}
                    // renderRow={ data => (
                    //     data.status==validCode? this._renderValidItem(data): this._renderInvalidItem(data)
                    // )}
                    renderRow={ data => (
                      this._renderValidItem(data)
                    )}
                    renderHiddenRow={ (data, secId, rowId, rowMap) => (
                        <TouchableOpacity
                            style={styles.standaloneRowBack}
                            onPress={()=>{
                                rowMap[`${secId}${rowId}`].closeRow()
                                // this._deleteFromShoppingCartByProductId(data.index)
                            }}>
                            <UIText style={styles.backUITextWhite}>删除</UIText>
                        </TouchableOpacity>
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                />
                {this._renderShopCartBottomMenu()}
            </View>
        )
    }
    _renderShopCartBottomMenu = () => {
        return (
            <View style={styles.CartBottomContainer}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', paddingLeft: 19 }}
                    // onPress={() => this._selectAll()}
                >
                    <Image
                        // source={this.state.selectAll?circleSelect:circleUnselect}
                        style={{ width: 22, height: 22, backgroundColor: 'red' }}/>

                    <UIText
                        value={'全选'}
                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: '#999999', marginLeft: 10 }}/>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UIText
                        value={'合计'}
                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: ColorUtil.Color_222222 }}/>
                    <UIText
                        // value={StringUtils.formatMoneyString(this.state.totalPrice)}
                        value={'测试'}
                        style={styles.totalPrice}/>
                    <TouchableOpacity
                        style={styles.selectGoodsNum}
                        // onPress={() => this._toBuyImmediately()}
                    >
                        <UIText
                            // value={this.state.selectGoodsNum == 0 ? '结算' : '结算(' + this.state.selectGoodsNum + ')'}
                            value= '结算'
                            style={{ color: ColorUtil.Color_ffffff, fontSize: 16 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    _renderValidItem=(data)=>{
        return(
            <TouchableHighlight
                // onPress={()=>this._jumpToProductDetailPage(data.product_id)}
                style={styles.itemContainer}>
                <View style={styles.standaloneRowFront}>
                    <UIImage
                        // source={data.select?circleSelect:circleUnselect}
                        style={{width:22,height:22,marginLeft:10,marginBottom:20,backgroundColor:'red'}}
                        // onPress={()=>{this._changeSelectStatus(data.index)}}
                    />
                    <UIImage
                        // source={{uri:data.pictureUrl}}
                        style={[styles.validProductImg,{backgroundColor:'red'}]}
                    />
                    <View style={styles.validContextContainer}>
                        <View>
                            <UIText
                                // value={data.name}
                                value={'测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试'}
                                numberOfLines={2}
                                style={{fontFamily: "PingFang-SC-Medium", fontSize: 13, lineHeight: 18, color: "#222222"}}
                            />

                            <UIText
                                // value={data.context}
                                value={'测试测试测试测试测试测试测试测试'}
                                numberOfLines={2}
                                style={{fontFamily: "PingFang-SC-Medium", fontSize: 13, color: "#999999"}}/>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <UIText
                                // value={'￥:'+StringUtils.formatMoneyString(user.isLogin?data.levelPrice:data.original_price,false)}
                                value={'$100'}
                                style={{fontSize: 14, color: "#e60012"}}/>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity
                                    style={styles.rectangle}
                                    // onPress={()=>{this._reduceProductNum(data.index)}}

                                >
                                    <UIText
                                        value={'—'}
                                        // style={{fontSize:15,color:data.num<=1?ColorUtil.Color_dddddd:ColorUtil.Color_222222}}
                                        style={{fontSize:15,color:ColorUtil.Color_222222}}
                                    />
                                </TouchableOpacity>
                                <View style={[styles.rectangle,{width:46,borderLeftWidth:0,borderRightWidth:0}]}>
                                    <RNTextInput
                                        style={styles.textInputStyle}
                                        onChangeText={text => this._onChangeText(text,data.index,data)}
                                        underlineColorAndroid={'transparent'}
                                        // value={data.disNum+''}
                                        value={'10'}
                                        keyboardType='numeric'
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.rectangle}
                                    onPress={()=>{this._addProductNum(data.index)}}>
                                    <UIText
                                        value={'+'}
                                        // style={{fontSize:15,color:data.num>=data.stock?color.gray_DDD:color.black_222}}
                                        style={{fontSize:15,color:ColorUtil.Color_222222}}

                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
    //
    // _renderInvalidItem=(data)=>{
    //     return(
    //         <TouchableHighlight
    //             onPress={()=>this._jumpToProductDetailPage(data.product_id)}
    //             style={styles.invalidItemContainer}>
    //             <View style={[styles.standaloneRowFront,{height:100}]}>
    //                 <View style={styles.invalidUITextInvalid}>
    //                     <UIText
    //                         value={'失效'}
    //                         style={{fontFamily: "PingFang-SC-Medium", fontSize: 12, color: "#ffffff"}}/>
    //                 </View>
    //                 <UIImage
    //                     source={{uri:data.pictureUrl}}
    //                     style={styles.invalidProductImg}/>
    //                 <View style={styles.invalidUITextContainer}>
    //                     <View>
    //                         <UIText
    //                             value={data.name}
    //                             style={{fontFamily: "PingFang-SC-Medium", fontSize: 13, lineHeight: 18, color: "#222222"}}/>
    //                         <UIText
    //                             value={data.conUIText}
    //                             style={{fontFamily: "PingFang-SC-Medium", fontSize: 13, color: "#999999"}}/>
    //                     </View>
    //                 </View>
    //             </View>
    //         </TouchableHighlight>
    //     )
    // }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'flex-end'
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
        borderTopWidth: 1,
        borderColor: 'black',
        backgroundColor:'green' //每个界面背景颜色不一样
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: ColorUtil.mainRedColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15
    },
    backUITextWhite: {
        color: '#FFF',
        marginRight:10
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 130,
        width:ScreenUtils.width,
        flexDirection:'row',
        marginRight:16
    },
    rectangle:{
        height:30,
        width:30,
        justifyContent:'center',
        borderWidth:1,
        borderColor:ColorUtil.Color_666666,
        alignItems:'center'
    },

    validItemContainer:{
        height:130,
        flexDirection:'row',
        backgroundColor:ColorUtil.Color_ffffff
    },
    validProductImg:{
        width:80,
        height:80,
        marginLeft:16,
        marginRight:16,
        marginBottom:20
    },
    validConUITextContainer:{
        flex:1,
        height:100,
        justifyContent:'space-between',
        marginTop:10,
        paddingRight:15
    },

    invalidItemContainer:{
        height:100,
        flexDirection:'row',
        backgroundColor:ColorUtil.Color_ffffff
    },
    invalidUITextInvalid:{
        width: 38,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#999999",
        justifyContent:'center',
        alignItems:'center',
        marginLeft:12
    },
    invalidProductImg:{
        width:80,
        height:80,
        marginLeft:7,
        marginRight:16,
    },
    invalidUITextContainer:{
        flex:1,
        height:100,
        justifyContent:'space-between',
        marginTop:30,
        paddingRight:15
    },

    CartBottomContainer:{
        // position:'absolute',
        // marginTop:ScreenUtils.height - ScreenUtils.tabBarHeight - 49 - ScreenUtils.headerHeight,
        width:ScreenUtils.width,
        height:49,
        backgroundColor:ColorUtil.Color_ffffff,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    totalPrice:{
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color:ColorUtil.mainRedColor,
        marginLeft:10,
        marginRight:10
    },
    selectGoodsNum:{
        width:110,
        height:49,
        backgroundColor:ColorUtil.mainRedColor,
        justifyContent:'center',
        alignItems:'center'
    },

    TextInputStyle:{
        fontSize:15,
        color:ColorUtil.Color_222222,
        height:29,
        width:46,
        paddingVertical:0,
    },
    validContextContainer:{
        flex:1,
        height:100,
        justifyContent:'space-between',
        marginTop:10,
        paddingRight:15
    },
});
