/**
 * @author xzm
 * @date 2019/4/3
 */

import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text } from '../../../../components/ui';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import res from '../../res';
import AvatarImage from '../../../../components/ui/AvatarImage';
import ToSearchComponent from './Component/ToSearchComponent';
import SmoothPushHighComponent from '../../../../comm/components/SmoothPushHighComponent';
const {px2dp} = ScreenUtils;
const {
    bg_fans_item
} = res.homeBaseImg;

const {
    icon_v1,
    icon_v2,
    icon_v3,
    icon_v4,
    icon_v5
} = res.myData;
type Props = {};
@SmoothPushHighComponent
export default class GroupShowFansPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            fansNum: null
        };
    }

    $navigationBarOptions = {
        title: '我的秀迷',
        show: true
    };

    _listItemRender = ({ item }) => {
        const uri = { uri: item.headImg };
        return (
            <ImageBackground resizeMode={'stretch'} source={bg_fans_item} style={styles.itemWrapper}>
                <View style={[styles.fansIcon, { overflow: 'hidden' }]}>
                    <AvatarImage style={styles.fansIcon} source={uri}/>
                </View>
                <Text style={styles.fansNameStyle}>
                    {item.nickname}
                </Text>
            </ImageBackground>
        );
    };

    _headerRender = () => {
        let levelIcon ;
        if(this.params.vname === 'v1'){
            levelIcon = icon_v1
        }
        if(this.params.vname === 'v2'){
            levelIcon = icon_v2
        }
        if(this.params.vname === 'v3'){
            levelIcon = icon_v3
        }
        if(this.params.vname === 'v4'){
            levelIcon = icon_v4
        }
        if(this.params.vname === 'v5'){
            levelIcon = icon_v5
        }
       return(
           <View style={styles.headerWrapper}>
               <Text style={styles.levelNameText}>
                   {`${this.params.name}品鉴官`}
               </Text>
               <Image source={levelIcon} style={styles.iconStyle}/>
                <View style={{flex:1}}/>
               <Text style={styles.headerText}>
                   {`${this.params.count || 0}人`}
               </Text>
           </View>
       )
    };

    _render() {
        return (
            <View style={styles.container}>
                <ToSearchComponent navigate={this.$navigate} levelId={this.params.id}/>
                {this._headerRender()}
                <RefreshFlatList
                    style={styles.container}
                    url={MineAPI.getShowFansList}
                    renderItem={this._listItemRender}
                    params={{levelId:this.params.id}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemWrapper: {
        height: 66 * 240 / 195,
        width: (ScreenUtils.width - DesignRule.margin_page * 2) * 1071 / 1030,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: DesignRule.margin_page + 5,
        marginTop: 3,
        alignSelf: 'center'
    },
    fansIcon: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    fansNameStyle: {
        color: DesignRule.textColor_mainTitle_222,
        fontSize: DesignRule.fontSize_mainTitle,
        marginLeft: 8,
        paddingVertical: 5
    },
    typeWrapper: {
        width: 55,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noActivateTextStyle: {
        fontSize: DesignRule.fontSize_20,
        color: DesignRule.textColor_secondTitle
    },
    activateTextStyle: {
        fontSize: DesignRule.fontSize_20,
        color: DesignRule.mainColor
    },
    headerTextWrapper: {
        marginLeft: DesignRule.margin_page,
        marginTop: 15,
        fontSize: DesignRule.fontSize_threeTitle,
        color: DesignRule.textColor_secondTitle
    },
    levelWrapper: {
        borderRadius: 2,
        height: 15,
        justifyContent: 'center',
        borderWidth: 1,
        marginLeft: 15,
        borderColor:DesignRule.mainColor,
        paddingHorizontal:12,
    },
    levelTextStyle: {
        color: DesignRule.mainColor,
        includeFontPadding: false,
        fontSize: DesignRule.fontSize_20
    },
    groupWrapper:{
        height:px2dp(44),
        width:DesignRule.width - DesignRule.margin_page*2,
        backgroundColor:DesignRule.white,
        borderRadius:px2dp(5),
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:px2dp(15),
        paddingRight:px2dp(10),
        alignSelf:'center',
        marginTop:px2dp(15)
    },
    levelName:{
        color:DesignRule.textColor_mainTitle,
        fontSize:DesignRule.fontSize_threeTitle
    },
    numTextStyle:{
        fontSize:px2dp(12),
        color:DesignRule.textColor_instruction,
        flex:1,
        textAlign:'right',
    },
    headerWrapper:{
        flexDirection:'row',
        alignItems:'center',
        width:DesignRule.width,
        paddingHorizontal:px2dp(15),
        marginTop:px2dp(10)
    },
    iconStyle:{
        width:px2dp(24),
        height:px2dp(16),
        marginLeft:px2dp(5),
    },
    headerText:{
        color:DesignRule.textColor_instruction,
        fontSize:DesignRule.fontSize_24
    },
    levelNameText:{
        color:DesignRule.textColor_mainTitle,
        fontSize:px2dp(13)
    }
});
