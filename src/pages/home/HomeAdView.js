import React, { Component } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './Modules';
import { homePoint } from './HomeTypes';
import { adModules } from './HomeAdModel';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import { track, trackEvent } from '../../utils/SensorsTrack';
import bridge from '../../utils/bridge';

const { px2dp } = ScreenUtils;

const defaultBannerHeight = px2dp(10);
const adWidth = (ScreenUtils.width - px2dp(35)) / 2 - 0.5;
const adHeight = adWidth * (80 / 170);

const radius = (5);

@observer
export default class HomeAdView extends Component {

    constructor(props) {
        super(props);
        this.adRadius = [
            { borderTopLeftRadius: radius, overflow: 'hidden' },
            { borderTopRightRadius: radius, overflow: 'hidden' },
            { borderBottomLeftRadius: radius, overflow: 'hidden' },
            { borderBottomRightRadius: radius, overflow: 'hidden' }
        ];
    }

    _adAction(value) {
        if (!value) {
            bridge.$toast('获取数据失败！');
            return;
        }
        track(trackEvent.bannerClick, homeModule.bannerPoint(value, homePoint.homeAd));
        const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
        const { navigate } = this.props;
        const params = homeModule.paramsNavigate(value);
        navigate(router, { ...params });
    }

    _renderBanner() {
        const { banner, adHeights } = adModules;
        if (banner.length === 0) {
            return null;
        }
        let items = [];
        banner.map((val, index) => {
            let url = val.imgUrl;
            items.push(
                <TouchableWithoutFeedback onPress={() => this._adAction(val)} key={'banner' + index}>
                    <Image
                        style={[styles.bannerImage, { height: adHeights.get(url) }]}
                        source={{ uri: url }}/>
                </TouchableWithoutFeedback>
            );
        });
        return <View>{items}</View>;
    }


    _renderAd() {
        const { ad } = adModules;
        let len = 4;
        if (ad.length > 0) {
            len = ad.length;
        }
        let items = [];
        for (let i = 0; i < len; i++) {
            items.push(<TouchableWithoutFeedback key={i} onPress={() => this._adAction(ad[i])}>
                <View
                    style={[styles.ad, { marginTop: adModules.banner.length === 0 ? px2dp(5) : ((i === 0 || i === 1) ? 0 : px2dp(5)) }, this.adRadius[i]]}>
                    <ImageLoad source={{ uri: ad[i] ? ad[i].imgUrl : '' }}
                               showPlaceholder={false}
                               type={'mfit'}
                               style={styles.ad}/>
                </View>
            </TouchableWithoutFeedback>);
        }
        return <View style={styles.adrow}>
            {items}
        </View>;
    }

    render() {
        return <View style={styles.container}>
            {this._renderBanner()}
            {this._renderAd()}
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width
    },
    bannerImage: {
        width: ScreenUtils.width,
        height: defaultBannerHeight,
        marginBottom: px2dp(15)
    },
    adrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    ad: {
        width: adWidth,
        height: adHeight,
        backgroundColor: 'white'
    }
});
