/**
 * 发现收藏
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Waterfall from '../../components/ui/WaterFall';
import { observer } from 'mobx-react';
import { ShowRecommendModules, tag } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils';
import {
    MRText as Text
} from '../../components/ui';
const { px2dp } = ScreenUtils;
import ItemView from './ShowHotItem';
import BasePage from '../../BasePage';
import res from './res';
import DesignRule from '../../constants/DesignRule';
import Toast from '../../utils/bridge';

const imgWidth = px2dp(168);

@observer
export default class ShowConnectPage extends BasePage {
    state = {
        select: false,
        selectedList: {},
        allSelected: false,
        collectData: [],
        firstLoad: true,
        isEmpty: false
    };
    $navigationBarOptions = {
        title: '秀场收藏',
        show: true
    };
    $NavBarRenderRightItem = () => {
        const { select } = this.state;
        return (
            <TouchableOpacity style={styles.rightButton} onPress={() => this._onSelectedAction()}>
                <Text style={styles.select}>{select ? '完成' : '管理'}</Text>
            </TouchableOpacity>
        );
    };

    constructor(props) {
        super(props);
        this.recommendModules = new ShowRecommendModules();
    }

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'show/ShowConnectPage') {
                    this._refreshData();
                }
            }
        );
    }

    _refreshData() {
        this.waterfall && this.waterfall.clear();
        this.recommendModules.loadCollect().then(data => {
            this.setState({ firstLoad: false });
            this.waterfall && (this.waterfall.index = 1);
            if (data && data.length > 0) {
                this.waterfall && this.waterfall.addItems(data);
            } else {
                // this.waterfall.addItems([]);
                this.setState({ isEmpty: true });
            }
            this.state.collectData = data;
        });
    }

    _deleteSelected(ids) {
        if (ids.length > 0) {
            this.recommendModules.batchCancelConnected(ids).then(data => {
                this._refreshData();
                this.setState({ select: false });
            });
        }
    }

    _delete() {
        const { selectedList, allSelected } = this.state;
        let ids = [];
        if (allSelected) {
            this.state.collectData.map(value => {
                ids.push(value.id);
            });
        } else {
            ids = Object.keys(selectedList);
        }

        if (ids.length === 0) {
            Toast.$toast('请选择要删除的文章');
            return;
        }

        Alert.alert(
            '',
            '确定删除？',
            [
                { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: '确定', onPress: () => {
                        this._deleteSelected(ids);
                    }
                }
            ],
            { cancelable: false }
        );
    }

    _onSelectedAction() {
        const { select } = this.state;
        this.setState({ select: !select });
    }

    infiniting(done) {
        setTimeout(() => {
            this.recommendModules.getMoreCollect().then(data => {
                this.waterfall && this.waterfall.addItems(data);
                if (data.length > 0) {
                    this.setState({ allSelected: false });
                }
                this.state.collectData = [...this.state.collectData, ...data];
            });
            done();
        }, 1000);
    }

    refreshing(done) {
        setTimeout(() => {
            this._refreshData();
            done();
        }, 1000);
    }

    _gotoDetail(data) {
        this.$navigate('show/ShowDetailPage', { id: data.id, code: data.code });
    }

    _selectedAction(data) {
        const { selectedList, allSelected, collectData } = this.state;

        if (allSelected) {
            let selecteds = {};
            collectData.map((value) => {
                if (value.id !== data.id) {
                    selecteds[value.id] = value.id;
                }
            });
            this.setState({ allSelected: false, selectedList: selecteds });
            return;
        }

        if (selectedList[data.id]) {
            delete selectedList[data.id];
        } else {
            selectedList[data.id] = data.id;
        }

        this.setState({
            selectedList: selectedList,
            allSelected: Object.keys(selectedList).length === this.state.collectData.length
        });
    }

    _selectedAllAction() {
        const { allSelected, collectData } = this.state;
        if (allSelected) {
            this.setState({ allSelected: false, selectedList: {} });
        } else {
            let selects = {};
            collectData.map(value => {
                selects[value.id] = value.id;
            });
            this.setState({ allSelected: true, selectedList: selects });
        }

    }

    renderItem = (data) => {
        let imgWide = 1;
        let imgHigh = 1;
        let img = '';
        if (data.generalize === tag.New || data.generalize === tag.Recommend) {
            imgWide = EmptyUtils.isEmpty(data.coverImgWide) ? 1 : data.coverImgWide;
            imgHigh = EmptyUtils.isEmpty(data.coverImgHigh) ? 1 : data.coverImgHigh;
            img = data.coverImg;
        } else {
            imgWide = data.imgWide ? data.imgWide : 1;
            imgHigh = data.imgHigh ? data.imgHigh : 1;
            img = data.img;
        }
        let imgHeight = (imgHigh / imgWide) * imgWidth;
        const { select, allSelected, selectedList } = this.state;
        return <View><ItemView
            isSelected={select}
            imageStyle={{ height: imgHeight }}
            data={data}
            press={() => this._gotoDetail(data)}
            imageUrl={img}
        />
            {
                select
                    ?
                    <TouchableOpacity style={styles.selectedView} onPress={() => this._selectedAction(data)}>
                        <Image
                            style={
                                {
                                    width: 22,
                                    height: 22
                                }
                            }
                            source={allSelected ? res.button.selected_circle_red : (selectedList[data.id] ? res.button.selected_circle_red : res.button.unselected_circle)}/>
                    </TouchableOpacity>
                    :
                    null
            }
        </View>;
    };
    _keyExtractor = (data) => data.id + '';

    goToHome() {
        // this.$navigateBackToHome();
        this.props.navigation.popToTop();
        this.props.navigation.navigate('ShowListPage');
    }

    _renderInfinite() {
        return <View style={{ justifyContent: 'center', alignItems: 'center', height: 50 }}>
            {this.recommendModules.isEnd ?
                <Text style={styles.text} allowFontScaling={false}>我也是有底线的</Text> : this.recommendModules.isRefreshing ?
                    <Text style={styles.text}>加载中...</Text> :
                    <Text style={styles.text} allowFontScaling={false}>加载更多</Text>}
        </View>;
    }

    _render() {
        const { allSelected, select, firstLoad, isEmpty } = this.state;
        if (firstLoad) {
            return <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>;
        }
        if (isEmpty) {
            return <View style={styles.emptyContainer}>
                <Image style={styles.noCollect} source={res.placeholder.noCollect}/>
                <Text style={styles.collectWhat} allowFontScaling={false}>去收藏点什么吧</Text>
                <Text style={styles.goToIndex} allowFontScaling={false}>快去商城逛逛吧</Text>
                <TouchableOpacity style={styles.gotobutton} onPress={() => {
                    this.goToHome();
                }}>
                    <Text style={styles.goToText} allowFontScaling={false}>逛一逛</Text>
                </TouchableOpacity>
            </View>;
        }
        return (
            <View style={styles.container}>
                <Waterfall
                    space={10}
                    ref={(ref) => {
                        this.waterfall = ref;
                    }}
                    columns={2}
                    infinite={true}
                    hasMore={true}
                    renderItem={item => this.renderItem(item)}
                    containerStyle={{ marginLeft: 15, marginRight: 15 }}
                    keyExtractor={(data) => this._keyExtractor(data)}
                    infiniting={(done) => this.infiniting(done)}
                    refreshing={(done) => this.refreshing(done)}
                    renderInfinite={() => this._renderInfinite()}
                />
                {
                    select
                        ?
                        <View style={styles.bottomView}>
                            <TouchableOpacity style={styles.allView} onPress={() => {
                                this._selectedAllAction();
                            }}>
                                <Image style={styles.allImg}
                                       source={allSelected ? res.button.selected_circle_red : res.button.unselected_circle}/>
                                <Text style={styles.all} allowFontScaling={false}>全选</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}/>
                            <TouchableOpacity style={styles.button} onPress={() => this._delete()}>
                                <Text style={styles.delete} allowFontScaling={false}>删除</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: px2dp(12)
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center'
    },
    bottomView: {
        height: px2dp(49) + ScreenUtils.safeBottom,
        paddingBottom: ScreenUtils.safeBottom,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    all: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(10)
    },
    button: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(109),
        height: px2dp(49),
        alignItems: 'center',
        justifyContent: 'center'
    },
    delete: {
        color: '#fff',
        fontSize: px2dp(16)
    },
    select: {
        color: DesignRule.mainColor,
        fontSize: px2dp(15)
    },
    rightButton: {
        width: px2dp(52),
        height: (49),
        alignItems: 'center',
        justifyContent: 'center'
    },
    allImg: {
        marginLeft: px2dp(20),
        height: px2dp(22),
        width: px2dp(22)
    },
    allView: {
        height: px2dp(49),
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectedView: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px2dp(30),
        height: px2dp(30),
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    collectWhat: {
        marginTop: px2dp(15),
        color: '#909090',
        fontSize: px2dp(15)
    },
    goToIndex: {
        marginTop: px2dp(4),
        color: '#909090',
        fontSize: px2dp(12)
    },
    noCollect: {
        marginTop: px2dp(120)
    },
    gotobutton: {
        width: px2dp(115),
        height: px2dp(36),
        borderRadius: px2dp(36) / 2,
        borderColor: '#E60012',
        borderWidth: ScreenUtils.onePixel,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px2dp(20)
    },
    goToText: {
        color: '#E60012',
        fontSize: px2dp(15)
    },
    text: {
        color: '#999',
        fontSize: px2dp(11)
    }
});
