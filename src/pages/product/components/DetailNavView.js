import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { observer } from 'mobx-react';
import ShopCartStore from '../../shopCart/model/ShopCartStore';
import res from '../res/product';
import { MRText as Text } from '../../../components/ui/index';
import UIImage from '@mr/image-placeholder';

const { detail_back_down, detail_car_down, detail_car_up, detail_more_down } = res.detailNavView;
const { show_detail_back, show_share } = res.button;

/**
 * 商品详情bannerView
 */

@observer
export default class DetailNavView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scale: false
        };
    }

    componentDidMount() {

        if (this.props.scale) {
            this.updateWithScale(1);
        }

    }

    updateWithScale = (scale1) => {
        if (scale1 === 1 && this.state.scale === false) {
            this.setState({
                    scale: true
                }
            );
        } else if (scale1 < 1 && this.state.scale === true) {
            this.setState({
                    scale: false
                }
            );
        }
    };

    render() {
        const { messageCount } = this.props;
        return (<View style={!this.props.scale ? styles.transparentView : styles.transparentView1}>
                <View style={styles.leftBarItemContainer}>
                    {/*返回*/}
                    <TouchableOpacity onPress={() => {
                        this.props.navBack && this.props.navBack();
                    }} style={styles.btnContainer}>
                        <Image
                            source={this.state.scale ? detail_back_down : show_detail_back}/>
                    </TouchableOpacity>
                </View>
                {/*图片*/}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {this.state.scale && this.props.scale !== true ?
                        <UIImage source={{ uri: this.props.source }} style={{
                            width: 38,
                            height: 38,
                            borderColor: DesignRule.color_ddd,
                            borderWidth: 1
                        }}/> : null}
                </View>
                <View style={styles.rightBarItemContainer}>
                    {/*购物车*/}
                    {this.props.navRLeft ? <TouchableOpacity onPress={() => {
                        this.props.navRLeft && this.props.navRLeft();
                    }} style={styles.btnContainer}>
                        <Image style={{ marginRight: 10 }}
                               source={this.state.scale ? detail_car_down : detail_car_up}/>
                        {ShopCartStore.getAllGoodsClassNumber === 0 ? null : <View style={{
                            position: 'absolute', top: 4, right: 8, height: 16,
                            paddingHorizontal: 6,
                            backgroundColor: DesignRule.mainColor,
                            borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 10
                            }}
                                  allowFontScaling={false}>{ShopCartStore.getAllGoodsClassNumber > 99 ? 99 : ShopCartStore.getAllGoodsClassNumber}</Text>
                        </View>}
                    </TouchableOpacity> : null}
                    {/*分享相关*/}
                    <TouchableOpacity onPress={() => {
                        this.props.navRRight && this.props.navRRight();
                    }} style={styles.btnContainer}>
                        <Image source={this.state.scale ? detail_more_down : show_share}/>
                        {messageCount === 0 ? null : <View style={{
                            position: 'absolute', top: 4, right: 8, height: 10, width: 10,
                            paddingHorizontal: 4,
                            backgroundColor: DesignRule.mainColor,
                            borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                        }}/>}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    transparentView: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: ScreenUtils.statusBarHeight,
        zIndex: 3,
        left: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    transparentView1: {
        width: ScreenUtils.width,
        paddingTop: ScreenUtils.statusBarHeight,
        height: ScreenUtils.headerHeight,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rightBarItemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 88,
        height: 44
    },
    leftBarItemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 88,
        height: 44
    },
    btnContainer: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
