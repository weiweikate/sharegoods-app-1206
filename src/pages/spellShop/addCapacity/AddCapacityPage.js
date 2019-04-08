import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import RouterMap from '../../../navigation/RouterMap';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import HTML from 'react-native-render-html';
import ScreenUtils from '../../../utils/ScreenUtils';
import StringUtils from '../../../utils/StringUtils';

export class AddCapacityPage extends BasePage {
    $navigationBarOptions = {
        title: '我要扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            maxPersonNum: '',
            personNum: '',
            showExpand: false,
            storeExpansion: ''
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState
        };
    };

    componentDidMount() {
        const { storeData } = this.params;
        SpellShopApi.store_person({ storeCode: storeData.storeNumber }).then((data) => {
            const dataTemp = data.data || {};
            const { maxPersonNum, personNum, showExpand } = dataTemp;
            this.setState({
                loadingState: PageLoadingState.success,
                maxPersonNum, personNum, showExpand
            });
        }).catch(() => {
            this.setState({
                loadingState: PageLoadingState.fail
            });
        });

        SpellShopApi.store_expansion().then((data) => {
            const dataTemp = data.data || {};
            const { storeExpansion } = dataTemp;
            this.setState({
                storeExpansion
            });
        });
    }

    _addBtnAction = () => {
        this.$navigate(RouterMap.AddCapacityPricePage, { storeData: this.params.storeData });
    };

    _render() {
        const { maxPersonNum, personNum, showExpand, storeExpansion } = this.state;
        return (
            <ScrollView>
                <View style={styles.numView}>
                    <Text style={styles.leftText}>店铺成员数：</Text>
                    <Text style={styles.rightText}>{`${personNum || 0}/${maxPersonNum || 0} 人`}</Text>
                </View>
                <NoMoreClick style={styles.addBtn} onPress={this._addBtnAction} disabled={!showExpand}>
                    <Text style={styles.addText}>立即扩容</Text>
                </NoMoreClick>
                {
                    StringUtils.isNoEmpty(storeExpansion) ? <HTML html={storeExpansion}
                                                                  imagesMaxWidth={ScreenUtils.width - 30}
                                                                  imagesInitialDimensions={{
                                                                      width: ScreenUtils.width - 30,
                                                                      height: 0
                                                                  }}
                                                                  containerStyle={{
                                                                      marginTop: 30,
                                                                      marginHorizontal: 15
                                                                  }}/> : null
                }

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    numView: {
        marginHorizontal: 15,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        backgroundColor: DesignRule.white,
        height: 64
    },
    leftText: {
        marginLeft: 15,
        color: DesignRule.textColor_secondTitle, fontSize: 14
    },
    rightText: {
        marginRight: 15,
        color: DesignRule.textColor_1f2d3d, fontSize: 16
    },

    addBtn: {
        justifyContent: 'center', alignItems: 'center', marginTop: 20, marginHorizontal: 30,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_btn
    },
    addText: {
        color: DesignRule.textColor_white, fontSize: 15
    }
});

export default AddCapacityPage;
