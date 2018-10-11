import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default class TopicDetailSegmentView extends Component {

    static propTypes = {
        segmentViewOnPressAtIndex: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }

    _onPress = (index) => {
        if (index === this.state.selectedIndex) {
            return;
        }
        this.setState({
            selectedIndex: index
        }, () => {
            this.props.segmentViewOnPressAtIndex(index);
        });
    };

    _renderItem = (title, index) => {
        return <TouchableWithoutFeedback onPress={() => {
            this._onPress(index);
        }}>
            <View style={styles.btnContainer}>
                <Text
                    style={[styles.title, { color: this.state.selectedIndex === index ? '#e60012' : '#999999' }]}>{title}</Text>
                {this.state.selectedIndex === index ? <View style={{
                    width: 45,
                    height: 3,
                    bottom: 0,
                    position: 'absolute',
                    backgroundColor: '#D51243'
                }}/> : null}
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        return (
            <View style={{ height: 50.5 }}>
                <View style={[styles.container]}>
                    {this._renderItem('详情', 0)}
                    <View style={{ height: 25, alignSelf: 'center', width: 1, backgroundColor: '#EEEEEE' }}/>
                    {this._renderItem('参数', 1)}
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        marginBottom: 1.5,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        flex: 1
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

