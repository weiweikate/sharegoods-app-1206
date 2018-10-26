/**
 * 首页头部分类view
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ClassifyModules } from './Modules';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;

const Item = ({ data, onPress }) => {
    const {icon, img} = data
    let source = icon ? icon : {uri: img}
    return <TouchableOpacity style={styles.item} onPress={() => onPress(data)}>
        <Image style={styles.icon} source={source}/>
        <View style={styles.space}/>
        <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
    </TouchableOpacity>
}

@observer
export default class HomeClassifyView extends Component {

    constructor(props) {
        super(props);
        this.classifyModule = new ClassifyModules();
        this.classifyModule.loadClassifyList();
    }

    _onItemPress = (data) => {
        console.log('_onItemPress', data);
        const { navigation } = this.props;

        if (data.img && data.name !== '全部分类') {
            navigation.navigate('home/search/SearchResultPage', { categoryId: data.id, name: data.name })
        } else {
            navigation.navigate(data.route)
        }
    }

    renderItems = () => {
        const { classifyList } = this.classifyModule;
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
        height: px2dp(174),
        paddingLeft: px2dp(2),
        paddingRight: px2dp(2),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    item: {
        width: px2dp(48),
        height: px2dp(80),
        marginLeft: px2dp(10),
        marginRight: px2dp(10),
        marginTop: px2dp(5),
        marginBottom: px2dp(5),
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
        color: '#666',
        fontSize: px2dp(10)
    }
});


