import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import { MRText } from '../../../components/ui';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import MineAPI from '../../mine/api/MineApi';
import DesignRule from '../../../constants/DesignRule';
import RouterMap, { popToRouteName } from '../../../navigation/RouterMap';

@observer
export class AddressSelectPage extends BasePage {
    $navigationBarOptions = {
        title: '选择配送区域'
    };
    addressSelectModel = new AddressSelectModel();
    _renderItem = ({ item }) => {
        const { requestWithCode, itemIndex, selectItems } = this.addressSelectModel;
        return (
            <NoMoreClick style={{ height: 40, justifyContent: 'center' }} onPress={() => {
                //点击列当前的城市
                selectItems[itemIndex] = item;
                if (itemIndex === 2) {
                    const { productDetailAddressModel } = this.params;
                    const nameList = selectItems.map((item) => {
                        return item.name;
                    });
                    productDetailAddressModel.addressSelectedText = nameList.join('');
                    productDetailAddressModel.addressSelectedCode = item.code;
                    popToRouteName(RouterMap.ProductDetailPage);
                    return;
                }
                //下一页
                requestWithCode(item.code);
            }}>
                <MRText style={styles.itemText}>{item.name}</MRText>
            </NoMoreClick>
        );
    };
    _keyExtractor = (item) => {
        return item.code + '';
    };

    _ItemSeparatorComponent = () => {
        return (
            <View style={styles.separatorView}/>
        );
    };

    componentDidMount() {
        this.addressSelectModel.requestWithCode(0);
    }

    _render() {
        const { selectItems, addressList, itemIndex } = this.addressSelectModel;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 40, backgroundColor: 'white' }}>
                    <View style={styles.tittleContainer}>
                        {
                            selectItems.map((item, index) => {
                                if (!item.name) {
                                    return null;
                                }
                                return (
                                    <NoMoreClick key={index} onPress={() => {
                                        this.addressSelectModel.itemIndex = index;
                                        selectItems.forEach((item, index1) => {
                                            if (index1 === index) {
                                                selectItems[index1] = { name: '请选择' };
                                            } else if (index1 > index) {
                                                selectItems[index1] = {};
                                            }
                                        });

                                    }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <MRText style={styles.tittleText}>{item.name}</MRText>
                                        </View>
                                        <View style={{
                                            height: 2,
                                            backgroundColor: index === itemIndex ? DesignRule.mainColor : 'white'
                                        }}/>
                                    </NoMoreClick>
                                );
                            })
                        }
                    </View>
                    <View style={styles.separatorView}/>
                </View>
                <FlatList data={addressList}
                          style={{ backgroundColor: 'white' }}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          ItemSeparatorComponent={this._ItemSeparatorComponent}
                          showsVerticalScrollIndicator={false}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tittleContainer: {
        flex: 1, flexDirection: 'row'
    },
    tittleText: {
        marginHorizontal: 15,
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },
    itemText: {
        marginLeft: 15,
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },
    separatorView: {
        height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg
    }
});

export default AddressSelectPage;

class AddressSelectModel {
    //当前列表项数据
    @observable itemIndex = -1;
    @observable selectItems = [{ name: '请选择' }, {}, {}];
    @observable contentList = [[], [], []];

    @computed get addressList() {
        return this.contentList[this.itemIndex] || [];
    }

    @action requestWithCode = (code) => {
        MineAPI.getAreaList({ fatherCode: code }).then((data) => {
            //当前列表项数据
            if (this.itemIndex === -1) {
                this.itemIndex = 0;
            } else if (this.itemIndex === 0) {
                this.itemIndex = 1;
            } else if (this.itemIndex === 1) {
                this.itemIndex = 2;
            }
            this.contentList[this.itemIndex] = data.data || [];
            this.selectItems[this.itemIndex] = { name: '请选择' };
        });
    };
}
