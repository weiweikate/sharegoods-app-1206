/**
 * @author xzm
 * @date 2019/10/24
 */

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MRBannerViewComponent from '../../../../components/ui/bannerView/MRBannerViewComponent';
import { homeModule } from '../../model/Modules';
import {TrackApi} from '../../../../utils/SensorsTrack';

const {px2dp} = ScreenUtils;
const size = {
    width: 345,
    height: 110
}
export const bannerHeight = ScreenUtils.getImgHeightWithWidth(size, DesignRule.width - px2dp(30));

export default class SignInBannerView extends PureComponent {
    constructor(props) {
        super(props);
    }

    _onPressRow = (index) => {
        const {bannerList,navigate} = this.props;
        let data = bannerList[index];
        TrackApi.BannerClick({
            bannerType: data.linkType,
            bannerContent: data.linkTypeCode,
            bannerId:data.id,
            bannerRank:data.rank,
            bannerLocation: 42
        });
        if (data) {
            const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
            let params = homeModule.paramsNavigate(data);
            navigate(router, params);
        }
    };

    render() {
        const {bannerList} = this.props;
        if (bannerList.length === 0) {
            return null;
        }
        let items = [];
        bannerList.map(item => {
            items.push(item.image);
        });
        let len = items.length;
        if (len === 0) return null;
        return (
            <View style={styles.banner}>
                <MRBannerViewComponent
                    itemRadius={px2dp(5)}
                    imgUrlArray={items}
                    bannerHeight={bannerHeight}
                    modeStyle={1}
                    autoLoop={true}
                    onDidSelectItemAtIndex={(i) => {
                        this._onPressRow(i);
                    }}/>
            </View>);
    }
}

var styles = StyleSheet.create({
    banner: {
        height: bannerHeight,
        width: ScreenUtils.width - px2dp(30)
    }
});
