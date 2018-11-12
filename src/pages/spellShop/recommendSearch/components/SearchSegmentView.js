import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';

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
            <View style={styles.itemContainer}>
                <Text
                    style={[styles.title, { color: this.state.selIndex === index ? DesignRule.bgColor_btn : '#999999' }]}>{title}</Text>
                {index === this.state.selIndex && < View style={styles.itemLine}/>}
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
        borderTopColor: DesignRule.lineColor_inColorBg,
        borderBottomColor: DesignRule.lineColor_inColorBg,
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
        fontSize: 13
    },
    itemLine: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: DesignRule.bgColor_btn,
        height: 2,
        width: 50,
        alignSelf: 'center'
    }
});

