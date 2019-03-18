import React, { Component } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './Modules';
import { adModules } from './HomeAdModel';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import { track, trackEvent } from '../../utils/SensorsTrack';

const { px2dp } = ScreenUtils;

const defaultBannerHeight = px2dp(10);
const adWidth = (ScreenUtils.width - px2dp(35)) / 2 - 0.5;
const adHeight = adWidth * (160 / 340);

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
        track(trackEvent.recommanderBannerClick, homeModule.bannerPoint(value));
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
        let items = [];
        ad.map((value, index) => {
            items.push(<TouchableWithoutFeedback key={index} onPress={() => this._adAction(value)}>
                <View
                    style={[styles.ad, { marginTop: adModules.banner.length === 0 ? px2dp(5) : 0 }, this.adRadius[index]]}>
                    <ImageLoad source={{ uri: value.imgUrl }}
                               style={[styles.ad,
                                   { marginTop: adModules.banner.length === 0 ? 0 : ((index !== 0 && index !== 1) ? px2dp(5) : 0) }]}/>
                </View>
            </TouchableWithoutFeedback>);
        });
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
        width: ScreenUtils.width,
        paddingTop: px2dp(10)
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
        height: adHeight
    }
});
