import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

export default class Home extends Component {
    static navigationOptions = {
        tabBarLabel: '主页',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('./res/img/group_tab_selected.png')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('./res/img/group_tab_unselected.png')}/>
            );
        },
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>组护额US苦辣都看见爱的看见爱的</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarIcon: {
        width: 21,
        height: 21,
    }

});
