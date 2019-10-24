/**
 * @author xzm
 * @date 2019/10/24
 */

import React, {PureComponent} from 'react';
import {
    Animated,
    Easing,
    View,
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import {MRText} from '../../../components/ui';

const {px2dp} = ScreenUtils;
export default class SingleNumView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentNum: 0,
            transformY: new Animated.Value(0)
        }
        const {speed=100} = this.props;

        this.transformYAnimate = Animated.timing(
            this.state.transformY,
            {
                toValue: 1,
                duration: speed,
                easing: Easing.in,
            }
        );
    }

    componentDidMount() {
        this._startAnimated();
    }

    _startAnimated = () => {
        this.state.transformY.setValue(0);
        const {num} = this.props;
        const {currentNum} = this.state;
        if (num === currentNum) {
            return;
        }
        this.setState({
            currentNum: (currentNum + 1) % 10
        })
        this.transformYAnimate.start(() => this._startAnimated());
    }

    render() {
        const {fontSize = px2dp(15),singleStyle} = this.props;
        const fontHeight = fontSize * 1.4;
        const {currentNum} = this.state;
        const translateY = this.state.transformY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -fontHeight]
        });

        return (
            <View style={{height: fontHeight, overflow: 'hidden'}}>
                <Animated.View style={{transform:[ {translateY}]}}>
                    <View style={{height: fontHeight, justifyContent: 'center',}}>
                        <MRText style={[singleStyle,{fontSize:fontSize}]}>
                            {currentNum}
                        </MRText>
                    </View>
                    <View style={{height: fontHeight, justifyContent: 'center'}}>
                        <MRText style={[singleStyle,{fontSize:fontSize}]}>
                            {currentNum == 9 ? 0 : currentNum+1}
                        </MRText>
                    </View>
                </Animated.View>
            </View>
        )
    }
}


