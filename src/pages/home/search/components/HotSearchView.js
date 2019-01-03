import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import DesignRule from 'DesignRule';
import {MRText as Text} from '../../../../components/ui';

/**
 * 热门搜索view
 */

export default class HotSearchView extends Component {
    static propTypes = {
        listData: PropTypes.array.isRequired,
        clickItemAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    rendTag = () => {
        if (this.props.listData.length === 0) {
            return;
        }
        let tagList = [];
        for (let index = 0; index < this.props.listData.length; index++) {
            let item = this.props.listData[index] || {};
            let textshow = item.wordName || '';
            textshow = textshow.length > 10 ? textshow.substr(0, 10) + '...' : textshow;
            tagList.push(
                <View key={index}>
                    <TouchableOpacity style={styles.btn}
                                      onPress={() => this.props.clickItemAction(item.wordName, index, item.id)}>
                        <Text style={styles.btnText} allowFontScaling={false}>{textshow}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return tagList;
    };

    render() {
        return (
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText} allowFontScaling={false}>热门搜索</Text>
                </View>
                <View style={styles.containerView}>
                    {this.rendTag()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 13
    },
    headerText: {
        fontSize: 13,
        color: DesignRule.textColor_instruction
    },
    image: {
        width: 15,
        height: 15
    },

    containerView: {
        flexDirection: 'row',   // 水平排布
        flexWrap: 'wrap',
        alignItems: 'center',
        marginHorizontal: 13
    },
    btn: {
        justifyContent: 'center',
        marginTop: 10,
        marginRight: 10,
        height: 30,
        borderRadius: 3,
        backgroundColor: DesignRule.lineColor_inColorBg
    },
    btnText: {
        paddingHorizontal: 12,
        fontSize: 13
    }
});
