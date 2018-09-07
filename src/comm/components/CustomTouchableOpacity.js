
import {
    TouchableOpacity
} from 'react-native'

export default  class CustomTouchableOpacity extends TouchableOpacity{

    isCalled = false ;
    timer= null;
    constructor(props){
        super(props)
        if (props.onPress){
            props.onPress = this.HandlerOnceTap(props.onPress)
        }
    }
    HandlerOnceTap = (functionTobeCalled, interval = 1000) => {
        if (!this.isCalled) {
           this.isCalled = true;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isCalled = false;
            }, interval);
            return functionTobeCalled();
        }
    };

}
