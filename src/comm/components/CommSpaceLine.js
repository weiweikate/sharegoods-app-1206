import {
    View,
    StyleSheet

} from 'react-native';
import React, { Component } from 'react';
import DesignRule from '../../constants/DesignRule';

export default class CommSpaceLine extends Component {
    constructor(props) {
        super(props);
        this.style = props.style;
    }
    render() {
        return (
            <View style={[Styles.CommLineStyle, this.style]}/>
        );
    }
}
const Styles = StyleSheet.create({
    CommLineStyle: {
        height: 0.5,
        backgroundColor: DesignRule.lineColor_inColorBg
    }
});
