/**
 * huchao
 * 填写退货物流
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    SectionList
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText
} from '../../../components/ui';
import UIImage from '@mr/image-placeholder';
import OrderApi from '../api/orderApi';
import DesignRule from '../../../constants/DesignRule';

export default class SelectLogisticsCompanyPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            logisticsCompanys: []
        };
        this._bindFunc();
    }

    _bindFunc() {
        this._renderItem = this._renderItem.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
        this._onPressItem = this._onPressItem.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
        this.handleNetData = this.handleNetData.bind(this);
    }

    loadPageData() {
        this.$loadingShow();
        OrderApi.findAllExpress().then((result) => {
            this.$loadingDismiss();
            this.handleNetData(result.data);
        }).catch((error) => {
            this.$loadingDismiss();
            this.$toastShow(error.msg || '操作失败，请重试');
        });
    }

    handleNetData(pageData) {
        // hotVo	Array
        let hotVoIndex = -1;
        let index = -1;
        let logisticsCompanys = Object.keys(pageData).map((key) => {
            index++;
            let data = pageData[key];
            if (key === 'hotVo') {
                key = '常用物流';
                hotVoIndex = index;
            }
            return { title: key, data: data };
        });
        if (hotVoIndex !== -1) {
            let hotVo = logisticsCompanys[hotVoIndex];
            logisticsCompanys.splice(hotVoIndex, 1);
            logisticsCompanys.unshift(hotVo);
        }
        this.setState({ logisticsCompanys });
    }

    componentDidMount() {
        this.loadPageData();
    }

    $navigationBarOptions = {
        title: '选择物流公司',
        show: true// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    _render() {
        return (
            <View style={styles.container}>
                <SectionList
                    renderItem={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    sections={this.state.logisticsCompanys}
                    keyExtractor={(item, index) => item.name + index}
                    ItemSeparatorComponent={() => <View
                        style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg }}/>}
                />
            </View>
        );
    }

    _renderItem({ item, index, section }) {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this._onPressItem(item, index, section);
            }}>
                <View style={styles.item_container}>
                    <UIImage source={{ url: 'https://ws4.sinaimg.cn/large/006tNc79gy1fsnh4ez029j3058056myq.jpg' }}
                             style={styles.item_image}
                    />
                    <UIText value={item.name}
                            style={styles.item_title}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderSectionHeader({ section: { title } }) {
        return (
            <View style={styles.header_container}>
                <UIText value={title}
                        style={styles.header_title}
                />
            </View>
        );
    }

    _onPressItem(item, index, section) {
        this.$navigateBack();
        this.params.callBack && this.params.callBack(item.name, item.code);
    }
}


const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: DesignRule.bgColor
        },
        item_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            height: 60,
            alignItems: 'center'
        },
        item_image: {
            height: 33,
            width: 33,
            marginLeft: 17
        },
        item_title: {
            color: DesignRule.textColor_mainTitle,
            fontSize: 15,
            marginLeft: 17
        },
        header_container: {
            backgroundColor: DesignRule.bgColor,
            flexDirection: 'row',
            height: 27,
            alignItems: 'center'
        },
        header_title: {
            color: DesignRule.textColor_mainTitle,
            fontSize: 16,
            marginLeft: 17
        }
    }
);
