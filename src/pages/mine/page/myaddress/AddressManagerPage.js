import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import addrSelectedImg from '../../res/address/addr_default_s.png';
import addrUnselectedImg from '../../res/address/addr_default_n.png';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';

export default class AddressManagerPage extends BasePage {

    initIndex = -10;

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
            selectIndex: this.initIndex,
            datas: []
        };
    }

    componentDidMount() {
        // 拿数据
        this.refreshing();
    }

    refreshing() {
        MineAPI.queryAddrList({}).then((response) => {
            if (response.data) {
                for (let i = 0, len = response.data.length; i < len; i++) {
                    if (response.data[i].defaultStatus === 1) {
                        this.setState({
                            selectIndex: i
                        });
                    }
                }
            }
            this.setState({
                datas: response.data || []
            });
        }).catch((data) => {
            bridge.$toast(data.msg);
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
        return <TouchableOpacity onPress={() => this._onItemClick(item.item)}>
            <View style={styles.cell}>
                <View style={styles.cell_name_tel}>
                    <Text style={{ flex: 1, fontSize: 13, color: '#333333' }}>{item.item.receiver}</Text>
                    <Text style={{ fontSize: 13, color: '#333333' }}>{item.item.receiverPhone}</Text>
                </View>
                <Text style={styles.cell_addr}>{item.item.address}</Text>
                <View style={{ height: 0.5, backgroundColor: '#EBEBEB', marginTop: 13 }}/>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}
                                      onPress={() => this._onSelectImgClick(item.item, item.index)}>
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

    _onItemClick = (item) => {
        // 地址列表点击
    };

    _onSelectImgClick = (item, index) => {
        // 设置默认地址
        MineAPI.setDefaultAddr({ id: item.id }).then((response) => {
            let nowIndex = index === this.state.selectIndex ? this.initIndex : index;
            this.setState({
                selectIndex: nowIndex
            });
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    };

    _onEditAddress = (item) => {
        // 编辑地址页面
        this.props.navigation.navigate('mine/address/AddressEditAndAddPage', {
            refreshing: this.refreshing.bind(this),
            from: 'edit',
            receiver: item.receiver,
            tel: item.receiverPhone + '',
            address: item.address,
            id: item.id,
            areaText: item.province + item.city + item.area,
            provinceCode: item.provinceCode,
            cityCode: item.cityCode,
            areaCode: item.areaCode,
            isDefault: item.defaultStatus === 1
        });
    };

    _onDelAddress = (item) => {
        // 删除地址,刷新页面
        MineAPI.delAddress({ id: item.id }).then((response) => {
            this.refreshing();
        }).catch((data) => {
            bridge.$toast(data.msg);
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
