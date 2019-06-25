import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import { MRText } from '../../../components/ui';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import MineAPI from '../../mine/api/MineApi';
import DesignRule from '../../../constants/DesignRule';

const addressType = {
    'addressProvince': '0',
    'addressCity': '1',
    'addressArea': '2'
};

@observer
export class AddressSelectPage extends BasePage {
    $navigationBarOptions = {
        title: '选择配送区域'
    };
    addressSelectModel = new AddressSelectModel();
    _renderItem = ({ item }) => {
        const { requestWithCode, indexType, selectItems } = this.addressSelectModel;
        return (
            <NoMoreClick style={{ height: 40, justifyContent: 'center' }} onPress={() => {
                //点击列当前的城市
                selectItems[indexType] = item;
                if (indexType === addressType.addressArea) {
                    return;
                }
                //下一页
                requestWithCode(item.code);
            }}>
                <MRText style={styles.itemText}>{item.name}</MRText>
            </NoMoreClick>
        );
    };
    _keyExtractor = (item, index) => {
        return item.id + index + '';
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
        const { selectItems, addressList, indexType } = this.addressSelectModel;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 40, backgroundColor: 'white' }}>
                    <View style={styles.tittleContainer}>
                        {
                            Object.keys(selectItems).map((item, index) => {
                                const value = selectItems[item];
                                if (!value) {
                                    return null;
                                }
                                return (
                                    <NoMoreClick key={index} onPress={() => {
                                        this.addressSelectModel.indexType = item;
                                        Object.keys(selectItems).forEach((item1) => {
                                            if (item1 === item) {
                                                selectItems[item1] = { name: '请选择' };
                                            } else if (item1 > item) {
                                                selectItems[item1] = null;
                                            }
                                        });
                                    }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <MRText style={styles.tittleText}>{value.name}</MRText>
                                        </View>
                                        <View style={{
                                            height: 2,
                                            backgroundColor: item === indexType ? DesignRule.mainColor : 'white'
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
    @observable indexType = null;
    @observable selectItems = {
        [addressType.addressProvince]: null,
        [addressType.addressCity]: null,
        [addressType.addressArea]: null
    };
    @observable contentList = {
        [addressType.addressProvince]: [],
        [addressType.addressCity]: [],
        [addressType.addressArea]: []
    };

    @computed get addressList() {
        return this.contentList[this.indexType] || [];
    }

    @action requestWithCode = (code) => {
        MineAPI.getAreaList({ fatherCode: code }).then((data) => {
            //当前列表项数据
            if (!this.indexType) {
                this.indexType = addressType.addressProvince;
            } else if (this.indexType === addressType.addressProvince) {
                this.indexType = addressType.addressCity;
            } else if (this.indexType === addressType.addressCity) {
                this.indexType = addressType.addressArea;
            }
            this.contentList[this.indexType] = data.data || [];
            this.selectItems[this.indexType] = { name: '请选择' };
        });
    };
}
