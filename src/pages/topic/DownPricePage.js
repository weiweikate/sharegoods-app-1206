import React from 'react';
import BasePage from '../../BasePage';

import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import { observer } from 'mobx-react';
import { ActivityOneView,TopBannerView } from './components/SbSectiontHeaderView';
import ScreenUtils from '../../utils/ScreenUtils';
import SbOpenPrizeHeader from './components/SbOpenPrizeHeader';
import OpenPrizeItemView from './components/OpenPrizeItemView';
import TotalTopicDataModel from './model/SubTopicModel';
import SubSwichView from './components/SubSwichView';
import TopicItemView from './components/TopicItemView';
import DesignRule from '../../constants/DesignRule';
// import ImageLoad from '@mr/image-placeholder'
import { getTopicJumpPageParam } from './model/TopicMudelTool';
import { track } from '../../utils/SensorsTrack';

const { statusBarHeight } = ScreenUtils;
@observer
export default class DownPricePage extends BasePage {

    $navigationBarOptions = {
        show: true
    };

    constructor(props) {
        super(props);
        this.dataModel = new TotalTopicDataModel();
        this.state = {
            selectNav: 0
        };
    }

    componentDidMount() {
        // this.$NavigationBarResetTitle(this.dataModel.name)
        this.didBlurSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { linkTypeCode } = this.params;
                console.log('-----' + linkTypeCode);
                this.dataModel.loadTopicData(linkTypeCode);
            }
        );
        track('$AppViewScreen', { '$screen_name': 'DownPricePage','$title':'专题' });
    }

    /**
     * 渲染底部组列表
     * @param sections 所有组数据
     * @returns {*}
     * @private
     */
    _renderBottomListView(sections) {
        const sectionsData = sections.slice() || [];
        return (
            <View
                style={
                    {
                        flexDirection: 'row',//设置横向布局
                        flexWrap: 'wrap',  //设置换行显示
                        // alignItems: 'flex-start',
                        backgroundColor: DesignRule.bgColor
                    }
                }
            >
                {
                    sectionsData.map((section, sectionIndex) => {
                        return this._renderSection(section, sectionIndex);
                    })
                }
            </View>
        );
    }

    _onRefresh = () => {
        const { linkTypeCode } = this.params;
        this.dataModel.loadTopicData(linkTypeCode);
    };

    /**
     * 渲染具体组
     * @param section 组数据
     * @returns {*}
     * @private
     */

    _renderSection = (section, sectionIndex) => {
        const sectionListData = section.data.slice() || [];
        return (
            <View
                style={
                    {
                        flexDirection: 'row',//设置横向布局
                        flexWrap: 'wrap',  //设置换行显示
                        backgroundColor: DesignRule.bgColor,
                        // backgroundColor:'red',
                        width: ScreenUtils.width - 20,
                        marginLeft: 10
                    }
                }
            >
                {section.key !== 'one' ?
                    <ActivityOneView imageUrl={section.bannerImg} ratio={section.aspectRatio}/> : null}

                {
                    sectionListData.map((itemData, itemIndex) => {
                        return (
                            this._getTopicType() === 1 ?
                                <OpenPrizeItemView
                                    key={itemIndex}
                                    itemData={itemData}
                                    itemClick={(itemData) => {
                                        this._itemActionClick(itemData);
                                    }
                                    }
                                />
                                :
                                <TopicItemView
                                    key={itemIndex}
                                    itemData={itemData}
                                    numOfColum={this._getColumNum()}
                                    itemClickAction={
                                        () => {
                                            this._itemActionClick(itemData);
                                        }
                                    }
                                />
                        );
                    })
                }
            </View>
        );
    };
    /**
     *
     * @param itemData
     * @private
     */
    _itemActionClick = (itemData) => {
        // if (itemData.productType === 99) {
        //     this.$navigate('home/product/ProductDetailPage', {
        //         productId: itemData.productId,
        //         productCode: itemData.prodCode,
        //         preseat:'专题列表页'
        //     });
        // } else if (itemData.productType === 1 || itemData.productType === 2 || itemData.productType === 3) {
        //     this.$navigate('topic/TopicDetailPage', {
        //         activityCode: itemData.prodCode,
        //         activityType: itemData.productType,
        //         preseat:'专题列表页'
        //     });
        // } else if (itemData.productType === 5) {
        //     this.$navigate('topic/DownPricePage', {
        //         linkTypeCode: itemData.prodCode
        //     });
        // }
        const pageObj = getTopicJumpPageParam(itemData);
        this.$navigate(pageObj.pageRoute, pageObj.params);
    };

    _render() {
        const sectionList = this.dataModel.sectionDataList.slice() || [];
        let sectionData = [];
        if (sectionList.length > 0) {
            sectionData = sectionList[this.state.selectNav].sectionDataList || [];
        }
        const { imgUrl } = this.dataModel;
        this.$NavigationBarResetTitle(this.dataModel.name);
        return (
            <ScrollView
                alwaysBounceVertical={true}
                contentContainerStyle={Styles.list}
                style={{
                    width: ScreenUtils.width
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.dataModel.isRefresh}
                        onRefresh={this._onRefresh.bind(this)}
                        progressViewOffset={statusBarHeight + 44}
                        colors={[DesignRule.mainColor]}
                        title="下拉刷新"
                        tintColor={DesignRule.textColor_instruction}
                        titleColor={DesignRule.textColor_instruction}
                    />
                }
            >
                {/*<ImageLoad style={Styles.topBannerImageStyle} source={{ uri: imgUrl ? imgUrl : '' }}/>*/}
                <TopBannerView imageUrl={imgUrl} ratio={0.5}/>
                {
                    this._getTopicType() === 0
                        ?
                        <SubSwichView
                            headerData={this.dataModel}
                            navItemClick={(index) => {
                                this.setState({
                                    selectNav: index
                                });
                            }
                            }
                        />
                        :
                        <SbOpenPrizeHeader
                            headerData={this.dataModel}
                            navItemClick={(index, item) => {
                                //自导航点击事件
                                this.setState({
                                    selectNav: index
                                });
                            }}
                        />

                }
                {
                    this._renderBottomListView(sectionData)
                }
            </ScrollView>
        );
    }

    /**
     * 获取类型
     * 0 普通专题
     * 1 秒杀 降价拍
     * */
    _getTopicType = () => {
        if (this.dataModel.templateId === 5 ||
            this.dataModel.templateId === 6) {
            return 1;
        } else {
            return 0;
        }
    };
    /**
     * 获取专题模板列数
     * @returns {number}
     * @private
     */
    _getColumNum = () => {
        if (this.dataModel.templateId === 3 ||
            this.dataModel.templateId === 4) {
            return 3;
        } else {
            return 2;
        }
    };
}

const Styles = StyleSheet.create({
    list: {
        flexDirection: 'row',//设置横向布局
        flexWrap: 'wrap',  //设置换行显示
        backgroundColor: DesignRule.bgColor
    },
    itemBgStyle: {
        width: ScreenUtils.width / 2,
        height: ScreenUtils.width / 2 + 100,
        backgroundColor: DesignRule.bgColor,
        padding: 8,
        paddingBottom: 0
    },
    topBannerImageStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.width * 7 / 15
    }
});
