import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import DesignRule from 'DesignRule';
import res from '../../res';
import {MRText as Text} from '../../../../components/ui';

const upDown = res.search.updown;

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
        if (this.state.selIndex === index && index !== 2) {
            return;
        }
        this.setState({
            selIndex: index
        }, () => {
            this.props.segmentOnPressAtIndex(index);
        });
    };

    _renderItem = (title, index) => {
        return <TouchableWithoutFeedback onPress={() => {
            this._onPress(index);
        }}>
            <View style={styles.btnContainer}>
                <Text
                    style={[styles.title, { color: this.state.selIndex === index ? DesignRule.mainColor : DesignRule.textColor_instruction }]} allowFontScaling={false}>{title}</Text>
                {index === 2 && <Image source={upDown}/>}
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
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 15,
        color: DesignRule.textColor_instruction
    }
});

