import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import AvatarImage from '../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';

import RES from '../../../../comm/res';
import RouterMap from '../../../../navigation/RouterMap';
import StringUtils from '../../../../utils/StringUtils';

const arrow_right = RES.button.arrow_right_black;
const { px2dp, width } = ScreenUtils;
const img_w_h = (width - 30 - px2dp(16) - 1) / 3;

export class DetailHeaderScoreView extends Component {

    _renderContentImgs = (imgs) => {
        if (imgs.length > 0) {
            return <View style={styles.contentImgView}>
                {
                    imgs.map((value, index) => {
                        if (index > 5) {
                            return;
                        }
                        let leftValue = index === 0 || index === 3 ? 0 : px2dp(8);
                        return <NoMoreClick onPress={() => this._action(index)}>
                            {
                                index === 0 && this.hasVideo ? <Image key={index + value}
                                                                      style={[styles.contentImg, { marginLeft: leftValue }]}
                                                                      source={{ uri: value }}/> :
                                    <UIImage key={index + value}
                                             style={[styles.contentImg, { marginLeft: leftValue }]}
                                             source={{ uri: value }}/>
                            }

                        </NoMoreClick>;
                    })
                }
            </View>;
        }
    };

    _renderContent = (comment) => {
        const { headImg, nickname, imgUrl, videoUrl } = comment || {};
        const commentTemp = (comment || {}).comment;

        let images = [];
        if (StringUtils.isNoEmpty(videoUrl)) {
            this.hasVideo = true;
            images.push(`${videoUrl}?x-oss-process=video/snapshot,t_0,f_png,w_600,h_600,m_fast`);
        }
        if (StringUtils.isNoEmpty(imgUrl)) {
            let temp = imgUrl.split('$');
            images.push(...temp);
        }

        return (
            <View>
                <View style={styles.iconView}>
                    <AvatarImage style={styles.iconImg} source={{ uri: headImg }} borderRadius={15}/>
                    <Text style={styles.nameText}>{nickname || ''}</Text>
                </View>
                <Text style={styles.contentText}>{commentTemp || ''}</Text>
                {this._renderContentImgs(images)}
            </View>
        );
    };

    _action = (index) => {
        const { navigation, pData } = this.props;
        const { comment } = pData;
        const commentTemp = (comment || {}).comment;
        const { imgUrl, videoUrl } = comment || {};
        let images = [];
        if (StringUtils.isNoEmpty(imgUrl)) {
            images = imgUrl.split('$');
        }
        navigation.navigate(RouterMap.P_ScoreSwiperPage, {
            video: videoUrl,
            videoImg: `${videoUrl}?x-oss-process=video/snapshot,t_0,f_png,w_600,h_600,m_fast`,
            images: images,
            content: commentTemp,
            index: index
        });
    };

    _allScoreAction = () => {
        const { navigation, pData, messageCount } = this.props;
        navigation.navigate(RouterMap.P_ScoreListPage, {
            pData: pData,
            messageCount: messageCount
        });
    };

    render() {
        const { pData } = this.props;
        const { comment, totalComment } = pData;
        return (
            <View style={[styles.container, this.props.style]}>
                <NoMoreClick style={styles.tittleView} onPress={this._allScoreAction}>
                    <Text style={styles.countText}>{`晒单(${totalComment || 0})`}</Text>
                    <Text style={styles.moreText}>查看全部</Text>
                    <Image style={styles.moreImage} source={arrow_right}/>
                </NoMoreClick>
                {
                    comment ? this._renderContent(comment) : null
                }
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
        flexDirection: 'row', flexWrap: 'wrap'
    },
    contentImg: {
        width: img_w_h, height: img_w_h, marginBottom: 10
    }

});

export default DetailHeaderScoreView;
