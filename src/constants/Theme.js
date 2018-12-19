import ScreenUtils from '../utils/ScreenUtils';
import DesignRule from './DesignRule';


const getUIScale = (value) => {
    return ScreenUtils.width / 375 * value;
};

const ui = {
    //-----------------------------Text------------------------------//
    Text: {
        default: {
            fontSize: 16,
            color: 'black'
        },
        heading: {
            fontSize: 36,
            color: 'black'
        },
        title: {
            fontSize: 28,
            color: 'black'
        },
        subtitle: {
            fontSize: 24,
            color: 'black'
        },
        caption: {
            fontSize: 12,
            color: 'black'
        },

        //-----------------------------Goods List Text------------------------------//
        goodsListTitle: {
            fontSize: 14,
            color: '#121212'
        },
        goodsListCurrentPrice: {
            fontSize: 14,
            color: '#EB2224',
            fontWeight: 'bold'
        },
        goodsListOriginalPrice: {
            fontSize: 10,
            color: '#999999',
            textDecorationLine: 'line-through'
        }

    },


    //-----------------------------Line------------------------------//
    Line: {
        default: {
            height: ScreenUtils.onePixel,
            backgroundColor: DesignRule.lineColor_inColorBg
        },
        left_margin: {
            height: ScreenUtils.onePixel,
            backgroundColor: DesignRule.lineColor_inColorBg,
            marginLeft: 20
        },
        between_margin: {
            height: ScreenUtils.onePixel,
            backgroundColor: DesignRule.lineColor_inColorBg,
            marginLeft: 20,
            marginRight: 20
        },
        vertical: {
            width: ScreenUtils.onePixel,
            backgroundColor: DesignRule.lineColor_inColorBg
        }
    },

    //-----------------------------Image------------------------------//
    Image: {
        default: {
            img: {
                width: 20,
                height: 20
            }

        }
    },

    //-----------------------------Button------------------------------//
    Button: {
        default: {
            btn_container: {
                width: ScreenUtils.width - 50,
                height: 50,
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: DesignRule.mainColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5
            },
            btn_text: {
                color: DesignRule.white,
                fontSize: 15
            }
        },
        dash: {
            btn_container: {
                height: 50,
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: DesignRule.white,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: ScreenUtils.onePixel,
                borderRadius: 5,
                borderColor: DesignRule.mainColor,
                borderStyle: 'dashed'
            },
            btn_text: {
                color: 'black',
                fontSize: 15
            }
        },
        verification_code: {
            btn_container: {
                height: 30,
                padding: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: ScreenUtils.onePixel,
                borderColor: DesignRule.mainColor,
                borderRadius: 5
            },
            btn_text: {
                color: DesignRule.mainColor,
                fontSize: 12
            }
        },
        common_modal_single_btn: {
            btn_container: {
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5
            },
            btn_text: {
                color: 'black',
                fontSize: 15
            }
        },
        common_modal_two_btn_left: {
            btn_container: {
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomLeftRadius: 5
            },
            btn_text: {
                color: 'black',
                fontSize: 15
            }
        },
        common_modal_two_btn_right: {
            btn_container: {
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomRightRadius: 5
            },
            btn_text: {
                color: 'black',
                fontSize: 15
            }
        }
    },

    //-----------------------------IconText--------------------------------//
    IconText: {
        default: {
            container: {
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DesignRule.white
            },
            icon: {
                width: 30,
                height: 30
            },
            text: {
                color: 'black',
                fontSize: 15
            }
        },
        circle_icon: {
            container: {
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DesignRule.white
            },
            icon: {
                width: 30,
                height: 30,
                borderRadius: 30 / 2
            },
            text: {
                color: 'black',
                fontSize: 15
            }
        }
    },
    //-----------------------------Badge------------------------------//
    Badge: {
        default: {
            badge: {
                position: 'absolute',
                backgroundColor: DesignRule.mainColor,
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: ScreenUtils.onePixel * 3,
                borderColor: DesignRule.white,
                justifyContent: 'center',
                alignItems: 'center'
            },
            text: {
                color: DesignRule.white
            }

        }
    },
    //-----------------------------SingleItem------------------------------//
    SingleItem: {
        default: {
            container: {
                height: 56,
                width: ScreenUtils.width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DesignRule.white
            },
            left_icon: {
                height: 25,
                width: 25,
                marginLeft: 10
            },
            left_text: {
                marginLeft: 10,
                color: DesignRule.textColor_mainTitle_more_light
            },
            middle_text: {
                flex: 1,
                textAlign: 'right',
                marginRight: 10,
                marginLeft: 10
            },
            right_arrow: {
                width: 7,
                height: 12,
                marginRight: 10
            }
        },
        left_circle_icon: {
            container: {
                height: 50,
                width: ScreenUtils.width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DesignRule.white
            },
            left_icon: {
                height: 25,
                width: 25,
                marginLeft: 10,
                borderRadius: 25 / 2
            },
            left_text: {
                marginLeft: 10
            },
            middle_text: {
                flex: 1,
                textAlign: 'right',
                marginRight: 10,
                marginLeft: 10
            },
            right_arrow: {
                width: 7,
                height: 12,
                marginRight: 10
            }

        },
        personal_settings_photo: {
            container: {
                height: 100,
                width: ScreenUtils.width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DesignRule.white
            },
            left_icon: {
                height: 50,
                width: 50,
                marginLeft: 10,
                borderRadius: 50 / 2
            },
            left_text: {
                marginLeft: 10
            },
            middle_text: {
                flex: 1,
                textAlign: 'right',
                marginRight: 10,
                marginLeft: 10
            },
            right_arrow: {
                width: 10,
                height: 15,
                marginRight: 10
            }
        }

    },
    //-----------------------------RichItem------------------------------//
    RichItem: {
        default: {
            container: {
                height: 80,
                width: ScreenUtils.width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: DesignRule.white
            },
            left_icon: {
                height: 40,
                width: 40,
                marginLeft: 10
            },
            middle_container: {
                flex: 2,
                marginLeft: 10
            },
            middle_up_text: {},
            middle_bottom_text: {
                marginTop: 5
            },
            right_container: {
                flex: 2,
                marginLeft: 10
            },
            right_up_text: {},
            right_bottom_text: {
                marginTop: 5
            }
        },
        topicDetail: {
            container: {
                width: ScreenUtils.width,
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginTop: 20,
                marginBottom: 8,
                backgroundColor: DesignRule.white
            },
            left_icon: {
                height: 32,
                width: 32,
                marginLeft: 20
            },
            middle_container: {
                flex: 3,
                marginLeft: 12
            },
            middle_up_text: {
                fontSize: 14,
                marginTop: -4,
                color: '#333333'
            },
            middle_bottom_text: {
                fontSize: 12,
                color: '#666666'
            },
            right_container: {
                flex: 1
            },
            right_up_text: {},
            right_bottom_text: {}
        },

        myorderList: {
            container: {
                paddingTop: 15,
                height: 84,
                width: ScreenUtils.width,
                backgroundColor: '#F9F9F9'
            },
            left_icon: {
                height: 56,
                width: 58,
                marginLeft: 20
            },
            middle_container: {
                flex: 2.3,
                marginLeft: 10,
                height: 50
            },
            middle_up_text: {
                fontSize: 12,
                color: '#333333',
                height: 51
            },
            middle_bottom_text: {
                marginTop: 5

            },
            right_container: {
                height: 51,
                marginRight: 20
            },
            right_up_text: {
                textAlign: 'right',
                fontSize: 12
            },
            right_bottom_text: {
                textAlign: 'right',
                fontSize: 12,
                marginBottom: 8
            }
        }
    },


    //-----------------------------------------------function UI------------------------------------------------------//

    Header: {
        default: {
            container: {
                flexDirection: 'row',
                backgroundColor: DesignRule.white
            },
            header_left: {
                flex: 1,
                justifyContent: 'center',
                marginLeft: 13
            },
            header_back_img: {
                width: 10,
                height: 18
            },
            header_middle: {
                flex: 4,
                alignItems: 'center',
                justifyContent: 'center'
            },
            title: {
                fontSize: 18,
                color: 'black'
            },
            header_right: {
                flex: 1,
                justifyContent: 'center',
                marginRight: 13,
                alignItems: 'flex-end'
            },
            header_right_title: {
                fontSize: 14,
                color: 'black'
            },
            right_icon: {
                width: 24,
                height: 24
            }
        },
        goods: {
            container: {
                flexDirection: 'row',
                backgroundColor: DesignRule.white
            },
            header_left: {
                flex: 1,
                justifyContent: 'center',
                marginLeft: 13
            },
            header_back_img: {
                width: 10,
                height: 18
            },
            header_middle: {
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center'
            },
            title: {
                fontSize: 18,
                color: 'black'
            },
            header_right: {
                flex: 1.1,
                justifyContent: 'center',
                marginRight: 13,
                alignItems: 'flex-end'
            },
            header_right_title: {
                fontSize: 14,
                color: 'black'
            },
            right_icon: {
                width: 24,
                height: 24
            }
        }
    },

    SearchHeader: {
        default: {
            container: {
                flexDirection: 'row',
                backgroundColor: DesignRule.white,
                height: ScreenUtils.headerHeight,
                paddingTop: ScreenUtils.statusBarHeight,
                paddingLeft: 15,
                paddingRight: 15,
                alignItems: 'center',
                justifyContent: 'space-between'
            },
            header_left: {
                justifyContent: 'center',
                flex: 1
            },
            header_back_img: {
                width: 10,
                height: 18
            },
            header_middle: {
                alignItems: 'center',
                justifyContent: 'center'
            },
            title: {
                fontSize: 18,
                color: 'black'
            },
            header_right: {
                justifyContent: 'center',
                alignItems: 'flex-end',
                flex: 1
            },
            header_right_title: {
                fontSize: 14,
                color: 'black'
            },
            right_icon: {
                width: 24,
                height: 24
            },
            searchView: {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F0F0F0',
                borderRadius: 4,
                height: 26
            },
            placeHolder_text: {
                marginLeft: 8,
                color: '#6C6F74',
                fontSize: 14
            },
            title_text: {
                marginLeft: 8,
                color: '#333333',
                fontSize: 14
            },
            searchView_icon: {
                height: 17,
                width: 17,
                marginLeft: 8,
                resizeMode: 'contain'
            },
            searchInput: {
                flex: 8
            },
            close_input_img: {
                height: 18,
                width: 18,
                marginRight: 10
            }
        }
    },

    TimerButton: {
        default: {
            container: {
                width: 120,
                height: 44,
                justifyContent: 'center',
                alignItems: 'center'
            },
            text: {
                fontSize: 15
            }
        }
    },
    TextInput: {
        default: {
            container: {
                width: ScreenUtils.width,
                backgroundColor: DesignRule.white
            },
            content_container: {
                flexDirection: 'row',
                height: 50,
                backgroundColor: DesignRule.white,
                justifyContent: 'center',
                alignItems: 'center'
            },
            title: {
                width: 80,
                marginLeft: getUIScale(20),
                fontSize: 15,
                color: 'black'
            },
            input: {
                marginLeft: 10,
                flex: 1,
                fontSize: 15,
                color: 'black'
            },
            close_input_img: {
                height: 18,
                width: 18,
                marginRight: 12
            }
        }

    },
    //-----------------------------------------------Modal UI------------------------------------------------------//
    CommonModal: {
        default: {
            container: {
                width: ScreenUtils.width - 60,
                marginLeft: 30,
                marginRight: 30,
                backgroundColor: 'white',
                borderRadius: 5,
                alignItems: 'center'
            },
            title: {
                marginTop: 15,
                fontSize: 20
            },
            content: {
                marginTop: 15,
                fontSize: 15,
                marginRight: 15,
                marginLeft: 15
            },
            btn_container: {
                flexDirection: 'row',
                borderRadius: 5
            },
            line: {
                width: ScreenUtils.width - 60,
                marginTop: 10
            }

        }
    },
    PayPwdModal: {
        default: {
            container: {
                width: 316,
                backgroundColor: 'white',
                alignItems: 'center',
                borderRadius: 5
            },
            top_container: {
                flexDirection: 'row',
                height: 40,
                alignItems: 'center'
            },
            top_left: {
                flex: 1
            },
            top_left_img: {
                width: 11,
                height: 11,
                marginLeft: 13
            },
            top_middle: {
                flex: 2,
                alignItems: 'center'
            },
            top_middle_tx: {
                color: DesignRule.textColor_mainTitle,
                fontSize: 14
            },
            top_right: {
                flex: 1, alignItems: 'flex-end'
            },
            top_right_tx: {
                color: DesignRule.textColor_mainTitle_more_light,
                fontSize: 12,
                marginRight: 10
            },
            pwd_input: {
                width: 290,
                marginTop: 10
            },
            bottom_container: {
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 13
            },
            bottom_left_tx: {
                color: DesignRule.textColor_mainTitle_more_light,
                fontSize: 14,
                marginLeft: 10
            },
            bottom_middle_tx: {
                color: DesignRule.textColor_mainTitle_light,
                fontSize: 14,
                marginLeft: 10
            },
            bottom_right_img: {
                marginLeft: 8,
                width: 7,
                height: 12,
                marginRight: 10
            }
        }
    },
    //-----------------------------------------------Modal UI------------------------------------------------------//

    //-----------------------------------------------Goods List--------------------------------------------//
    GoodsListModelView: {
        default: {
            container: {
                backgroundColor: DesignRule.bgColor,
                paddingLeft: getUIScale(20),
                paddingRight: getUIScale(20),
                paddingBottom: 10
            },
            delete_all: {
                width: 14,
                height: 14,
                resizeMode: 'center',
                marginTop: 27 - 14 + 2
            },
            delete_item: {
                width: 14,
                height: 27,
                resizeMode: 'contain'
            },
            itemContainer: {
                marginRight: 5,
                flexDirection: 'row',
                marginTop: 5,
                alignItems: 'flex-end',
                height: 27
            },
            text_container: {
                backgroundColor: '#DFDFDF',
                height: 20,
                paddingLeft: 5,
                justifyContent: 'center'
            },
            text: {
                lineHeight: 20,
                maxWidth: ScreenUtils.width - getUIScale(40) - 20
            }
        }
    },
    //-----------------------------------------------Confirm Order--------------------------------------------//
    SelectAddressCell: {
        default: {
            container_add: {
                backgroundColor: '#fff',
                paddingTop: 20,
                paddingBottom: 12,
                alignItems: 'center'
            },
            no_address: {
                marginBottom: 10,
                lineHeight: 14,
                color: '#666666',
                fontSize: 12
            },
            container_addAddress: {
                width: 124,
                height: 36,
                borderRadius: 2,
                // backgroundColor: DesignRule.mainColor,
                borderWidth: 1,
                borderColor: '#EB2224',
                justifyContent: 'center',
                alignItems: 'center'
            },
            addAddressText: {
                color: '#EB2224',
                fontSize: 16
            },
            container_select: {
                backgroundColor: '#fff',
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: getUIScale(20),
                paddingRight: getUIScale(20),
                paddingTop: 12,
                paddingBottom: 12
            },
            icon: {
                width: 14,
                height: 18
            },
            container_address: {
                marginLeft: 10,
                width: ScreenUtils.width - getUIScale(40) - 10 - 14
            },
            right_arrow: {
                width: 6,
                height: 10,
                resizeMode: 'contain'
            },
            address_content: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            address_text: {
                lineHeight: 20,
                marginRight: 7,
                color: '#333333',
                fontSize: 12

            },
            container_name_phone: {
                flexDirection: 'row'
            },
            name_title: {
                fontSize: 12,
                lineHeight: 20
            },
            name_text: {
                fontWeight: 'bold'
            },
            phone_text: {
                fontWeight: 'bold',
                fontSize: 12,
                marginLeft: 30,
                lineHeight: 20
            }
        }
    },
    OrderItemCell: {
        default: {
            container: {
                height: 140,
                backgroundColor: '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: getUIScale(20),
                paddingRight: getUIScale(20),
                paddingBottom: 20,
                paddingTop: 20
            },
            imageView: {
                width: 100,
                height: 100,
                resizeMode: 'cover'
            },
            contentView: {
                marginLeft: 12,
                justifyContent: 'space-between',
                width: ScreenUtils.width - 100 - getUIScale(40) - 12
            },
            itemNameText: {
                color: '#666666',
                lineHeight: 20,
                fontSize: 12
            },
            bottomView: {
                height: 30,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'flex-end'
            },
            priceUnit: {
                fontSize: 10
            },
            price: {
                lineHeight: 20,
                fontSize: 12,
                color: '#EB2224'
            },
            selectCount: {
                height: 30,
                width: 90,
                flexDirection: 'row'
            },
            subImage: {
                height: 30,
                width: 30,
                resizeMode: 'center'
            },
            numContent: {
                height: 30,
                width: 30,
                justifyContent: 'center',
                alignItems: 'center'
            },
            numText: {
                fontSize: 13
            },
            plusImage: {
                height: 30,
                width: 30,
                resizeMode: 'center'
            },
            line: {
                marginLeft: getUIScale(20),
                marginRight: getUIScale(20)
            }
        }
    }
};

export {
    ui
};
