/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { bannerModule } from './HomeBannerModel';

export const bannerHeight = px2dp(120);

import MRBannerViewComponent from '../../components/ui/bannerView/MRBannerViewComponent';
import ImageLoad from '@mr/image-placeholder';

import { track, trackEvent } from '../../utils/SensorsTrack';
import DesignRule from '../../constants/DesignRule';

@observer
export default class HomeBannerView extends Component {
    state = {
        index: 0
    };

    _renderViewPageItem(item) {
        return (
            <TouchableOpacity onPress={() => this._onPressRowWithItem(item)} activeOpacity={1}>
                <ImageLoad style={styles.img} source={{ uri: item }} borderRadius={px2dp(5)}/>
            </TouchableOpacity>
        );
    }

    _renderPagination = (index, total) => {
        const { bannerCount } = bannerModule;
        let items = [];
        for (let i = 0; i < bannerCount; i++) {
            if (index === i) {
                items.push(<View key={i} style={styles.activityIndex}/>);
            } else {
                items.push(<View key={i} style={styles.index}/>);
            }
        }
        return <View style={styles.indexView}>
            {items}
        </View>;
    };

    _onPressRowWithItem(item) {
        const { bannerCount, bannerList } = bannerModule;
        let data = null;
        for (let i = 0; i < bannerCount; i++) {
            if (bannerList[i].imgUrl === item) {
                data = bannerList[i];
                break;
            }
        }
        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            const { navigate } = this.props;
            track(trackEvent.bannerClick, {
                pageType: '主页banner',
                bannerLocation: '主页',
                bannerID: data.id,
                bannerRank: data.rank,
                url: data.imgUrl,
                bannerName: data.linkTypeCode
            });
            navigate(router, { ...params, preseat: 'home_banner' });
        }
    }

    _onPressRow = (index) => {
        const { bannerList } = bannerModule;
        let data = bannerList[index];
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        const { navigate } = this.props;
        track(trackEvent.bannerClick, {
            pageType: 'home',
            bannerLocation: 'home',
            bannerID: data.id,
            bannerRank: data.rank,
            url: data.imgUrl,
            bannerName: data.linkTypeCode
        });
        navigate(router, { ...params, preseat: 'home_banner' });
    };

    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }

        let items = [];
        bannerList.map(value => {
            items.push(value.imgUrl);
        });

        return <View style={styles.banner}>
            <MRBannerViewComponent itemRadius={px2dp(5)} imgUrlArray={items} bannerHeight={bannerHeight}
                                   modeStyle={1} autoInterval={5}
                                   pageFocused={this.props.pageFocused}
                                   onDidSelectItemAtIndex={(index) => {
                                       this._onPressRow(index);
                                   }}/>
        </View>;
    }

    _renderPage = (item, num) => {
        return <Image
            source={{ uri: item }}
            style={styles.page}/>;
    };
}

const styles = StyleSheet.create({
    img: {
        height: bannerHeight,
        width: ScreenUtils.width - px2dp(30)
    },
    banner: {
        paddingHorizontal: px2dp(15),
        height: bannerHeight,
        width: ScreenUtils.width,
        borderRadius: (5),
        backgroundColor: 'white'
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: ScreenUtils.width,
        height: px2dp(15)
    },
    activityIndex: {
        width: px2dp(10),
        height: px2dp(3),
        borderRadius: px2dp(3),
        backgroundColor: DesignRule.textColor_mainTitle,
        marginLeft: px2dp(2),
        marginRight: px2dp(2)
    },
    index: {
        width: px2dp(5),
        height: px2dp(3),
        borderRadius: px2dp(3),
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        marginLeft: px2dp(2),
        marginRight: px2dp(2)
    },
    page: {
        width: ScreenUtils.width,
        height: bannerHeight
    }
});
