/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/12/25.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text } from '../../../../components/ui';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder';
import MineAPI from '../../api/MineApi';
import res from '../../res';

const {
    bg_fans_item
} = res.homeBaseImg;
type Props = {};
export default class MyShowFansPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            activatedNum: null,
            fansNum: null
        };
    }

    $navigationBarOptions = {
        title: '我的秀迷',
        show: true// false则隐藏导航
    };


    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        MineAPI.getShowFansCount().then((data) => {
            if (data.data) {
                this.setState({
                    activatedNum: data.data.showFansCount
                });
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
        });

    }

    _listItemRender = ({ item }) => {
        let noActivate = (
            <View style={[styles.typeWrapper, {
                borderColor: DesignRule.mainColor,
                borderWidth: 1,
                backgroundColor: '#fcf5f9'
            }]}>
                <Text style={styles.activateTextStyle}>
                    未激活
                </Text>
            </View>
        );
        let activate = (
            <View style={[styles.typeWrapper, { borderColor: '#e0e1e0', borderWidth: 1, backgroundColor: '#f1f1f1' }]}>
                <Text style={styles.noActivateTextStyle}>
                    已激活
                </Text>
            </View>
        );
        const uri = { uri: item.headImg };
        return (
            <ImageBackground resizeMode={'stretch'} source={bg_fans_item} style={styles.itemWrapper}>
                <View style={[styles.fansIcon,{ overflow: 'hidden'}]}>
                    <ImageLoad style={styles.fansIcon} cacheable={true} source={uri}/>
                </View>
                <Text style={styles.fansNameStyle}>
                    {item.nickname}
                </Text>
                {item.status ? activate : noActivate}
            </ImageBackground>
        );
    };

    _headerRender = () => {
        if (this.state.activatedNum && this.state.fansNum) {
            return (
                <Text style={styles.headerTextWrapper}>
                    激活人数：<Text
                    style={{ color: DesignRule.textColor_mainTitle_222, fontSize: 18 }}>{this.state.activatedNum}</Text>/<Text>{this.state.fansNum}</Text>
                </Text>
            );
        } else {
            return null;
        }
    };

    _render() {
        return (
            <View style={styles.container}>

                {/*{this._listItemRender()}*/}
                <RefreshFlatList
                    style={styles.container}
                    url={MineAPI.getShowFansList}
                    renderItem={this._listItemRender}
                    // totalPageNum={(result)=> {return result.data.isMore ? 10 : 0}}
                    renderHeader={this._headerRender}
                    onStartRefresh={this.loadPageData}
                    handleRequestResult={(result) => {
                        this.setState({
                            fansNum: result.data.totalNum
                        });
                        return result.data.data;
                    }}

                    // ref={(ref) => {this.list = ref}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemWrapper: {
        height: 66*240/195,
        width: (ScreenUtils.width - DesignRule.margin_page * 2)*1071/1030,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: 3,
        alignSelf: 'center',
    },
    fansIcon: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    fansNameStyle: {
        color: DesignRule.textColor_mainTitle_222,
        fontSize: DesignRule.fontSize_mainTitle,
        flex: 1,
        marginLeft: 8
    },
    typeWrapper: {
        width: 55,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noActivateTextStyle: {
        fontSize: DesignRule.fontSize_20,
        color: DesignRule.textColor_secondTitle
    },
    activateTextStyle: {
        fontSize: DesignRule.fontSize_20,
        color: DesignRule.mainColor
    },
    headerTextWrapper: {
        marginLeft: DesignRule.margin_page,
        marginTop: 12
    }

});
