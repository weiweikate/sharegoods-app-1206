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
import apiEnvironment from '../../api/ApiEnvironment';
import TagDetailItemView from './components/TagDetailItemView';
import CommShowShareModal from '../../comm/components/CommShowShareModal';
import EmptyUtils from '../../utils/EmptyUtils';

const { iconShowShare, dynamicEmpty } = res;
const { px2dp } = ScreenUtils;

export default class TagDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLoadingMore: false
        };
        this.size = 10;
        this.isLoadEnd = false;
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
        this.cursor = '';
        ShowApi.getDynamicWithTag({size: this.size, tagId: this.params.tagId }).then((data) => {
            this.data = [];
            let realData = data.data.data || [];
            realData.map((item) => {
                this.data.push(item);
            });

            this.cursor = this.getLastCursor(realData);
            if(EmptyUtils.isEmptyArr(realData) || realData.length < this.size){
                this.isLoadEnd = true;
            }

            this.setState({ isRefreshing: false });
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.setState({ isRefreshing: false });
        });
    };


    getLastCursor = (data)=>{
        if(EmptyUtils.isEmptyArr(data)){
            return null;
        }
        let item = data[data.length-1];
        return item.cursor || '';
    }

    loadMore = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore || this.isLoadEnd) {
            return;
        }
        this.setState({ isLoadingMore: true });
        ShowApi.getDynamicWithTag({ cursor: this.cursor, size: this.size, tagId: this.params.tagId }).then((data) => {

            let realData = data.data.data || [];
            realData.map((item) => {
                this.data.push(item);
            });
            if(EmptyUtils.isEmptyArr(realData) || realData.length < this.size){
                this.isLoadEnd = true;
            }
            this.cursor = this.getLastCursor(realData);
            this.setState({ isLoadingMore: false });
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.setState({ isLoadingMore: false });
        });
    };

    renderItem = (itemData, itemIdx, itemContainer) => {
        return (<TagDetailItemView itemData={itemData} itemContainer={itemContainer}/>);
    };


    renderHeader = () => {
        return (<TagDescriptionView tagId={this.params.tagId} callback={this.headerRequestFinish}/>);
    };

    renderEmpty = () => {
        return (
            <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                <Image source={dynamicEmpty} style={{ width: px2dp(267), height: px2dp(192), marginTop: px2dp(50) }}/>
                <MRText style={styles.emptyTip}>
                    暂无内容
                </MRText>
            </View>
        );
    };

    _render() {
        return (
            <View style={{ flex: 1, paddingHorizontal: px2dp(5) }}>
                <Waterfall
                    showsVerticalScrollIndicator={false}
                    style={styles.waterfall}
                    data={this.data}
                    renderHeader={this.renderHeader}
                    gap={px2dp(10)}
                    numberOfColumns={2}
                    expansionOfScope={100}
                    onEndReachedThreshold={1000}
                    onEndReached={this.loadMore}
                    renderItem={this.renderItem}
                    renderEmpty={this.renderEmpty}
                    refreshControl={
                        <RefreshControl
                            colors={[DesignRule.mainColor]}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refresh}
                        />
                    }/>
                <CommShowShareModal ref={(ref) => this.shareModal = ref}
                                    type={'show'}
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

var styles = StyleSheet.create({
    emptyTip: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_threeTitle
    }

});
