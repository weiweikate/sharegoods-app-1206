import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import gwc from '../res/gwc.png';

export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewBuy: PropTypes.func.isRequired,
        bottomViewAddToGWC: PropTypes.func.isRequired,
        bottomViewGoGWC: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }

    render() {
        return (<View style={styles.container}>
            <TouchableOpacity style={{ width: 63, justifyContent: 'center', alignItems: 'center' }}
                              onPress={this.props.bottomViewGoGWC}>
                <Image style={{ marginBottom: 6 }} source={gwc}/>
                <Text>购物车</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                              onPress={this.props.bottomViewBuy}>
                <Text>立即购买</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#D51243', justifyContent: 'center', alignItems: 'center' }}
                onPress={this.props.bottomViewAddToGWC}>
                <Text style={{ color: 'white' }}>加入购物车</Text>
            </TouchableOpacity>

        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 49, flexDirection: 'row', backgroundColor: 'white', borderWidth: 1,
        borderColor: '#DDDDDD'
    }

});

