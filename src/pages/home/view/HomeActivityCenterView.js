import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';
import { homeModule } from '../model/Modules';
import StringUtils from '../../../utils/StringUtils';

const { width } = ScreenUtils;

@observer
export default class HomeActivityCenterView extends Component {

    // _adAction(value) {
    //     if (!value) {
    //         bridge.$toast('获取数据失败！');
    //         return;
    //     }
    //     const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
    //     const { navigate } = this.props;
    //     const params = homeModule.paramsNavigate(value);
    //     navigate(router, { ...params, ...getSGspm_home(HomeSource.expandBnner, index) });
    // }

    render() {
        if (StringUtils.isEmpty(homeModule.centerImg)) {
            return null;
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
            }}>
                <ImageLoad
                    style={{ width, height: homeModule.centerImgHeight }}
                    source={{ uri: homeModule.centerImg }}
                    showPlaceholder={false}/>
            </TouchableWithoutFeedback>
        );
    }
}
