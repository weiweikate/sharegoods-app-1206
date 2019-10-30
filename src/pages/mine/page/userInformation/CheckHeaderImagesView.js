/**
 * @author zhoujianxin
 * @date on 2019/10/23.
 * @desc
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import BasePage from '../../../../BasePage';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import FlyImageViewer from '../../../../comm/components/FlyImageViewer';
import user from '../../../../model/user';

@observer
export default class CheckHeaderImagesView extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    // 更换页面背景色
    $setBackgroundColor() {
        return DesignRule.textColor_mainTitle;
    }

    _render() {
        return (
            <View style={styles.container}>
                <FlyImageViewer imageUrls={[user.headImg]}
                                index={this.params.index}
                                type={this.params.type} //
                                unShowDown={this.params.type==='userInfo'} //判断是否是用户头像跳转过来的，是就隐藏下载图片按钮
                                onCancel={() => {
                                    this.props.navigation.goBack();
                                }}
                                loadingRender={() => {
                                    return null;
                                    // return (<Image source={"./imgs/common/loading-normal.gif"} style={{ width: 30, height: 30 }}/>);
                                }}
                                saveToLocalByLongPress={true}
                                onSaveToCamera={() => {
                                    this.$toastShow('保存成功');
                                }}
                                getImagePicker={this.params.getImagePicker} //选择图片和拍照功能

                />

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
