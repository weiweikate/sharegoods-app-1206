import React from 'react';
import { Animated, Image, Platform, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import styles from './style';
import emojiData from 'emoji-datasource';
import _ from 'lodash';
import ScrollableTabView from '@mr/react-native-scrollable-tab-view';
import TabBar from './tab';
import TabBarDot from './tabDot';
import stringify from './stringify';
import parse from './parse';
import PropTypes from 'prop-types';
import ViewPropTypes from './viewproptypes';
import splitter from './grapheme-splitter';
import store from '@mr/rn-store';

require('string.fromcodepoint');

const categories = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags'];
const filters = ['white_frowning_face'];
const blockIconNum = 23;
let choiceness = ['grinning', 'grin', 'joy', 'sweat_smile', 'laughing', 'wink', 'blush', 'yum', 'heart_eyes', 'kissing_heart',
    'kissing_smiling_eyes', 'stuck_out_tongue_winking_eye', 'sunglasses', 'smirk', 'unamused', 'thinking_face',
    'flushed', 'rage', 'triumph', 'sob', 'mask', 'sleeping', 'zzz', 'hankey', 'ghost', '+1', '-1', 'facepunch', 'v',
    'ok_hank', 'muscle', 'pray', 'point_up', 'lips', 'womans_hat', 'purse', 'crown', 'dog', 'panda_face', 'pig',
    'earth_asia', 'cherry_blossom', 'sunny', 'thunder_cloud_and_rain', 'zap', 'snowflake', 'birthday', 'lollipop',
    'beers', 'popcorn', 'soccer', 'airplane', 'iphone', 'tada', 'heart', 'broken_heart', 'flag_us', 'flag_cn'];

const choicenessAndroid = ['grinning', 'grin', 'joy', 'sweat_smile', 'laughing', 'wink', 'blush', 'yum', 'heart_eyes', 'kissing_heart',
    'kissing_smiling_eyes', 'stuck_out_tongue_winking_eye', 'sunglasses', 'smirk', 'unamused',
    'flushed', 'rage', 'triumph', 'sob', 'mask', 'sleeping', 'zzz', 'hankey', 'ghost', '+1', '-1', 'facepunch', 'v',
    'ok_hank', 'muscle', 'pray', 'point_up', 'lips', 'womans_hat', 'purse', 'crown', 'dog', 'panda_face', 'pig',
    'earth_asia', 'cherry_blossom', 'sunny', 'thunder_cloud_and_rain', 'zap', 'snowflake', 'birthday', 'lollipop',
    'beers', 'soccer', 'airplane', 'iphone', 'tada', 'heart', 'broken_heart', 'flag_us', 'flag_cn'];

const HISTORY_STORAGE = '@mr/history_storage';
const HISTORY_TYPE = 'history_type';

class Emoticons extends React.Component {
    constructor(props) {
        super(props);
        this._classify = this._classify.bind(this);
        this._onEmoticonPress = this._onEmoticonPress.bind(this);
        this.state = {
            data: [],
            groupIndex: Platform.OS === 'android' ? 1 : 1,
            // showWV: false,
            position: new Animated.Value(this.props.show ? 0 : -300),
            // wvPosition: new Animated.Value(-height),
            history: [],
            currentMainTab: 0,
            currentDotTab: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        Platform.OS === 'android' ? choiceness = choicenessAndroid : '';
    }

    static defaultProps = {
        show: false,
        concise: true,
        showHistoryBar: true,
        showPlusBar: true,
        asyncRender: false
    };

    componentDidMount() {
        store.get(HISTORY_STORAGE).then((result) => {
            this.setState({ history: result });
        });
    }

    componentWillMount() {
        if (this.props.showPlusBar) {
            this.setState({ groupIndex: this.state.groupIndex++ });
            this.setState({ currentMainTab: ++this.state.currentMainTab });
        }

        if (this.props.showHistoryBar) {
            this.setState({ groupIndex: this.state.groupIndex++ });
            this.setState({ currentMainTab: ++this.state.currentMainTab });
        }
        this._classify();
    }

    componentWillUnmount() {
        let result = this.state.history;
        store.save(HISTORY_STORAGE, result);
    }

    _charFromCode(utf16) {
        return String.fromCodePoint(...utf16.split('-').map(u => '0x' + u));
    }

    _classify() {
        let filteredData = emojiData.filter(e => !_.includes(filters, e.short_name));
        let sortedData = _.orderBy(filteredData, 'sort_order');
        let groupedData = _.groupBy(sortedData, 'category');

        if (this.props.concise) {
            filteredData = emojiData.filter(e => _.includes(choiceness, e.short_name));
            const temp = [];
            _.mapKeys(filteredData, (value) => {
                temp.push({
                    code: this._charFromCode(value.unified),
                    name: value.short_name
                });
            });
            _.each(choiceness, (value) => {
                const one = temp.filter(e => _.includes([value], e.name));
                if (one && one[0]) {
                    this.state.data.push(one[0]);
                }
            });
        } else {
            this.state.data = _.mapValues(groupedData, group => group.map((value) => {
                return {
                    code: this._charFromCode(value.unified),
                    name: value.short_name
                };
            }));
        }

    }

    _onChangeTabMain(data) {
        this.setState({ currentMainTab: data.i });
    }

    _onChangeTabDot(data) {
        this.state.currentDotTab[this.state.currentMainTab] = data.i;
        this.setState({ currentDotTab: this.state.currentDotTab });
    }

    _onPlusPress() {
        this.setState({ showWV: true });
    }

    _onEmoticonPress(val, type) {
        if (this.props.onEmoticonPress) {
            this.props.onEmoticonPress(val);
            type === HISTORY_TYPE ? null : this._history(val);
        }

    }

    _onBackspacePress() {
        if (this.props.onBackspacePress) {
            this.props.onBackspacePress();
        }
    }

    _onCloseWV() {
        this.setState({ showWV: false });
    }

    _history = (val) => {
        let result = this.state.history;
        let value = _.clone(val);
        if (result) {
            // result = JSON.parse(result);
            let valIndex = _.find(result, value);
            if (valIndex) {
                // valIndex.freq++;
                _.remove(result, { name: valIndex.name });
                result.push(valIndex);
            } else {
                // value.freq = 1;
                result.push(value);
            }
        }
        this.setState({ history: result });

    };

    group = (emoji, type) => {
        let groupView = [];
        const blocks = Math.ceil(emoji.length / blockIconNum);
        for (let i = 0; i < blocks; i++) {
            let ge = _.slice(emoji, i * blockIconNum, (i + 1) * blockIconNum);
            groupView.push(
                <View style={styles.groupView} key={emoji[0].name + 'block' + i}>
                    {
                        ge.map((value, key) => {
                            console.log('key---' + key + '--value--' + value);
                            // if (( this.state.currentDotTab[this.state.currentMainTab] == i))
                            return (
                                <TouchableHighlight
                                    underlayColor={'#f1f1f1'}
                                    onPress={() => this._onEmoticonPress(value, type)}
                                    style={styles.emojiTouch}
                                    key={Math.random() + value.name}
                                >
                                    <Text
                                        style={styles.emoji}
                                    >
                                        {value.code}
                                    </Text>
                                </TouchableHighlight>
                            );

                        })
                    }
                    <View style={{ flex: 1 }}/>
                    {
                        (this.state.currentDotTab[this.state.currentMainTab] == i)
                        || !this.props.asyncRender ? (<TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this._onBackspacePress()}
                            style={[styles.emojiTouch, styles.delete]}
                        >
                            <Image
                                resizeMode={'contain'}
                                style={styles.backspace}
                                source={require('./backspace.png')}/>
                        </TouchableOpacity>) : null
                    }


                </View>
            );
        }
        return groupView;
    };

    render() {


        let groupsView = [];
        const plusButton = <View
            tabLabel={'plus'}
            style={styles.cateView}
            key={'0_plus'}
        />;

        // const histroyView = group(the.state.history);
        const history = <View
            tabLabel={'history'}
            style={styles.cateView}
            key={'0_history'}
        >
            <ScrollableTabView
                tabBarPosition='bottom'
                renderTabBar={() => <TabBarDot {...this.props} />}
                onChangeTab={this._onChangeTabDot.bind(this)}
                initialPage={0}
                tabBarActiveTextColor="#fc7d30"
                style={styles.scrollGroupTable}
                tabBarUnderlineStyle={{ backgroundColor: '#fc7d30', height: 2 }}
            >
                {
                    this.group(this.state.history, HISTORY_TYPE)
                }
            </ScrollableTabView>
        </View>;
        if (this.props.showPlusBar) {
            groupsView.push(plusButton);
        }

        // if (this.props.showHistoryBar) {
        //     groupsView.push(history);
        // }
        if (this.props.concise) {
            const groupView = this.group(this.state.data);

            groupsView.push(
                <View
                    tabLabel={this.state.data[0].code}
                    style={styles.cateView}
                    key={this.state.data[0].name}
                >
                    <ScrollableTabView
                        tabBarPosition='bottom'
                        renderTabBar={() => <TabBarDot {...this.props} />}
                        onChangeTab={this._onChangeTabDot.bind(this)}
                        initialPage={0}
                        tabBarActiveTextColor="#fc7d30"
                        style={styles.scrollGroupTable}
                        tabBarUnderlineStyle={{ backgroundColor: '#fc7d30', height: 2 }}
                    >
                        {
                            groupView
                        }
                    </ScrollableTabView>

                </View>
            );
        } else {
            _.each(categories, (value, key) => {
                const groupView = this.group(this.state.data[value]);
                if (groupView.length >= 0) {
                    groupsView.push(
                        <View
                            tabLabel={this.state.data[value][0].code}
                            style={styles.cateView}
                            key={value}
                        >
                            <ScrollableTabView
                                tabBarPosition='bottom'
                                renderTabBar={() => <TabBarDot {...this.props}/>}
                                onChangeTab={this._onChangeTabDot.bind(this)}
                                initialPage={0}
                                tabBarActiveTextColor="#fc7d30"
                                style={styles.scrollGroupTable}
                                tabBarUnderlineStyle={{ backgroundColor: '#fc7d30', height: 2 }}
                            >
                                groupsView.push(history);

                                {
                                    groupView
                                }
                            </ScrollableTabView>

                        </View>
                    );
                }
            });
        }


        return (
            <Animated.View style={[styles.container, { bottom: this.state.position }, this.props.style]}>
                <ScrollableTabView
                    tabBarPosition='overlayBottom'
                    renderTabBar={() => <TabBar {...this.props} onPlusPress={this._onPlusPress.bind(this)}/>}
                    initialPage={this.state.groupIndex}
                    onChangeTab={this._onChangeTabMain.bind(this)}
                    tabBarActiveTextColor="#fc7d30"
                    style={styles.scrollTable}
                    tabBarUnderlineStyle={{ backgroundColor: '#fc7d30', height: 2 }}
                >
                    {history}
                    {groupsView}
                </ScrollableTabView>

            </Animated.View>
        );
    }
}

Emoticons.propTypes = {
    onEmoticonPress: PropTypes.func.isRequired,
    onBackspacePress: PropTypes.func,
    style: ViewPropTypes.style,
    show: PropTypes.bool,
    concise: PropTypes.bool,
    showHistoryBar: PropTypes.bool,
    showPlusBar: PropTypes.bool,
    asyncRender: PropTypes.bool
};


export default Emoticons;
export {
    stringify as stringify,
    parse as parse,
    splitter as splitter
};
