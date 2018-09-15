import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Modal
} from 'react-native';

import BasePage from '../../../BasePage';
import DetailHeaderView from './components/DetailHeaderView';
import DetailSegmentView from './components/DetailSegmentView';
import DetailBottomView from './components/DetailBottomView';
import SelectionPage from './SelectionPage';
import DateUtils from '../../../utils/DateUtils';
import HomeAPI from '../api/HomeAPI';

export default class ProductDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: {},

            product: {},
            specMap: [],
            paramList: [],
            priceList: []
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this._productList();
    }

    //数据
    _productList = () => {
        this.$loadingShow();
        HomeAPI.productList({
            keyword: this.params.keywords,
            pageSize: 10,
            page: this.state.page,
            sortModel: this.state.sortModel,
            sortType: this.state.sortType,
            time: DateUtils.formatDate(new Date())
        }).then((data) => {
            console.log(data.data);
            this.$loadingDismiss();
            this.setState({
                productList: data.data.data
            });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.message);
        });
    };

    //segment 详情0 参数1 选项
    _segmentViewOnPressAtIndex = (index) => {

    };

    //去购物车
    _bottomViewGoGWC = () => {

    };

    //立即购买
    _bottomViewBuy = () => {
        this.setState({
            modalVisible: true
        });
    };

    //加入购物车
    _bottomViewAddToGWC = () => {
        this.setState({
            modalVisible: true
        });
    };


    //选择规格确认
    _selectionViewConfirm = () => {

    };

    //选择规格关闭
    _selectionViewClose = () => {
        this.setState({
            modalVisible: false
        });
    };


    _renderListHeader = () => {
        return (<DetailHeaderView data={this.state.data}/>);
    };

    _renderSectionHeader = () => {
        return <DetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = ({}) => {
        return <View style={{ height: 1000, backgroundColor: '#EEEEEE' }}></View>;
    };

    _render() {
        return (
            <View style={styles.container}>
                <SectionList ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             showsVerticalScrollIndicator={false}
                             sections={[{ data: [{}] }]}/>
                <DetailBottomView bottomViewGoGWC={this._bottomViewGoGWC} bottomViewBuy={this._bottomViewBuy}
                                  bottomViewAddToGWC={this._bottomViewAddToGWC}/>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <SelectionPage selectionViewConfirm={this._selectionViewConfirm}
                                   selectionViewClose={this._selectionViewClose}/>
                </Modal>

            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

