import BasePage from '../../../../BasePage';
import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import UIText from '../../../../components/ui/UIText';
import MineAPI from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import RouterMap, { routePop } from '../../../../navigation/RouterMap';

const arrow_right = res.button.arrow_right;
export default class SelectAreaPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '选择地区'
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            tag: props.navigation.state.params.tag,
            fatherCode: props.navigation.state.params.fatherCode
        };
        this.canBack = true;
    }

    $isMonitorNetworkStatus() {
        return true;
    }

    componentDidMount() {

    }

    _render() {
        return (
            <RefreshFlatList
                ItemSeparatorComponent={this._separator}
                renderItem={this._renderItem}
                isSupportLoadingMore={false}
                url={MineAPI.getAreaList}
                params={{ fatherCode: this.state.fatherCode }}
                handleRequestResult={(response) => {
                    let data = response.data || [];
                    if (this.params.tag === 'street') {
                        data = [{ name: '不选择街道', code: '' }, ...data];
                    }
                    return data;
                }}
            />
        );
    }

    _renderItem = (item) => {
        return <NoMoreClick style={styles.container} onPress={() => this._onItemClick(item.item)}>
            <UIText value={item.item.name} style={styles.blackText}/>
            <Image source={arrow_right} style={{ marginRight: 18, width: 10, height: 15 }} resizeMode={'contain'}/>
        </NoMoreClick>;
    };

    _separator = () => {
        return <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>;
    };

    _onItemClick = (item) => {
        const { setArea, provinceCode, provinceName, cityCode, cityName, areaCode, areaName } = this.props.navigation.state.params || {};
        if (this.state.tag === 'province') {
            // 跳转到市级
            this.$navigate(RouterMap.SelectAreaPage, {
                setArea: setArea,
                tag: 'city',
                provinceCode: item.code,
                provinceName: item.name,
                fatherCode: item.code,
                type: this.params.type
            });
        } else if (this.state.tag === 'city') {
            // 跳转到区级
            this.$navigate(RouterMap.SelectAreaPage, {
                setArea: setArea,
                tag: 'area',
                provinceCode,
                provinceName,
                cityCode: item.code,
                cityName: item.name,
                fatherCode: item.code,
                type: this.params.type
            });
        } else if (this.state.tag === 'area') {
            if (this.params.type === 3) {
                if (this.canBack) {
                    this.canBack = false;
                    routePop(3);
                    let areaText = provinceName + cityName + item.name;
                    setArea && setArea(provinceCode, provinceName, cityCode, cityName, item.code, item.name, '', '', areaText);
                }
                return;
            }
            this.$navigate(RouterMap.SelectAreaPage, {
                setArea: setArea,
                tag: 'street',
                provinceCode,
                provinceName,
                cityCode,
                cityName,
                areaCode: item.code,
                areaName: item.name,
                fatherCode: item.code
            });
        } else if (this.state.tag === 'street') {
            // 回退并刷新
            if (this.canBack) {
                this.canBack = false;
                routePop(4);
                let streetName = item.code === '' ? '' : item.name;
                let areaText = provinceName + cityName + areaName + streetName;
                setArea && setArea(provinceCode, provinceName, cityCode, cityName, areaCode, areaName, item.code, streetName, areaText);
            }
        }
    };
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48
    },
    blackText: {
        fontSize: 15,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 15,
        flex: 1
    }
});
