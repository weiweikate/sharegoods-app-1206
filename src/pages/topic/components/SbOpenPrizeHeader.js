import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView


} from 'react-native';

import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import ColorUtil from '../../../utils/ColorUtil';
import UIText from '../../../comm/components/UIText';
import bridge from '../../../utils/bridge';
import SbResTool from '../res/SbResTool';

export default class SbOpenPrizeHeader extends Component {

    static propTypes = {
        subjectType: PropTypes.number,
        headerData: PropTypes.object.isRequired,
        navItemClick: PropTypes.func.isRequired
    };
    state = {
        selectSate: 0
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { imgUrl, topicNavTitleList } = this.props.headerData;
        const NavWidth = topicNavTitleList.length>5?ScreenUtils.width/5: ScreenUtils.width/topicNavTitleList.length;
        console.log(imgUrl);
        return (
            <View>
                {/*<PreLoadImage*/}
                {/*imageUri={imgUrl}*/}
                {/*style={SbOpenPrizeHeaderStyles.topImageStyle}*/}
                {/*/>*/}
                {

                    (topicNavTitleList instanceof Array && topicNavTitleList.length > 1) ?
                        <View style={SbOpenPrizeHeaderStyles.bottomDownViewBgStyle}>
                            <View
                                style={
                                    {
                                        width: ScreenUtils.width,
                                        height: 48,
                                        backgroundColor: 'white'
                                    }
                                }
                            />
                            <ScrollView
                                ref="scroll"
                                style={{
                                    position: 'absolute',
                                    height: 55,
                                    width: ScreenUtils.width,
                                    left: 0,
                                    top: 0
                                }}
                                contentContainerStyle={{
                                    flexDirection: 'row'
                                }
                                }
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <Image
                                    source={SbResTool.miaosha_qianggouzhong_img}
                                    style={[itemViewStyle.itemBgImageStyle,
                                        {
                                            // left: this.state.selectSate * ScreenUtils.width / 5
                                            left: this.state.selectSate * NavWidth
                                        }]}
                                />
                                {this._getDownTimeItemView().map(itemView => {
                                    return itemView;
                                })}
                            </ScrollView>
                        </View>
                        : null
                }
            </View>
        );
    }

    _getDownTimeItemView = () => {
        const { topicNavTitleList } = this.props.headerData;
        const NavWidth = topicNavTitleList.length>5?ScreenUtils.width/5: ScreenUtils.width/topicNavTitleList.length;
        console.log(topicNavTitleList);
        if (topicNavTitleList instanceof Array && topicNavTitleList.length > 0) {
            let tempCompoentArr = [];
            topicNavTitleList.map((item, index) => {
                tempCompoentArr.push(
                    <TouchableOpacity onPress={() => {
                        this._downItemViewClick(index, item);
                    }} key={index}>
                        <View style={[itemViewStyle.itemBgStyle,
                            // { width: ScreenUtils.width /arrAccount}
                            {width:NavWidth}
                        ]}>
                            <UIText
                                value={item.title}
                                style={[itemViewStyle.itemTopTextStyle,
                                    // { width: ScreenUtils.width /arrAccount},
                                    this.state.selectSate === index ?
                                        {
                                            color: ColorUtil.Color_ffffff
                                        } : null]}
                            />
                            {/*//先注释掉*/}
                            {/*<UIText*/}
                            {/*value={'已经开抢'}*/}
                            {/*style={*/}
                            {/*[*/}
                            {/*itemViewStyle.itemBottomTextStyle,*/}
                            {/*this.state.selectSate === index ?*/}
                            {/*{*/}
                            {/*color: ColorUtil.Color_ffffff*/}
                            {/*} : null*/}
                            {/*]*/}
                            {/*}*/}
                            {/*/>*/}
                        </View>
                    </TouchableOpacity>
                );
            });
            return tempCompoentArr;
        } else {
            return [];
        }


    };
    /**
     * 每个自导航点击的事件
     * @param index 子导航索引
     * @param item  子导航所对应的导航数据
     * @private
     */
    _downItemViewClick = (index, item) => {
        this.setState({
            selectSate: index
        });
        if (index > 2) {
            let offsetX = index * (ScreenUtils.width / 5) - (ScreenUtils.width * 2 / 5);
            this.refs.scroll.scrollTo({ x: offsetX, y: 0, animated: true });
        } else {
            this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true });
        }

        this.props.navItemClick(index, item);
        bridge.$toast('点击了 ' + item + ' 索引:' + index);
    };
}

const SbOpenPrizeHeaderStyles = StyleSheet.create({
    headerBgViewStyle: {
        backgroundColor: ColorUtil.Color_f7f7f7
    },
    topImageStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.width * 188 / 375
    },
    bottomDownViewBgStyle: {
        height: 55,
        width: ScreenUtils.width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: ColorUtil.Color_f7f7f7
    }
});

const itemViewStyle = StyleSheet.create({
    itemBgStyle: {
        width: ScreenUtils.width / 5,
        height: 48
    },
    itemBgImageStyle: {
        position: 'absolute',
        width: ScreenUtils.width / 5,
        height: 55
    },
    itemTopTextStyle: {
        flex: 1,
        zIndex: 20,
        marginTop: 5,
        color: ColorUtil.Color_222222,
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 18
    },
    itemBottomTextStyle: {
        flex: 1,
        zIndex: 20,
        color: ColorUtil.Color_999999,
        textAlign: 'center',
        fontSize: 12
    }
});


