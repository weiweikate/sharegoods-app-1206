import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import {
    MRText as Text
} from '../../../../components/ui';

export default class RecommendSegmentView extends Component {

    static propTypes = {
        segmentPressAtIndex: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 1
        };
    }

    _onPress = (index) => {
        if (index === this.state.selectIndex) {
            return;
        }
        this.setState({
                selectIndex: index
            }, () => {
                this.props.segmentPressAtIndex(index);
            }
        );
    };

    _renderItem = (title, index, style1) => {
        return <TouchableWithoutFeedback onPress={() => {
            this._onPress(index);
        }}>
            <View style={[styles.itemContainer, style1]}>
                <Text
                    style={[styles.title, { color: this.state.selectIndex === index ? DesignRule.bgColor_btn : '#999999' }]}>{title}</Text>
                {index === this.state.selectIndex && < View style={styles.itemLine}/>}
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        return (<View style={styles.container}>
            {this._renderItem('附近店铺', 1, { marginLeft: 15 })}
            {this._renderItem('新开店铺', 2, { marginLeft: 20 })}
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',backgroundColor:DesignRule.bgColor
    },
    itemContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLine: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: DesignRule.bgColor_btn,
        height: 2,
        width: 20,
        alignSelf: 'center'
    },
    title: {
        fontSize: 13
    }
});

