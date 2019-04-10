import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from '../model/Modules';
import { homePoint } from '../HomeTypes';
import { homeFocusAdModel } from '../model/HomeFocusAdModel';
import { homeExpandBnnerModel } from '../model/HomeExpandBnnerModel';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;

const adWidth = (ScreenUtils.width - px2dp(35)) / 2 - 0.5;
const adHeight = adWidth * (80 / 170);

const radius = (5);

@observer
export default class HomeFocusAdView extends Component {

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


    _renderAd() {
        const { ad } = homeFocusAdModel;
        let len = ad.length > 4 ? 4 : ad.length;
        let items = [];
        for (let i = 0; i < len; i++) {
            items.push(<TouchableWithoutFeedback key={i} onPress={() => this._adAction(ad[i])}>
                <View
                    style={[styles.ad, { marginTop: homeExpandBnnerModel.banner.length === 0 ? px2dp(5) : ((i === 0 || i === 1) ? px2dp(15) : px2dp(5)) }, this.adRadius[i]]}>
                    <ImageLoad source={{ uri: ad[i] ? ad[i].image : '' }}
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
            {this._renderAd()}
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width
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
