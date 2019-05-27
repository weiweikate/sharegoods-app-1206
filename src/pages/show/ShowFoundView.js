/**
 * 精选热门
 */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { observer } from 'mobx-react';
import { tag } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';

const { px2dp } = ScreenUtils;
import ReleaseButton from './components/ReleaseButton';
import user from '../../model/user';
import ShowGroundView from './components/ShowGroundView';

@observer
export default class ShowFoundView extends React.Component {

    constructor(props) {
        super(props);
        this.firstLoad = true;
        this.state = {
            showEditorIcon: true,
            showToTop: false,
            rightValue: new Animated.Value(1)
        };

    }

    addDataToTop = (value) => {
        this.foundList && this.foundList.addDataToTop(value);
    };

    scrollToTop=()=>{
        if(this.state.showToTop){
            this.foundList && this.foundList.scrollToTop();
        }
    }

    releaseButtonShow = () => {
        Animated.timing(
            this.state.rightValue,
            {
                toValue: 1,
                duration: 300
            }
        ).start();
    };

    releaseButtonHidden = () => {
        Animated.timing(
            this.state.rightValue,
            {
                toValue: 0,
                duration: 300
            }
        ).start();
    };



    render() {
        const right = this.state.rightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-px2dp(22), px2dp(15)]
        });
        return (
            <View style={styles.container}>
                <ShowGroundView style={{ flex: 1 }}
                                ref={(ref) => {
                                    this.foundList = ref;
                                }}
                                uri={'/social/show/content/page/query@GET'}
                                params={{ spreadPosition: tag.Found + '' }}

                                onItemPress={({ nativeEvent }) => {
                                    const { navigate } = this.props;
                                    let params = {
                                        data: nativeEvent,
                                        ref: this.foundList,
                                        index: nativeEvent.index
                                    };
                                    if (nativeEvent.showType === 1) {
                                        navigate('show/ShowDetailPage', params);
                                    } else {
                                        navigate('show/ShowRichTextDetailPage', params);
                                    }

                                }}
                                onScrollY={({ nativeEvent }) => {
                                    this.setState({
                                        showToTop: nativeEvent.YDistance > ScreenUtils.height
                                    });
                                }}

                                onScrollStateChanged={({ nativeEvent }) => {
                                    const { state } = nativeEvent;
                                    if (state === 0) {
                                        this.releaseButtonShow();
                                    } else {
                                        this.releaseButtonHidden();
                                    }
                                }}
                />
                {
                    user.token ?
                        <Animated.View style={{
                            position: 'absolute',
                            right: right,
                            bottom: px2dp(118)
                        }}>
                            <ReleaseButton

                                onPress={() => {
                                    if (!user.isLogin) {
                                        this.props.navigate('login/login/LoginPage');
                                        return;
                                    }
                                    this.props.navigate('show/ReleaseNotesPage');
                                }}/>
                        </Animated.View> : null
                }
            </View>
        );
    }
}

let styles = StyleSheet.create({
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    recTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    text: {
        color: '#999',
        fontSize: px2dp(11),
        height: 100,
        width: 100
    },
    container: {
        flex: 1
    }
});
