import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import { homeModule } from '../model/Modules';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import { getSGspm_home, HomeSource } from '../../../utils/OrderTrackUtil';
import { homePoint } from '../HomeTypes';
import { track, trackEvent } from '../../../utils/SensorsTrack';

const { width } = ScreenUtils;

@observer
export default class HomeActivityCenterView extends Component {

    _adAction(value) {
        if (!value) {
            bridge.$toast('获取数据失败！');
            return;
        }
        track(trackEvent.bannerClick, homeModule.bannerPoint(value, homePoint.newNser, 0));
        const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
        const { navigate } = this.props;
        const params = homeModule.paramsNavigate(value);
        navigate(router, { ...params,...getSGspm_home(HomeSource.newNser)});
    }

    render() {
        const { centerData } = homeModule;
        if (StringUtils.isEmpty(centerData.icon)) {
            return null;
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    this._adAction(centerData);
                }}
                activeOpacity={1}>
                <ImageLoad
                    style={{ width, height: homeModule.centerImgHeight }}
                    source={{ uri: centerData.icon }}
                    showPlaceholder={false}/>
            </TouchableOpacity>
        );
    }
}
