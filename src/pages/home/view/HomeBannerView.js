/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import { homeModule } from '../model/Modules';
import { bannerModule } from '../model/HomeBannerModel';
import MRBannerViewComponent from '../../../components/ui/bannerView/MRBannerViewComponent';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import DesignRule from '../../../constants/DesignRule';
import { homePoint } from '../HomeTypes';

const { px2dp, width } = ScreenUtils;

export const bannerHeight = px2dp(120);

@observer
export default class HomeBannerView extends Component {

    _onPressRow = (index) => {
        const { bannerList } = bannerModule;
        let data = bannerList[index];

        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            const { navigate } = this.props;

            track(trackEvent.bannerClick, homeModule.bannerPoint(data, homePoint.homeBanner, index));
            navigate(router, { ...params });
        }
    };

    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }
        const isFocused = homeModule.isFocused;
        let items = [];
        let data = bannerList[0] || {};
        if (data.itemData) {
            data.itemData.map(item => {
                items.push(item.image);
            });
        }
        let len = items.length;
        return <View style={styles.banner}>
            {len === 0 ?
                <View style={styles.defaultImg}/> :
                <View style={{ height: bannerHeight }}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            height: px2dp(90),
                            width,
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}/>
                    <MRBannerViewComponent
                        itemRadius={px2dp(5)}
                        imgUrlArray={items}
                        bannerHeight={bannerHeight}
                        modeStyle={1}
                        autoLoop={isFocused ? true : false}
                        pageFocused={isFocused}
                        onDidSelectItemAtIndex={(i) => {
                            this._onPressRow(i);
                        }}/>
                </View>

            }
        </View>;
    }

}

const styles = StyleSheet.create({
    banner: {
        height: bannerHeight,
        width: ScreenUtils.width
    },
    defaultImg: {
        flex: 1,
        borderRadius: px2dp(5),
        backgroundColor: DesignRule.lineColor_inColorBg
    }
});
