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
// import HomeAPI from '../api/HomeAPI';
import TotalTopicDataModel from './model/SubTopicModel';
import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';
import PropTypes from 'prop-types';
import SubSwichView from './components/SubSwichView';
import TopicAPI from './api/TopicApi';
import bridge from '../../utils/bridge';
import user from '../../model/user';

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
            selectNav: 0
        };
    }

    componentDidMount() {
        // const {linkTypeCode} = this.params;
        // this.dataModel.loadTopicData(linkTypeCode);
        this.dataModel.loadTopicData('ZT20180002');
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
                        backgroundColor: '#FFFFFF'
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
                        // alignItems: 'flex-start',
                        backgroundColor: '#FFFFFF',
                        width: ScreenUtils.width
                    }
                }
            >
                {section.key !== 'one' ? <ActivityOneView imageUrl={section.bannerImg}/> : null}

                {
                    sectionListData.map((itemData, itemIndex) => {
                        return <OpenPrizeItemView
                            itemData={itemData}
                            followAction={() => {
                                this._followActionClick(itemData, sectionIndex, itemIndex);
                            }
                            }
                            itemClick={(itemData) => {
                                this.$navigate('topic/TopicDetailPage', { activityCode: itemData.prodCode });
                            }
                            }
                        />;
                    })
                }
            </View>
        );
    };

    /**
     * 取消关注和关注
     * @param itemData
     * @param sectionIndex
     * @param itemIndex
     * @private
     */
    _followActionClick = (itemData, sectionIndex, itemIndex) => {

        let type = itemData.notifyFlag ? 0 : 1;
        let param = {
            'activityId': itemData.id,
            'activityType': itemData.productType,
            'type': type,
            'userId': user.id
        };
        TopicAPI.followAction(
            param
        ).then(result => {

            bridge.$toast(result.msg);
            let section = this.dataModel.sectionDataList[sectionIndex] || [];
            section.data[itemIndex].notifyFlag = type;
            //重新赋值
            this.dataModel.sectionDataList[sectionIndex] = section;

        }).catch(error => {
            bridge.$toast(error.msg);

        });

    };


    _render() {
        const sectionList = this.dataModel.sectionDataList.slice() || [];
        let sectionData = [];
        if (sectionList.length > 0) {
            sectionData = sectionList[this.state.selectNav].sectionDataList || [];
        } else {

        }
        const { imgUrl } = this.dataModel;
        // const {linkTypeCode} = this.params;
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
        const { linkTypeCode } = this.params;
        if (linkTypeCode.search('ZT') != -1) {
            return 0;
        } else {
            return 1;
        }
    };
}


DownPricePage.propTypes = {
    //专题code
    linkTypeCode: PropTypes.string.isRequired
};
const Styles = StyleSheet.create({
    list: {
        flexDirection: 'row',//设置横向布局
        flexWrap: 'wrap',  //设置换行显示
        backgroundColor: '#FFFFFF'
    },
    itemBgStyle: {
        width: ScreenUtils.width / 2,
        height: ScreenUtils.width / 2 + 100,
        backgroundColor: ColorUtil.Color_f7f7f7,
        padding: 8,
        paddingBottom: 0
    }
});
