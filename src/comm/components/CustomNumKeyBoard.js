import CommModal from './CommModal'
import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'
import ScreenUtils from '../../utils/ScreenUtils'
import { MRText } from '../../components/ui'
import DesignRule from '../../constants/DesignRule'

const { px2dp } = ScreenUtils
const propTypes = {
    //是否显示键盘
    visible: PropTypes.bool,
    //是否背景为透明色 默认透明
    transparent: PropTypes.bool,
    //字符回调函数
    itemClick: PropTypes.func.isRequired,
    /**
     * 是否保存当前键盘出现一次所输入的所有状态，如果设置true，则键盘每次点击回调本次键盘出现输入的所有存储字符
     * 默认false
     */
    isSaveCurrentInputState: PropTypes.bool,
    /**
     * 关闭的回调函数
     */
    closeAction: PropTypes.func.isRequired,
    /**
     * 键盘输出的最大长度，当 isSaveCurrentInputState 为true时候有效
     * 默认-1 无限制
     */
    maxNumLength: PropTypes.number.isRequired
}

const defaultProp = {
    maxNumLength: -1
}
const numArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '回退'];

let numViewWidth = ScreenUtils.width / 3 - px2dp(12);
let numViewHeight = px2dp(40);
const styles = StyleSheet.create({

    contentStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'column'
    },
    keyBoardBgStyle: {
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        width: ScreenUtils.width,
        height: px2dp(250),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    numItemBgStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: numViewHeight,
        width: numViewWidth,
        margin: px2dp(5),
        backgroundColor: DesignRule.color_fff,
        borderRadius: px2dp(5)
    },
    numTextStyle: { fontSize: px2dp(18) }


})
export default class CustomNumKeyBoard extends Component {
    constructor(props) {
        super(props)
        this.modal = null
        this.state = {
            visible: false,
            isSaveCurrentInputState: false,
            numString: '',
            maxNumLength:-1,
        }
    }
    componentWillReceiveProps(props) {
        const { visible, isSaveCurrentInputState } = props
        if (visible !== this.state.visible ||
            isSaveCurrentInputState !== this.state.isSaveCurrentInputState
        ) {
            this.setState({
                visible: visible,
                isSaveCurrentInputState: isSaveCurrentInputState
            })
        }
    }

    _closeNumKeyBoard = () => {
        const { closeAction } = this.props
        closeAction && closeAction(false);
        this.setState({
            visible: false
        })
    }

    render() {
        const { transparent } = this.props
        return (
            <CommModal
                onRequestClose={this._closeNumKeyBoard}
                ref={(ref) => {
                    this.modal = ref;
                }}
                visible={this.state.visible}
                transparent={transparent}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this._closeNumKeyBoard();
                    }}
                >
                    <View style={styles.contentStyle}>
                        <View style={styles.keyBoardBgStyle}>
                            {
                                numArr.map((item, index) => {
                                    return this._getNumViewItem(index, item)
                                })
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </CommModal>
        )
    }

    _getNumViewItem = (index, itemText) => {
        return (
            <TouchableOpacity onPress={() => {
                this._itemClick(index, itemText)
            }}>
                <View style={styles.numItemBgStyle}>
                    <MRText style={styles.numTextStyle}>
                        {itemText}
                    </MRText>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     * 数字点击的回调
     * @param index
     * @param itemText
     * @private
     */
    _itemClick = (index, itemText) => {
        const { itemClick, isSaveCurrentInputState,maxNumLength } = this.props;
        let currentNum = this.state.numString;
        let numLength = this.state.numString.length;
        if (isSaveCurrentInputState) {
            if (maxNumLength !== -1 && numLength >= maxNumLength && itemText !== '回退') {
                itemClick && itemClick(currentNum);
            }else {
                if (/^[0-9]+$/.test(itemText)) {
                    currentNum = currentNum + itemText;
                    this.setState({
                        numString: currentNum
                    })
                    itemClick && itemClick(currentNum);
                } else if (itemText === '回退') {
                    currentNum = currentNum.substr(0, numLength - 1)
                    this.setState({
                        numString: currentNum
                    })
                    itemClick && itemClick(currentNum);
                }
            }
        } else {
            if (/^[0-9]+$/.test(itemText) || itemText === '回退') {
                    itemClick && itemClick(itemText)
            }
        }
    }
}

CustomNumKeyBoard.propTypes = propTypes;
CustomNumKeyBoard.defaultProps = defaultProp;
