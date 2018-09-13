import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class SearchSegmentView extends Component {

    static propTypes = {
        onPressAtIndex: PropTypes.func //点击搜索的回调函数
    };

    static defaultProps = {
        onPressAtIndex: () => {
            console.warn('SegmentView miss onPressAtIndex func');
        }
    };

    state = { selIndex: 0 };

    _onPress = (index) => {
        if (index === this.state.selIndex) {
            return;
        }
        this.setState({
            selIndex: index
        }, () => {
            this.props.onPressAtIndex(index);
        });
    };

    _renderItem = (title, index) => {
        return <TouchableWithoutFeedback onPress={() => {
            this._onPress(index);
        }}>
            <View style={styles.itemContainer}>
                <Text
                    style={[styles.title, { color: this.state.selIndex === index ? '#e60012' : '#999999' }]}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        return (<View style={[styles.container, this.props.style]}>
            {this._renderItem('所有店铺', 0)}
            <View style={styles.line}/>
            {this._renderItem('招募中', 1)}
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width,
        height: 42,
        backgroundColor: '#ffffff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eeeeee',
        borderBottomColor: '#eeeeee',
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        width: StyleSheet.hairlineWidth,
        height: 15,
        backgroundColor: '#ddd'
    },
    itemContainer: {
        width: (ScreenUtils.width - StyleSheet.hairlineWidth) / 2,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#999999'
    }
});

