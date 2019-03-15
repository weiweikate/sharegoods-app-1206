/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { bannerModule } from './HomeBannerModel';

export const bannerHeight = px2dp(120);

import MRBannerViewComponent from '../../components/ui/bannerView/MRBannerViewComponent';

import { track, trackEvent } from '../../utils/SensorsTrack';


@observer
export default class HomeBannerView extends Component {

    _onPressRowWithItem(item) {
        const { bannerCount, bannerList } = bannerModule;
        let data = null;
        for (let i = 0; i < bannerCount; i++) {
            if (bannerList[i].imgUrl === item) {
                data = bannerList[i];
                break;
            }
        }
        console.log('_onPressRowWithItem', data)
        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            const { navigate } = this.props;

            track(trackEvent.bannerClick, this._bannerPoint(data));
            navigate(router, { ...params, preseat: 'home_banner' });
        }
    }

    //banner埋点
    _bannerPoint(data) {
        return {
            bannerName: data.linkTypeCode,
            bannerId: data.id,
            url: data.imgUr,
            bannerRank: data.rank,
            bannerType: data.linkType,
            bannerContent: data.remark
        }
    }

    _onPressRow = (index) => {
        const { bannerList } = bannerModule;
        let data = bannerList[index];
        
        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            const { navigate } = this.props;

            track(trackEvent.bannerClick, this._bannerPoint(data));
            navigate(router, { ...params, preseat: 'home_banner' });
        }
    };

    _onDidScrollToIndex(index) {
        const { bannerList } = bannerModule;
        let data = bannerList[index];
        track(trackEvent.bannerSwiper, this._bannerPoint(data));
    }

    render() {
        const { bannerList } = bannerModule;

        // 此处需返回null，否则指示器有问题
        if (bannerList.length === 0) {
            return null;
        }

        let items = [];
        bannerList.map(value => {
            items.push(value.imgUrl);
        });
        return <View style={styles.banner}>
            <MRBannerViewComponent itemRadius={px2dp(5)} imgUrlArray={items}
                                   bannerHeight={bannerHeight}
                                   modeStyle={1} autoInterval={5}
                                   pageFocused={this.props.pageFocused}
                                   onDidScrollToIndex={(i)=> {this._onDidScrollToIndex(i)}}
                                   onDidSelectItemAtIndex={(i) => {
                                       this._onPressRow(i);
                                   }}/>
        </View>;
    }

}

const styles = StyleSheet.create({
    banner: {
        paddingHorizontal: px2dp(15),
        height: bannerHeight,
        width: ScreenUtils.width,
        borderRadius: (5),
        backgroundColor: 'white'
    }
});
