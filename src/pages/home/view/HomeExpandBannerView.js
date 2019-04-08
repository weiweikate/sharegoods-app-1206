import React, { Component } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from '../model/Modules';
import { homePoint } from '../HomeTypes';
import { homeExpandBnnerModel } from '../model/HomeExpandBnnerModel';
import { observer } from 'mobx-react';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;

const defaultBannerHeight = px2dp(10);

const radius = (5);

@observer
export default class HomeExpandBannerView extends Component {

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
        const { banner, adHeights } = homeExpandBnnerModel;
        if (banner.length === 0) {
            return null;
        }
        let items = [];
        banner.map((val, index) => {
            let url = val.image;
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

    render() {
        return <View style={styles.container}>
            {this._renderBanner()}
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
    }
});
