import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import StringUtils from '../../../utils/StringUtils';
import { homeNewUserModel } from '../model/HomeNewUserModel';
import { homeModule } from '../model/Modules';
import bridge from '../../../utils/bridge';

const { width } = ScreenUtils;

@observer
export default class HomeNewUserAreaView extends Component {

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

    render() {
        const { newUserData } = homeNewUserModel;
        if (newUserData && StringUtils.isEmpty(newUserData.image)) {
            return null;
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._adAction(newUserData);
            }}>
                <ImageLoad
                    style={{ width, height: homeNewUserModel.imgHeight }}
                    source={{ uri: newUserData.image }}
                    showPlaceholder={false}/>
            </TouchableWithoutFeedback>
        );
    }
}
