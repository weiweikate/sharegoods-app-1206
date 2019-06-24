/**
 * @author xzm
 * @date 2019/6/19
 */

import React from 'react';
import {
    StyleSheet,
    RefreshControl,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../BasePage';
import NoMoreClick from '../../components/ui/NoMoreClick';
import res from './res';
import Waterfall from './components/Waterfall/Waterfall';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import TagDescriptionView from './components/TagDescriptionView';
import { MRText } from '../../components/ui';
import ShowApi from './ShowApi';
import ImageLoad from '@mr/image-placeholder';
import ShowUtils from './utils/ShowUtils';
import CommShareModal from '../../comm/components/CommShareModal';
import apiEnvironment from '../../api/ApiEnvironment';

const { iconShowShare, iconShowFire } = res;
const { px2dp } = ScreenUtils;

export default class TagDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLoadingMore: false
        };
        this.page = 1;
        this.size = 10;
    }

    $navigationBarOptions = {
        title: this.params.name,
        show: true
    };

    $NavBarRenderRightItem = () => {
        return (
            <NoMoreClick onPress={() => {
                this.shareModal && this.shareModal.open();
            }}>
                <Image source={iconShowShare}/>
            </NoMoreClick>
        );
    };

    headerRequestFinish = () => {
        this.data = [];
        this.loadMore();
    };

    refresh = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        this.setState({ isRefreshing: true });
        this.size = 10;
        this.page = 1;
        ShowApi.getDynamicWithTag({ page: this.page, size: this.size, tagId: this.params.tagId }).then((data) => {
            this.data = [];
            let realData = data.data.data || [];
            realData.map((item) => {
                this.data.push(item);
            });
            this.page++;
            this.setState({ isRefreshing: false });
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.setState({ isRefreshing: false });
        });
    };

    loadMore = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        this.setState({ isLoadingMore: true });
        ShowApi.getDynamicWithTag({ page: this.page, size: this.size, tagId: this.params.tagId }).then((data) => {

            let realData = data.data.data || [];
            realData.map((item) => {
                this.data.push(item);
            });

            this.page++;
            this.setState({ isLoadingMore: false });
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.setState({ isLoadingMore: false });
        });
    };

    renderItem = (itemData, itemIdx, itemContainer) => {
        //TODO 宽高判断 0判断
        let uri, width = 1, height = 1;
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

        return (
            <TouchableWithoutFeedback onPress={() => {
                if (itemData.showType === 1 || itemData.showType === 3) {
                    this.$navigate('show/ShowDetailPage', { code: itemData.showNo });
                } else {
                    this.$navigate('show/ShowRichTextDetailPage', { code: itemData.showNo });
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
                    {itemData.content ? <MRText style={{
                        fontSize: DesignRule.fontSize_threeTitle,
                        color: DesignRule.textColor_mainTitle,
                        width: itemContainer.width - px2dp(20),
                        alignSelf: 'center',
                        maxLength: 2,
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
                            <ImageLoad source={{ uri: itemData.userInfoVO.userImg }}
                                       style={{ width: px2dp(20), height: px2dp(20), borderRadius: px2dp(10) }}/>
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
                            {ShowUtils.formatShowNum(itemData.hotCount)}
                        </MRText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };


    renderHeader = () => {
        return (<TagDescriptionView tagId={6} callback={this.headerRequestFinish}/>);
    };

    _render() {
        return (
            <View style={{flex:1}}>
                <Waterfall
                    showsVerticalScrollIndicator={false}
                    style={styles.waterfall}
                    data={this.data}
                    renderHeader={this.renderHeader}
                    gap={px2dp(15)}
                    numberOfColumns={2}
                    expansionOfScope={100}
                    onEndReachedThreshold={1000}
                    onEndReached={this.loadMore}
                    renderItem={this.renderItem}
                    refreshControl={
                        <RefreshControl
                            colors={[DesignRule.mainColor]}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refresh}
                        />
                    }/>
                <CommShareModal ref={(ref) => this.shareModal = ref}

                                webJson={{
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/discover/aTag/list?tagId=${this.params.tagId}`,//(图文分享下的链接)
                                    title: this.params.name || '秀一秀 赚到够',//分享标题(当为图文分享时候使用)
                                    dec: '好物不独享，内有惊喜福利~'
                                }}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({});
