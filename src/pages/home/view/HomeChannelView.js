/**
 * 首页头部分类view
 */

import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { channelModules } from '../model/HomeChannelModel';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText as Text } from '../../../components/ui/index';
import { homeModule } from '../model/Modules';
import RouterMap, { routeNavigate, routePush } from '../../../navigation/RouterMap';
import user from '../../../model/user';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { homePoint } from '../HomeTypes';


const { px2dp, width } = ScreenUtils;

class Item extends Component {

    constructor(props) {
        super(props);
        this.itemSpace = (width - px2dp(16) * 2 - px2dp(56) * 5) / 8;
    }

    render() {
        const { onPress, data, index } = this.props;
        const { image, title } = this.props.data;
        let source = { uri: image };
        return <TouchableOpacity style={[styles.item, {
            marginLeft: index % 5 === 0 ? 0 : this.itemSpace,
            marginRight: index % 5 === 4 ? 0 : this.itemSpace,
            marginTop: index > 4 ? px2dp(-6) : 0
        }]} onPress={() => onPress(data)}>
            <Image style={styles.icon} showPlaceholder={false} source={source}/>
            <Text style={styles.name} allowFontScaling={false} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>;
    }
}

/**
 * @author chenyangjun
 * @date on 2018/9/7
 * @describe 首页头部分类view
 * @org www.sharegoodsmall.com
 * @email chenyangjun@meeruu.com
 */

@observer
export default class HomeChannelView extends Component {

    _filterNav = (router, params) => {
        if (router === RouterMap.SignInPage && !user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
        } else {
            routePush(router, { ...params });
        }
    };

    _onItemPress = (data, index) => {
        // const { navigate } = this.props;
        let router = homeModule.homeNavigate(data.linkType, data.linkTypeCode) || '';
        let params = homeModule.paramsNavigate(data);
        params.fromHome = true;
        this._filterNav(router, { ...params });
        track(trackEvent.bannerClick, homeModule.bannerPoint(data, homePoint.homeIcon, index));
    };

    renderItems = (channelList) => {
        let itemViews = [];
        // 最多两排
        channelList.map((value, index) => {
            itemViews.push(<Item key={index} index={index} data={value} onPress={(data) => {
                this._onItemPress(data, index);
            }}/>);
        });
        return itemViews;
    };

    render() {
        const { channelList } = channelModules;
        if (channelList.length === 0) {
            return null;
        }
        return (<View style={[styles.container, { height: channelModules.channelHeight }]}>
                {this.renderItems(channelList)}
            </View>
        );
    }
}

HomeChannelView.propTypes = {
    navigation: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16),
        paddingTop: px2dp(8),
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: ScreenUtils.width
    },
    item: {
        width: px2dp(56),
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: px2dp(56),
        height: px2dp(56)
    },
    name: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(11),
        marginBottom: px2dp(10)
    }
});


