import { View, TouchableOpacity} from 'react-native';
import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
const { px2dp } = ScreenUtils;

export default class ShopCartEmptyCell extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { itemData,onClick ,haveShopCartGoods} = this.props;
        return (
            <TouchableOpacity onPress={()=>{
               onClick();
            }}>
            <View style={{
                marginBottom:haveShopCartGoods?px2dp(5):0,
                height: itemData.height,
                width: haveShopCartGoods?ScreenUtils.width / 2 - px2dp(23) : ScreenUtils.width / 2 - px2dp(12),
                marginLeft:haveShopCartGoods? px2dp(5):px2dp(0),
                height: itemData.height,
                backgroundColor:DesignRule.color_fff,
                borderRadius:px2dp(6),
                padding:px2dp(2),
                paddingTop:px2dp(0),
            }}>
                <PreLoadImage
                    imageUri={itemData.imgUrl}
                    style={{
                        marginTop:px2dp(2),
                        width: haveShopCartGoods?ScreenUtils.width / 2 - px2dp(30) :ScreenUtils.width / 2 - px2dp(20),
                        height: itemData.imageHeight ,
                        borderRadius:px2dp(6)
                    }}
                />
                <MRText numberOfLines={2}
                        style={{ fontSize: px2dp(14),
                            color: DesignRule.textColor_mainTitle,
                            marginTop: px2dp(5) ,
                            marginLeft:px2dp(10),
                            marginRight:px2dp(10),
                            height:px2dp(40)
                        }}>
                    {itemData.name}
                </MRText>
                <View style={{ flexDirection: 'row', marginTop: px2dp(3) }}>
                    {this.createTipView([])}
                </View>
                <View style={{ flexDirection: 'row',alignItems:'center' ,paddingLeft:px2dp(10) }}>
                    <View style={{ flex: 1 }}>
                        <MRText style={{color:'rgba(255, 0, 80, 1)',fontSize:px2dp(12)}}>
                            {`￥${itemData.originalPrice}`}
                        </MRText>
                    </View>
                    {/*<View style={{ width: px2dp(50), alignItems: 'center', justifyContent: 'center' }}>*/}
                        {/*<TouchableOpacity>*/}
                            {/*<Image style={{ width: px2dp(10), height: px2dp(2), backgroundColor: 'red' }}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                </View>
            </View>
            </TouchableOpacity>
        );
    }

    createTipView = (tipArr = ['秒杀', '直降aaa']) => {
        let tipViewArr = [];
        tipViewArr = tipArr.map((itemStr, index) => {
            return (
                <View style={{
                    backgroundColor: 'rgba(255, 0, 80, 0.2)',
                    paddingLeft: px2dp(1),
                    paddingRight: px2dp(1),
                    marginLeft: px2dp(3),
                    height: px2dp(14),
                    borderRadius: px2dp(2),
                    justifyContent: 'center'
                }}>
                    <MRText style={{ color: 'rgba(255, 0, 80, 1)', fontSize: px2dp(10) }}>
                        {itemStr}
                    </MRText>
                </View>
            );
        });
        return tipViewArr;
    };
}
