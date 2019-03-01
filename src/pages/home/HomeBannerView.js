/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import ViewPager from '../../components/ui/ViewPager';

const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { bannerModule } from './HomeBannerModel';

export const bannerHeight = px2dp(125);
const cellHeight = px2dp(120)

import MRBannerViewMode from '../../components/ui/bannerView/MRBannerViewMode';
import ImageLoad from '@mr/image-placeholder';

import { track, trackEvent } from '../../utils/SensorsTrack'
@observer
export default class HomeBannerView extends Component {
    state = {
        index: 0
    };

    _renderViewPageItem(item) {
        return (
            <TouchableOpacity onPress={() => this._onPressRowWithItem(item)} activeOpacity={1}>
                <ImageLoad style={styles.img} source={{ uri: item }}/>
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
            track(trackEvent.bannerClick, {pageType: '主页banner', bannerLocation: '主页', bannerID: data.id, bannerRank: data.rank, url: data.imgUrl, bannerName: data.linkTypeCode})
            navigate(router, {...params, preseat:'home_banner'})
        }
    }

    _onPressRow = (index) => {
        const { bannerList } = bannerModule;
        let data = bannerList[index];
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        const { navigate } = this.props;
        console.log('_onPressRow', data, params, router)
        track(trackEvent.bannerClick, {pageType: 'home', bannerLocation: 'home', bannerID: data.id, bannerRank: data.rank, url: data.imgUrl, bannerName: data.linkTypeCode})
        navigate(router, {...params, preseat:'home_banner'})
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

        return <View style={styles.container}>
            <View style={styles.banner}>
            {
                Platform.OS === 'ios'
                    ?
                    <MRBannerViewMode itemRadius={px2dp(5)} imgUrlArray={items} bannerHeight={cellHeight} modeStyle={1} autoInterval={5}
                                      onDidSelectItemAtIndex={(index) => {
                                          this._onPressRow(index);
                                      }}/>
                    :
                    <ViewPager
                        swiperShow={true}
                        arrayData={items}
                        renderItem={this._renderViewPageItem.bind(this)}
                        autoplay={true}
                        loop={true}
                        height={cellHeight}
                        renderPagination={this._renderPagination.bind(this)}
                        index={0}
                        scrollsToTop={true}
                    />
            }
            </View>
        </View>;
    }

    _renderPage = (item, num) => {
        return <Image
            source={{ uri: item }}
            style={styles.page}/>;
    };
}

const styles = StyleSheet.create({
    container: {
        height: bannerHeight,
        width: ScreenUtils.width,
        backgroundColor: '#fff'
    },
    img: {
        height: bannerHeight,
        width: ScreenUtils.width
    },
    banner: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: cellHeight,
        borderRadius: px2dp(5),
        shadowOffset: {width: 0, height: px2dp(2)},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowColor: '#000',
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
        width: px2dp(24),
        height: px2dp(6),
        borderRadius: px2dp(3),
        backgroundColor: '#fff',
        marginLeft: px2dp(2.5),
        marginRight: px2dp(2.5)
    },
    index: {
        width: px2dp(6),
        height: px2dp(6),
        borderRadius: px2dp(3),
        backgroundColor: '#f4f4f4',
        marginLeft: px2dp(2.5),
        marginRight: px2dp(2.5)
    },
    page: {
        width: ScreenUtils.width,
        height: bannerHeight
    }
});
