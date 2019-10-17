import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import HomeTitleView from './HomeTitleView';
import { limitGoModule } from '../model/HomeLimitGoModel';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import { MRText } from '../../../components/ui';
import { routePush } from '../../../navigation/RouterMap';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import XiuDouResultModal from './XiuDouResultModal';
import { observer } from 'mobx-react';
import { getSGspm_home, HomeSource } from '../../../utils/OrderTrackUtil';

const { px2dp } = ScreenUtils;

@observer
export default class HomeLimitGoTopView extends Component {

    openModal() {
        this.modal && this.modal.open();
        track(trackEvent.HomePagePopShow, { homePagePopType: 1 });
    }

    seeMore() {
        routePush('HtmlPage', {
            uri: '/spike',
            ...getSGspm_home(HomeSource.limitGo, -1)
        });
    }

    render() {
        return (
            <View>
                <View style={{ paddingHorizontal: px2dp(15), flexDirection: 'row', alignItems: 'center' }}>
                    <HomeTitleView title={'限时购'}/>
                    <View style={{ flex: 1 }}/>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        this.seeMore();
                    }}>
                        <MRText style={{ color: DesignRule.textColor_placeholder, fontSize: px2dp(12) }}>更多></MRText>
                    </TouchableOpacity>
                </View>
                {
                    limitGoModule.isShowFreeOrder ?
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            this.openModal();
                        }}>
                            <Image source={res.limitGoHeader}
                                   resizeMode={'contain'}
                                   style={{ height: px2dp(50), width: ScreenUtils.width }}/>
                        </TouchableOpacity> : null
                }
                <XiuDouResultModal ref={(ref) => {
                    this.modal = ref;
                }}/>
            </View>);
    }
}
