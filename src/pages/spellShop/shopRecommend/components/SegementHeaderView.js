import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class SegmentView extends Component {

    static propTypes = {
        onPressAtIndex: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0
        };
    }

    _onPress = (index) => {
        if (index === this.state.selectIndex) {
            return;
        }
        this.setState({
                selectIndex: index
            }, () => {
                this.props.onPressAtIndex(index);
            }
        );
    };

    _renderItem = (title, index) => {
        return <TouchableWithoutFeedback onPress={() => {
            this._onPress(index);
        }}>
            <View style={styles.itemContainer}>
                <Text style={[styles.title, { color: this.state.selectIndex === index ? '#D51243' : '#666666' }]}
                >{title}</Text>
                {index === this.state.selectIndex && < View style={styles.itemLine}/>}
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        return (<View style={styles.container}>
            {this._renderItem('新开店铺', 0)}
            {this._renderItem('热门店铺', 1)}
            {this._renderItem('所有店铺', 2)}
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContainer: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLine: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#D51243',
        height: 3,
        width: 50,
        alignSelf: 'center'
    },
    title: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#999999'
    }
});

