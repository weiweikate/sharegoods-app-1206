/**
 * @author xzm
 * @date 2019/6/26
 */

import React, { PureComponent } from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import ImageLoad from '@mr/image-placeholder';
import DesignRule from '../../../constants/DesignRule';
import ShowUtils from '../utils/ShowUtils';
import RouterMap, { routePush } from '../../../navigation/RouterMap';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import { MRText } from '../../../components/ui';
import EmptyUtils from '../../../utils/EmptyUtils';

const { px2dp } = ScreenUtils;
const { iconShowFire } = res;


export default class TagDetailItemView extends PureComponent {
    constructor(props) {
        super(props);
        this.hotCount = this.props.itemData.hotCount;
        this.state = {
            hotCount: this.hotCount
        };
    }

    hotAdd = (num) => {
        this.hotCount = num;
        this.setState({
            hotCount: this.hotCount
        });
    };

    render() {
        const { itemContainer, itemData } = this.props;
        let uri, width = 1, height = 1;
        let minHeight = itemContainer.width * 120 / 167;
        let maxHeight = itemContainer.width * 240 / 167;
        if (itemData.showType === 3) {
            if (itemData.resource) {
                for (let i = 0; i < itemData.resource.length; i++) {
                    let resourceItem = itemData.resource[i];
                    if (resourceItem.type === 5) {
                        uri = resourceItem.baseUrl;
                        width = resourceItem.width;
                        height = resourceItem.height;
                    }
                }
            }
        } else {
            if (itemData.resource) {
                uri = itemData.resource[0].baseUrl;
                width = itemData.resource[0].width;
                height = itemData.resource[0].height;
            }
        }

        height = itemContainer.width * height / width;
        if (height < minHeight) {
            height = minHeight;
        }

        if (height > maxHeight) {
            height = maxHeight;
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                if (itemData.showType === 1) {
                    routePush(RouterMap.ShowDetailPage, {
                        code: itemData.showNo, updateHotNum: (num) => {
                            this.hotAdd(num);
                        }
                    });
                } else if (itemData.showType === 3) {
                    routePush(RouterMap.ShowVideoPage, { code: itemData.showNo });
                } else {
                    routePush(RouterMap.ShowRichTextDetailPage, { code: itemData.showNo });
                }
            }}>
                <View style={{
                    width: itemContainer.width,
                    overflow: 'hidden',
                    borderRadius: px2dp(5),
                    backgroundColor: DesignRule.white
                }}>
                    <ImageLoad
                        source={{ uri }}
                        style={{ width: itemContainer.width, height, marginBottom: px2dp(10) }}/>
                    {itemData.content ? <MRText
                        numberOfLines={2}
                        style={{
                            fontSize: DesignRule.fontSize_threeTitle,
                            color: DesignRule.textColor_mainTitle,
                            width: itemContainer.width - px2dp(20),
                            alignSelf: 'center',
                            marginBottom: px2dp(10)
                        }}>
                        {itemData.content}
                    </MRText> : null}

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: px2dp(10),
                        marginBottom: px2dp(10)
                    }}>
                        <View style={{ borderRadius: px2dp(10), overflow: 'hidden' }}>
                            {!EmptyUtils.isEmpty(itemData.userInfoVO.userImg) ?
                                <ImageLoad source={{ uri: itemData.userInfoVO.userImg }}
                                           style={{ width: px2dp(20), height: px2dp(20), borderRadius: px2dp(10) }}/> :
                                <Image source={res.placeholder.avatar_default}
                                       style={{ width: px2dp(20), height: px2dp(20), borderRadius: px2dp(10) }}
                                       borderRadius={px2dp(10)}/>}
                        </View>
                        <MRText style={{
                            color: DesignRule.textColor_secondTitle,
                            fontSize: px2dp(11),
                            flex: 1,
                            marginLeft: px2dp(5)
                        }}>
                            {itemData.userInfoVO.userName}
                        </MRText>
                        <Image style={{ width: 20, height: 20 }} source={iconShowFire}/>
                        <MRText style={{ color: DesignRule.textColor_secondTitle, marginLeft: px2dp(5) }}>
                            {ShowUtils.formatShowNum(this.state.hotCount)}
                        </MRText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}



