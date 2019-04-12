/**
 * @author xzm
 * @date 2019/4/3
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import { TrackApi } from '../../../../utils/SensorsTrack';
import ToSearchComponent from './Component/ToSearchComponent';
import RouterMap from '../../../../navigation/RouterMap';
import res from '../../res'
const { px2dp } = ScreenUtils;
const {next_icon,icon_v1,icon_v2,icon_v3,icon_v4,icon_v5} = res.myData;

type Props = {};
export default class MainShowFansPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            fansNum: null,
            levelList: []
        };
    }

    $navigationBarOptions = {
        title: '我的秀迷',
        show: true
    };

    componentDidMount() {
        MineAPI.getFansLevelList().then(
            (data) => {
                if (data.data) {
                    TrackApi.ViewMyFans({ fanAmount: data.data.total });
                    this.setState({
                        fansNum: data.data.total,
                        levelList: data.data.userFansLevelList || []
                    });
                }
            }
        ).catch((error) => {

        });
    }

    _headerRender = () => {
        if (this.state.fansNum || this.state.fansNum === 0) {
            return (
                <Text style={styles.headerTextWrapper}>
                    {`秀迷人数： ${this.state.fansNum}人`}
                </Text>
            );
        } else {
            return null;
        }
    };

    itemRender(data, index) {
        let levelIcon ;
        if(data.vname === 'v1'){
            levelIcon = icon_v1
        }else if(data.vname === 'v2'){
            levelIcon = icon_v2
        }else if(data.vname === 'v3'){
            levelIcon = icon_v3
        }else if(data.vname === 'v4'){
            levelIcon = icon_v4
        }else if(data.vname === 'v5'){
            levelIcon = icon_v5
        }else {
            return null;
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate(RouterMap.GroupShowFansPage, data);
            }}>
                <View key={'item' + index} style={styles.groupWrapper}>
                    <Text style={styles.levelName}>
                        {`${data.name}品鉴官`}
                    </Text>
                    <Image source={levelIcon} style={styles.levelIcon}/>
                    <Text style={styles.numTextStyle}>
                        {data.count ? `${data.count}人` : '0人'}
                    </Text>
                    <Image source={next_icon} style={styles.nextIcon} resizeMode={'contain'}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    allLevelRender = () => {
        return this.state.levelList.map((data, index) => {
            return this.itemRender(data, index);
        });
    };


    _render() {
        return (
            <View style={styles.container}>
                <ToSearchComponent navigate={this.$navigate}/>
                {this._headerRender()}
                <ScrollView showsVerticalScrollIndicator={false} h>
                    {this.allLevelRender()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemWrapper: {
        height: 66 * 240 / 195,
        width: (ScreenUtils.width - DesignRule.margin_page * 2) * 1071 / 1030,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: DesignRule.margin_page + 5,
        marginTop: 3,
        alignSelf: 'center'
    },
    fansIcon: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    fansNameStyle: {
        color: DesignRule.textColor_mainTitle_222,
        fontSize: DesignRule.fontSize_mainTitle,
        marginLeft: 8,
        paddingVertical: 5
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
        marginTop: 15,
        fontSize: DesignRule.fontSize_threeTitle,
        color: DesignRule.textColor_secondTitle
    },
    levelWrapper: {
        borderRadius: 2,
        height: 15,
        justifyContent: 'center',
        borderWidth: 1,
        marginLeft: 15,
        borderColor: DesignRule.mainColor,
        paddingHorizontal: 12
    },
    levelTextStyle: {
        color: DesignRule.mainColor,
        includeFontPadding: false,
        fontSize: DesignRule.fontSize_20
    },
    groupWrapper: {
        height: px2dp(44),
        width: DesignRule.width - DesignRule.margin_page * 2,
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(10),
        alignSelf: 'center',
        marginTop: px2dp(15)
    },
    levelName: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    levelIcon: {
        width: px2dp(24),
        height: px2dp(16),
        marginLeft: px2dp(5),
    },
    numTextStyle: {
        fontSize: px2dp(12),
        color: DesignRule.textColor_instruction,
        flex: 1,
        textAlign: 'right'
    },
    nextIcon: {
        width: px2dp(4),
        height: px2dp(9),
        marginLeft:px2dp(5)
    }
});
