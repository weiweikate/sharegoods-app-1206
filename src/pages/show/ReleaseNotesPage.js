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
    TouchableWithoutFeedback,
    Keyboard,
    TextInput, DeviceEventEmitter
} from 'react-native';
import BasePage from '../../BasePage';
import { MRText } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import res from './res';
import BusinessUtils from '../mine/components/BusinessUtils';
import ImageLoad from '@mr/image-placeholder';
import NoMoreClick from '../../components/ui/NoMoreClick';
import UIImage from '../../components/ui/UIImage';
import Emoticons, * as emoticons from '../../comm/components/emoticons';
import EmptyUtils from '../../utils/EmptyUtils';

const { addIcon, delIcon, iconShowDown, iconShowEmoji, addShowIcon } = res;

const { px2dp } = ScreenUtils;

export default class ReleaseNotesPage extends BasePage {
    $navigationBarOptions = {
        title: '发布心得',
        show: true
    };

    constructor(props) {
        super(props);
        this.state = {
            imageArr: [],
            showEmoji: false,
            showEmojiButton: false,
            text: '',
            keyBoardHeight: 0,
            products: []
        };

    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        this.setState({
            showEmoji: false,
            showEmojiButton: true,
            keyBoardHeight: e.endCoordinates.height
        });
    };

    _keyboardDidHide = () => {
        if (!this.state.showEmoji) {
            this.setState({
                showEmojiButton: false,
                keyBoardHeight: 0
            });
        }
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this._publish}>
                <MRText style={styles.publishTextStyle}>
                    发布
                </MRText>
            </TouchableOpacity>
        );
    };

    _publish=()=>{
        // if(EmptyUtils.isEmptyArr(this.state.imageArr)){
        //     this.$toastShow('至少需要上传一张图片哦');
        //     return;
        // }

        this.props.navigation.popToTop();
        this.props.navigation.navigate('ShowListPage');
        DeviceEventEmitter.emit('PublishShowFinish');
    }

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
        let spus = this.state.products.map((value) => {
            return value.spuCode;
        });
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate('show/ShowProductListPage', {
                    spus,
                    callBack: (value) => {
                        let arr = this.state.products;
                        arr.push(value);
                        this.setState({
                            products: arr
                        });
                    }
                });
            }}>
                <View style={styles.addProductWrapper}>
                    <Image source={addShowIcon} style={styles.addProductIcon}/>
                    <MRText style={styles.addProductText}>添加推荐商品</MRText>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _emojiButton = () => {
        return (<View style={{
            width: DesignRule.width,
            height: px2dp(40),
            backgroundColor: DesignRule.white,
            position: 'absolute',
            alignItems: 'center',
            bottom: this.state.keyBoardHeight,
            flexDirection: 'row',
            borderTopColor: '#E4E4E4',
            borderTopWidth: 1
        }}
                      ref={(ref) => this.bottom = ref}
        >
            <TouchableWithoutFeedback onPress={() => {
                const isShow = this.state.showEmoji;
                if (!isShow) {
                    Keyboard.dismiss();
                    this.setState({
                        showEmoji: true,
                        keyBoardHeight: 300
                    });
                } else {
                    this.textinput && this.textinput.focus();
                    this.setState({
                        showEmoji: false
                    });
                }
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center'

                }}>
                    <View style={styles.emojiButtonWrapper}>
                        <Image source={iconShowEmoji} style={styles.emojiButtonStyle}/>
                        <MRText style={styles.emojiTextStyle}>
                            表情
                        </MRText>
                    </View>

                </View>
            </TouchableWithoutFeedback>
            <View style={{ flex: 1 }}/>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <Image source={iconShowDown} style={styles.closeKeyboard}/>
            </TouchableWithoutFeedback>
        </View>);
    };

    _productsRender = () => {
        let products = this.state.products;
        return products.map((item, index) => {
            return (<View key={'product' + index}>
                <View style={styles.itemWrapper}>
                    <UIImage source={{ uri: item.imgUrl ? item.imgUrl : '' }}
                             style={[styles.validProductImg]}/>
                    <View style={{ height: px2dp(70) }}>
                        <MRText numberOfLines={1}
                                style={styles.itemTitle}
                                ellipsizeMode={'tail'}>
                            {item.productName ? item.productName : ''}
                        </MRText>
                        <View style={{ flex: 1 }}/>
                        <View style={{ flexDirection: 'row', alignItems: 'center' ,marginLeft:px2dp(10)}}>
                            <MRText style={{ fontSize: px2dp(10), color: DesignRule.mainColor }}>￥</MRText>
                            <MRText style={styles.priceText}>
                                {item.showPrice ? item.showPrice : item.price}
                            </MRText>
                        </View>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={() => {
                    products.splice(index, 1);
                    this.setState({ products });
                }
                }>
                    <Image source={delIcon}
                           style={{ width: 15, height: 15, position: 'absolute', top: -8, right: px2dp(8) }}/>
                </TouchableWithoutFeedback>
            </View>);
        });
    };

    _render() {

        const emoji = <View>
            <Emoticons
                show={true}
                concise={true}
                showHistoryBar={true}
                showPlusBar={false}
                onBackspacePress={() => {
                    let text = this.state.text;
                    let arr = emoticons.splitter(text);
                    arr.pop();
                    this.setState({
                        text: arr.join('')
                    });
                }}
                onEmoticonPress={(emoji) => {
                    console.log(emoji);
                    this.setState({
                        text: this.state.text + emoji.code
                    }, () => {
                        let str = emoticons.stringify(this.state.text);
                        console.log(str);
                    });

                }}
            />
        </View>;

        return (
            <View style={styles.contain}>
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.noteContain}>
                            <TextInput style={styles.textInputStyle}
                                       allowFontScaling={false}
                                       ref={(ref) => {
                                           this.textinput = ref;
                                       }}
                                       onChangeText={(text) => {
                                           this.setState({
                                               text: text
                                           });
                                       }}
                                       placeholder={'可分享购物心得，生活感悟......'}
                                       maxLength={1000}
                                       value={this.state.text}
                            />
                            <View style={styles.lineStyle}/>
                            {this._imageRender()}
                        </View>
                        {this._addProductButton()}
                        {this._productsRender()}
                    </ScrollView>
                </View>
                {this.state.showEmojiButton ? this._emojiButton() : null}


                {this.state.showEmoji ? emoji : null}
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
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addProductWrapper: {
        alignItems: 'center',
        marginTop: px2dp(11),
        marginBottom: px2dp(20),
        marginLeft: DesignRule.margin_page,
        alignSelf: 'flex-start',
        flexDirection: 'row'
    },
    addProductText: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_threeTitle_28
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
    },
    emojiButtonStyle: {
        width: px2dp(18),
        height: px2dp(18)
    },
    emojiTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle_28,
        marginLeft: px2dp(5)
    },
    emojiButtonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: DesignRule.margin_page
    },
    closeKeyboard: {
        width: px2dp(20),
        height: px2dp(20),
        marginRight: DesignRule.margin_page
    },
    itemWrapper: {
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5),
        flexDirection: 'row',
        marginBottom: px2dp(10),
        padding: px2dp(5),
        marginHorizontal: DesignRule.margin_page,
        width: (DesignRule.width - DesignRule.margin_page * 2)
    },
    validProductImg: {
        width: px2dp(60),
        height: px2dp(60)
    },
    itemTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_mediumBtnText,
        width: DesignRule.width - px2dp(115)
    },
    contentStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle
    },
    priceText: {
        color: DesignRule.mainColor,
        fontSize: px2dp(18)
    },
    addProductIcon: {
        width: px2dp(18),
        height: px2dp(18),
        marginRight: px2dp(8)
    }
});

