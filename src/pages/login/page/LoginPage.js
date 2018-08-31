import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'


export default class LoginPage extends Component{
    render(){
        return(
            <View>

                <TouchableOpacity onPress={this.back}>
                    <Text>
                        返回
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }

        back=()=>{
                   this.props.navigation.goBack();
                   }


}
