import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import res from '../../../../comm/res/index';
import detailNavView from '../res/detailNavView';
import DesignRule from '../../../../constants/DesignRule';

/**
 * 商品详情bannerView
 */

export default class DetailNavView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scale: false
        };
    }

    componentDidMount() {

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
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>

                    <TouchableOpacity onPress={() => {
                        this.props.navBack && this.props.navBack();
                    }} style={styles.btnContainer}>
                        <Image
                            source={this.state.scale ? detailNavView.detail_back_down : res.button.show_detail_back}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {this.state.scale ? <Image source={{ uri: this.props.source }} style={{
                        width: 38,
                        height: 38,
                        borderColor: DesignRule.color_ddd,
                        borderWidth: 1
                    }}/> : null}
                </View>
                <View style={styles.rightBarItemContainer}>
                    <TouchableOpacity onPress={() => {
                        this.props.navRLeft && this.props.navRLeft();
                    }} style={styles.btnContainer}>
                        <Image style={{ marginRight: 10 }}
                               source={this.state.scale ? detailNavView.detail_car_down : detailNavView.detail_car_up}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navRRight && this.props.navRRight();
                    }} style={styles.btnContainer}>
                        <Image source={this.state.scale ? detailNavView.detail_more_down : res.button.show_share}/>
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
        left: 16,
        right: 16,
        zIndex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 88,
        height: 44
    },
    leftBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 88,
        height: 44
    },
    btnContainer: {
        width: 44,
        alignItems: 'center'
    }
});
