/**
 * @providesModule FlyImageZoom
 * @flow
 * 图片缩放
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
} from 'react-native';



export type Props = {

  onClick?: ()=>void,

      /**
       * 操作区域宽度
       */
      cropWidth: number,

      /**
       * 操作区域高度
       */
      cropHeight: number,

      /**
       * 图片宽度
       */
      imageWidth: number,

      /**
       * 图片高度
       */
      imageHeight: number,

      /**
       * 单手是否能移动图片
       */
      panToMove?: boolean,

      /**
       * 多手指是否能缩放
       */
      pinchToZoom?: boolean,

      /**
       * 手指按住少于多少毫秒认为是退出
       */
      leaveStayTime?: number,

      /**
       * 手指按住后位移少于多少认为是退出
       */
      leaveDistance?: number,

      /**
       * 横向超出的距离，父级做图片切换时，可以监听这个函数
       * 当此函数触发时，可以做切换操作
       */
      horizontalOuterRangeOffset?: (offsetX?: number)=>void,

      /**
       * 触发想切换到左边的图，向左滑动速度超出阈值时触发
       */
      onDragLeft?: ()=>void,

      /**
       * 松手但是没有取消看图的回调
       */
      responderRelease?: (vx: number)=>void,

      /**
       * 最大滑动阈值
       */
      maxOverflow?: number,

      /**
       * 长按的阈值（毫秒）
       */
      longPressTime?: number,

      /**
       * 长按的回调
       */
      onLongPress?: ()=>void,

      /**
       * 双击的回调
       */
      onDoubleClick?: ()=>void,

      /**
       * 透传
       */
      others?: any,
}

 class FlyImageZoom extends Component{
// 上次/当前/动画 x 位移
 static defaultProps =   {onClick : ()=> {
 },
   onLongPress : ()=> {
   },
   panToMove : true,
   pinchToZoom : true,
   cropWidth : 100,
   cropHeight : 100,
   imageWidth : 100,
   imageHeight : 100,
   source : '',
   longPressTime : 2000,
   leaveStayTime : 100,
   leaveDistance : 10,
   maxOverflow : 100,
   horizontalOuterRangeOffset : ()=> {
   },
   responderRelease : ()=> {
   },
   onDoubleClick : ()=> {
   },
   canDoubleTouch : false,
 }
  state= {centerX : 0.5,
  centerY : 0.5}
 lastPositionX;
 positionX = 0;
 animatedPositionX = new Animated.Value(0);

// 上次/当前/动画 y 位移
     lastPositionY;
     positionY = 0;
     animatedPositionY = new Animated.Value(0);
    // 缩放大小
     scale = 1;
     animatedScale = new Animated.Value(1);
     zoomLastDistance;
     zoomCurrentDistance = 0;
// 图片手势处理
     imagePanResponder;

    // 图片视图当前中心的位置
    //private centerX: number
    //private centerY: number

    // 上次手按下去的时间
    lastTouchStartTime;

   // 滑动过程中，整体横向过界偏移量
     horizontalWholeOuterCounter = 0;
    // 滑动过程中，x y的总位移
     horizontalWholeCounter = 0;
     verticalWholeCounter = 0;
    // 两手距离中心点位置
     centerDiffX = 0;
     centerDiffY = 0;
 longPressTimeout;

// 上一次点击的时间
     lastClickTime = 0;

    // 双击时的位置
    doubleClickX = 0;
    doubleClickY = 0;
   //是否双击缩放了rr
     isDoubleClickScale = false;
  componentWillMount(){
    this.imagePanResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

        // gestureState.{x,y}0 现在会被设置为0
                this.lastPositionX = null;
                this.lastPositionY = null;
                this.zoomLastDistance = null;
                this.horizontalWholeCounter = 0;
                this.verticalWholeCounter = 0;
                this.lastTouchStartTime = new Date().getTime();
                this.isDoubleClickScale = false;

                if (evt.nativeEvent.changedTouches.length > 1) {
                 this.centerDiffX = (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2 - this.props.cropWidth / 2;
                 this.centerDiffY = (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2 - this.props.cropHeight / 2;
             }

            // 计算长按
               if (this.longPressTimeout) {
                   clearTimeout(this.longPressTimeout);
               }
               this.longPressTimeout = setTimeout(()=> {

                   if(this.props.onLongPress){
                     this.props.onLongPress();
                   }else {

                   }
               }, this.props.longPressTime);

               if (evt.nativeEvent.changedTouches.length <= 1) {
                    // 一个手指的情况
                    if (new Date().getTime() - this.lastClickTime < 175) {
                        // 认为触发了双击
                        this.lastClickTime = 0;
                        this.props.onDoubleClick();

                        // // 取消长按
                         clearTimeout(this.longPressTimeout);
                        //
                        // // 因为可能触发放大，因此记录双击时的坐标位置
                         this.doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
                         this.doubleClickY = evt.nativeEvent.changedTouches[0].pageY;
                        //
                        // 缩放
                        if(this.props.canDoubleTouch){
                         this.isDoubleClickScale = true;
                        if (this.scale > 1 || this.scale < 1) {
                            // 回归原位
                            this.scale = 1;

                            this.positionX = 0;
                            this.positionY = 0;
                        } else {
                            // 开始在位移地点缩放
                            // 记录之前缩放比例
                            // const beforeScale = this.scale;

                            // 开始缩放
                            this.scale = 2;

                            // 缩放 diff
                            // const diffScale = this.scale - beforeScale;
                            // 找到两手中心点距离页面中心的位移
                            // 移动位置
                          //   this.positionX = this.doubleClickX * diffScale / this.scale;
                          //  this.positionY = this.doubleClickY * diffScale / this.scale;

                            this.positionX = 0;
                            this.positionY = 0;
                        }
                      }
                        Animated.timing(this.animatedScale, {
                            toValue: this.scale,
                            duration: 100,
                        }).start();
                        Animated.timing(this.animatedPositionX, {
                            toValue: this.positionX,
                            duration: 100,
                        }).start();
                        Animated.timing(this.animatedPositionY, {
                            toValue: this.positionY,
                            duration: 100,
                        }).start();
                    } else {
                        this.lastClickTime = new Date().getTime();
                    }
                }
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}

        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}

        if (evt.nativeEvent.changedTouches.length <= 1) {

                   // x 位移
                   let diffX = gestureState.dx - this.lastPositionX;
                   if (this.lastPositionX === null) {
                       diffX = 0;
                   }
                   // y 位移
                   let diffY = gestureState.dy - this.lastPositionY;
                   if (this.lastPositionY === null) {
                       diffY = 0;
                   }

                   // 保留这一次位移作为下次的上一次位移
                   this.lastPositionX = gestureState.dx;
                   this.lastPositionY = gestureState.dy;

                   this.horizontalWholeCounter += diffX;
                   this.verticalWholeCounter += diffY;

                   if (Math.abs(this.horizontalWholeCounter) > 5 || Math.abs(this.verticalWholeCounter) > 5) {
                       // 如果位移超出手指范围，取消长按监听
                       clearTimeout(this.longPressTimeout);
                   }

                   if (this.props.pinchToZoom) {
                       // diffX > 0 表示手往右滑，图往左移动，反之同理
                       // horizontalWholeOuterCounter > 0 表示溢出在左侧，反之在右侧，绝对值越大溢出越多
                       if (this.props.imageWidth * this.scale > this.props.cropWidth) { // 如果图片宽度大图盒子宽度， 可以横向拖拽
                           // 没有溢出偏移量或者这次位移完全收回了偏移量才能拖拽
                           if (this.horizontalWholeOuterCounter > 0) { // 溢出在右侧
                               if (diffX < 0) { // 从右侧收紧
                                   if (this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                                       // 偏移量还没有用完
                                       this.horizontalWholeOuterCounter += diffX;
                                       diffX = 0;
                                   } else {
                                       // 溢出量置为0，偏移量减去剩余溢出量，并且可以被拖动
                                       diffX += this.horizontalWholeOuterCounter;
                                       this.horizontalWholeOuterCounter = 0;
                                       this.props.horizontalOuterRangeOffset(0);
                                   }
                               } else { // 向右侧扩增
                                   this.horizontalWholeOuterCounter += diffX;
                               }

                           } else if (this.horizontalWholeOuterCounter < 0) { // 溢出在左侧
                               if (diffX > 0) { // 从左侧收紧
                                   if (Math.abs(this.horizontalWholeOuterCounter) > diffX) {
                                       // 偏移量还没有用完
                                       this.horizontalWholeOuterCounter += diffX;
                                       diffX = 0;
                                   } else {
                                       // 溢出量置为0，偏移量减去剩余溢出量，并且可以被拖动
                                       diffX += this.horizontalWholeOuterCounter;
                                       this.horizontalWholeOuterCounter = 0;
                                       this.props.horizontalOuterRangeOffset(0);
                                   }
                               } else { // 向左侧扩增
                                   this.horizontalWholeOuterCounter += diffX;
                               }
                           } else {
                               // 溢出偏移量为0，正常移动
                           }

                           // 产生位移
                           this.positionX += diffX / this.scale;

                           // 但是横向不能出现黑边
                           // 横向能容忍的绝对值
                           let horizontalMax = (this.props.imageWidth * this.scale - this.props.cropWidth) / 2 / this.scale;
                           if (this.positionX < -horizontalMax) { // 超越了左边临界点，还在继续向左移动
                               this.positionX = -horizontalMax;

                               // 让其产生细微位移，偏离轨道
                               this.horizontalWholeOuterCounter += -1 / 1e10;
                           } else if (this.positionX > horizontalMax) { // 超越了右侧临界点，还在继续向右移动
                               this.positionX = horizontalMax;

                               // 让其产生细微位移，偏离轨道
                               this.horizontalWholeOuterCounter += 1 / 1e10;
                           }
                           this.animatedPositionX.setValue(this.positionX);
                       } else {
                           // 不能横向拖拽，全部算做溢出偏移量;
                           this.horizontalWholeOuterCounter += diffX;
                       }

                       // 溢出量不会超过设定界限
                       if (this.horizontalWholeOuterCounter > this.props.maxOverflow) {
                           this.horizontalWholeOuterCounter = this.props.maxOverflow;
                       } else if (this.horizontalWholeOuterCounter < -this.props.maxOverflow) {
                           this.horizontalWholeOuterCounter = -this.props.maxOverflow;
                       }

                       if (this.horizontalWholeOuterCounter !== 0) {
                           // 如果溢出偏移量不是0，执行溢出回调
                           this.props.horizontalOuterRangeOffset(this.horizontalWholeOuterCounter);
                       }

                       if (this.props.imageHeight * this.scale > this.props.cropHeight) {
                           // 如果图片高度大图盒子高度， 可以纵向拖拽
                           this.positionY += diffY / this.scale;
                           this.animatedPositionY.setValue(this.positionY);
                       }
                   }
               } else {
                   // 多个手指的情况
                   // 取消长按状态
                  //  if (this.longPressTimeout) {
                  //      clearTimeout(this.longPressTimeout);
                  //  }

                   if (this.props.panToMove) {

                       // 找最小的 x 和最大的 x
                       let minX;
                       let maxX;
                       if (evt.nativeEvent.changedTouches[0].locationX > evt.nativeEvent.changedTouches[1].locationX) {
                           minX = evt.nativeEvent.changedTouches[1].pageX;
                           maxX = evt.nativeEvent.changedTouches[0].pageX;
                       } else {
                           minX = evt.nativeEvent.changedTouches[0].pageX;
                           maxX = evt.nativeEvent.changedTouches[1].pageX;
                       }

                       let minY;
                       let maxY;
                       if (evt.nativeEvent.changedTouches[0].locationY > evt.nativeEvent.changedTouches[1].locationY) {
                           minY = evt.nativeEvent.changedTouches[1].pageY;
                           maxY = evt.nativeEvent.changedTouches[0].pageY;
                       } else {
                           minY = evt.nativeEvent.changedTouches[0].pageY;
                           maxY = evt.nativeEvent.changedTouches[1].pageY;
                       }

                       let widthDistance = maxX - minX;
                       let heightDistance = maxY - minY;
                       let diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance);
                       this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1));

                       if (this.zoomLastDistance !== null) {
                           let distanceDiff = (this.zoomCurrentDistance - this.zoomLastDistance) / 200;
                           let zoom = this.scale + distanceDiff;

                           if (zoom < 0.6) {
                               zoom = 0.6;
                           }
                           if (zoom > 10) {
                               zoom = 10;
                           }

                           // 记录之前缩放比例
                           let beforeScale = this.scale;

                           // 开始缩放
                           this.scale = zoom;


                           this.animatedScale.setValue(this.scale);

                           // 图片要慢慢往两个手指的中心点移动
                           // 缩放 diff
                           let diffScale = this.scale - beforeScale;
                           // 找到两手中心点距离页面中心的位移
                           // 移动位置
                           this.positionX -= this.centerDiffX * diffScale / this.scale;
                           this.positionY -= this.centerDiffY * diffScale / this.scale;
                           this.animatedPositionX.setValue(this.positionX);
                           this.animatedPositionY.setValue(this.positionY);
                       }
                       this.zoomLastDistance = this.zoomCurrentDistance;
                   }
               }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。

        // 双击缩放了，结束手势就不需要操作了
              if (this.isDoubleClickScale) {
                  return;
              }

              // 手势完成,如果是单个手指、距离上次按住只有预设秒、滑动距离小于预设值,认为是单击
              let stayTime = new Date().getTime() - this.lastTouchStartTime;
              let moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
              if (evt.nativeEvent.changedTouches.length === 1 && stayTime < this.props.leaveStayTime && moveDistance < this.props.leaveDistance) {
                  this.props.onClick();
              } else {
                  this.props.responderRelease(gestureState.vx)
              }

              if (this.scale < 1) {
                  // 如果缩放小于1，强制重置为 1
                  this.scale = 1;
                  Animated.timing(this.animatedScale, {
                      toValue: this.scale,
                      duration: 100,
                  }).start();
              }

              if (this.props.imageWidth * this.scale <= this.props.cropWidth) {
                  // 如果图片宽度小于盒子宽度，横向位置重置
                  this.positionX = 0;
                  Animated.timing(this.animatedPositionX, {
                      toValue: this.positionX,
                      duration: 100,
                  }).start();
              }

              if (this.props.imageHeight * this.scale <= this.props.cropHeight) {
                  // 如果图片高度小于盒子高度，纵向位置重置
                  this.positionY = 0;
                  Animated.timing(this.animatedPositionY, {
                      toValue: this.positionY,
                      duration: 100,
                  }).start();
              }

              // 横向肯定不会超出范围，由拖拽时控制
              // 如果图片高度大于盒子高度，纵向不能出现黑边
              if (this.props.imageHeight * this.scale > this.props.cropHeight) {
                  // 纵向能容忍的绝对值
                  let verticalMax = (this.props.imageHeight * this.scale - this.props.cropHeight) / 2 / this.scale;
                  if (this.positionY < -verticalMax) {
                      this.positionY = -verticalMax;
                  } else if (this.positionY > verticalMax) {
                      this.positionY = verticalMax;
                  }
                  Animated.timing(this.animatedPositionY, {
                      toValue: this.positionY,
                      duration: 100,
                  }).start();
              }

              // 拖拽正常结束后,如果没有缩放,直接回到0,0点
              if (this.scale === 1) {
                  this.positionX = 0;
                  this.positionY = 0;
                  Animated.timing(this.animatedPositionX, {
                      toValue: this.positionX,
                      duration: 100,
                  }).start();
                  Animated.timing(this.animatedPositionY, {
                      toValue: this.positionY,
                      duration: 100,
                  }).start();
              }

              // 水平溢出量置空
              this.horizontalWholeOuterCounter = 0;

              // 取消长按
              if (this.longPressTimeout) {
                  clearTimeout(this.longPressTimeout);
              }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    });
  }

  handleLayout(event: React.LayoutChangeEvent) {
        //  this.centerX = event.nativeEvent.layout.x + event.nativeEvent.layout.width / 2;
        //  this.centerY = event.nativeEvent.layout.y + event.nativeEvent.layout.height / 2;
     }


  /**
       * 重置大小和位置
       */
       reset() {
          this.scale = 1;
          this.animatedScale.setValue(this.scale);
          this.positionX = 0;
          this.animatedPositionX.setValue(this.positionX);
          this.positionY = 0;
          this.animatedPositionY.setValue(this.positionY);
      }
      render() {
        let animateConf = {
            transform: [{
                scale: this.animatedScale
            }, {
                translateX: this.animatedPositionX
            }, {
                translateY: this.animatedPositionY
            }]
        }

        return (
            <View style={[styles.container, {width:this.props.cropWidth,height:this.props.cropHeight}]} {...this.imagePanResponder.panHandlers}>
                <Animated.View style={animateConf}>
                    <View onLayout={this.handleLayout.bind(this)}
                          style={{width:this.props.imageWidth,height:this.props.imageHeight}}>
                        {this.props.children}
                    </View>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create(  {container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent', // fix 0.36 bug, see: https://github.com/facebook/react-native/issues/10782
    }});

    module.exports = FlyImageZoom;
