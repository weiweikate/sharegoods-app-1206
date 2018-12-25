//开放店铺设置页面
import React from 'react';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from 'DesignRule';
import res from '../res';
const SelIcon = res.shopSetting.SelIcon;
const UnSelIcon = res.shopSetting.UnSelIcon;

const SCREEN_WIDTH = Dimensions.get('window').width;
import {
    MRText as Text
} from '../../../components/ui';

export default class InvitationSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '店铺加入方式',
        rightNavTitle: '完成',
        rightTitleStyle: styles.rightItem
    };

    $NavBarRightPressed = () => {
        SpellShopApi.invitationSetting({ recruitStatus: this.state.selIndex }).then(() => {
            this.$toastShow('设置成功');
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            selIndex: null,
            bounceValue: new Animated.Value(1)//logo 尺寸
        };
    }

    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {
        //店铺信息
        SpellShopApi.getById({ storeCode: this.params.storeData.storeNumber }).then((data) => {
            let dataTemp = data.data || {};
            this.setState({
                selIndex: dataTemp.recruitStatus
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    // 点击行
    _clickRow = (index) => {
        if (index === this.state.selIndex) {
            return;
        }
        this.setState({ selIndex: index }, () => {
            Animated.sequence([
                Animated.timing(
                    this.state.bounceValue,
                    {
                        toValue: 1.5,
                        duration: 200
                    }
                ),
                Animated.spring(
                    this.state.bounceValue,
                    {
                        toValue: 1,
                        duration: 200,
                        friction: 2,// 摩擦力,默认7
                        tension: 40// 张力，默认40。
                    }
                )
            ]).start();
        });
    };

    renderRow = (value, index) => {
        const transform = index === this.state.selIndex ? [{ scale: this.state.bounceValue }] : null;
        return (<TouchableWithoutFeedback key={index} onPress={() => {
            this._clickRow(index);
        }}>
            <View style={[styles.row, index === 0 ? { marginTop: 10 } : null]}>
                <View style={styles.rowTop}>
                    <Animated.Image style={[transform ? { transform } : null]}
                                    source={index === this.state.selIndex ? SelIcon : UnSelIcon}/>
                    <Text style={styles.text} allowFontScaling={false}>{value}</Text>
                </View>
                {index === 2 ? null : <View style={styles.line}/>}
            </View>
        </TouchableWithoutFeedback>);
    };

    _render() {

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {
                        ['需要店长审核后加入', '允许任何人加入', '不允许任何人加入'].map((value, index) => {
                            return this.renderRow(value, index);
                        })
                    }
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightItem: {
        fontSize: 15,
        color: DesignRule.mainColor
    },
    row: {
        width: SCREEN_WIDTH,
        height: 44,
        backgroundColor: 'white'
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 21,
        flex: 1
    },
    text: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 11
    },
    line: {
        backgroundColor: DesignRule.lineColor_inColorBg,
        marginHorizontal: 15,
        height: StyleSheet.hairlineWidth
    }
});
