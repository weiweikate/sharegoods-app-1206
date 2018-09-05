import {
    View,
    StyleSheet

} from 'react-native'
import React, {Component} from 'react'
import ColorUtil from "../../utils/ColorUtil";

export  default  class CommSpaceLine extends Component {

    constructor(props){
        super(props)
        this.style = props.style
    }

    render(){
        return(
            <View style={[Styles.CommLineStyle,this.style]}/>
        )
    }
}
const Styles = StyleSheet.create({
    CommLineStyle:{
        height:0.5,
        backgroundColor:ColorUtil.lineColor
    }
})
