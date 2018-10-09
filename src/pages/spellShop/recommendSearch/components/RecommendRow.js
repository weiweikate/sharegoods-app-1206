//拼店页面，店铺行数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StarImg from '../src/dj_03.png';


export default class RecommendRow extends Component {

    static propTypes = {
        RecommendRowItem: PropTypes.object,
        RecommendRowOnPress: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    renderIconItem = ({ item }) => {
        return (<TouchableOpacity onPress={() => {
        }}>
            {item.headImg ? <Image style={styles.itemIcon} source={{ uri: item.headImg || '' }}/> : <View
                style={styles.itemIcon}/>}
        </TouchableOpacity>);
    };
    _onPress = () => {
        this.props.RecommendRowOnPress && this.props.RecommendRowOnPress(this.props.RecommendRowItem.id);
    };

    render() {
        const { ...RecommendRowItem } = this.props.RecommendRowItem;
        const { storeUserList } = RecommendRowItem;

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
                            {RecommendRowItem.headUrl ? <Image style={styles.icon}
                                                               source={{ uri: RecommendRowItem.headUrl || '' }}/> :
                                <View style={styles.icon}/>}
                            <View style={styles.tittleContainer}>
                                <Text style={styles.name}>{RecommendRowItem.name || ''}</Text>
                                <Text style={styles.member}>{`店主: ${RecommendRowItem.storeUserName || ''}`}</Text>
                            </View>
                        </View>
                        <FlatList
                            style={styles.midFlatList}
                            data={storeUserList}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={this.renderIconItem}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                        <View style={{
                            marginLeft: 100,
                            width: 100,
                            height: 5,
                            borderRadius: 2,
                            borderColor: '#D51234',
                            marginTop: 6
                        }}>

                        </View>
                    </View>
                    <View style={{ width: 1, backgroundColor: 'rgb(244,231,221)' }}/>
                    <View style={{ width: 44 + 70, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                starsArr.map((item, index) => {
                                    return <Image key={index} source={StarImg}/>;
                                })
                            }
                        </View>
                        <Text style={{ marginTop: 9, color: '#939393', fontSize: 14 }}>店铺等级</Text>
                        <TouchableOpacity style={styles.joinBtn} onPress={() => {
                            this.props.RecommendRowOnPress();
                        }}>
                            <Text style={styles.joinText}>+加入我们</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.bottomContainer}>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.moneyText}>店铺成员</Text>
                        <Text style={styles.moneyText}>{RecommendRowItem.storeUserNum || 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.moneyText}>店铺本月收入</Text>
                        <Text style={styles.moneyText}>{`${RecommendRowItem.tradeVolume || 0}元`}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.moneyText}>店铺累计收入</Text>
                        <Text style={styles.moneyText}>{`${RecommendRowItem.totalTradeVolume || 0}元`}</Text>
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
        backgroundColor: '#FEFAF7',
        flexDirection: 'row'
    },


    headerViewContainer: {
        flexDirection: 'row',
        height: 44,
        marginTop: 15,
        paddingHorizontal: 15
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: '#eee',
        borderRadius: 25
    },
    tittleContainer: {
        justifyContent: 'center',
        marginLeft: 11,
        flex: 1
    },
    name: {
        color: '#212121',
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 14
    },
    member: {
        color: '#666666',
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 11
    },
    joinBtn: {
        marginTop: 17,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#D51243'
    },
    joinText: {
        color: 'white',
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12
    },

    midFlatList: {
        marginTop: 17
    },
    itemIcon: {
        backgroundColor: '#eee',
        marginLeft: 15,
        width: 40,
        height: 40,
        borderRadius: 20
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
    moneyText: {
        color: '#666666',
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 11
    }


});

