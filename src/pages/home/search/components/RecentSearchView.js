import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import DesignRule from 'DesignRule';
import res from '../../res';
import {MRText as Text} from '../../../../components/ui';

const deleteImg = res.search.search_delete;

/**
 * 最近搜索view
 */

export default class RecentSearchView extends Component {
    static propTypes = {
        listData: PropTypes.array.isRequired,
        clickItemAction: PropTypes.func.isRequired,
        clearHistory: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    rendTag = () => {

        if (this.props.listData.length === 0) {
            return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 19 }}>
                <Text style={styles.headerText} allowFontScaling={false}>暂无搜索历史</Text>
            </View>;
        } else {
            let tagList = [];
            for (let index = 0; index < this.props.listData.length; index++) {
                let textshow = this.props.listData[index];
                textshow = textshow.length > 10 ? textshow.substr(0, 10) + '...' : textshow;
                tagList.push(
                    <View key={index}>
                        <TouchableOpacity style={styles.btn}
                                          onPress={() => this.props.clickItemAction(this.props.listData[index], index)}>
                            <Text style={styles.btnText} allowFontScaling={false}>{textshow}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
            return tagList;
        }
    };

    render() {
        return (
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText} allowFontScaling={false}>历史搜索</Text>
                    <TouchableOpacity onPress={this.props.clearHistory}>
                        <Image style={styles.image} source={deleteImg}/>
                    </TouchableOpacity>
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
        marginHorizontal: 13,
        justifyContent: 'space-between'
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
