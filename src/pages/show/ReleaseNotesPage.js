/**
 * @author xzm
 * @date 2019/4/30
 */
import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    NativeModules
} from 'react-native';
import BasePage from '../../BasePage';
import { MRText } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import res from './res';
import ImageLoad from '@mr/image-placeholder';
import NoMoreClick from '../../components/ui/NoMoreClick';
import UIImage from '../../components/ui/UIImage';
import Emoticons, * as emoticons from '../../comm/components/emoticons';
import EmptyUtils from '../../utils/EmptyUtils';
import ShowApi from './ShowApi';
import RouterMap,{replaceRoute} from '../../navigation/RouterMap';
import TagView from './components/TagView';
import PictureVideoUtils from './utils/PictureVideoUtils';

const { addIcon, delIcon, iconShowDown, iconShowEmoji, addShowIcon, showTagIcon } = res;
const { arrow_right_black } = res.button;

const { px2dp } = ScreenUtils;

export default class ReleaseNotesPage extends BasePage {
    $navigationBarOptions = {
        title: '发布动态',
        show: true
    };

    constructor(props) {
        super(props);
        this.state = {
            imageArr: [],
            showEmoji: false,
            showEmojiButton: false,
            text: '',
            titleText: '',
            keyBoardHeight: 0,
            products: [],
            tags: [],
            videoData: null
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
            <NoMoreClick onPress={this._publish}>
                <MRText style={styles.publishTextStyle}>
                    发布
                </MRText>
            </NoMoreClick>
        );
    };

    _publish = () => {
        if(this.state.videoData){
            this.publishVideo();
            return;
        }
        if (EmptyUtils.isEmptyArr(this.state.imageArr) && this.state.videoData === null) {
            this.$toastShow('至少需要上传一张图片哦');
            return;
        }
        let content = this.state.text || '';
        let products = this.state.products || [];
        let images = this.state.imageArr;
        let urls, video = null;
        if (this.state.videoData) {
            let cover = {
                baseUrl: this.state.videoData.cover,
                height: this.state.videoData.height,
                width: this.state.videoData.width,
                type: 5
            };
            urls = [cover];
            video = {
                baseUrl: this.state.videoData.video,
                videoTime: this.state.videoData.videoTime,
                width: this.state.videoData.width,
                height: this.state.videoData.height,
                type: 4
            };
        } else {
            urls = images.map((value) => {
                return {
                    baseUrl: value.url,
                    height: value.height,
                    width: value.width,
                    type: 2
                };
            });
        }

        let productsPar = products.map((value) => {
            return value.spuCode;
        });
        let params = {
            content,
            video,
            images: urls,
            products: productsPar,
            title: this.state.titleText,
            tagList: this.state.tags.map((item) => {
                return item.tagId;
            })
        };
        ShowApi.publishShow(params).then((data) => {
            replaceRoute(RouterMap.MyDynamicPage);
        }).catch((error) => {
            this.$toastShow(error.msg || '网络错误');
        });
    };

    publishVideo=()=>{
        const {videoPath,videoCover} = this.state.videoData;
        NativeModules.ShowModule.uploadVideo('cs',videoPath).then((data)=>{
            PictureVideoUtils.uploadSingleImage(videoCover,(data)=>{
                alert(JSON.stringify(data))
            })
        }).catch((error)=>{

        })
    }

    choosePicker = () => {
        // NativeModules.ShowModule.selectVideo().then((data)=>{
        //
        // })
        // return;

        NativeModules.ShowModule.recordVideo().then((data)=>{
            this.setState({videoData:data})
        })
        return;

        let imageArr = this.state.imageArr;
        if (imageArr.length >= 8) {
            return;
        }
        let num = 8 - imageArr.length;
        PictureVideoUtils.selectPictureOrVideo(num,false,callback => {
            if (callback.type === 'video') {
                this.setState({ videoData: callback });
            } else {
                let result = imageArr.concat(callback.images);
                this.setState({ imageArr: result });
            }
        })
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
        if (this.state.videoData) {
            return (
                <View style={styles.imagesWrapper}>
                    <View>
                        <ImageLoad style={styles.photo_item} source={{ uri: `file://${this.state.videoData.videoCover}` }}/>
                        <NoMoreClick style={styles.delete_btn} onPress={() => {
                            this.setState({ videoData: null });
                        }}>
                            <UIImage style={{ width: px2dp(15), height: px2dp(15) }} source={delIcon}/>
                        </NoMoreClick>
                    </View>
                </View>
            );
        }

        let images = this.state.imageArr.map((value, index) => {
            let left = index === 0 ? 0 : px2dp(15);
            return (
                <View style={{ marginLeft: left }} key={index}>
                    <ImageLoad style={styles.photo_item} source={{ uri: value.url }}/>
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
        if (this.state.videoData) {
            return null;
        }

        let imageArr = this.state.imageArr;
        if (imageArr.length >= 8) {
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
        if (this.state.products.length >= 1) {
            return null;
        }

        let spus = this.state.products.map((value) => {
            return value.spuCode;
        });
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate(RouterMap.ShowProductListPage, {
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
                this.setState({
                    showEmoji: false,
                    keyBoardHeight: 0,
                    showEmojiButton: false
                });
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
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: px2dp(10),
                            marginBottom: px2dp(5)
                        }}>
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

    _renderTitleInput = () => {
        return (
            <View style={styles.titleInputWrapper}>
                <TextInput
                    style={{ flex: 1 }}
                    allowFontScaling={false}
                    onChangeText={(text) => {
                        this.setState({
                            titleText: text
                        });
                    }}
                    placeholder={'请输入活动标题（选填）'}
                    maxLength={23}
                    value={this.state.titleText}/>
                <MRText style={styles.numLimitTextStyle}>
                    {`${this.state.titleText ? this.state.titleText.length : 0}/23`}
                </MRText>
            </View>
        );
    };

    refreshTags = (tags) => {
        this.setState({ tags });
    };

    tagRender = () => {
        if (EmptyUtils.isEmpty(this.state.tags)) {
            return (
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigate(RouterMap.TagSelectorPage, { callback: this.refreshTags });
                }}>
                    <View style={styles.tagWrapper}>
                        <Image style={{ width: px2dp(18), height: px2dp(18), marginLeft: DesignRule.margin_page }}
                               source={showTagIcon}/>
                        <MRText style={styles.tagPlaceholder}>
                            添加活动 获得更多曝光
                        </MRText>
                        <Image source={arrow_right_black} style={{ width: px2dp(10), height: px2dp(16) }}/>
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate(RouterMap.TagSelectorPage, { callback: this.refreshTags ,tags:this.state.tags});
            }}>
                <View style={styles.tagWrapper}>
                    {this.state.tags.map((item, index) => {
                        return (
                            <TagView text={item.name} style={{ marginLeft: px2dp(15) }}/>
                        );
                    })}
                    <View style={{ flex: 1 }}/>
                    <Image source={arrow_right_black} style={{ width: px2dp(10), height: px2dp(16) }}/>
                </View>
            </TouchableWithoutFeedback>
        );

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
                            {this._renderTitleInput()}

                            <View style={{ width: DesignRule.width }}>
                                <TextInput style={styles.textInputStyle}
                                           multiline
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
                                <MRText style={[styles.numLimitTextStyle, {
                                    bottom: px2dp(5),
                                    right: px2dp(15),
                                    position: 'absolute'
                                }]}>
                                    {`${this.state.text ? this.state.text.length : 0}/1000`}
                                </MRText>
                            </View>
                            <View style={styles.lineStyle}/>
                            {this._imageRender()}
                            {this.tagRender()}
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
        width: (DesignRule.width - DesignRule.margin_page * 2),
        height: px2dp(70)
    },
    validProductImg: {
        width: px2dp(60),
        height: px2dp(60)
    },
    itemTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_24,
        width: DesignRule.width - px2dp(115),
        marginLeft: px2dp(10)
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
    },
    titleInputWrapper: {
        height: px2dp(50),
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: DesignRule.margin_page,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    numLimitTextStyle: {
        color: '#cccccc',
        fontSize: DesignRule.fontSize_threeTitle
    },
    tagWrapper: {
        height: px2dp(50),
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: DesignRule.margin_page,
        borderBottomWidth: ScreenUtils.onePixel,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        borderTopWidth: ScreenUtils.onePixel,
        borderTopColor: 'rgba(0,0,0,0.1)'
    },
    tagPlaceholder: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle,
        flex: 1,
        marginLeft: px2dp(8)
    }
});

