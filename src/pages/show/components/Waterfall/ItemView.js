import React, { Component } from 'react';
import { View } from 'react-native';
export default class WaterfallItemView extends Component{
  constructor(props){
    super(props);
    this.hidden = false;
    this.height = 0;
    this.width = props.parent._getItemWidth();
    // this.state = {
    //   opacity: new Animated.Value(0)
    // }
  }
  componentWillUnmount(){}
  componentWillMount(){}
  componentWillReceiveProps(nextProps){
    if(nextProps.item !== this.props.item){
      this.setPosition(-1000, -1000);
      // this.state.opacity.setValue(0);
      this.forceUpdate();
    }
  }
  componentDidMount(){}
  componentDidUpdate(){}
  hideIt(){
    if( !this.hidden ){
      // this.state.opacity.setValue(0)
      this.hidden = true;
      this.forceUpdate();
    }
  }
  showIt(){
    if( this.hidden ){
      // this.showUp()
      this.hidden = false;
      this.forceUpdate();
    }
  }
  // showUp(){
  //   Animated.timing(
  //     this.state.opacity,{
  //       toValue:1,
  //       useNativeDriver: true,
  //       duration: 250
  //     }).start()
  // }
  _renderContent(){
    let {item, idx, renderContent, parent} = this.props;
    return renderContent && renderContent(item,idx,this,parent);
  }
  setNativeProps(...args){
    let { root } = this.refs
    root && root.setNativeProps(...args);
  }
  _onLayout = (e)=>{
    let {parent} = this.props;
    this.props.onLayout && this.props.onLayout(e)
    this.width = e.nativeEvent.layout.width;
    this.height = e.nativeEvent.layout.height;
    if(e.nativeEvent.layout.x === -1000 && e.nativeEvent.layout.y === -1000){
      parent.placeItem(this);
    }
  }
  setPosition(left,top){
    this.setNativeProps({style:{position:'absolute', left, top}});
    this.left = left;
    this.top = top;
  }
  getTop(){ return this.top; }
  getFoot(){ return this.top + this.height; }
  render(){
    return (
      <View ref={'root'} {...this.props} style={this.props.style} onLayout={this._onLayout}>
        {  this.hidden ?
            <View style={{height: this.height}}/>
            : this._renderContent()
        }
      </View>
    );
  }
}
