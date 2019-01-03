//发布公告页面
import React from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import StringUtils from '../../../utils/StringUtils';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import {
    MRText as Text, MRTextInput as TextInput
} from '../../../components/ui';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class AnnouncementPublishPage extends BasePage {

    $navigationBarOptions = {
        title: '发布公告'
    };
    state = { text: '' };

    // 发布公告
    _saveContent = () => {
        if (StringUtils.isEmpty(this.state.text)) {
            this.$toastShow('公告内容不能为空');
            return;
        }
        if (this.state.text.length > 180) {
            this.$toastShow('公告长度不能大于180字');
            return;
        }

        SpellShopApi.storeNoticeInsert({ content: this.state.text, storeCode: this.params.storeData.storeNumber }).then(() => {
            const { publishSuccess } = this.params;
            this.$toastShow('发布成功');
            publishSuccess && publishSuccess();
            this.$navigateBack();
        }).catch((error) => {
            this.$toastShow(error.msg);
        });

    };

    _goBack = () => {
        this.$navigateBack();
    };

    _onChangeText = (text) => {
        if (text.length > 180) {
            text = text.substring(0, 180);
        }
        this.setState({ text });
    };

    _render() {
        const color = { color: this.state.text ? DesignRule.textColor_mainTitle : DesignRule.textColor_instruction };
        return (
            <View style={styles.container}>
                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={styles.gap}/>
                    <View style={styles.bgContainer}>
                        <View style={styles.topBar}>
                            <Text style={styles.barTitle} allowFontScaling={false}>公告内容</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput value={this.state.text}
                                       onChangeText={this._onChangeText}
                                       multiline
                                       placeholder={'请输入公告内容......'}
                                       blurOnSubmit={false}
                                       style={[styles.textInput, color]}/>
                            <Text style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                color:DesignRule.textColor_instruction
                            }} allowFontScaling={false}>{`${this.state.text.length}/180`}</Text>
                        </View>
                        <View style={styles.btnRow}>
                            {this.renderBtn(this._goBack, styles.canCelBtn, styles.canCelTitle, '取消')}
                            {this.renderBtn(this._saveContent, styles.okBtn, styles.okTitle, '发布')}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    renderBtn = (onPress, style, titleStyle, title) => {
        return (<TouchableOpacity onPress={onPress} style={style}>
            <Text style={titleStyle} allowFontScaling={false}>{title}</Text>
        </TouchableOpacity>);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topBar: {
        justifyContent: 'center',
        width: SCREEN_WIDTH - 30,
        marginTop: 15,
        alignItems: 'center',
        height: 44,
        backgroundColor: DesignRule.mainColor,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    barTitle: {
        fontSize: 15,
        color: 'white'
    },
    textInputContainer: {
        width: SCREEN_WIDTH - 30,
        backgroundColor: DesignRule.lineColor_inColorBg,
        height: ScreenUtils.autoSizeHeight(300)
    },
    textInput: {
        fontSize: 14,
        margin: 17,
        flex: 1,
        textAlignVertical: 'top'
    },
    gap: {
        width: SCREEN_WIDTH,
        height: 10,
        backgroundColor: DesignRule.bgColor
    },
    bgContainer: {
        flex: 1,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    btnRow: {
        marginTop: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },
    okBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        width: 110,
        height: 40,
        borderRadius: 5
    },
    okTitle: {
        fontSize: 16,
        color: 'white'
    },
    canCelBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        width: 110,
        height: 40,
        marginRight: 45,
        borderRadius: 5
    },
    canCelTitle: {
        fontSize: 16,
        color: DesignRule.textColor_instruction
    }
});
