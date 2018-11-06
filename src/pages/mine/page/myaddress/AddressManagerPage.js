import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import addrSelectedImg from '../../../../comm/res/selected_circle_red.png';
import addrUnselectedImg from '../../../../comm/res/unselected_circle.png';
import addrBorderImgN from '../../res/address/dizhi_img_nor.png';
import addrBorderImgS from '../../res/address/dizhi_img_sel.png';
import addrRight from '../../res/address/dizhi_icon_moren_sel.png';
import dingwei from '../../res/address/dizhi_icon_dingwei_nor.png';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';

export default class AddressManagerPage extends BasePage {

    initIndex = -10;

    // 导航配置
    $navigationBarOptions = {
        title: '地址管理',
        rightTitleStyle: { color: DesignRule.mainColor },
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
                    ListHeaderComponent={this._header}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    extraData={this.state}
                    onRefresh={this.refreshing}
                    refreshing={false}
                    keyExtractor={(item) => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    data={this.state.datas}/>
            </View>
        );
    }

    _renderItem = (item) => {
        return <TouchableOpacity onPress={() => this._onItemClick(item.item)} style={styles.touchable}>
            <Image source={item.index === this.state.selectIndex ? addrRight : null}
                   style={styles.topImage}/>
            <View style={styles.cell}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                    <Image source={dingwei}
                           style={{
                               width: 16,
                               height: 20,
                               marginLeft: 16,
                               marginRight: 10
                           }}/>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={styles.cell_name_tel}>
                            <Text style={{
                                flex: 1,
                                fontSize: 15,
                                color: DesignRule.textColor_mainTitle
                            }}>收货人：{item.item.receiver}</Text>
                            <Text style={{
                                fontSize: 15,
                                color: DesignRule.textColor_mainTitle
                            }}>{item.item.receiverPhone}</Text>
                        </View>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                            style={styles.cell_addr}>{item.item.province + item.item.city + item.item.area + item.item.address}</Text>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg, marginTop: 15 }}/>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 13, paddingBottom: 13 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}
                                      onPress={() => this._onSelectImgClick(item.item, item.index)}>
                        <Image style={{ width: 16, height: 16, marginRight: 11 }}
                               source={item.index === this.state.selectIndex ? addrSelectedImg : addrUnselectedImg}
                        />
                        <Text style={{
                            flex: 1,
                            fontSize: 13,
                            color: item.index === this.state.selectIndex ? DesignRule.mainColor : DesignRule.textColor_instruction
                        }}>默认地址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
                                      onPress={() => this._onEditAddress(item.item, item.index)}>
                        <Image style={{ width: 16, height: 17, marginRight: 4 }}
                               source={require('../../res/address/addr_edit.png')}/>
                        <Text style={{ fontSize: 13, color: DesignRule.textColor_instruction }}>编辑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 17 }}
                                      onPress={() => this._onDelAddress(item.item)}>
                        <Image style={{ width: 17, height: 15, marginRight: 6 }}
                               source={require('../../res/address/addr_del.png')}/>
                        <Text style={{ fontSize: 13, color: DesignRule.textColor_instruction }}>删除</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Image source={item.index === this.state.selectIndex ? addrBorderImgS : addrBorderImgN}
                   style={styles.bottomImage}/>
        </TouchableOpacity>;
    };

    _onItemClick = (item) => {
        // 地址列表点击
        if (this.params.from == 'order') {
            this.params.callBack && this.params.callBack(item);
            this.$navigateBack();
        }
    };

    _onSelectImgClick = (item, index) => {
        // 设置默认地址
        if (index != this.state.selectIndex) {
            MineAPI.setDefaultAddr({ id: item.id }).then((response) => {
                this.setState({
                    selectIndex: index
                });
            }).catch((data) => {
                if (data.code === 10009 || data.code === 10001) {
                    this.$navigate('login/login/LoginPage');
                }
                bridge.$toast(data.msg);
            });
        }
    };

    _onEditAddress = (item, index) => {
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
            isDefault: index === this.state.selectIndex
        });
    };

    _onDelAddress = (item) => {
        Alert.alert('', '是否确认删除此地址？', [
            {
                text: '取消', onPress: () => {
                    style: 'cancel';
                }
            },
            {
                text: '确定', onPress: () => {
                    // 删除地址,刷新页面
                    MineAPI.delAddress({ id: item.id }).then((response) => {
                        this.refreshing();
                    }).catch((data) => {
                        bridge.$toast(data.msg);
                    });
                }
            }
        ]);
    };

    _header = () => {
        return <View style={{ height: 10, backgroundColor: 'transparent' }}/>;
    };

    _footer = () => {
        return <View style={{ height: 20, backgroundColor: 'transparent' }}/>;
    };

    _separator = () => {
        return <View style={{ height: 10, backgroundColor: 'transparent' }}/>;
    };


}

const styles = StyleSheet.create({
    touchable: {
        marginRight: 15,
        marginLeft: 15
    },
    cell: {
        flexDirection: 'column',
        backgroundColor: DesignRule.white,
        borderRadius: 10
    },
    cell_name_tel: {
        flexDirection: 'row',
        paddingRight: 17
    },
    cell_addr: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle,
        paddingRight: 17,
        marginTop: 5
    },
    topImage: {
        height: 33,
        width: 33,
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 3,
        right: 0
    },
    bottomImage: {
        height: 3,
        width: ScreenUtils.width - 36,
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 2,
        bottom: 0
    }
});
