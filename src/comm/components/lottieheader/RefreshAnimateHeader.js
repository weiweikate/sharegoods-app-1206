'use strict';
import React, {useRef, useCallback,useState} from 'react';
import {StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import {
    RefreshLayout,
    RefreshHeader,
    RefreshState,
} from 'react-native-refresh';
import {MRText} from '../../../components/ui';

const RefreshStatus = {
    PULLDOWN:'下拉刷新',
    LOOSEN:'松开刷新',
    REFRESHING:'刷新中...',
    REFRESHED:'刷新完成'
}

function RefreshAnimateHeader(props) {
    const {refreshing, onRefresh, source, headerHeight = 50} = props;

    const lottieRef = useRef(React.createRef());
    const progressRef = useRef(new Animated.Value(1));
    const currentState = useRef(RefreshState.Idle);
    const [status,setStatus] = useState(RefreshStatus.PULLDOWN);

    const onPullingRefreshCallBack = useCallback((state) => {
        currentState.current = state;
        setStatus(RefreshStatus.LOOSEN);
    }, []);

    const onRefreshCallBack = useCallback(
        (state) => {
            lottieRef.current.play(24, 150);
            onRefresh && onRefresh(state);
            currentState.current = state;
            setStatus(RefreshStatus.REFRESHING);

        },
        [onRefresh],
    );

    const onEndRefreshCallBack = useCallback((state) => {
        currentState.current = state;
        setStatus(RefreshStatus.REFRESHED);
    }, []);

    const onIdleRefreshCallBack = useCallback((state) => {
        if (currentState.current === RefreshState.End) {
            lottieRef.current.play(0, 24);
            lottieRef.current.reset();
        }
        setStatus(RefreshStatus.PULLDOWN);
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
            <RefreshHeader style={[styles.container, {height: headerHeight+20}]}>
                <LottieView
                    ref={lottieRef}
                    style={[styles.lottery, {height: headerHeight}]}
                    resizeMode={'cover'}
                    loop={false}
                    autoSize={false}
                    autoPlay={false}
                    speed={3}
                    source={source}
                    hardwareAccelerationAndroid={true}
                    cacheStrategy={'strong'}
                    progress={progressRef.current.interpolate({
                        inputRange: [0, headerHeight+20, headerHeight * 3],
                        outputRange: [0, 0.10, 0.10],
                        extrapolate: 'clamp',
                    })}
                />
                <MRText style={{height:20}}>{status}</MRText>
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
