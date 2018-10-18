import React from 'react';
import BasePage from '../../BasePage';

import {
    View,
    StyleSheet,
    ScrollView
} from 'react-native';
import { observer } from 'mobx-react';
import ColorUtil from '../../utils/ColorUtil';
import { ActivityOneView } from './components/SbSectiontHeaderView';
import ScreenUtils from '../../utils/ScreenUtils';
import SbOpenPrizeHeader from './components/SbOpenPrizeHeader';
import OpenPrizeItemView from './components/OpenPrizeItemView';
import TotalTopicDataModel from './model/SubTopicModel';
import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';
import SubSwichView from './components/SubSwichView';
import TopicItemView from './components/TopicItemView';

@observer
export default class DownPricePage extends BasePage {

    $navigationBarOptions = {
        title: '专题',
        show: true
    };

    constructor(props) {
        super(props);
        this.dataModel = new TotalTopicDataModel();
        this.state = {
            selectNav: 0,
            // linkTypeCode: 'ZT20180002'
        };
    }

    componentDidMount() {
        const { linkTypeCode } = this.params;
        console.log('-----' + linkTypeCode);
        this.dataModel.loadTopicData(linkTypeCode);
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
                        backgroundColor: '#F7F7F7'
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
                        backgroundColor: '#F7F7F7',
                        width: ScreenUtils.width
                    }
                }
            >
                {section.key !== 'one' ? <ActivityOneView imageUrl={section.bannerImg}/> : null}

                {
                    sectionListData.map((itemData, itemIndex) => {
                        return (
                            this._getTopicType() === 1 ?
                                <OpenPrizeItemView
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
        if (itemData.productType === 99) {
            this.$navigate('home/product/ProductDetailPage', {
                productId: itemData.productId,
                productCode: itemData.prodCode
            });
        } else if (itemData.productType === 1 || itemData.productType === 2 || itemData.productType === 3) {
            this.$navigate('topic/TopicDetailPage', {
                activityCode: itemData.prodCode,
                activityType: itemData.productType
            });
        } else if (itemData.productType === 5) {
            this.$navigate('topic/TopicPage', {
                linkTypeCode: itemData.prodCode
            });
        }
    };
    _render() {
        const sectionList = this.dataModel.sectionDataList.slice() || [];
        let sectionData = [];
        if (sectionList.length > 0) {
            sectionData = sectionList[this.state.selectNav].sectionDataList || [];
        } else {

        }
        const { imgUrl,name } = this.dataModel;
        this.$NavigationBarResetTitle(name || '专题')
        return (
            <ScrollView
                alwaysBounceVertical={true}
                contentContainerStyle={Styles.list}
                style={{
                    width: ScreenUtils.width
                }}
            >
                <PreLoadImage
                    imageUri={imgUrl}
                    style={{
                        width: ScreenUtils.width,
                        height: ScreenUtils.width * 188 / 375
                    }}
                />

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
     * 1 秒杀
     * 2 降价拍
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
        backgroundColor: '#F7F7F7'
    },
    itemBgStyle: {
        width: ScreenUtils.width / 2,
        height: ScreenUtils.width / 2 + 100,
        backgroundColor: ColorUtil.Color_f7f7f7,
        padding: 8,
        paddingBottom: 0
    }
});
