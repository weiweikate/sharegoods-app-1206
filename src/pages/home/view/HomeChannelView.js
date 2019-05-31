/**
 * 首页头部分类view
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { channelModules } from '../model/HomeChannelModel';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText as Text } from '../../../components/ui/index';
import ImageLoad from '@mr/image-placeholder';
import { homeModule } from '../model/Modules';
import RouterMap from '../../../navigation/RouterMap';
import user from '../../../model/user';


const { px2dp } = ScreenUtils;

class Item extends Component {

    render() {
        const { onPress, data } = this.props;
        const { image, title } = this.props.data;
        let source = { uri: image };
        return <TouchableOpacity style={styles.item} onPress={() => onPress(data)}>
            <ImageLoad style={styles.icon} showPlaceholder={false} source={source}/>
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
        const { navigate } = this.props;
        if (router === 'home/signIn/SignInPage' && !user.isLogin) {
            navigate(RouterMap.LoginPage);
        } else {
            navigate(router, { ...params });
        }
    };

    _onItemPress = (data) => {
        // const { navigate } = this.props;
        let router = homeModule.homeNavigate(data.linkType, data.linkTypeCode) || '';
        let params = homeModule.paramsNavigate(data);
        params.fromHome = true;
        this._filterNav(router, { ...params });
    };

    renderItems = () => {
        const { channelList } = channelModules;
        if (channelList.length === 0) {
            return null;
        }
        let itemViews = [];
        // 5个
        channelList.slice(0, 5).map((value, index) => {
            itemViews.push(<Item key={index} data={value} onPress={(data) => {
                this._onItemPress(data);
            }}/>);
        });
        return itemViews;
    };

    render() {
        return (<View style={[styles.container, { height: channelModules.channelHeight }]}>
                {this.renderItems()}
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


