/*
* 垂直展示的row
* */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import gwc from '../res/gwc.png';

export default class SearchBar extends Component {

    static propTypes = {
        onPressAtIndex: PropTypes.func.isRequired,
        storeProduct: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <TouchableWithoutFeedback>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={[styles.container]}>
                        <Image style={styles.img}/>
                        <View style={styles.textContentView}>
                            <Text style={{ color: '#222222', fontSize: 13 }}
                                  numberOfLines={2}>CHEERIOBAN慵懒随意春装2018新款女毛呢格纹编制流...苏小香风...外套</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#D51243', fontSize: 17 }}>￥150.00起</Text>
                                <Image style={{ width: 15, height: 15 }} source={gwc}/>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 16,
        marginRight: 22,
        flexDirection: 'row'
    },
    img: {
        backgroundColor: 'red',
        height: 120,
        width: 120
    },
    textContentView: {
        width: ScreenUtils.width - 150 - 22,
        marginLeft: 14,
        marginTop: 6,
        marginBottom: 9,
        justifyContent: 'space-between'
    }
});

