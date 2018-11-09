import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import xiangqing_btn_gouwuche_nor from '../res/xiangqing_btn_gouwuche_nor.png';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ShopCartStore from '../../../shopCart/model/ShopCartStore';
import { observer } from 'mobx-react';
import DesignRule from 'DesignRule';


@observer
export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<View style={{ height: ScreenUtils.isIOSX ? 49 + 33 : 49, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <TouchableOpacity style={{ width: 63, justifyContent: 'center', alignItems: 'center' }}
                                  onPress={() => this.props.bottomViewAction('goGwc')}>
                    <Image style={{ marginBottom: 6 }} source={xiangqing_btn_gouwuche_nor}/>
                    <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction }}>购物车</Text>
                    {ShopCartStore.getAllGoodsClassNumber === 0 ? null : <View style={{
                        position: 'absolute', top: 4, right: 4, height: 16,
                        paddingHorizontal: 4,
                        backgroundColor: DesignRule.mainColor,
                        borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 10
                        }}>{ShopCartStore.getAllGoodsClassNumber}</Text>
                    </View>}
                </TouchableOpacity>
                <View style = {{width:0.5,height:49,backgroundColor:DesignRule.lineColor_inColorBg}}/>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                  onPress={() => this.props.bottomViewAction('buy')}>
                    <Text>立即购买</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: DesignRule.mainColor, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.props.bottomViewAction('gwc')}>
                    <Text style={{ color: 'white' }}>加入购物车</Text>
                </TouchableOpacity>
            </View>

        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 49, flexDirection: 'row', backgroundColor: 'white', borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg
    }
});

