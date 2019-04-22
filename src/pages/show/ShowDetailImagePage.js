import React from "react";
import {
    StyleSheet,
    View,
} from "react-native";

import FlyImageViewer from '../../comm/components/FlyImageViewer'
import BasePage from "../../BasePage";

export default class ShowDetailImagePage extends BasePage {
    $navigationBarOptions = {
        show: false
    };
    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    _render() {
        return (
            <View style={styles.container}>
                <FlyImageViewer imageUrls={this.params.imageUrls}
                                index={this.params.index}
                                onCancel={() => {this.props.navigation.goBack();}}
                                loadingRender={() => {
                    return null;
                }}
                                saveToLocalByLongPress = {true}
                                onSaveToCamera={()=> {this.$toastShow('保存成功')}}

                />

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
});

