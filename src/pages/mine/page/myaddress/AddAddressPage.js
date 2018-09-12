import {
    Text, View, TextInput, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import React from 'react';
import BasePage from '../../../../BasePage';
import IconGoTo from '../../../mine/res/customerservice/icon_06-03.png';

export default class AddAddressPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        rightTitleStyle: { color: '#D51243' },
        rightNavTitle: '保存'
    };

    $NavBarRightPressed = () => {
        const { refreshing, from } = this.props.navigation.state.params || {};
        if (from === 'edit') {
            //编辑地址
        } else if (from === 'add') {
            //保存地址
        }

        //保存地址，保存成功后刷新返回
        // HttpUtils.post('', {}).then((data) => {
        //     console.log(data);
        //     this.setState({
        //         datas: data
        //     });
        // }).catch((data) => {
        //     console.warn(data);
        //     bridge.$toast(data.msg);
        // });
        refreshing && refreshing();
        this.$navigateBack();
    };


    constructor(props) {
        super(props);
        const { receiver, tel, area, address, from } = this.props.navigation.state.params;
        if (from === 'edit') {
            this.$navigationBarOptions.title = '编辑地址';
        } else if (from === 'add') {
            this.$navigationBarOptions.title = '添加地址';
        }
        this.state = {
            receiverText: receiver || '',
            telText: tel || '',
            areaText: area || '',
            addrText: address || ''
        };
    }

    _render() {
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
            <TouchableOpacity style={styles.horizontalItem}>
                <Text style={[styles.itemLeftText, { flex: 1 }]}>所在地区</Text>
                <Text>{this.state.areaText}</Text>
                <Image source={IconGoTo} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
            </TouchableOpacity>
            <View style={{ height: 0.5, backgroundColor: '#EEEEEE' }}/>
            <TextInput
                style={{
                    height: 105,
                    backgroundColor: 'white',
                    textAlignVertical: 'top',
                    padding: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 14,
                    color: '#222222',
                    fontSize: 13
                }}
                placeholder={'请输入详细地址~'}
                placeholderTextColor={'#999999'}
                maxLength={90}
                multiline={true}
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
        padding: 0,
        color: '#999999',
        fontSize: 13
    }
});
