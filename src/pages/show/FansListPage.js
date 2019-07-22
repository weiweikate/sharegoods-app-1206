/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/7/16.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import RefreshFlatList from '../../comm/components/RefreshFlatList';
import ShowApi from './ShowApi';
import ScreenUtils from '../../utils/ScreenUtils';
import ImageLoad from '@mr/image-placeholder';
import { MRText } from '../../components/ui';
import LinearGradient from 'react-native-linear-gradient';

const autoSizeWidth = ScreenUtils.autoSizeWidth;
/**
 *  type
 *  0 我的粉丝
 *  1 我的关注
 *  2 TA的粉丝
 *  3 TA的关注
 *
 *  id //查询的用户
 */

const Titles = ['我的粉丝', '我的关注', 'TA的粉丝', 'TA的关注'];
const Apis = [ShowApi.getUserFans, ShowApi.getUserFollow, ShowApi.getOtherFans,ShowApi.getOtherFollow]
export default class FansListPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
        this.type = this.params.type;
        if ( this.type > 3){this.type = 0}
    }

    componentDidMount(){
        this.$NavigationBarResetTitle(Titles[this.type])
    }

    $navigationBarOptions = {
        title: '',
        show: true// false则隐藏导航
    };
    btnClick = (item, index)=>{
        let {relationType, userNo} = item;

        //  0 相互未关注 1 为我关注他，2 为相互关注 3为他关注我
        if (relationType === 1 || relationType === 2){//取消关注
            Alert.alert('温馨提示','确定取消对TA的关注吗？',[
                {text: '再想想',onPress: ()=> {}},
                {text: '确定取消',onPress: ()=> {
                    this.$loadingShow();
                    ShowApi.cancelFollow({userNo}).then(()=> {
                        this.$loadingDismiss();
                        this.handleData(item, index);
                    }).catch((err) => {
                        this.$loadingDismiss();
                        this.$toastShow(err.msg)
                    })
                    }}
            ])
        } else {
            this.$loadingShow();
            ShowApi.userFollow({userNo}).then(()=> {
                this.$loadingDismiss();
                this.handleData(item, index);
            }).catch((err) => {
                this.$loadingDismiss();
                this.$toastShow(err.msg)
            })
        }


    }

    handleData(item, index){
        let relationType = item.relationType;
        let data = this.list.getSourceData();

        //  0 相互未关注 1 为我关注他，2 为相互关注 3为他关注我
        if (relationType === 1 || relationType === 2){//取消关注
            if (relationType === 1){
                item.relationType = 0
            }else {
                item.relationType = 3
            }

        } else {
            if (relationType === 0){
                item.relationType = 1
            }else {
                item.relationType = 2
            }
        }

        data[index] = item;
        this.list.changeData([...data]);
    }
    getParams = () => {
        if (this.type === 2 || this.type === 3){
            return {otherUserCode: this.params.id}
        }
        return {}
    }
    _render() {
        return (
            <RefreshFlatList
                url={Apis[this.type]}
                paramsFunc={this.getParams}
                renderItem={this.renderItem}
                ref={(ref)=> {this.list = ref}}
                defaultEmptyText={['您还没有粉丝哦～','您还没有关注的人～','TA还没有粉丝哦～','TA还没有关注的人～'][this.type]}
            />
        );
    }


    renderItem = ({item, index})=>{
        let {userImg, userType, fansCount ,contentCount, userName} = item;
        let detail = ''
        if (contentCount !== 0){
            detail = '文章·'+ contentCount
        }
        if (fansCount !== 0){
            if (detail.length === 0){
                detail = '粉丝·'+ fansCount
            }else {
                detail = detail + ' | 粉丝·'+ fansCount
            }
        }
        if (detail.length === 0 && userType === 1) {
            detail = '萌新驾到，还没留下什么'
        }
        return(
            <View style={styles.itemContainer}>
                <ImageLoad source={{uri: userImg}}
                           style={styles.userImg}
                           isAvatar={true}
                />
                <View style={{
                    marginLeft: autoSizeWidth(10),
                    flex: 1
                }}>
                    <MRText style={styles.userName}>{userName}</MRText>
                    { detail.length?<MRText style={styles.detail}>{detail}</MRText>:null}
                </View>
                {this.renderBtn(item, index)}
            </View>
        )
    }

    renderBtn(item, index){
        let relationType = item.relationType;
        //  0 相互未关注 1 为我关注他，2 为相互关注 3为他关注我
        switch (relationType) {
            case 0:
            case 3: {
                return(
                    <TouchableWithoutFeedback onPress={()=>this.btnClick(item,index)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={['#FFCB02', '#FF9502']}
                                        style={styles.btn}
                        >
                            <MRText style={{
                                fontSize: autoSizeWidth(13),
                                color: 'white',
                                marginBottom: 0.5
                            }} allowFontScaling={false}>关注</MRText>
                        </LinearGradient>
                    </TouchableWithoutFeedback>
                )
            }
            case 1:
            case 2: {
                return(
                    <TouchableWithoutFeedback onPress={()=>this.btnClick(item,index)}>
                        <View
                                        style={[styles.btn,{backgroundColor: '#FFEACC'}]}>
                            <MRText style={{
                                fontSize: autoSizeWidth(13),
                                color: '#FF9502',
                                marginBottom: 0.5
                            }} allowFontScaling={false}>{relationType == 1?'已关注':'相互关注'}</MRText>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    itemContainer:{
        height: autoSizeWidth(70),
        marginHorizontal: autoSizeWidth(15),
        marginTop: autoSizeWidth(10),
        borderRadius: 7,
        overflow: 'hidden',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    userImg: {
        height: autoSizeWidth(40),
        width: autoSizeWidth(40),
        borderRadius: autoSizeWidth(20),
        overflow: 'hidden',
        marginLeft: autoSizeWidth(15),
    },
    userName: {
        fontSize: DesignRule.fontSize_secondTitle,
        color:DesignRule.textColor_mainTitle
    },
    detail: {
        fontSize: DesignRule.fontSize_threeTitle,
        color:DesignRule.textColor_instruction,
        marginTop: 2
    },
    btn: {
        height: autoSizeWidth(28),
        width: autoSizeWidth(70),
        borderRadius: autoSizeWidth(14),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: autoSizeWidth(15)
    }
});
