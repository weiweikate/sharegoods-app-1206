import { Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import MineAPI from '../../api/MineApi';
import bridge from '../../../../utils/bridge';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import SmoothPushHighComponent from '../../../../comm/components/SmoothPushHighComponent';
import RouterMap from '../../../../navigation/RouterMap';

const NoMessage = res.address.kongbeiye_icon_dizhi;
const addr_edit = res.address.addr_edit;
const addr_del = res.address.addr_del;

/**
 * @author luoyongming
 * @date on 2018/9/18
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */
@SmoothPushHighComponent
export default class AddressManagerPage extends BasePage {

    initIndex = -10;

    // 导航配置
    $navigationBarOptions = {
        title: '地址管理',
        rightTitleStyle: { color: DesignRule.mainColor },
        rightNavTitle: '添加新地址'
    };

    $NavBarRightPressed = () => {
        this.$navigate(RouterMap.AddressEditAndAddPage, {
            refreshing: this.refreshing.bind(this),
            from: 'add'
        });
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: this.initIndex,
            datas: []
        };
    }

    refreshing() {
        this.list && this.list._onRefresh();
    }

    // 空布局
    _renderEmptyView = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={NoMessage} style={{ width: 110, height: 110, marginTop: 112 }}/>
                <Text style={{ color: DesignRule.textColor_instruction, fontSize: 15, marginTop: 11 }}>暂无收货地址</Text>
                <Text style={{ color: DesignRule.textColor_instruction, fontSize: 12, marginTop: 3 }}>快去添加吧～</Text>
            </View>
        );
    };

    _render() {
        return (
            <RefreshFlatList
                ref={(ref) => {
                    this.list = ref;
                }}
                isSupportLoadingMore={false}
                url={MineAPI.queryAddrList}
                params={{}}
                renderItem={this._renderItem}
                renderEmpty={this._renderEmptyView}
                handleRequestResult={(response) => {
                    if (response.data && response.data.length > 0) {
                        let ids = [];
                        let selectIndex = -1;
                        for (let i = 0, len = response.data.length; i < len; i++) {
                            if (response.data[i].defaultStatus === 1) {
                                this.setState({
                                    selectIndex: i
                                });
                                selectIndex = i;
                            }
                            ids.push(response.data[i].id);
                        }
                        let currentAddressId = this.params.currentAddressId || -1;
                        if (currentAddressId && ids.indexOf(currentAddressId) === -1) {//当前选择地址被删除了
                            if (selectIndex === -1) {
                                this.params.callBack && this.params.callBack({});
                            } else {
                                this.params.callBack && this.params.callBack(response.data[selectIndex]);
                            }
                        }
                    } else {//没有地址时候返回data： null
                        this.params.callBack && this.params.callBack({});
                    }
                    return response.data || [];
                }}
            />
        );
    }

    _renderItem = (item) => {
        let {province, city, area, address, street} = item.item;
        street = street || '';
        return <TouchableOpacity onPress={() => this._onItemClick(item.item)} style={styles.touchable}>
                <View style={styles.cell_name_tel}>
                    <Text style={{
                        flex: 1,
                        fontSize: 15,
                        color: DesignRule.textColor_mainTitle
                    }}>{item.item.receiver+ '     ' + item.item.receiverPhone}</Text>
                    {item.item.defaultStatus === 1 ? <View style={{backgroundColor: 'rgba(255,0,80,0.1)', justifyContent: 'center', paddingHorizontal: 3, height: 16}}>
                        <Text style={{color: '#FF0050', fontSize: 10}}>默认</Text>
                    </View>: null}
                </View>
                <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={styles.cell_addr}>{province + city + area + street + address}</Text>
            <View style={{flex: 1}}/>
            <View style={{ flexDirection: 'row', alignItems: 'center',height: DesignRule.autoSizeWidth(38), borderTopWidth: 1, borderTopColor: DesignRule.bgColor}}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}
                                  onPress={() => this._onSelectImgClick(item.item, item.index)}>
                    <Image style={{ width: DesignRule.autoSizeWidth(16), height: DesignRule.autoSizeWidth(16), marginRight: 11 }}
                           source={item.index === this.state.selectIndex ? res.button.selected_circle_red : res.button.unselected_circle}
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
                           source={addr_edit}/>
                    <Text style={{ fontSize: 13, color: DesignRule.textColor_instruction }}>编辑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 17 }}
                                  onPress={() => this._onDelAddress(item.item)}>
                    <Image style={{ width: 17, height: 15, marginRight: 6 }}
                           source={addr_del}/>
                    <Text style={{ fontSize: 13, color: DesignRule.textColor_instruction }}>删除</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>;
    };

    _onItemClick = (item) => {
        // 地址列表点击
        if (this.params.from === 'order') {
            bridge.showLoading();
            let callBack = this.params.callBack;
            callBack && callBack({ ...item });
            this.$navigateBack();
        }
    };

    _onSelectImgClick = (item, index) => {
        // 设置默认地址
        if (index !== this.state.selectIndex) {
            MineAPI.setDefaultAddr({ id: item.id }).then((response) => {
                this.setState({
                    selectIndex: index
                });
            }).catch((data) => {
                if (data.code === 10009 || data.code === 10001) {
                    this.gotoLoginPage();
                }
                bridge.$toast(data.msg);
            });
        }
    };

    _onEditAddress = (item, index) => {
        // 编辑地址页面
        this.$navigate(RouterMap.AddressEditAndAddPage, {
            refreshing: this.refreshing.bind(this),
            from: 'edit',
            receiver: item.receiver,
            tel: item.receiverPhone + '',
            address: item.address,
            id: item.id,
            areaText: item.province + item.city + (item.area || ''),
            provinceCode: item.provinceCode,
            cityCode: item.cityCode,
            areaCode: item.areaCode,
            streeCode: item.streeCode,
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

}

const styles = StyleSheet.create({
    touchable: {
        height: DesignRule.autoSizeWidth(127),
        marginRight: 15,
        marginLeft: 15,
        marginTop: 10,
        backgroundColor: 'white'
    },
    cell_name_tel: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: DesignRule.autoSizeWidth(15),
    },
    cell_addr: {
        fontSize: 12,
        color: DesignRule.textColor_mainTitle,
        paddingRight: 17,
        marginTop: DesignRule.autoSizeWidth(10),
        marginLeft: 15
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
