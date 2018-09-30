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
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import Modules from './Modules'
const { classifyModule } = Modules
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils

const Item = ({data,  onPress}) => <TouchableOpacity style={styles.item} onPress={()=> onPress(data)}>
    <Image style={styles.icon} source={(data.icon)}/>
    <View style={styles.space}/>
    <Text>{data.name}</Text>
</TouchableOpacity>

class HomeClassifyView extends Component {

    _onItemPress = (data) => {
        console.log('_onItemPress', data)
    }

    renderItems = () => {
        const { classify } = this.props
        const { classifyList } = classify
        console.log('HomeClassifyView', classifyList)
        let itemViews = []
        classifyList.map((value, index)=> {
            itemViews.push( <Item key={index} data={value} onPress={(data)=> {this._onItemPress(data)}}/>)
        })
        return itemViews
    }

    render() {
        
        return (<View style={styles.container}>
            {this.renderItems()}
        </View>
        )
    }
}

@observer
export default class HomeClassify extends Component {
    render () {
        return <HomeClassifyView classify={classifyModule} {...this.props}/>
    }
}

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
    }
});

HomeClassify.propTypes = {
    navigation: PropTypes.object
};