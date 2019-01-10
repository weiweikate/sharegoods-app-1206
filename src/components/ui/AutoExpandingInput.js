import React, { Component } from 'react';
import { MRTextInput as TextInput } from './UIText';

class AutoExpandingInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            defaultValue: props.defaultValue
        };
    }

    onContentSizeChange(event) {
        this.setState({ height: event.nativeEvent.contentSize.height });
    }

    render() {
        return (
            <TextInput {...this.props}
                       multiline={true}
                       onChange={this.onChange}
                       onContentSizeChange={this.onContentSizeChange.bind(this)}
                       style={[this.props.style, { height: Math.max(80, this.state.height) }]}
                       defaultValue={this.state.defaultValue}
                       scrollEnabled={false}
                //showsVerticalScrollIndicator={false}
            />
        );
    }
}

export default AutoExpandingInput;
