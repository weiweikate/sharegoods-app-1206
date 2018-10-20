/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { bannerModule, homeModule } from './Modules';
import ViewPager from '../../components/ui/ViewPager';

const bannerHeight = px2dp(220);

@observer
export default class HomeBannerView extends Component {
    constructor(props) {
        super(props);
        bannerModule.loadBannerList();
    }

    _bannerAction(item, index) {
        const { bannerList } = bannerModule;
        const banner = bannerList[index];
        const router = homeModule.homeNavigate(banner.linkType, banner.linkTypeCode);
        let params = homeModule.paramsNavigate(banner);
        const { navigation } = this.props;
        navigation.navigate(router, params);
    }

    _renderViewPageItem = (item, index) => {
        return <TouchableOpacity onPress={() => {
            this._bannerAction(item, index);
        }}>
            <Image
                source={{ uri: item }}
                style={styles.img}
                resizeMode="cover"
            />
        </TouchableOpacity>;
    };

    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }
        let items = [];
        bannerList.map((value, index) => {
            items.push(value.imgUrl);
        });
        return <View>
            <ViewPager
                swiperShow={true}
                arrayData={items}
                renderItem={this._renderViewPageItem.bind(this)}
                dotStyle={{
                    height: px2dp(5),
                    width: px2dp(5),
                    borderRadius: px2dp(5),
                    backgroundColor: '#fff',
                    opacity: 0.4
                }}
                activeDotStyle={{
                    height: px2dp(5),
                    width: px2dp(30),
                    borderRadius: px2dp(5),
                    backgroundColor: '#fff'
                }}
                autoplay={true}
                height={bannerHeight}
            />
        </View>;
    }
}

const styles = StyleSheet.create({
    img: {
        height: bannerHeight,
        width: ScreenUtils.width
    }
});
