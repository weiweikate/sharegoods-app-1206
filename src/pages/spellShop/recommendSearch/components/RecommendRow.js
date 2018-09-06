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

export default class RecommendRow extends Component {

    static propTypes = {
        id: PropTypes.number,        //店铺id
        headUrl: PropTypes.string,   //头像
        name: PropTypes.string,      //店名
        hadUser: PropTypes.number,   //店内目前成员人数
        clickShopInfoRow: PropTypes.func       //点击回调
    };

    constructor(props) {
        super(props);
        this.state = {
            dataList: ['', '', '','', '', '','', '', '','', '', '']
        };
    }

    renderIconItem = () => {
        return (<TouchableOpacity style={styles.item_container} onPress={() => {
        }}>
            <Image style={styles.itemIcon}/>
        </TouchableOpacity>);
    };

    render() {
        return (<TouchableWithoutFeedback style={styles.container} onPress={() => {
            this.props.clickShopInfoRow(this.props.id);
        }}>

            <View style={styles.viewContainer}>

                <View style={styles.headerViewContainer}>
                    <Image style={styles.icon} source={{ uri: this.props.headUrl }}/>
                    <View style={styles.tittleContainer}>
                        <Text style={styles.name}>美丽的小姑凉</Text>
                        <Text style={styles.member}>成员：23人</Text>
                    </View>
                    <TouchableOpacity style={styles.joinBtn} onPress={() => {
                        this.props.clickShopInfoRow();
                    }}>
                        <Text style={styles.joinText}>申请加入</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={styles.midFlatList}
                    data={this.state.dataList}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderIconItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                <View style = {styles.moneyContainer}>
                    <Text style={styles.moneyText}>店铺本月收入：<Text style={{ color: '#D51243' }}>5888.98元</Text>
                    </Text>
                    <Text style={[styles.moneyText,{ marginLeft: 16 }]}>
                        店铺累计收入：<Text
                        style={{ color: '#D51243' }}>15555.888.98元</Text>
                    </Text>
                </View>

            </View>
        </TouchableWithoutFeedback>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width,
        backgroundColor: 'rgb(245,245,245)'
    },
    viewContainer: {
        marginTop: 9,
        backgroundColor: 'white'
    },

    headerViewContainer: {
        flexDirection: 'row',
        height: 44,
        marginTop: 15,
        paddingHorizontal: 15
    },
    icon: {
        width: 44,
        height: 44,
        backgroundColor: '#eee',
        borderRadius: 4
    },
    tittleContainer: {
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
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 27,
        borderRadius: 4,
        backgroundColor: '#D51243'
    },
    joinText: {
        color: 'white',
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12
    },

    midFlatList: {
        marginTop: 30
    },
    itemContainer: {
        width: 65,
        height: 50
    },
    itemIcon: {
        backgroundColor: 'red',
        marginLeft: 15,
        width: 50,
        height: 50,
        borderRadius: 25
    },

    moneyContainer: {
        flexDirection:'row',
        marginTop: 29,
        marginBottom: 16,
        paddingHorizontal: 15,
    },
    moneyText: {
        color: '#999999',
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12
    }


});

