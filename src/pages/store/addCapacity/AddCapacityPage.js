import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import HTML from '@mr/react-native-render-html';
import ScreenUtils from '../../../utils/ScreenUtils';
import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../components/ui';

export class AddCapacityPage extends BasePage {
    $navigationBarOptions = {
        title: '我要扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},

            currStoreVolume: '',
            storeUserNum: '',
            expandDone: false,

            storeExpansion: ''
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: () => {
                    this.loadPageData();
                }
            }
        };
    };
    loadPageData = () => {
        SpellShopApi.expand_expandInfo().then((data) => {
            const dataTemp = data.data || {};
            const { currStoreVolume, storeUserNum, expandDone } = dataTemp;
            this.setState({
                loadingState: PageLoadingState.success,
                currStoreVolume, storeUserNum, expandDone
            });
        }).catch((e) => {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: e
            });
        });

        SpellShopApi.store_expansion().then((data) => {
            const dataTemp = data.data || {};
            const { storeExpansion } = dataTemp;
            this.setState({
                storeExpansion
            });
        });
    };

    componentDidMount() {
        this.loadPageData();
    }

    _addBtnAction = () => {
        this.$navigate('store/addCapacity/AddCapacityPricePage');
    };

    _render() {
        const { currStoreVolume, storeUserNum, expandDone, storeExpansion } = this.state;
        const outNum = StringUtils.sub(storeUserNum || 0, currStoreVolume || 0);
        return (
            <ScrollView>
                <View style={styles.topContainer}>
                    <View style={styles.numView}>
                        <Text style={styles.leftText}>店铺成员数：</Text>
                        <Text style={styles.rightText}>{`${storeUserNum || 0}/${currStoreVolume || 0} 人`}</Text>
                    </View>
                    {outNum > 0 &&
                    <View style={styles.numView}>
                        <Text style={styles.leftText}>待扩容成员数：</Text>
                        <Text style={styles.rightText}>{`${outNum}人`}</Text>
                    </View>}
                </View>
                {outNum > 0 && <Text style={styles.explainText}>注：扩容后，待扩容成员将成为正式成员</Text>}
                <NoMoreClick style={styles.addBtn} onPress={this._addBtnAction} disabled={!expandDone}>
                    <Text style={styles.addText}>立即扩容</Text>
                </NoMoreClick>
                <HTML html={storeExpansion}
                      imagesMaxWidth={ScreenUtils.width - 30}
                      imagesInitialDimensions={{
                          width: ScreenUtils.width - 30,
                          height: 0
                      }}
                      containerStyle={{
                          marginTop: 30,
                          marginHorizontal: 15
                      }}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    topContainer: {
        marginTop: 20, borderRadius: 5, marginHorizontal: 15
    },
    numView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: DesignRule.white, height: 64
    },
    leftText: {
        marginLeft: 15,
        color: DesignRule.textColor_secondTitle, fontSize: 14
    },
    rightText: {
        marginRight: 15,
        color: DesignRule.textColor_1f2d3d, fontSize: 16
    },
    explainText: {
        marginTop: 10, marginRight: 15,
        color: DesignRule.textColor_redWarn, fontSize: 11, alignSelf: 'flex-end'
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
