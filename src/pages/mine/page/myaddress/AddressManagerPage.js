import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import addrSelectedImg from '../../res/address/addr_default_s.png';
import addrUnselectedImg from '../../res/address/addr_default_n.png';

export default class AddressManagerPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '地址管理',
        rightTitleStyle: { color: '#D51243' },
        rightNavTitle: '添加新地址'
    };

    $NavBarRightPressed = () => {
        this.$navigate('mine/address/AddressEditAndAddPage', {
            refreshing: this.refreshing.bind(this),
            from: 'add'
        });
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
            datas: []
        };
    }

    componentDidMount() {
        // 拿数据
        this.refreshing();
    }

    refreshing() {
        // HttpUtils.get('', {}).then((data) => {
        //     console.log(data);
        //     this.setState({
        //         datas: data
        //     });
        // }).catch((data) => {
        //     console.warn(data);
        //     bridge.$toast(data.msg);
        // });
        var datas = [];
        for (var i = 0; i < 10; i++) {
            if (i === 0) {
                datas.push({ id: i, receiver: i + '', tel: '18038000489', address: '对方就立刻撒娇弗兰克的角色', selected: true });

            } else {
                datas.push({ id: i, receiver: i + '', tel: '18038000489', address: '对方就立刻撒娇弗兰克的角色', selected: false });
            }
        }
        this.setState({
            datas: datas
        });
    }

    _render() {
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
                    keyExtractor={(item) => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    getItemLayout={(data, index) => (
                        //行高于分割线高，优化
                        { length: 120, offset: (120 + 10) * index, index }
                    )}
                    data={this.state.datas}>
                </FlatList>
            </View>
        );
    }

    _renderItem = (item) => {
        return <TouchableOpacity>
            <View style={styles.cell}>
                <View style={styles.cell_name_tel}>
                    <Text style={{ flex: 1, fontSize: 13, color: '#333333' }}>{item.item.receiver}</Text>
                    <Text style={{ fontSize: 13, color: '#333333' }}>{item.item.tel}</Text>
                </View>
                <Text style={styles.cell_addr}>{item.item.address}</Text>
                <View style={{ height: 0.5, backgroundColor: '#EBEBEB', marginTop: 13 }}/>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}
                                      onPress={() => this._onSelectImgClick(item.index)}>
                        <Image style={{ width: 15, height: 15, marginRight: 11 }}
                               source={item.index === this.state.selectIndex ? addrSelectedImg : addrUnselectedImg}
                        />
                        <Text style={{
                            flex: 1,
                            fontSize: 13,
                            color: item.index === this.state.selectIndex ? '#D51243' : '#666666'
                        }}>默认地址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
                                      onPress={() => this._onEditAddress(item.item)}>
                        <Image style={{ width: 16, height: 17, marginRight: 4 }}
                               source={require('../../res/address/addr_edit.png')}/>
                        <Text style={{ fontSize: 13, color: '#000000' }}>编辑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 17 }}
                                      onPress={() => this._onDelAddress(item.item)}>
                        <Image style={{ width: 17, height: 15, marginRight: 6 }}
                               source={require('../../res/address/addr_del.png')}/>
                        <Text style={{ fontSize: 13, color: '#000000' }}>删除</Text>
                    </TouchableOpacity>
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

    _onEditAddress = (item) => {
        // 编辑地址页面
        this.props.navigation.navigate('mine/address/AddressEditAndAddPage', {
            refreshing: this.refreshing.bind(this),
            from: 'edit',
            receiver: item.receiver,
            tel: item.tel,
            area: item.area,
            address: item.address
        });
    };

    _onDelAddress = (item) => {
        // 删除地址,刷新页面
        // HttpUtils.get('', {}).then((data) => {
        //     console.log(data);
        //     this.setState({
        //         datas: data
        //     });
        // }).catch((data) => {
        //     console.warn(data);
        //     bridge.$toast(data.msg);
        // });
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
