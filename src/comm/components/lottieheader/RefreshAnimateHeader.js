'use strict';
import React, {useRef, useCallback} from 'react';
import {StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import {
    RefreshLayout,
    RefreshHeader,
    RefreshState,
} from 'react-native-refresh';


function RefreshAnimateHeader(props) {
    const {refreshing, onRefresh, source, headerHeight = 50} = props;

    const lottieRef = useRef(React.createRef());
    const progressRef = useRef(new Animated.Value(1));
    const currentState = useRef(RefreshState.Idle);

    const onPullingRefreshCallBack = useCallback((state) => {
        currentState.current = state;
    }, []);

    const onRefreshCallBack = useCallback(
        (state) => {
            lottieRef.current.play(16, 100);
            onRefresh && onRefresh(state);
            currentState.current = state;
        },
        [onRefresh],
    );

    const onEndRefreshCallBack = useCallback((state) => {
        currentState.current = state;
    }, []);

    const onIdleRefreshCallBack = useCallback((state) => {
        if (currentState.current === RefreshState.End) {
            lottieRef.current.play(0, 16);
            lottieRef.current.reset();
        }
        currentState.current = state;
    }, []);

    const onChangeOffsetCallBack = useCallback((event) => {
        const {offset} = event.nativeEvent;
        if (
            currentState.current !== RefreshState.Refreshing &&
            currentState.current !== RefreshState.End
        ) {
            progressRef.current.setValue(offset);
        }
    }, []);

    return (
        <RefreshLayout
            refreshing={refreshing}
            onChangeOffset={onChangeOffsetCallBack}
            onPullingRefresh={onPullingRefreshCallBack}
            onRefresh={onRefreshCallBack}
            onEndRefresh={onEndRefreshCallBack}
            onIdleRefresh={onIdleRefreshCallBack}
        >
            <RefreshHeader style={[styles.container, {height: headerHeight}]}>
                <LottieView
                    ref={lottieRef}
                    style={[styles.lottery, {height: headerHeight}]}
                    resizeMode={'cover'}
                    loop={false}
                    autoSize={false}
                    autoPlay={false}
                    speed={2}
                    source={source}
                    hardwareAccelerationAndroid={true}
                    cacheStrategy={'strong'}
                    progress={progressRef.current.interpolate({
                        inputRange: [0, headerHeight * 1.2, headerHeight * 3],
                        outputRange: [0, 0.12, 0.12],
                        extrapolate: 'clamp',
                    })}
                />
            </RefreshHeader>
            {props.children}
        </RefreshLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottery: {
        height: 50,
    },
});

export default React.memo(RefreshAnimateHeader);
