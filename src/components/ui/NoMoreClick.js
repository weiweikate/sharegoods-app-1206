import React, { Component } from 'react';
import {
    TouchableOpacity
} from 'react-native';

class NoMoreClick extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isDisable: false
        };
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }


    // ToPress = async () => {
    //     const {onPress} = this.props;
    //     if(onPress){
    //         onPress && onPress();
    //         await this.setState({isDisable: true})
    //         this.timer = setTimeout(async () => {
    //             await this.setState({isDisable: false})
    //         }, 500)
    //     }
    // };
    // ToPress =()=>{
    //     if(this.timer){
    //         return;
    //     }
    //     this.timer=setTimeout(()=>{
    //         clearTimeout(this.timer);
    //         this.timer=null;
    //     },1500);
    //     this.props.onPress();
    // }
    //
    // render() {
    //     const { ...attributes} = this.props;
    //     return (
    //         <TouchableOpacity
    //             onPress={this.ToPress}{...attributes}>
    //             {/*{this.props.children}*/}
    //         </TouchableOpacity>
    //     )
    // }
    render() {
        return(
            <TouchableOpacity
            onPress={this.debouncePress(this.props.onPress)}> {this.props.children}
        </TouchableOpacity>);
    }


    debouncePress = onPress => {
        // return c.throttle(onPress, 500, { leading: true, trailing: false });
        const clickTime = Date.now();
        if (!this.lastClickTime || Math.abs(this.lastClickTime - clickTime) > 500) {
            this.lastClickTime = clickTime ;
            onPress() ;
        }



    };


}

export default NoMoreClick;
