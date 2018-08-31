import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

export default class FriendPage extends Component {
    static navigationOptions = {
        tabBarLabel: '好友',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('./res/img/home_tab_selected.png')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('./res/img/home_tab_unselected.png')}/>
            );
        },
    };

    render() {
        return (
            <View style={styles.container}>
                <Text onPress={this.redirect}>这是好友1</Text>
            </View>
        );
    }

    redirect = () => {
        this.props.navigation.navigate('login/page/LoginPage', {info: '传值过去1'});
    };
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
