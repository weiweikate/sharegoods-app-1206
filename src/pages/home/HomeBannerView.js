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
import DesignRule from '../../constants/DesignRule';
import { homePoint } from './HomeTypes';


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
        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            const { navigate } = this.props;

            track(trackEvent.bannerClick, homeModule.bannerPoint(data, homePoint.homeBanner));
            navigate(router, { ...params });
        }
    }

    _onPressRow = (index) => {
        const { bannerList } = bannerModule;
        let data = bannerList[index];

        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            const { navigate } = this.props;

            track(trackEvent.bannerClick, homeModule.bannerPoint(data, homePoint.homeBanner));
            navigate(router, { ...params });
        }
    };

    _onDidScrollToIndex(index) {
        const { bannerList } = bannerModule;
        let data = bannerList[index];
        track(trackEvent.bannerShow, homeModule.bannerPoint(data, homePoint.homeBanner));
    }

    render() {
        const { bannerList } = bannerModule;
        const isFocused = homeModule.isFocused;
        let items = [];
        bannerList.map(value => {
            items.push(value.imgUrl);
        });
        let len = items.length;
        return <View style={styles.banner}>
            {len === 0 ?
                <View style={styles.defaultImg}/> :
                <MRBannerViewComponent
                    itemRadius={px2dp(5)}
                    imgUrlArray={items}
                    bannerHeight={bannerHeight}
                    modeStyle={1}
                    autoLoop={isFocused ? true : false}
                    pageFocused={isFocused}
                    onDidScrollToIndex={(i) => {
                        this._onDidScrollToIndex(i);
                    }}
                    onDidSelectItemAtIndex={(i) => {
                        this._onPressRow(i);
                    }}/>
            }
        </View>;
    }

}

const styles = StyleSheet.create({
    banner: {
        paddingHorizontal: px2dp(15),
        height: bannerHeight,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    },
    defaultImg: {
        flex: 1,
        borderRadius: px2dp(5),
        backgroundColor: DesignRule.lineColor_inColorBg
    }
});
