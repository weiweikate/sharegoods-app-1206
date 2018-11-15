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
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';

export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { shareMoney } = this.props;
        return (<View style={{ height: 49 + ScreenUtils.safeBottom, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <TouchableOpacity style={{ width: 63, justifyContent: 'center', alignItems: 'center' }}
                                  onPress={() => this.props.bottomViewAction('gwc')}>
                    <Image style={{ marginBottom: 6 }} source={xiangqing_btn_gouwuche_nor}/>
                    <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction }}>购物车</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: DesignRule.mainColor
                    }}
                    onPress={() => this.props.bottomViewAction('buy')}>
                    <Text style={{ color: DesignRule.white, fontSize: 14 }}>立即购买</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: '#FBBB50',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                    onPress={() => this.props.bottomViewAction('jlj')}>
                    <Text style={{ color: DesignRule.white, fontSize: 25 }}>赚</Text>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={{ color: DesignRule.white, fontSize: 11 }}>品牌奖励金</Text>
                        <View style={{
                            marginTop: 6,
                            alignItems:'center'
                        }} maxWidth={ScreenUtils.autoSizeWidth(100)}>
                            <Text style={{
                                color: DesignRule.white,
                                fontSize: 11,
                            }} numberOfLines = {2}>{StringUtils.isNoEmpty(shareMoney) ? `￥${shareMoney}` : '￥?'}</Text>
                        </View>
                    </View>
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

