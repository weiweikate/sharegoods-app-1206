import React, { Component } from "react";
import {
    ScrollView,
} from "react-native";

class CommNavigation extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        return (
            <ScrollView
                {
                    ...this.props
                }
            >
                {
                    React.Children.map(this.props.children,(child,index)=>{
                        console.log('child 索引'+index);
                        return(child)
                    })
                }
            </ScrollView>
        );

    }


}

export default CommNavigation;
