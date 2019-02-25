import React, { Component } from 'react';
import { View, StyleSheet, Image, NativeModules ,Platform} from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import AvatarImage from '../../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';
import pRes from '../../../res';
import DateUtils from '../../../../../utils/DateUtils';
import RouterMap from '../../../../../navigation/RouterMap';
import NoMoreClick from '../../../../../components/ui/NoMoreClick';
import StringUtils from '../../../../../utils/StringUtils';

const { p_score_star, p_score_unStar } = pRes.product.productScore;

const { px2dp, width } = ScreenUtils;
const img_w_h = (width - 30 - px2dp(16) - 1) / 3;

export class P_ScoreListItemView extends Component {

    _renderStars = (star) => {
        let score = parseInt(star);
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Image key={i}
                       source={score > i ? p_score_star : p_score_unStar}
                       style={{ height: 10, width: 10, marginLeft: i === 0 ? 0 : 6 }}/>
            );
        }
        return <View style={styles.starsView}>
            {stars}
        </View>;
    };

    _renderContentImgs = (imgs) => {
        if ((imgs || []).length > 0) {
            return <View style={styles.contentImgView}>
                {
                    imgs.map((value, index) => {
                        if (index > 5) {
                            return;
                        }
                        let leftValue = index === 0 || index === 3 ? 0 : px2dp(8);
                        return <NoMoreClick onPress={() => this._action(index)} key={index}>
                            {
                                this.hasVideo && index === 0 ?
                                    <Image style={[styles.contentImg, { marginLeft: leftValue }]}
                                           source={{ uri: value }}/> :
                                    <UIImage style={[styles.contentImg, { marginLeft: leftValue }]}
                                             source={{ uri: value }}/>
                            }

                        </NoMoreClick>;
                    })
                }
            </View>;
        }
    };

    _action = (index) => {
        const { navigation, itemData } = this.props;
        const { imgUrl, videoUrl, videoImgPath, comment } = itemData;
        let images = [];
        if (StringUtils.isNoEmpty(imgUrl)) {
            images = imgUrl.split('$');
        }
        navigation.navigate(RouterMap.P_ScoreSwiperPage, {
            video: videoUrl,
            videoImg: videoImgPath,
            images: images,
            content: comment,
            index: index
        });
    };

    componentDidMount = () => {
        this._getVideoImage(this.props);
    };

    componentWillReceiveProps(nextProps) {
        this._getVideoImage(nextProps);
    }


    _getVideoImage = (props)=>{
        //处理视频图片
        let { videoUrl } = props.itemData;
        if (StringUtils.isNoEmpty(videoUrl)) {
            NativeModules.commModule.RN_Video_Image(videoUrl).then(({ imagePath }) => {
                props.itemData.videoImgPath = Platform.OS === 'android' ? 'file://' + imagePath : '' + imagePath;
                this.setState({
                    data: props.pData
                });
            });
        }
    }
    render() {
        const { headImg, nickname, star, comment, imgUrl, createTime, spec, videoUrl, videoImgPath, reply } = this.props.itemData || {};
        let imgs = [];
        if (StringUtils.isNoEmpty(videoUrl)) {
            this.hasVideo = true;
            imgs.push(videoImgPath);
        }
        if (StringUtils.isNoEmpty(imgUrl)) {
            let temp = imgUrl.split('$');
            imgs.push(...temp);
        }
        return (
            <View style={styles.container}>
                <View style={styles.iconView}>
                    <AvatarImage style={styles.iconImg} source={{ uri: headImg }} borderRadius={15}/>
                    <Text style={styles.nameText}>{nickname || ''}</Text>
                    {this._renderStars(star)}
                </View>
                <Text style={styles.skuText}>{spec || ''}</Text>
                <Text
                    style={styles.contentText}>{(StringUtils.isEmpty(comment) && imgs.length === 0 ? '此用户未留下晒单内容~' : comment || '')}</Text>
                {this._renderContentImgs(imgs)}
                <Text style={styles.dateText}>{DateUtils.formatDate(createTime || '', 'yyyy-MM-dd')}</Text>
                {
                    StringUtils.isEmpty(reply) ? null : <View style={styles.responseView}>
                        <Text style={styles.responseTittleText}>秀秀回复</Text>
                        <Text
                            style={styles.responseContentText}>{reply}</Text>
                    </View>
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
    skuText: {
        fontSize: 11, color: DesignRule.textColor_instruction
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
    },
    dateText: {
        marginBottom: 10,
        fontSize: 11, color: DesignRule.textColor_instruction
    },
    responseView: {
        marginBottom: 10,
        backgroundColor: '#f2f2f2', borderRadius: 5
    },
    responseTittleText: {
        marginTop: 10, marginLeft: 10,
        fontSize: 11, color: DesignRule.textColor_secondTitle
    },
    responseContentText: {
        marginHorizontal: 10, marginVertical: 10,
        fontSize: 11, color: DesignRule.textColor_instruction
    }

});

export default P_ScoreListItemView;

