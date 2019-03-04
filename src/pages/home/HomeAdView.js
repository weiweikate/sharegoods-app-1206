import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './Modules';
import { adModules } from './HomeAdModel';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import res from './res'

const { px2dp } = ScreenUtils;

const  adViewHeight = px2dp(270);
export {adViewHeight};

const bannerWidth = ScreenUtils.width - px2dp(30)
const defaultBannerHeight = px2dp(80)

const adWidth = (ScreenUtils.width - px2dp(35)) / 2
const adHeight = adWidth * (160 / 340)

const radius = (5)

@observer
export default class HomeAdView extends Component {

    constructor(props) {
        super(props)
        this.adRadius = [
            {borderTopLeftRadius: radius, overflow: 'hidden'},
            {borderTopRightRadius: radius, overflow: 'hidden'},
            {borderBottomLeftRadius: radius, overflow: 'hidden'},
            {borderBottomRightRadius: radius, overflow: 'hidden'},
        ]
    }

    _adAction(value) {
        const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
        const { navigate } = this.props;
        const params = homeModule.paramsNavigate(value);
        navigate(router, { ...params, preseat: 'home_ad' });
    }

    _renderBanner() {
        //TODO: 占位图，等待接口调试
        return <View style={styles.banner}>
            <View style={{borderRadius: (5), overflow: 'hidden'}}>
                <Image style={styles.bannerImage} source={res.place}/>
            </View>
        </View>
    }

    _renderAd() {
        const { ad } = adModules;
        let items = [];
        ad.map((value, index) => {
            items.push(<TouchableWithoutFeedback key={index} onPress={() => this._adAction(value)}>
                <View style={[styles.ad, this.adRadius[index]]}>
                    <ImageLoad source={{ uri: value.imgUrl }} style={styles.ad}/>
                </View>
            </TouchableWithoutFeedback>);
        })
        return <View style={styles.adrow}>
            {items}
        </View>
    }

    render() {
        return <View style={styles.container}>
            <View style={styles.tran}/>
            {this._renderBanner()}
            {this._renderAd()}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width,
        height: adViewHeight,
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    banner: {
        paddingTop: px2dp(10)
    },
    bannerImage: {
        width: bannerWidth,
        height: defaultBannerHeight,
    },
    adrow: {
        marginTop: px2dp(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    ad: {
        width: adWidth,
        height: adHeight,
        marginBottom: px2dp(4)
    },
    tran: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: px2dp(54),
        backgroundColor: '#fff'
    }
});
