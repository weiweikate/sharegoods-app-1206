import React, {Component} from 'react'
import {TextInput} from 'react-native'
class AutoExpandingInput extends Component{
    constructor(props) {
        super(props)
        this.state = {
            height:35,
        }
    }
    onContentSizeChange(event) {
        this.setState({height: event.nativeEvent.contentSize.height});
    }
    render() {
        return (
            <TextInput {...this.props}
                       multiline={true}
                       onChange={this.onChange}
                       onContentSizeChange={this.onContentSizeChange.bind(this)}
                       style={[this.props.style,{height:Math.max(35,this.state.height)}]}
                       value={this.state.text}
                       underlineColorAndroid={'transparent'}
            />
        );
    }
}
export default AutoExpandingInput
