//拼店页面，店铺行数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../res';
import UIImage from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../../../components/ui';


const StarImg = res.recommendSearch.dj_03;

export default class RecommendRow extends Component {

    static propTypes = {
        RecommendRowItem: PropTypes.object,
        RecommendRowOnPress: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _onPress = () => {
        this.props.RecommendRowOnPress && this.props.RecommendRowOnPress(this.props.RecommendRowItem);
    };

    render() {
        const { ...RecommendRowItem } = this.props.RecommendRowItem;
        const storeStar = RecommendRowItem.storeStarId;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return (<TouchableWithoutFeedback style={styles.container} onPress={this._onPress}>

            <View style={styles.viewContainer}>
                <View style={styles.topViewContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerViewContainer}>
                            {RecommendRowItem.headUrl ? <UIImage style={styles.icon}
                                                                 source={{ uri: RecommendRowItem.headUrl || '' }}
                                                                 borderRadius={25}/> :
                                <View style={[styles.icon, { backgroundColor: DesignRule.lineColor_inColorBg }]}/>}
                            <View style={styles.tittleContainer}>
                                <Text style={styles.name} numberOfLines={1} allowFontScaling={false}>{RecommendRowItem.name || ''}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        width: ScreenUtils.autoSizeWidth(44 + 70),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                starsArr.map((item, index) => {
                                    return <Image key={index} source={StarImg}/>;
                                })
                            }
                        </View>
                        <Text
                            style={{ marginTop: 9, color: DesignRule.textColor_instruction, fontSize: 12 }} allowFontScaling={false}>店铺等级</Text>
                    </View>
                </View>


                <View style={styles.bottomContainer}>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop} allowFontScaling={false}>店铺ID</Text>
                        <Text style={styles.containBottom} allowFontScaling={false}>{RecommendRowItem.showNumber || 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop} allowFontScaling={false}>店铺成员</Text>
                        <Text style={styles.containBottom} allowFontScaling={false}>{RecommendRowItem.storeUserNum || 0}</Text>
                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width
    },
    viewContainer: {
        marginTop: 9,
        marginHorizontal: 15,
        backgroundColor: 'white'
    },

    topViewContainer: {
        alignItems: 'center',
        height: 80,
        backgroundColor: '#FEFAF7',
        flexDirection: 'row'
    },


    headerViewContainer: {
        flexDirection: 'row',
        marginLeft: 15
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    tittleContainer: {
        justifyContent: 'center',
        marginLeft: 11,
        flex: 1
    },
    name: {
        color: DesignRule.textColor_mainTitle,
        fontSize: 13
    },


    bottomContainer: {
        flexDirection: 'row',
        height: 63,
        alignItems: 'center'
    },
    moneyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containTop: {
        color: DesignRule.textColor_secondTitle,
        fontSize: 10
    },
    containBottom: {
        marginTop: 7,
        color: DesignRule.textColor_secondTitle,
        fontSize: 13
    }
});

