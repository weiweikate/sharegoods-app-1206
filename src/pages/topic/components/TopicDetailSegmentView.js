import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import DesignRule from 'DesignRule';
import {
    MRText as Text
} from '../../../components/ui';

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
                    style={[styles.title, { color: this.state.selectedIndex === index ? DesignRule.mainColor : DesignRule.textColor_instruction }]} allowFontScaling={false}>{title}</Text>
                {this.state.selectedIndex === index ? <View style={{
                    width: 45,
                    height: 3,
                    bottom: 0,
                    position: 'absolute',
                    backgroundColor: DesignRule.mainColor
                }}/> : null}
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        return (
            <View style={{ height: 50.5 }}>
                <View style={[styles.container]}>
                    {this._renderItem('详情', 0)}
                    <View style={{ height: 25, alignSelf: 'center', width: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    {this._renderItem('参数', 1)}
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        marginBottom: 1.5,
        backgroundColor: 'white',
        flexDirection: 'row',
        flex: 1
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 15,
        color: DesignRule.textColor_instruction
    }
});

