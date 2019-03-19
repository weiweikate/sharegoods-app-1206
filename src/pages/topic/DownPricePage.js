import React from 'react';
import BasePage from '../../BasePage';

import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    InteractionManager
} from 'react-native';
import { observer } from 'mobx-react';
import { ActivityOneView, TopBannerView } from './components/SbSectiontHeaderView';
import ScreenUtils from '../../utils/ScreenUtils';
import SbOpenPrizeHeader from './components/SbOpenPrizeHeader';
import OpenPrizeItemView from './components/OpenPrizeItemView';
import TotalTopicDataModel from './model/SubTopicModel';
import SubSwichView from './components/SubSwichView';
import TopicItemView from './components/TopicItemView';
import DesignRule from '../../constants/DesignRule';
import { getTopicJumpPageParam } from './model/TopicMudelTool';
import { MRText } from "../../components/ui";
import CommShareModal from "../../comm/components/CommShareModal";
import apiEnvironment from "../../api/ApiEnvironment";
import user from '../../model/user'

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

        InteractionManager.runAfterInteractions(() => {
            //初次进入loading
            if (this.dataModel.isShowLoading) {
                this.$loadingShow('加载中');
                this.dataModel.isShowLoading = false;
            }
        });
    }

    $NavBarRenderRightItem = () => {
        return (
            <MRText
                onPress={() => {
                    this.shareModal.open();
                }}
            >
                分享
            </MRText>
        )
    }

    componentDidMount() {

        this.didBlurSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { linkTypeCode } = this.params;
                console.log('-----' + linkTypeCode);
                setTimeout(() => {
                    this.dataModel.loadTopicData(linkTypeCode);
                })
            }
        );
    }
    componentWillUnmount() {
        this.$loadingDismiss();
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
     * @param section
     * @param sectionIndex
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
        const { linkTypeCode } = this.params;
        this.$NavigationBarResetTitle(this.dataModel.name);
        return (
            <ScrollView
                alwaysBounceVertical={true}
                contentContainerStyle={Styles.list}
                showsVerticalScrollIndicator={false}
                style={{
                    width: ScreenUtils.width,
                    flex: 1
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
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'miniProgramWithCopyUrl'}
                                webJson={{
                                    hdImageURL:this.dataModel.imgUrl || '',
                                    title: this.dataModel.topicTitle,
                                    dec: '属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    linkUrl: apiEnvironment.getCurrentH5Url() + '/subject/' + linkTypeCode,
                                    thumImage: 'logo.png'
                                }}
                                miniProgramJson={{
                                    hdImageURL:this.dataModel.imgUrl || '',
                                    title: this.dataModel.topicTitle,
                                    dec: '属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    thumImage: 'logo.png',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/subject/${linkTypeCode}?upuserid=${user.code || ''}`,
                                    miniProgramPath: `/pages/index/index?type=5&id=${linkTypeCode}&inviteId=${user.code || ''}`
                                }}
                />
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
        backgroundColor: DesignRule.bgColor,
        paddingBottom: 20
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
