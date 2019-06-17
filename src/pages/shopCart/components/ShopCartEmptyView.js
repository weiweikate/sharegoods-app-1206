/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huyufeng on 2019/1/3.
 *
 */

'use strict';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, View,  RefreshControl} from 'react-native';
// import { UIText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
// import res from '../res';
import PropTypes from 'prop-types';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from '../../home/model/Modules';
import shopCartEmptyModel from '../model/ShopCartEmptyModel';

@observer
export default class ShopCartEmptyView extends Component {
    st = 0;
    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });
    layoutProvider = new LayoutProvider((i)=>{
        console.log('购物车空视图，布局layout类型索引'+i);
        return this.dataProvider.getDataForIndex(i).type || 0;
    },(type, dim)=>{
        switch (type){


        }
    })

    constructor(props) {
        super(props);
    }

    render() {
        // const { navigateToHome } = this.props;
        const {emptyViewList}  = shopCartEmptyModel
       this.dataProvider =  this.dataProvider.cloneWithRows(emptyViewList);
        return (
            <View style={styles.bgViewStyle}>
                {/*<Image source={res.kongShopCartImg} style={styles.imgStyle} resizeMode={'contain'}/>*/}
                {/*<UIText value={'去添加点什么吧'} style={styles.addSomethingTipStyle}/>*/}
                {/*<UIText value={'快去商城逛逛吧~'} style={styles.topTextStyle}/>*/}
                {/*<TouchableOpacity onPress={navigateToHome}>*/}
                    {/*<View style={styles.bottomTextBgViewStyle}>*/}
                        {/*<UIText value={'去逛逛'} style={styles.bottomTextStyle}/>*/}
                    {/*</View>*/}
                {/*</TouchableOpacity>*/}
                <RecyclerListView
                    ref={(ref) => {
                        this.recyclerListView = ref;
                    }}
                    style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                    refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                    onRefresh={this._onRefresh.bind(this)}
                                                    colors={[DesignRule.mainColor]}/>}
                    onEndReached={()=>{}}
                    onEndReachedThreshold={ScreenUtils.height / 3}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    onScrollBeginDrag={() => {}}
                    showsVerticalScrollIndicator={false}
                    onScroll={()=>{}}
                    renderFooter={() => {return null}
                    }
                />
            </View>
        );
    }
}
ShopCartEmptyView.propTypes = {
    //去逛逛
    navigateToHome: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    bgViewStyle: {
        backgroundColor: DesignRule.bgColor,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgStyle: {
        height: 115,
        width: 115
    },
    topTextStyle: {
        marginTop: 10,
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    },
    bottomTextBgViewStyle: {
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: DesignRule.mainColor,
        borderWidth: 1,
        borderRadius: 18,
        width: 115,
        height: 36
    },
    bottomTextStyle: {
        color: DesignRule.mainColor,
        fontSize: 15
    },
    addSomethingTipStyle: {
        marginTop: 10,
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    }

});
