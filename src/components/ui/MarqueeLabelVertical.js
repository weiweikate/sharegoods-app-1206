import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Easing} from 'react-native'

export default class MarqueeLabelVertical extends Component {
    constructor(props) {
      super(props)
      this.state = {
        translateY: new Animated.Value(0)
      }
      this.showHeadBar(0, props.dataSource.length + 1)
    }
    componentWillReceiveProps(props) {
      if(props.dataSource  && props.dataSource.length !== this.props.dataSource.length){
          this.state.translateY.setValue(0)
          Animated.timing(
            this.state.translateY
          ).stop();
        this.showHeadBar(0, props.dataSource.length + 1, 65)
      }
    }
    showHeadBar(index, count, height) {
      index++
      Animated.timing(this.state.translateY, {
        toValue: -18 * index, //40为文本View的高度
        duration: 1000, //动画时间
        Easing: Easing.linear,
        delay: 2500 //文字停留时间
      }).start((e) => {
          if (!e.finished) {
              return
          }
        if (index >= count - 2) {
          index = 0
          this.state.translateY.setValue(0)
        }
        this.showHeadBar(index, count) //循环动画
      })
    }
    _renderMarqueeView () {
        const {  dataSource, renderItems } = this.props
        let tmpArr = dataSource
        return (<View>
            {
            tmpArr.length > 0
            ?
            <Animated.View
                style={[
                styles.swiper,
                {
                    transform: [
                    {
                        translateY: this.state.translateY
                    }
                    ]
                }
                ]}
            >
                {tmpArr &&
                tmpArr.map((item, index) => {
                    return renderItems(item, index)
                })}
            </Animated.View>
            :
            null
        }
        </View>
        )
    }

    render() {
      const {  containerStyle, onPress } = this.props
      return (
        <TouchableWithoutFeedback
          onPress={
            onPress
              ? onPress
              : () => {
                  console.log('pressed')
                }
          }
        >
          <View style={[styles.container, containerStyle ? containerStyle : '']}>
            {this._renderMarqueeView()}
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      position: 'relative',
      overflow: 'hidden'
    },
    swiper: {
    },
    icon: {
      width: 15,
      height: 15,
      position: 'relative',
      top: 7,
      zIndex: 5,
      marginRight: 8
    },
    viewForText: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    text: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: 12,
      color: '#FFF',
      lineHeight: 30,
    }
  })
