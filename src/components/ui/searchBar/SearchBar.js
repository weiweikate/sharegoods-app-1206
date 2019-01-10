import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View,
    Image,
    StyleSheet
} from "react-native";
import SearchIcon from "./ss_03.png";
import { MRTextInput as TextInput} from '../../../components/ui';

export default class SearchBar extends Component {

    static propTypes = {
        title: PropTypes.string,//标题
        placeholder: PropTypes.string.isRequired//占位字符
    };

    render() {
        return (<View style={[styles.container, this.props.style]}>
            <Image style={styles.icon} source={SearchIcon}/>
            <TextInput value={this.props.title}
                       onChangeText={this.props.onChangeText}
                       placeholder={this.props.placeholder}
                       style={styles.desc}/>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 42,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginHorizontal: 15,
        flexDirection: "row",
        marginVertical: 10,
        alignItems: "center"
    },
    icon: {
        marginLeft: 16,
        marginRight: 6
    },
    desc: {
        fontSize: 14,
        color: "#333",
        flex: 1,
        height: 40,
        marginRight: 16
    }
});

