import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import StringUtils from '../../../utils/StringUtils';
import { homeNewUserModel } from '../model/HomeNewUserModel';
import { homeModule } from '../model/Modules';
import bridge from '../../../utils/bridge';
import { homePoint } from '../HomeTypes';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { getSGspm_home, HomeSource } from '../../../utils/OrderTrackUtil';

const { width } = ScreenUtils;

@observer
export default class HomeNewUserAreaView extends Component {

    _adAction(value) {
        if (!value) {
            bridge.$toast('获取数据失败！');
            return;
        }
        track(trackEvent.bannerClick, homeModule.bannerPoint(value, homePoint.newNser, 0));
        const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
        const { navigate } = this.props;
        const params = homeModule.paramsNavigate(value);
        navigate(router, { ...params, ...getSGspm_home(HomeSource.newNser) });
    }

    render() {
        const { newUserData } = homeNewUserModel;
        if (newUserData && StringUtils.isEmpty(newUserData.image)) {
            return null;
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    this._adAction(newUserData);
                }}
                activeOpacity={1}>
                <ImageLoad
                    style={{ width, height: homeNewUserModel.imgHeight }}
                    source={{ uri: newUserData.image }}
                    showPlaceholder={false}/>
            </TouchableOpacity>
        );
    }
}
