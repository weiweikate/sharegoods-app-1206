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
        HomeAPI.getHomeData({ type: this.props.type }).then((data) => {
            this.setState({
                    bannerList: data.data || []
                }
            );
        });
    }

    render() {
        const { bannerList } = this.state;
        if (!bannerList || bannerList.length === 0) {
            return null;
        }
        return (
            <View style={{ marginBottom: 20 }}>
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
                            <AutoHeightImage source={{ uri: image }} ImgWidth={ScreenUtils.width}/>
                        </NoMoreClick>;
                    })
                }
            </View>
        );
    }
}
