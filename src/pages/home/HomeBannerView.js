/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { bannerModule, homeModule } from './Modules';
import MRBannerViewMode from '../../components/ui/bannerView/MRBannerViewMode';

const bannerHeight = px2dp(230);

@observer
export default class HomeBannerView extends Component {
    state = {
        index: 0
    };

    _onDidSelectItemAtIndex = (index) => {
        const { bannerList } = bannerModule;
        let data = bannerList[index];
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        const { navigation } = this.props;
        navigation.navigate(router, params);
    };

    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }

        let items = [];
        bannerList.map(value => {
            items.push(value.imgUrl);
        });

        return <View>
            <MRBannerViewMode imgUrlArray={items}
                              onDidSelectItemAtIndex={(index) => this._onDidSelectItemAtIndex(index)}
                              bannerHeight={bannerHeight} modeStyle={1}/>
        </View>;
    }
}
