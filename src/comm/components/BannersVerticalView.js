/**
 * @author 陈阳君
 * @date on 2019/09/19
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import HomeAPI from '../../pages/home/api/HomeAPI';
import { homeModule } from '../../pages/home/model/Modules';
import NoMoreClick from '../../components/ui/NoMoreClick';
import { AutoHeightImage } from '../../components/ui/AutoHeightImage';
import ScreenUtils from '../../utils/ScreenUtils';
import { routePush } from '../../navigation/RouterMap';

export class BannersVerticalView extends Component {

    state = {
        bannerList: []
    };

    componentDidMount() {
        const { type, bannerList } = this.props;
        !bannerList && HomeAPI.getHomeData({ type: type }).then((data) => {
            this.setState({
                    bannerList: data.data || []
                }
            );
        });
    }

    render() {
        let bannerList = this.props.bannerList || this.state.bannerList;
        if (!bannerList || bannerList.length === 0) {
            return null;
        }
        return (
            <View style={{ marginBottom: 20, ...this.props.style }}>
                {
                    bannerList.map((item) => {
                        const { image, linkType, linkTypeCode } = item;
                        return <NoMoreClick onPress={() => {
                            const router = homeModule.homeNavigate(linkType, linkTypeCode);
                            let params = homeModule.paramsNavigate(item);
                            if (router) {
                                routePush(router, params);
                            }
                        }}>
                            <AutoHeightImage source={{ uri: image }}
                                             ImgWidth={this.props.ImgWidth || ScreenUtils.width}/>
                        </NoMoreClick>;
                    })
                }
            </View>
        );
    }
}
