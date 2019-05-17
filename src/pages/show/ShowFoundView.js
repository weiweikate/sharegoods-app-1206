/**
 * 精选热门
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { tag } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';

const { px2dp } = ScreenUtils;
import TimerMixin from 'react-timer-mixin';
import ReleaseButton from './components/ReleaseButton';
import user from '../../model/user';
import ShowGroundView from './components/ShowGroundView';
import ToTopButton from './components/ToTopButton';

@observer
export default class ShowFoundView extends React.Component {

    constructor(props) {
        super(props);
        this.firstLoad = true;
        this.state = {
            showEditorIcon: true,
            showToTop: false
        };

    }

    addDataToTop = (value) => {
        this.foundList && this.foundList.addDataToTop(value);
    };

    render() {
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
                                        this.lastStopScrollTime = (new Date()).getTime();
                                        TimerMixin.setTimeout(() => {
                                            if (this.lastStopScrollTime === -1) {
                                                return;
                                            }
                                            let currentTime = (new Date()).getTime();
                                            if ((currentTime - this.lastStopScrollTime) < 3000) {
                                                return;
                                            }
                                            this.setState({
                                                showEditorIcon: true
                                            });
                                        }, 3000);
                                    } else {
                                        this.lastStopScrollTime = -1;
                                        this.setState({
                                            showEditorIcon: false
                                        });
                                    }
                                }}
                />
                {
                    this.state.showEditorIcon ?
                        <ReleaseButton
                            style={{
                                position: 'absolute',
                                right: 15,
                                bottom: 118
                            }}
                            onPress={() => {
                                if (!user.isLogin) {
                                    this.props.navigate('login/login/LoginPage');
                                    return;
                                }
                                this.props.navigate('show/ReleaseNotesPage');
                            }}/> : null
                }
                {this.state.showToTop ? <ToTopButton
                    onPress={() => {
                        this.foundList && this.foundList.scrollToTop();
                    }}
                    style={{
                        position: 'absolute',
                        right: 15,
                        bottom: 70
                    }}/> : null}
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
