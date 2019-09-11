import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShopCartAPI from '../../../shopCart/api/ShopCartApi';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ShopCartEmptyCell from '../../../shopCart/components/ShopCartEmptyCell';
import { routePush } from '../../../../navigation/RouterMap';
import RouterMap from '../../../../navigation/RouterMap';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';

const { px2dp } = ScreenUtils;
const Cell_Height = px2dp(248);

export default class RecommendProductView extends React.Component {
    state = {
        dataList: []
    };

    componentDidMount() {
        ShopCartAPI.recommendProducts({
            page: 1,
            pageSize: 10
        }).then(result => {
            const tempArr = (result.data || []).map((goodItem) => {
                return {
                    ...goodItem,
                    height: Cell_Height,
                    imageHeight: px2dp(168)
                };
            });
            this.setState({
                dataList: tempArr
            });
        }).catch(error => {
        });
    }

    render() {
        const { dataList } = this.state;
        const { recommendScene } = this.props;
        if (dataList.length === 0) {
            return null;
        }
        return (
            <View>
                <View style={styles.headerView}>
                    <View style={styles.headerRed}/>
                    <MRText style={styles.headerText}>为你推荐</MRText>
                </View>
                <View style={styles.container}>
                    {
                        dataList.map((item, index) => {
                            return <ShopCartEmptyCell key={index} recommendScene={recommendScene} selectedIndex={index}
                                                      itemData={item} onClick={() => {
                                routePush(RouterMap.ProductDetailPage, { productCode: item.prodCode });
                            }}/>;
                        })
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        flexDirection: 'row', justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    headerView: {
        flexDirection: 'row', alignItems: 'center', height: 47
    },
    headerRed: {
        marginLeft: 15, marginRight: 8, borderRadius: 1,
        width: 2, height: 8, backgroundColor: DesignRule.mainColor
    },
    headerText: {
        fontWeight: '500',
        fontSize: 16, color: DesignRule.textColor_secondTitle
    }

});
