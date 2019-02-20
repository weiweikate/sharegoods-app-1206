import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import NoMoreClick from '../../../../../components/ui/NoMoreClick';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import DesignRule from '../../../../../constants/DesignRule';
import pRes from '../../../res';
import { observer } from 'mobx-react';

const { px2dp, width } = ScreenUtils;
const { p_score_star, p_score_unStar, p_score_add, p_score_delete, shaidan_icon_shipin } = pRes.product.productScore;
const img_w_h = (width - 60 - 12 * 3) / 4.0;

/**
 * 星星评分
 * **/
@observer
class StarsView extends Component {
    render() {
        const { index, p_ScorePublishModel, style } = this.props;
        const { itemDataS, changeStar } = p_ScorePublishModel;
        const itemData = itemDataS[index];
        let stars = [];
        for (let i = 1; i < 6; i++) {
            stars.push(
                <NoMoreClick key={i} onPress={() => {
                    changeStar(index, i);
                }}>
                    <Image source={itemData.starCount >= i ? p_score_star : p_score_unStar}
                           style={{ marginLeft: i === 1 ? 0 : px2dp(11) }}/>
                </NoMoreClick>
            );
        }

        return <View style={[style, { flexDirection: 'row', alignItems: 'center' }]}>
            {stars}
            <Text style={styles.wellText}>{itemData.starCount === 5 ? '非常好' : '好'}</Text>
        </View>;
    }
}

/**
 * 输入框和数量
 * **/
@observer
class TextInputView extends Component {
    render() {
        const { index, p_ScorePublishModel } = this.props;
        const { changeText, itemDataS } = p_ScorePublishModel;
        const itemData = itemDataS[index];
        return <View style={styles.textView}>
            <TextInput style={styles.textInput}
                       multiline
                       onChangeText={(text) => {
                           if (text.length > 180) {
                               text = text.substring(0, 180);
                           }
                           changeText(index, text);
                       }}
                       value={itemData.contentText}
                       placeholder={'晒单描述~'}/>
            <Text style={styles.numberText}>{`${itemData.contentText.length}/180`}</Text>
        </View>;
    }
}

/**
 * 视频和图片添加
 * **/
@observer
class ImgVideoView extends Component {
    render() {
        const { showAction, index, p_ScorePublishModel } = this.props;
        const { itemDataS, deleteImg, maxImageVideoCount } = p_ScorePublishModel;
        const itemData = itemDataS[index];
        const { images, video } = itemData;
        let dataCount = video ? images.length + 1 : images.length;
        return <View style={styles.imgVideosView}>
            {
                images.map((value, index1) => {
                    return <View key={index1} style={[styles.imgVideoView, { marginRight: index1 === 3 ? 0 : 2.5 }]}>
                        <UIImage style={styles.imgVideo} source={{ uri: value }}/>
                        <NoMoreClick style={styles.deleteImg}
                                     onPress={() => {
                                         deleteImg(index, index1);
                                     }}>
                            <Image source={p_score_delete}/>
                        </NoMoreClick>
                    </View>;
                })
            }
            {
                dataCount >= maxImageVideoCount ? null :
                    <NoMoreClick onPress={() => showAction(index)}>
                        <Image style={styles.imgVideo} source={p_score_add}/>
                    </NoMoreClick>
            }
            {
                dataCount >= maxImageVideoCount || video ? null :
                    <NoMoreClick onPress={() => showAction(index, true)}>
                        <Image style={[styles.imgVideo, { marginLeft: 12 }]} source={shaidan_icon_shipin}/>
                    </NoMoreClick>
            }
        </View>;
        ;
    }
}

export default class P_ScorePubItemView extends Component {
    render() {
        const { itemData, showAction, p_ScorePublishModel } = this.props;
        const { index } = itemData;

        const { productArr } = p_ScorePublishModel;
        const imgData = productArr[index];
        const { specImg } = imgData || {};

        return <View style={styles.container}>
            <View style={styles.scoreView}>
                <UIImage style={styles.productImg} source={{ uri: specImg }}/>
                <View>
                    <Text style={styles.satisfactionText}>商品满意度</Text>
                    <StarsView style={styles.starsView} index={index} p_ScorePublishModel={p_ScorePublishModel}/>
                </View>
            </View>
            <TextInputView index={index} p_ScorePublishModel={p_ScorePublishModel}/>
            <ImgVideoView showAction={showAction} index={index} p_ScorePublishModel={p_ScorePublishModel}/>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10, marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: DesignRule.white
    },
    /**满意度**/
    scoreView: {
        flexDirection: 'row', marginLeft: 15, marginTop: 15, marginBottom: 13
    },
    productImg: {
        marginRight: 10,
        height: 60, width: 60
    },
    satisfactionText: {
        marginTop: 2,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    starsView: {
        marginTop: 11
    },
    wellText: {
        marginLeft: px2dp(20),
        fontSize: 13, color: DesignRule.textColor_instruction
    },
    /**输入框**/
    textView: {
        marginHorizontal: 15
    },
    textInput: {
        padding: 0,
        height: 60, fontSize: 13, color: DesignRule.textColor_mainTitle, textAlignVertical: 'top'
    },
    numberText: {
        alignSelf: 'flex-end',
        fontSize: 11, color: DesignRule.textColor_instruction, paddingVertical: 4
    },
    /**图片视频**/
    imgVideosView: {
        flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 15, marginBottom: 15
    },
    imgVideoView: {
        width: img_w_h + 7, height: img_w_h + 10
    },
    imgVideo: {
        marginTop: 10,
        width: img_w_h, height: img_w_h, backgroundColor: DesignRule.bgColor
    },
    deleteImg: {
        position: 'absolute', right: 0, top: 0
    }
});
;
