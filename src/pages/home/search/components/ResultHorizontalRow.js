/*
* 横向展示的row
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
import gwc from '../res/gwc.png';

export default class ResultHorizontalRow extends Component {

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
                <View style={[styles.container]}>
                    <Image style={styles.img}/>
                    <Text style={{ color: '#222222', fontSize: 13, paddingHorizontal: 10, marginTop: 9 }}
                          numberOfLines={2}>UL2018春夏新款青春女装花朵印花露肩吊带休闲连...身裤YL32S6IN2000</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        marginBottom: 11,
                        marginTop: 21
                    }}>
                        <Text style={{ color: '#D51243', fontSize: 17 }}>￥1650.00起</Text>
                        <Image style={{ width: 15, height: 15 }} source={gwc}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginLeft: 5,
        backgroundColor: 'white',
        flex: 1
    },
    img: {
        backgroundColor: 'red',
        height: 170,
        width: 170
    }
});

