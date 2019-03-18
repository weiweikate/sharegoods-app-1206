import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import DesignRule from '../../../constants/DesignRule';
import UIText from '../../../components/ui/UIText';

export default class SbOpenPrizeHeader extends Component {

    static propTypes = {
        subjectType: PropTypes.number,
        headerData: PropTypes.object.isRequired,
        navItemClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const { checkIndex } = props.headerData;
        this.state = {
            selectSate: checkIndex || 0
        };
    }

    /**/
    componentDidMount() {
        const { topicNavTitleList } = this.props.headerData;
        if (topicNavTitleList instanceof Array && topicNavTitleList.length > 0) {
            this._downItemViewClick(this.state.selectSate, topicNavTitleList[this.state.selectSate]);
        }
    }

    render() {
        const { imgUrl, topicNavTitleList } = this.props.headerData;
        const NavWidth = topicNavTitleList.length > 5 ? ScreenUtils.width / 5 : ScreenUtils.width / topicNavTitleList.length;
        // const NavWidth = ScreenUtils.width / 5;
        console.log(imgUrl);
        return (
            <View>
                {
                    (topicNavTitleList instanceof Array && topicNavTitleList.length > 0) ?
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
                                    height: 60,
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
                                <View
                                    // source={SbResTool.miaosha_qianggouzhong_img}
                                    style={[itemViewStyle.itemBgImageStyle,
                                        {
                                            left: this.state.selectSate * NavWidth,
                                            width: NavWidth
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
        const NavWidth = topicNavTitleList.length > 5 ? ScreenUtils.width / 5 : ScreenUtils.width / topicNavTitleList.length;
        // const NavWidth = ScreenUtils.width / 5;
        console.log('topicNavTitleList');
        console.log(topicNavTitleList);
        console.log('topicNavTitleList');
        if (topicNavTitleList instanceof Array && topicNavTitleList.length > 0) {
            let tempCompoentArr = [];
            topicNavTitleList.map((item, index) => {
                tempCompoentArr.push(
                    <TouchableOpacity onPress={() => {
                        this._downItemViewClick(index, item);
                    }} key={index}>
                        <View style={[itemViewStyle.itemBgStyle,
                            { width: NavWidth }
                        ]}>
                            <UIText
                                value={item.title}
                                style={[itemViewStyle.itemTopTextStyle,
                                    // { width: ScreenUtils.width /arrAccount},
                                    this.state.selectSate === index ?
                                        {
                                            color: 'white'
                                        } : null]}
                            />


                            {
                                item.subTitle && item.subTitle.length > 0 ?
                                    <UIText
                                        value={item.subTitle}
                                        style={
                                            [
                                                itemViewStyle.itemBottomTextStyle,
                                                this.state.selectSate === index ?
                                                    {
                                                        color: 'white'
                                                    } : null
                                            ]
                                        }
                                    /> :
                                    null

                            }


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
            this.refs.scroll && this.refs.scroll.scrollTo({ x: offsetX, y: 0, animated: true });
        } else {
            this.refs.scroll && this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true });
        }
        this.props.navItemClick(index, item);
    };
}

const SbOpenPrizeHeaderStyles = StyleSheet.create({
    headerBgViewStyle: {
        backgroundColor: DesignRule.bgColor
    },
    topImageStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.width * 188 / 375
    },
    bottomDownViewBgStyle: {
        height: 50,
        width: ScreenUtils.width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: DesignRule.bgColor
    }
});

const itemViewStyle = StyleSheet.create({
    itemBgImageStyle: {
        position: 'absolute',
        // width: ScreenUtils.width / 5,
        // justifyContent:'center',
        alignItems: 'center',
        height: 47,
        backgroundColor: DesignRule.mainColor
    },
    itemBgStyle: {
        width: ScreenUtils.width / 5,
        height: 50,
        // marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemTopTextStyle: {
        // flex: 1,
        zIndex: 20,
        // marginTop: 5,
        color: DesignRule.textColor_mainTitle,
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 17
    },
    itemBottomTextStyle: {
        // flex: 1,
        zIndex: 20,
        color: DesignRule.textColor_instruction,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 12
    }
});


