/**
 * Created by zhoujianxin on 2019/5/9.
 * @Desc
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react';
import RefreshFlatList from '../../comm/components/RefreshFlatList';
import res from './res';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import { showActiveModules } from './Show';
import ShowApi from './ShowApi';
import PreLoadImage from '../../components/ui/preLoadImage/PreLoadImage';

import { MRText } from '../../components/ui';
import EmptyUtils from '../../utils/EmptyUtils';

@observer
export default class ShowActivityView extends Component {
    constructor(props) {
        super(props);
    }

    clickItem = (item, index) => {
        this.props.clickItem && this.props.clickItem(index, item);
    };

    replaceItemData = (index, data) => {
        let itemData = JSON.parse(data);
        let dataSource = this.List && this.List.getSourceData();
        dataSource[index] = itemData;
        this.List && this.List.changeData(dataSource);
    };

    replaceData = (index, data) => {

    };

    onListViewScroll = (event) => {
        let offsetY = event.nativeEvent.contentOffset.y;
        this.item0 && this.item0.measure((fx, fy, w, h, left, top) => {
            if (offsetY > ScreenUtils.height - 100) {
                showActiveModules.setTopBtnHide(true);
            } else {
                showActiveModules.setTopBtnHide(false);
            }
        });
    };

    scrollToTop = () => {
        if (showActiveModules.topBtnHide) {
            this.List && this.List.scrollToTop();
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <RefreshFlatList
                    ref={(ref) => {
                        this.List = ref;
                    }}
                    style={styles.container}
                    url={ShowApi.showActivity}
                    renderItem={this.renderItem}
                    params={{ spreadPosition: 4 }}
                    renderError={this.renderError}
                    onScroll={this.onListViewScroll}
                />
            </View>
        );
    }

    renderError = () => {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.errContainer}>
                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center' }}
                                      onPress={() => {
                                          this.List && this.List._onRefresh();
                                      }}>
                        <Image source={res.placeholder.no_data_img}
                               style={{ width: DesignRule.autoSizeWidth(120), height: DesignRule.autoSizeWidth(120) }}
                               resizeMode={'contain'}/>
                        <Text style={{
                            marginTop: 10,
                            color: '#666666',
                            fontSize: DesignRule.fontSize_mediumBtnText
                        }} allowFontScaling={false}>
                            重新加载
                        </Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        );
    };

    hotNum = (num) => {
        if (num) {
            if (num <= 999) {
                return num;
            } else if (num < 10000) {
                return `${parseInt(num / 1000)}k+`;
            } else if (num < 100000) {
                return `${parseInt(num / 10000)}W+`;
            } else {
                return '10W+';
            }
        }
        return 0;
    };

    renderItem = ({ item, index }) => {
        let imageUrl = '';
        let len = EmptyUtils.isEmptyArr(item.resource) ? 0 : item.resource.length;
        for (let i = 0; i < len; i++) {
            if (item.resource[i].type === 1) {
                imageUrl = item.resource[i].baseUrl || '';
                break;
            }
        }
        return (
            <TouchableWithoutFeedback key={'row' + index} onPress={() => this.clickItem(item, index)}>
                <View style={styles.itemBgStyle}
                      ref={(ref) => {
                          this['item' + index] = ref;
                      }}
                >
                    <Image style={styles.itemImgStyle} source={{ uri: imageUrl.length > 0 ? imageUrl : '111.png' }}/>
                    {ScreenUtils.isIOS ?
                        <Text style={styles.contentStyle}
                              numberOfLines={2}>
                            {item.title}
                        </Text> :
                        <MRText style={styles.contentStyle}
                                numberOfLines={2}>
                            {item.title}
                        </MRText>
                    }
                    {item.showType != 4 ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                            <PreLoadImage
                                imageUri={item.userInfoVO && item.userInfoVO.userImg}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12
                                }}
                                defaultImage={res.placeholder.noHeadImage}
                                errImage={res.placeholder.noHeadImage}
                            />
                            <Text style={{ flex: 1, marginLeft: 5, color: '#666666', fontSize: DesignRule.fontSize_22 }}
                                  numberOfLines={1}>{item.userInfoVO && item.userInfoVO.userName}
                            </Text>
                            <Image style={{ width: 12, height: 16, marginLeft: 10 }} source={res.hotIcon}/>
                            <Text style={{ marginLeft: 8, color: '#666666', fontSize: DesignRule.fontSize_22 }}>
                                {this.hotNum(item.hotCount)}
                            </Text>
                        </View> : <View style={{ margin: 7 }}/>
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7'
    },
    errContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    titleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 10,
        textAlign: 'center'
    },
    itemBgStyle: {
        marginLeft: 15,
        marginTop: 10,
        marginRight: 15,
        backgroundColor: 'white',
        // height:247,
        borderRadius: 5,
        overflow: 'hidden'
    },
    itemImgStyle: {
        height: (ScreenUtils.width - 30) * 190 / 345,
        width: ScreenUtils.width - 30,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        overflow: 'hidden'
    },
    btnText: {
        fontSize: 15,
        color: DesignRule.mainColor,
        textAlign: 'center'
    },
    btnStyle: {
        height: 36,
        width: 115,
        borderRadius: 18,
        borderColor: DesignRule.bgColor_btn,
        borderWidth: DesignRule.lineHeight * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    contentStyle: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        fontSize: DesignRule.fontSize_24,
        color: '#333333'
    }
});
