import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import addrSelectedImg from '../../res/address/addr_default_s.png';
import addrUnselectedImg from '../../res/address/addr_default_n.png';
import UIImage from '../../../../components/ui/UIImage';

export default class MyAddressPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '地址管理',
        rightTitleStyle: { color: '#D51243' },
        rightNavTitle: '添加新地址'
    };

    $NavBarRightPressed = () => {
        this.props.navigation.navigate('mine/AddAddressPage');
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0
        };
    }

    refreshing() {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            alert('刷新成功');
        }, 1500);
    }

    _render() {
        var datas = [];
        for (var i = 0; i < 100; i++) {
            if (i === 0) {
                datas.push({ key: i, title: i + '', selected: true });

            } else {
                datas.push({ key: i, title: i + '', selected: false });
            }
        }
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={(flatList) => this._flatList = flatList}
                    ListHeaderComponent={this._header}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    extraData={this.state}
                    onRefresh={this.refreshing}
                    refreshing={false}
                    showsVerticalScrollIndicator={false}
                    getItemLayout={(data, index) => (
                        //行高于分割线高，优化
                        { length: 120, offset: (120 + 10) * index, index }
                    )}
                    data={datas}>
                </FlatList>
            </View>
        );
    }

    _renderItem = (item) => {
        return <TouchableOpacity>
            <View style={styles.cell}>
                <View style={styles.cell_name_tel}>
                    <Text style={{ flex: 1, fontSize: 13, color: '#333333' }}>张苗苗</Text>
                    <Text style={{ fontSize: 13, color: '#333333' }}>17816857659</Text>
                </View>
                <Text style={styles.cell_addr}>浙江省杭州市西湖区古墩路675号盛苑小区</Text>
                <View style={{ height: 0.5, backgroundColor: '#EBEBEB', marginTop: 13 }}/>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <UIImage style={{ width: 15, height: 15, marginRight: 11, marginLeft: 20 }}
                             source={item.index === this.state.selectIndex ? addrSelectedImg : addrUnselectedImg}
                             onPress={() => this._onSelectImgClick(item.index)}/>
                    <Text style={{
                        flex: 1,
                        fontSize: 13,
                        color: item.index === this.state.selectIndex ? '#D51243' : '#666666'
                    }}>默认地址</Text>
                    <Image style={{ width: 16, height: 17, marginRight: 4 }}
                           source={require('../../res/address/addr_edit.png')}/>
                    <Text style={{ fontSize: 13, color: '#000000', marginRight: 16 }}>编辑</Text>
                    <Image style={{ width: 17, height: 15, marginRight: 6 }}
                           source={require('../../res/address/addr_del.png')}/>
                    <Text style={{ fontSize: 13, color: '#000000', marginRight: 17 }}>删除</Text>
                </View>
            </View>
        </TouchableOpacity>;
    };

    _onSelectImgClick = (index) => {
        let nowIndex = index === this.state.selectIndex ? -10 : index;
        this.setState({
            selectIndex: nowIndex
        });
    };

    _header = () => {
        return <View style={{ height: 8, backgroundColor: 'transparent' }}/>;
    };

    _separator = () => {
        return <View style={{ height: 10, backgroundColor: 'transparent' }}/>;
    };


}

const styles = StyleSheet.create({
    cell: {
        flexDirection: 'column',
        height: 120,
        backgroundColor: 'white'
    },
    cell_name_tel: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 15,
        paddingRight: 17
    },
    cell_addr: {
        fontSize: 13,
        color: '#333333',
        paddingLeft: 20,
        paddingRight: 17,
        marginTop: 13
    }
});
