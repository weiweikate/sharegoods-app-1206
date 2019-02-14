import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import AvatarImage from '../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';

import RES from '../../../../comm/res';

const arrow_right = RES.button.arrow_right_black;
const { px2dp, width } = ScreenUtils;

export class DetailScoreView extends Component {

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
        const { allAction } = this.props;
        let imgArr = ['', '', '', ''] || [];
        return (
            <View style={styles.container}>
                <NoMoreClick style={styles.tittleView} onPress={allAction}>
                    <Text style={styles.countText}>晒单(10)</Text>
                    <Text style={styles.moreText}>查看全部</Text>
                    <Image style={styles.moreImage} source={arrow_right}/>
                </NoMoreClick>
                <View style={styles.iconView}>
                    <AvatarImage style={styles.iconImg}/>
                    <Text style={styles.nameText}>Raul Kling</Text>
                </View>
                <Text style={styles.contentText}>衣服很合身，穿着很舒服，已经是第二次购买了！</Text>
                {this._renderContentImgs(imgArr)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10, paddingHorizontal: 15,
        backgroundColor: DesignRule.white
    },
    /**数量**/
    tittleView: {
        flexDirection: 'row', alignItems: 'center',
        height: 40
    },
    countText: {
        flex: 1, fontSize: 15, color: DesignRule.textColor_mainTitle
    },
    moreText: {
        fontSize: 12, color: DesignRule.textColor_redWarn
    },
    moreImage: {
        marginLeft: 5
    },
    /**内容**/
    iconView: {
        flexDirection: 'row', marginTop: 10, alignItems: 'center'
    },
    iconImg: {
        width: 30, height: 30
    },
    nameText: {
        marginLeft: 5,
        fontSize: 12, color: DesignRule.textColor_instruction
    },
    /**文字**/
    contentText: {
        marginVertical: 10,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    /**图片**/
    contentImgView: {
        flexDirection: 'row', marginBottom: 10
    },
    contentImg: {
        width: (width - 30 - px2dp(16)) / 3, height: (width - 30 - px2dp(16)) / 3
    }

});

export default DetailScoreView;
