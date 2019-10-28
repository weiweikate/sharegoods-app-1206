'use strict';
import React, {useCallback, useRef, useState} from 'react';
import {Animated, Platform} from 'react-native';
import LottieView from 'lottie-react-native';
import {RefreshHeader, RefreshLayout, RefreshState} from '@mr/react-native-refresh';
import {MRText} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';

const RefreshStatus = {
    PULLDOWN: '下拉刷新',
    LOOSEN: '松开刷新',
    REFRESHING: '刷新中...',
    REFRESHED: '刷新完成'
};
const lottieHeight = ScreenUtils.autoSizeWidth(70);

function RefreshAnimateHeader(props) {
    const {refreshing, onRefresh, source, headerHeight = ScreenUtils.autoSizeWidth(75), backgroundColor,headerStyle, lineTop} = props;

    const lottieRef = useRef(React.createRef());
    const progressRef = useRef(new Animated.Value(1));
    const currentState = useRef(RefreshState.Idle);
    const [status, setStatus] = useState(RefreshStatus.PULLDOWN);

    const onPullingRefreshCallBack = useCallback((state) => {
        currentState.current = state;
        setStatus(RefreshStatus.LOOSEN);
    }, []);

    const onRefreshCallBack = useCallback(
        (state) => {
            Platform.OS === 'ios' ? lottieRef.current.play() : lottieRef.current.play(24, 150);
            onRefresh && onRefresh(state);
            currentState.current = state;
            setStatus(RefreshStatus.REFRESHING);
        },
        [onRefresh]
    );

    const onEndRefreshCallBack = useCallback((state) => {
        currentState.current = state;
        setStatus(RefreshStatus.REFRESHED);
    }, []);

    const onIdleRefreshCallBack = useCallback((state) => {
        if (currentState.current === RefreshState.End && Platform.OS === 'android') {
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

    const lottie = Platform.OS === 'ios' ? <LottieView
        ref={lottieRef}
        style={{height: lottieHeight}}
        resizeMode={'cover'}
        loop={false}
        autoSize={false}
        autoPlay={false}
        speed={1}
        source={source}
        hardwareAccelerationAndroid={true}
        cacheStrategy={'strong'}
    /> : <LottieView
        ref={lottieRef}
        style={{height: lottieHeight}}
        resizeMode={'cover'}
        loop={false}
        autoSize={false}
        autoPlay={false}
        speed={3}
        source={source}
        hardwareAccelerationAndroid={true}
        cacheStrategy={'strong'}
        progress={progressRef.current.interpolate({
            inputRange: [0, lottieHeight + ScreenUtils.autoSizeWidth(20), headerHeight * 3],
            outputRange: [0, 0.10, 0.10],
            extrapolate: 'clamp'
        })}
    />;


    return (
        <RefreshLayout
            refreshing={refreshing}
            onChangeOffset={onChangeOffsetCallBack}
            onPullingRefresh={onPullingRefreshCallBack}
            onRefresh={onRefreshCallBack}
            onEndRefresh={onEndRefreshCallBack}
            onIdleRefresh={onIdleRefreshCallBack}
            backgroundColor={backgroundColor}
            lineTop={lineTop}
            height={headerHeight}
        >
            <RefreshHeader
                lineTop={lineTop}
                style={[{
                    alignItems: 'center',
                    height: headerHeight,

                },headerStyle]}>
                {lottie}
                <MRText style={{
                    height: ScreenUtils.autoSizeWidth(20),
                    color: DesignRule.textColor_instruction,
                    fontSize: DesignRule.fontSize_22
                }}>{status}</MRText>
            </RefreshHeader>
            {props.children}
        </RefreshLayout>
    );
}

export default React.memo(RefreshAnimateHeader);
