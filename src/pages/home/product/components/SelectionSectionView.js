import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text} from '../../../../components/ui';
/**
 * section规格 view
 */

export default class SelectionSectionView extends Component {
    static propTypes = {
        listData: PropTypes.array.isRequired,
        clickItemAction: PropTypes.func.isRequired,
        indexOfProp: PropTypes.any.isRequired,
        tittle: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);
    }

    _clickItemAction = (index) => {
        if (!this.props.listData[index].canSelected) {
            return;
        }
        this.props.clickItemAction(this.props.listData[index], this.props.indexOfProp, this.props.tittle);
    };


    rendTag = () => {
        if (this.props.listData.length === 0) {
            return;
        }
        let tagList = [];
        for (let index = 0; index < this.props.listData.length; index++) {
            let canSelected = this.props.listData[index].canSelected;
            let isSelected = this.props.listData[index].isSelected;
            tagList.push(
                <View key={index}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: isSelected ? DesignRule.mainColor : DesignRule.lineColor_inColorBg }]}
                        onPress={() => {
                            this._clickItemAction(index);
                        }}>
                        <Text
                            style={[styles.btnText, { color: canSelected ? (isSelected ? DesignRule.white : DesignRule.textColor_secondTitle) : DesignRule.color_ddd }]} allowFontScaling={false}>{this.props.listData[index].specValue}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return tagList;
    };

    render() {
        return (
            <TouchableWithoutFeedback>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText} allowFontScaling={false}>{this.props.tittle}</Text>
                    </View>
                    <View style={styles.containerView}>
                        {this.rendTag()}
                    </View>
                    <View style={{
                        height: 1,
                        marginTop: 15,
                        marginLeft: 16,
                        backgroundColor: DesignRule.lineColor_inColorBg
                    }}/>
                </View>
            </TouchableWithoutFeedback>
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
        color: DesignRule.textColor_secondTitle
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
        borderRadius: 3
    },
    btnText: {
        paddingHorizontal: 12,
        fontSize: 13
    }
});
