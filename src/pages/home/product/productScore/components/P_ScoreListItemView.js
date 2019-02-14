import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import AvatarImage from '../../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';
import pRes from '../../../res';

const { p_score_star, p_score_unStar } = pRes.product.productScore;

const { px2dp, width } = ScreenUtils;

export class P_ScoreListItemView extends Component {

    _renderStars = () => {
        let score = 4;
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Image source={score > i ? p_score_star : p_score_unStar}
                       style={{ height: 10, width: 10, marginLeft: i === 0 ? 0 : 6 }}/>
            );
        }
        return <View style={styles.starsView}>
            {stars}
        </View>;
    };

    _renderContentImgs = (imgs) => {
        if (imgs.length > 0) {
            return <View style={styles.contentImgView}>
                {
                    imgs.map((value, index) => {
                        if (index > 2) {
                            return;
                        }
                        let leftValue = index === 0 ? 0 : px2dp(8);
                        return <UIImage style={[styles.contentImg, { marginLeft: leftValue }]}
                                        source={{ uri: value }}/>;
                    })
                }
            </View>;
        }
    };

    render() {
        let imgArr = ['', '', '', ''] || [];

        return (
            <View style={styles.container}>
                <View style={styles.iconView}>
                    <AvatarImage style={styles.iconImg}/>
                    <Text style={styles.nameText}>Raul Kling</Text>
                    {this._renderStars()}
                </View>
                <Text style = {styles.skuText}>颜色：白色；尺码：XL</Text>
                <Text style={styles.contentText}>衣服很合身，穿着很舒服，已经是第二次购买了！</Text>
                {this._renderContentImgs(imgArr)}
                <Text style={styles.dateText}>2018-12-27</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10, paddingHorizontal: 15,
        backgroundColor: DesignRule.white
    },

    /**内容**/
    iconView: {
        flexDirection: 'row', marginTop: 15, marginBottom: 10, alignItems: 'center'
    },
    iconImg: {
        width: 30, height: 30
    },
    nameText: {
        marginLeft: 5, marginRight: 16,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    starsView: {
        flexDirection: 'row'
    },
    skuText:{
        fontSize: 11, color: DesignRule.textColor_instruction
    },
    /**文字**/
    contentText: {
        marginVertical: 10,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    /**图片**/
    contentImgView: {
        flexDirection: 'row'
    },
    contentImg: {
        width: (width - 30 - px2dp(16)) / 3, height: (width - 30 - px2dp(16)) / 3
    },
    dateText: {
        marginVertical: 10,
        fontSize: 11, color: DesignRule.textColor_instruction
    }

});

export default P_ScoreListItemView;

