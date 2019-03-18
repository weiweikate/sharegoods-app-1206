import React, { Component } from "react";
import {
    ScrollView
} from "react-native";

class CommNavigation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView
                {
                    ...this.props
                }
            >
                {
                    React.Children.map(this.props.children, (child, index) => {
                        let newChild;
                        if (index === 0) {
                            newChild = React.cloneElement(child, { style: { backgroundColor: "red" } });
                        } else {
                            newChild = React.cloneElement(child);
                        }
                        return newChild;

                    })
                }
            </ScrollView>
        );

    }


}

export default CommNavigation;
