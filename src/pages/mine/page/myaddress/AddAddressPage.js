import { Text, View, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';

export default class AddAddressPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '添加地址',
        rightTitleStyle: { color: '#D51243' },
        rightNavTitle: '保存'
    };

    $NavBarRightPressed = () => {
        //保存地址
    };


    constructor(props) {
        super(props);
        this.state = {
            receiverText: '',
            telText: '',
            areaText: '',
            addrText: ''
        };
    }

    render() {
        return <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.horizontalItem}>
                <Text style={styles.itemLeftText}>收货人</Text>
                <TextInput
                    style={styles.itemRightInput}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({ receiverText: text })}
                    value={this.state.receiverText}
                />
            </View>
            <View style={{ height: 0.5, backgroundColor: '#EEEEEE' }}/>
            <View style={styles.horizontalItem}>
                <Text style={styles.itemLeftText}>联系电话</Text>
                <TextInput
                    style={styles.itemRightInput}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({ telText: text })}
                    value={this.state.telText}
                />
            </View>
            <View style={{ height: 0.5, backgroundColor: '#EEEEEE' }}/>
            <View style={styles.horizontalItem}>
                <Text style={styles.itemLeftText}>所在地区</Text>
                <TextInput
                    style={styles.itemRightInput}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({ areaText: text })}
                    value={this.state.areaText}
                />
            </View>
            <View style={{ height: 0.5, backgroundColor: '#EEEEEE' }}/>
            <TextInput
                style={{
                    height: 105,
                    backgroundColor: 'white',
                    textAlignVertical: 'top',
                    padding: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 14
                }}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => this.setState({ addrText: text })}
                value={this.state.addrText}
            />
        </View>;
    }
}

const styles = StyleSheet.create({
    horizontalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        height: 45,
        backgroundColor: 'white'
    },
    itemLeftText: {
        width: 64,
        marginRight: 6,
        fontSize: 13,
        color: '#222222'
    },
    itemRightInput: {
        flex: 1,
        height: 40,
        padding: 0
    }
});
