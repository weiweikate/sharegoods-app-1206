/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/15.
 * props type 'Image'(有分享图片和web) 'nomal'（分享web）
 *
 *     imageJson:{
 *     imageUrlStr: 'http//：xxxx.png',
            titleStr: '商品标题',
            priceStr: '¥100.00',
            QRCodeStr: '分享的链接',
 *     }
 *     webJson:{
 *    title:分享标题(当为图文分享时候使用)
      dec:内容(当为图文分享时候使用)
      linkUrl:(图文分享下的链接)
      thumImage:(分享图标小图(http链接)图文分享使用)
 *     }
 */
"use strict";

import React from "react";

import {
    StyleSheet,
    View,
    Modal,
    TouchableWithoutFeedback,
    Animated
} from "react-native";

import {
    UIText, UIImage
} from '../../components/ui';

import ScreenUtils from '../../utils/ScreenUtils';
const saveMarginBottom = ScreenUtils.saveMarginBottom;
const autoSizeWidth = ScreenUtils.autoSizeWidth;

import CommTabImag from '../res/CommTabImag'
import bridge from '../../utils/bridge'

export default class CommShareModal extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {
            modalVisible: false,
            shareType: 1,
            path: '',
            scale: new Animated.Value(0.5),
        };
    }
    /** public*/
    open(){
        this.setState({modalVisible: true, shareType: 1,});
    }
    close(){
        this.setState({modalVisible: false});
    }
    /** public end */
    _bind() {
        this.open = this.open.bind(this);
    }

    componentDidMount() {

    }
    /**
     jsonData 参数
     info:包含截屏参数
     shareType : 0图片分享 1 图文链接分享
     platformType: 0 朋友圈 1 会话
     title:分享标题(当为图文分享时候使用)
     dec:内容(当为图文分享时候使用)
     linkUrl:(图文分享下的链接)
     thumImage:(分享图标小图(http链接)图文分享使用)
     shareImage:分享的大图(本地URL)图片分享使用
     **/
    share(platformType){
        this.close();
       let params = {shareType: this.state.shareType, platformType: platformType};
       if (this.state.shareType === 0){//图片分享
           params.shareImage = this.state.path;
       } else if(this.state.shareType === 1){//图文链接分享
           let {title, dec, linkUrl, thumImage} = this.props.webJson;
           params.title = title;
           params.dec = dec;
           params.linkUrl = linkUrl;
           params.thumImage = thumImage;
       }
       bridge.share(params, () => {

       }, (errorStr) => {

       });
    }

    saveImage(path){
        bridge.saveImage(path);
    }

    copyUrl(){
        this.close();
    }

    changeShareType(shareType){
        this.setState({shareType: shareType});

        if (this.state.path.length === 0 && shareType === 0){
            bridge.creatShareImage(this.props.imageJson, (path) => {
                this.setState({path: path});
                this.startAnimated();
            })
        }else {
            this.startAnimated();
        }
    }

    startAnimated(){
       this.state.scale.setValue(0.5);
        Animated.spring(
            // Animate value over time
            this.state.scale, // The value to drive
            {
                toValue: 1,
                duration: 500,
            }
        ).start();
    }

    render() {
        let array = [];
        if(this.props.type === 'Image'){
            array.push({image: CommTabImag.wechat, title: '微信好友', onPress: () => {this.share(1)}});
            array.push( {image: CommTabImag.pengyouquan, title: '朋友圈', onPress: () => {this.share(0)}});
            if (this.state.shareType === 1){
                array.push({image: CommTabImag.lianjie, title: '复制链接', onPress: () => {this.copyUrl()}})
                array.push({image: CommTabImag.baocun, title: '保存图片', onPress: () => {this.changeShareType(0)}});
            }
            if (this.state.shareType === 0){
                array.push({image: CommTabImag.download, title: '下载图片', onPress: () => {this.saveImage(this.state.path)}});
            }
        }
        return (
            <Modal
                animationType = "slide"
                transparent = {true}
                visible = {this.state.modalVisible}
                onRequestClose = {() => {
                    this.close();
                }}
                style = {styles.modalStyle}
            >
                <View style = {{flex: 1}}/>
                <View style = {styles.contentContainer}>
                    <View style = {styles.header}>
                        <View style = {{flex: 1, marginLeft: autoSizeWidth(25), height: 1, backgroundColor: '#EEEEEE'}} />
                        <UIText value = {'分享到'} style = {{color: '#4D4D4D', fontSize: autoSizeWidth(17), marginHorizontal: 7}}/>
                        <View style = {{flex: 1, marginRight: autoSizeWidth(25), height: 1, backgroundColor: '#EEEEEE'}} />
                    </View>
                    <View style ={{flexWrap: 'wrap', flexDirection: 'row'}}>
                        {
                            array.map((item, index) => {
                                return(
                                    <TouchableWithoutFeedback key = {index + 'item'} onPress = {item.onPress}>
                                        <View style = {styles.item}>
                                            <UIImage source = {item.image} style = {{height: autoSizeWidth(47),width: autoSizeWidth(47)}}/>
                                            <UIText value = {item.title} style = {{marginTop: 5, color: '#4D4D4D', fontSize: autoSizeWidth(11)}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </View>
                </View>
                <View style = {{marginHorizontal: autoSizeWidth(25), height: 1, backgroundColor: '#EEEEEE', justifySelf: 'flex-end'}}/>
                <TouchableWithoutFeedback onPress = {() =>{this.close()}}
                >
                    <View style = {[styles.bottomBtn,{ justifySelf: 'flex-end'}]}>
                        <UIText value = {'取消'} style = {{color: '#4D4D4D', fontSize: autoSizeWidth(16)}}/>
                    </View>
                </TouchableWithoutFeedback>
                {
                    this.state.shareType === 0 ?
                        <Animated.View style={{
                            height: autoSizeWidth(650 / 2),
                            width: autoSizeWidth(250),
                            position: 'absolute',
                            top: autoSizeWidth(90 + ScreenUtils.statusBarHeight),
                            left: autoSizeWidth(125 / 2),
                            borderRadius: 8,
                            borderColor: '#CCCCCC',
                            shadowOpacity: 0.3,
                            borderWidth: 0.5,
                            overflow: 'hidden',
                            shadowColor: '#CCCCCC',
                            transform: [{scale: this.state.scale}]

                        }}>
                            <UIImage source={{ uri: this.state.path }}
                                     style={{ height: autoSizeWidth(650 / 2), width: autoSizeWidth(250)}}/>
                        </Animated.View> : null
                }
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {

    },
    contentContainer: {
        backgroundColor: 'white',
        height: autoSizeWidth(295) + saveMarginBottom,
    },
    header:{
        flexDirection: 'row',
        height:autoSizeWidth(45),
        alignItems: 'center',
    },
    bottomBtn: {
        height: autoSizeWidth(45),
        marginBottom: saveMarginBottom,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    item: {
        width: autoSizeWidth(187.5 / 2),
        height: autoSizeWidth(187.5 / 2),
        marginTop: autoSizeWidth(20),
        alignItems: 'center',
        justifyContent: 'center',
    }
});
