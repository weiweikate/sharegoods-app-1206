import React from "react";
import {
    StyleSheet,
    View,
} from "react-native";

import FlyImageViewer from "FlyImageViewer";
import BasePage from "../../../BasePage";

export default class CheckBigImagesView extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    _render() {
        return (
            <View style={styles.container}>
                <FlyImageViewer imageUrls={this.params.imageUrls} index={this.params.index} onCancel={() => {
                    this.props.navigation.goBack();
                }} loadingRender={() => {
                    return null;
                    // return (<Image source={"./imgs/common/loading-normal.gif"} style={{ width: 30, height: 30 }}/>);
                }}/>

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

