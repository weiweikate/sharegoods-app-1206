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

export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (<View style={{ height: ScreenUtils.isIOSX ? 49 + 33 : 49 ,backgroundColor: 'white'}}>
            <View style={styles.container}>
                <TouchableOpacity style={{ width: 63, justifyContent: 'center', alignItems: 'center' }}
                                  onPress={()=>this.props.bottomViewAction('goGwc')}>
                    <Image style={{ marginBottom: 6 }} source={xiangqing_btn_gouwuche_nor}/>
                    <Text>购物车</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                  onPress={()=>this.props.bottomViewAction('buy')}>
                    <Text>立即购买</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#D51243', justifyContent: 'center', alignItems: 'center' }}
                    onPress={()=>this.props.bottomViewAction('gwc')}>
                    <Text style={{ color: 'white' }}>加入购物车</Text>
                </TouchableOpacity>
            </View>

        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 49, flexDirection: 'row', backgroundColor: 'white', borderWidth: 1,
        borderColor: '#DDDDDD'
    }
});

