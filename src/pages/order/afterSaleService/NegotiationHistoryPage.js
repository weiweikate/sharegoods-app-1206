/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/6/5.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity, Clipboard,
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    MRText
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import RefreshFlatList from '../../../comm/components/RefreshFlatList';
import user from '../../../model/user';
import DateUtils from '../../../utils/DateUtils';
import res from '../res';
import OrderApi from '../api/orderApi';
import ImageLoader from '@mr/image-placeholder';
import bridge from '../../../utils/bridge';
import { routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';

const OperatorType = {
    USER: 'USER',//用户
    MERCHANT: 'MERCHANT',//商家
    OPERATOR: 'OPERATOR'//运营人员
}
export default class NegotiationHistoryPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '协商记录',
        show: true// false则隐藏导航
    };


    componentDidMount() {

    }

    renderItem({item}){
        let header = () => {}
        let name = ''
        if (item.operatorType === OperatorType.USER){
            name = '自己'
            header = () => {return  <ImageLoader source={{uri: user.headImg}} style={styles.headerImg} isAvatar={true}/>}
        }else if (item.operatorType === OperatorType.MERCHANT){
            name = '商家'
            header = () => {return  <ImageLoader source={{uri: ''}} style={styles.headerImg} isAvatar={true}/>}
        }else {
            name = '秀购平台'
            header = () => {return  <Image source={res.other.tongyong_logo_nor} style={styles.headerImg} />}
        }

        return(
            <View style={{paddingBottom: 10, backgroundColor: 'white'}}>
                <View style={{height: 10, backgroundColor: DesignRule.bgColor}}/>
                <View style={styles.headerContainer}>
                    {header()}
                    <MRText style={styles.name}>{name}</MRText>
                    <MRText style={styles.time}>{ DateUtils.formatDate(item.createTime)}</MRText>
                </View>
                <MRText style={styles.title}>{item.operation}</MRText>
                {this.renderDetail(item)}
            </View>
        )
    }

    renderDetail(item){
        if (item.operation === '提交售后申请' || item.operation === '修改售后申请'){
            let content = item.content || '{}';
            let {applyQuantity, imgList, description, reason, applyRefundAmount, createTime, merchantOrderNo, serviceNo, type} = JSON.parse(content) || {};
            return(
                <View>
                    <MRText style={styles.detail}>{'申请售后理由：' + reason}</MRText>
                    <MRText style={styles.detail}>{'申请数量：' + applyQuantity}</MRText>
                    {type != 3 ?  <MRText style={styles.detail}>{'退款金额：¥' + applyRefundAmount}</MRText> : null}
                    <MRText style={styles.detail}>{'问题描述：' + (description || '/')}</MRText>
                    <MRText style={styles.detail}>{'申请时间：' + DateUtils.formatDate(createTime || '')}</MRText>
                    <View style={{flexDirection: 'row'}}>
                        <MRText style={styles.detail}>{'订单号：' + merchantOrderNo}</MRText>
                        <TouchableOpacity style={styles.copyBtn}
                                          onPress={()=>{this.copyText(merchantOrderNo)}}
                        >
                            <MRText style={styles.copyBtnText}>复制</MRText>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <MRText style={styles.detail}>{'申请单号：' + serviceNo}</MRText>
                        <TouchableOpacity style={styles.copyBtn}
                                          onPress={()=>{this.copyText(serviceNo)}}>
                            <MRText style={styles.copyBtnText}>复制</MRText>
                        </TouchableOpacity>
                    </View>
                    <MRText style={styles.detail}>{'上传图片:' + (imgList ? '' : '/')}</MRText>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingRight: 15,
                        marginBottom: 15
                    }}>
                        {this.renderCertificateImage(imgList)}
                    </View>
                </View>
            )

        }else {
            let content = item.content || '';
            content = content.replace(/;/g, '；')
            content = content.replace(/:/g, '：')
            return  <MRText style={styles.detail}>{content}</MRText>
        }
    }

    copyText(str){
        if (str){
            Clipboard.setString(str);
            bridge.$toast('复制成功')
        }
    }

    imgClick(imageUrls, index){
        routePush(RouterMap.CheckBigImagesView,{imageUrls, index})
    }



    /** 图片*/
    renderCertificateImage = (imgList) => {
        let arr = [];
        imgList = imgList || '';
        imgList = imgList.split(',');
        for (let i = 0; i < imgList.length; i++) {
            if (imgList[i].length > 0){
                arr.push(
                    <TouchableOpacity onPress={()=> {this.imgClick(imgList,i)}}>
                    <ImageLoader source={{ uri: imgList[i] }}
                                 style={{
                                     height: 50,
                                     width: 50,
                                     marginLeft: i ? 10 : 15,
                                     marginTop: 5
                                 }}/>
                    </TouchableOpacity>
                );
            }
        }
        return arr;
    };



    _render() {
        return (
            <RefreshFlatList
                url={OrderApi.consultation}
                params={{serviceNo: this.params.serviceNo}}
                isSupportLoadingMore={false}
                handleRequestResult={(result) => {return result.data}}
                renderItem={this.renderItem.bind(this)}
            />
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: DesignRule.lineColor_inWhiteBg,
        borderBottomWidth: DesignRule.lineHeight,
    },
    headerImg: {
        height: 30,
        width: 30,
        borderRadius: 15,
        marginLeft: 15,
        overflow: 'hidden'
    },
    name: {
        marginLeft: 10,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        flex: 1
    },
    time: {
        marginRight: 15,
        fontSize: 13,
        color: DesignRule.textColor_instruction
    },
    title: {
        marginLeft: 15,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        fontWeight: '600',
        marginTop: 10
    },
    detail: {
        marginHorizontal: 15,
        fontSize: 11,
        color: DesignRule.textColor_secondTitle,
        marginTop: 5
    },
    copyBtn: {
        marginTop: 5,
        justifyContent: 'center',
        width: 40,
    },
    copyBtnText: {
        fontSize: 11,
        color: DesignRule.mainColor,
    }
});
