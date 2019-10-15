import React from 'react';
import {
    View
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import {
    UIText
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
const {px2dp} = ScreenUtils;
const LogisticsDetailItem = props => {
    const {
        time,
        content1,
        isTop,
        isBottom,
        length
    } = props;

    this.renderMiddleImage = () => {
        return (
                <View style={{width:6,height:6,borderRadius:3,backgroundColor:'black'}}/>
        );
    };
    this.renderMiddleLine = () => {
        return (!isBottom ?
                <View style={{
                    width: 1,
                    backgroundColor: DesignRule.color_ddd,
                    marginTop: isTop ? px2dp(32) : px2dp(-19)
                }}/> :
                <View style={{
                    width: 1,
                    backgroundColor: DesignRule.color_ddd,
                    marginTop: px2dp(-19),
                    height: length > 1 ? px2dp(19) + px2dp(26) : 0,
                }}/>
        );
    };
    return (
        <View style={{marginRight:px2dp(15),marginLeft:px2dp(15),borderTopLeftRadius:isTop ? 10 : 0,borderTopRightRadius:isTop ? 10 : 0 ,backgroundColor:'white',
            borderBottomLeftRadius:isBottom ? 10 : 0,borderBottomRightRadius:isBottom ? 10 : 0,paddingBottom:px2dp(19),paddingTop:isTop ? px2dp(15) : 0,marginTop:-2}}>
        <View style={{ flexDirection: 'row',paddingLeft: px2dp(10),paddingRight:px2dp(21),}}>
            <View style={{width: px2dp(40), paddingTop: px2dp(10),marginRight:px2dp(15),marginLeft:px2dp(1)}}>
                <UIText value={time.substr(5,5)} style={{ fontSize: px2dp(13), color: isTop ? DesignRule.textColor_mainTitle_222 : DesignRule.textColor_instruction,textAlign:'right',marginRight:-1}}/>
                <UIText value={time.substr(10,6)} style={{ fontSize: px2dp(11), color: isTop ? DesignRule.textColor_mainTitle_222 : DesignRule.textColor_instruction,marginTop:px2dp(-14) ,textAlign:'right' }}/>
            </View>
            {this.renderMiddleLine()}
            {isTop || isBottom ?
                <View style={{position: 'relative', left: -3.5, top:!isBottom ? px2dp(32) : px2dp(26)}}>
                    {this.renderMiddleImage()}
                </View> :
                <View style={{position: 'relative', left: -3.5, alignItems: 'center', justifyContent: 'center'}}>
                    {this.renderMiddleImage()}
                </View>
            }
            <View style={{ paddingLeft: px2dp(20),paddingRight:px2dp(48),paddingTop:px2dp(15) }}>
                <UIText value={content1} style={{ fontSize: px2dp(13), color: isTop ? DesignRule.textColor_mainTitle_222 : DesignRule.textColor_instruction }}/>
            </View>
        </View>
        </View>
    );
};


export default LogisticsDetailItem;
