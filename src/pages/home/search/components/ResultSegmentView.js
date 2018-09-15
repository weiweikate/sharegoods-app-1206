import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default class SearchSegmentView extends Component {

    static propTypes = {
        segmentOnPressAtIndex: PropTypes.func //点击搜索的回调函数
    };

    constructor(props) {
        super(props);
        this.state = {
            selIndex: 0
        };
    }

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
            <View style={styles.btnContainer}>
                <Text
                    style={[styles.title, { color: this.state.selIndex === index ? '#e60012' : '#999999' }]}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        return (<View style={[styles.container, this.props.style]}>
            {this._renderItem('综合', 0)}
            {this._renderItem('销量', 1)}
            {this._renderItem('价格', 2)}
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 49,
        backgroundColor: '#ffffff',
        flexDirection: 'row'
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#999999'
    }
});

