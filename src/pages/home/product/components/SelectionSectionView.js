import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

/**
 * section规格 view
 */

export default class RecentSearchView extends Component {
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
            tagList.push(
                <View key={index}>
                    <TouchableOpacity style={styles.btn}
                                      onPress={() => this.props.clickItemAction(this.props.listData[index])}>
                        <Text style={styles.btnText}>{this.props.listData[index]}</Text>
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
                    <Text style={styles.headerText}>热门搜索</Text>
                </View>
                <View style={styles.containerView}>
                    {this.rendTag()}
                </View>
                <View style={{ height: 1, marginTop: 15, marginLeft: 16, backgroundColor: '#eeeeee' }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 18,
        marginHorizontal: 16,
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 13,
        color: '#666666'
    },
    image: {
        width: 15,
        height: 15
    },

    containerView: {
        marginTop: 6,
        flexDirection: 'row',   // 水平排布
        flexWrap: 'wrap',
        alignItems: 'center',
        marginHorizontal: 16
    },
    btn: {
        justifyContent: 'center',
        marginTop: 10,
        marginRight: 10,
        height: 30,
        borderRadius: 3,
        backgroundColor: '#EEEEEE'
    },
    btnText: {
        paddingHorizontal: 12,
        color: '#222222',
        fontSize: 13
    }
});
