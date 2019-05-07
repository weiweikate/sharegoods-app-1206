/**
 * @author xzm
 * @date 2019/4/30
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../BasePage';
import { MRText, MRTextInput } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import res from './res';
import BusinessUtils from '../mine/components/BusinessUtils';
import ImageLoad from '@mr/image-placeholder';
import NoMoreClick from '../../components/ui/NoMoreClick';
import UIImage from '../../components/ui/UIImage';

const { addIcon, delIcon } = res;

const { px2dp } = ScreenUtils;

export default class ReleaseNotesPage extends BasePage {
    $navigationBarOptions = {
        title: '发布心得',
        show: true
    };

    constructor(props) {
        super(props);
        this.state = {
            imageArr: []
        };
    }

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity>
                <MRText style={styles.publishTextStyle}>
                    发布
                </MRText>
            </TouchableOpacity>
        );
    };

    choosePicker = () => {
        let imageArr = this.state.imageArr;
        if (imageArr.length >= 9) {
            return;
        }
        let num = 9 - imageArr.length;
        BusinessUtils.getImagePicker(callback => {
            let result = imageArr.concat(callback.imageUrl);
            this.setState({ imageArr: result });
        }, num, true);
    };

    deletePic = (index) => {
        let imageArr = [];
        for (let i = 0; i < this.state.imageArr.length; i++) {
            if (i !== index) {
                imageArr.push(this.state.imageArr[i]);
            }
        }
        this.setState({ imageArr: imageArr });
    };

    _imageRender = () => {
        let images = this.state.imageArr.map((value, index) => {
            let left = index === 0 ? 0 : px2dp(15);
            return (
                <View style={{ marginLeft: left }} key={index}>
                    <ImageLoad style={styles.photo_item} source={{ uri: value }}/>
                    <NoMoreClick style={styles.delete_btn} onPress={() => {
                        this.deletePic(index);
                    }}>
                        <UIImage style={{ width: px2dp(15), height: px2dp(15) }} source={delIcon}/>
                    </NoMoreClick>
                </View>
            );
        });

        return (
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                <View style={styles.imagesWrapper}>
                    {images}
                    {this._addImageButton()}
                </View>
            </ScrollView>
        );
    };

    _addImageButton = () => {
        let imageArr = this.state.imageArr;
        if (imageArr.length >= 9) {
            return null;
        }

        let left = imageArr.length === 0 ? 0 : px2dp(15);
        return (
            <TouchableWithoutFeedback onPress={this.choosePicker}>
                <View style={[styles.addButtonStyle, { marginLeft: left }]}>
                    <Image source={addIcon} style={styles.addIconStyle}/>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _addProductButton = () => {
        return (
            <TouchableWithoutFeedback onPress={()=>{
                this.$navigate('show/ShowProductListPage')
            }}>
                <View style={styles.addProductWrapper}>
                    <MRText style={styles.addProductText}>+ 添加推荐商品</MRText>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _render() {
        return (
            <View style={styles.contain}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.noteContain}>
                        <MRTextInput style={styles.textInputStyle}
                                     placeholder={'可分享购物心得，生活感悟......'}
                                     maxLength={1000}
                        />
                        <View style={styles.lineStyle}/>
                        {this._imageRender()}
                    </View>
                    {this._addProductButton()}
                </ScrollView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    publishTextStyle: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_threeTitle
    },
    contain: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    noteContain: {
        backgroundColor: DesignRule.white,
        width: DesignRule.width
    },
    textInputStyle: {
        width: DesignRule.width - 2 * DesignRule.margin_page,
        height: px2dp(140),
        textAlignVertical: 'top',
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle,
        margin: px2dp(15)
    },
    lineStyle: {
        height: 1,
        width: DesignRule.width - 2 * DesignRule.margin_page,
        alignSelf: 'center',
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    imagesWrapper: {
        flexDirection: 'row',
        marginVertical: px2dp(15),
        marginLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    addButtonStyle: {
        width: px2dp(90),
        height: px2dp(90),
        borderRadius: px2dp(5),
        borderColor: '#E4E4E4',
        borderWidth: 1,
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addProductWrapper: {
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        height: px2dp(34),
        borderRadius: px2dp(17),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.white,
        marginTop: px2dp(15),
        width: px2dp(135),
        alignSelf: 'center'
    },
    addProductText: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_mediumBtnText
    },
    addIconStyle: {
        width: px2dp(20),
        height: px2dp(20)
    },
    photo_item: {
        width: px2dp(90),
        height: px2dp(90)
    },
    delete_btn: {
        width: px2dp(15),
        height: px2dp(15),
        position: 'absolute',
        top: -px2dp(7),
        right: -px2dp(7)
    }

});

