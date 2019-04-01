/**
 * 首页头部分类view
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { classifyModules } from './Modules';
import ScreenUtils from '../../utils/ScreenUtils';
import user from '../../model/user';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from '../../components/ui';
import ImageLoad from '@mr/image-placeholder';

const { px2dp } = ScreenUtils;

export const kHomeClassifyHeight = px2dp(90);

class Item extends Component {
    state = {
        loadingError: false
    };

    render() {
        const { onPress, data } = this.props;
        const { img, icon } = this.props.data;
        const { loadingError } = this.state;
        let source = { uri: img };
        return <TouchableOpacity style={styles.item} onPress={() => onPress(data)}>
            {
                loadingError
                    ?
                    <Image style={styles.icon} source={icon}/>
                    :
                    <ImageLoad style={styles.icon} showPlaceholder={false} source={source} onError={() => {
                        this.setState({ loadingError: true });
                    }}/>
            }
            <Text style={styles.name} allowFontScaling={false} numberOfLines={1}>{data.name}</Text>
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
export default class HomeClassifyView extends Component {

    _onItemPress = (data) => {
        const { navigate } = this.props;
        if (data.needLogin && !user.isLogin) {
            navigate('login/login/LoginPage');
            return;
        }
        navigate(data.route, {
            fromHome: true,
            id: 1,
            linkTypeCode: data.linkTypeCode,
            code: data.linkTypeCode,
            name: data.name,
            categoryId: data.id,
            activityCode: data.linkTypeCode
        });
    };

    renderItems = () => {
        const { classifyList } = classifyModules;
        let itemViews = [];
        classifyList.map((value, index) => {
            itemViews.push(<Item key={index} data={value} onPress={(data) => {
                this._onItemPress(data);
            }}/>);
        });
        return itemViews;
    };

    render() {
        return (<View style={styles.container}>
                {this.renderItems()}
            </View>
        );
    }
}

HomeClassifyView.propTypes = {
    navigation: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16),
        paddingTop: px2dp(8),
        height: kHomeClassifyHeight,
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
        fontSize: px2dp(11)
    }
});


