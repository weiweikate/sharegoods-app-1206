import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../components/ui';
import { BannersVerticalView } from '../../../comm/components/BannersVerticalView';
import { homeType } from '../../home/HomeTypes';
import LinearGradient from 'react-native-linear-gradient';

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
            expandDone: false
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
    };

    componentDidMount() {
        this.loadPageData();
    }

    _addBtnAction = () => {
        this.$navigate('store/addCapacity/AddCapacityPricePage');
    };

    _render() {
        const { currStoreVolume, storeUserNum, expandDone } = this.state;
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
                <NoMoreClick onPress={this._addBtnAction} disabled={!expandDone}>
                    <LinearGradient style={styles.addBtn}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <Text style={styles.addText}>立即扩容</Text>
                    </LinearGradient>
                </NoMoreClick>
                <BannersVerticalView type={homeType.store30} style={{ marginTop: 30 }}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    topContainer: {
        marginTop: 20, borderRadius: 10, marginHorizontal: 15, overflow: 'hidden'
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
