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

const { px2dp } = ScreenUtils;
import ImageLoad from '@mr/image-placeholder';

export const kHomeClassifyHeight = px2dp(83) * 2;

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
                    <ImageLoad style={styles.icon} source={source} onError={() => {
                        console.log('loadingError');
                        this.setState({ loadingError: true });
                    }} isAvatar={true}/>
            }
            <View style={styles.space}/>
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
        return (<View
                style={styles.container}>
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
        paddingLeft: px2dp(2),
        paddingRight: px2dp(2),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: ScreenUtils.width
    },
    item: {
        width: px2dp(48),
        height: px2dp(68),
        marginLeft: px2dp(10),
        marginRight: px2dp(10),
        marginTop: px2dp(7.5),
        marginBottom: px2dp(7.5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: px2dp(48),
        height: px2dp(48)
    },
    space: {
        height: px2dp(6)
    },
    name: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(10)
    }
});


