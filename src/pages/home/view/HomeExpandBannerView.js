import React, { Component } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from '../model/Modules';
import { homeExpandBnnerModel } from '../model/HomeExpandBnnerModel';
import { observer } from 'mobx-react';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;

const defaultBannerHeight = px2dp(10);

@observer
export default class HomeExpandBannerView extends Component {

    _adAction(value) {
        if (!value) {
            bridge.$toast('获取数据失败！');
            return;
        }
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
        console.log('-----', 'render');
        banner.map((val, index) => {
            let url = val.image;
            let imgHeight = adHeights.get(url);
            console.log('url------' + url + '------' + imgHeight);
            if (imgHeight) {
                items.push(
                    <TouchableWithoutFeedback onPress={() => this._adAction(val)} key={'banner' + index}>
                        <Image
                            style={[styles.bannerImage, { height: imgHeight }]}
                            source={{ uri: url }}/>
                    </TouchableWithoutFeedback>
                );
            }
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
