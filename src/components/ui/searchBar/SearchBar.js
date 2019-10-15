import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import SearchIcon from './ss_03.png';
import { MRTextInput as TextInput } from '../../../components/ui/UIText';

export default class SearchBar extends Component {

    static propTypes = {
        title: PropTypes.string,//标题
        placeholder: PropTypes.string.isRequired//占位字符
    };

    render() {
        return (<View style = {{backgroundColor: '#FFFFFF'}}>
                <View style={[styles.container, this.props.style]}>
                    <Image style={styles.icon} source={SearchIcon}/>
                    <TextInput value={this.props.title}
                               onChangeText={this.props.onChangeText}
                               placeholder={this.props.placeholder}
                               style={styles.desc}/>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F7F7F7',
        marginHorizontal: 15,
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center'
    },
    icon: {
        marginLeft: 16,
        marginRight: 6, width: 20, height: 20
    },
    desc: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        height: 40,
        marginRight: 16
    }
});

