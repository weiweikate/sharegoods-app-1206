import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenUtil from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import rightImg from './res/right_arrow.png';
import user from '../../model/user';
import { observer } from 'mobx-react';
import { MemberModule } from './Modules'
import DesignRule from 'DesignRule';

@observer
export default class HomeUserView extends Component {
    constructor(props) {
        super(props);
        this.memberModule = new MemberModule();
        this.memberModule.loadMembersInfo();
    }

    _goToPromotionPage() {
        const { navigation } = this.props;
        navigation && navigation.navigate('mine/MyPromotionPage');
    }

    render() {
        if (!user.isLogin) {
            return <View/>;
        }
        let { levelName, experience } = user
        const { memberLevels, levelCount } = this.memberModule
        
        experience = experience ? experience : 0
        let items = [];
        let levelNames = [];
        let lastExp = 0
        let total = px2dp(220) / levelCount
        let expItems = []
        memberLevels.map((level, index) => {
            levelNames.push( <Text style={styles.level} key={'text' + index}>{level.name}</Text>)
            items.push(<View key={'circle' + index} style={styles.smallCircle}/>)
            if (level.name <= levelName) {
                let otherExp =  experience - lastExp
                let currentExp = level.upgradeExp - lastExp
                if (experience === 0) {
                    items.push(<View key={'line' + index} style={[styles.progressLine, { backgroundColor: '#E7AE39'}]}>
                         <View style={{flex: 1, backgroundColor: '#9B6D26' }}/>
                    </View>)
                } else {
                    index !== levelCount - 1 && items.push(<View key={'line' + index} style={[styles.progressLine, { backgroundColor: '#E7AE39'}]}>
                        <View style={{flex: otherExp}}/><View style={{flex: lastExp - otherExp, backgroundColor: '#9B6D26' }}/>
                    </View>)
                }
                if (level.name === levelName) {
                    let left = (otherExp / currentExp > 1 ? 1 : otherExp / currentExp)  *  total
                    expItems.push(<View key={'user' + index} style={[styles.block, {paddingLeft: left}]}>
                            <View style={[styles.levelBottomTextBg]}>
                                <Text style={ styles.levelBottomText }> {experience} </Text>
                            </View>
                    </View>)
                } else {
                    index !== levelCount - 1 &&  expItems.push(<View key={'user' + index} style={styles.block}/>)
                }
            } else {
                index !== levelCount - 1 && items.push(<View key={'line' + index} style={[styles.progressLine]}/>)
                index !== levelCount - 1 && expItems.push(<View key={'user' + index} style={styles.block}/>)
            }
            lastExp = level.upgradeExp
        });
        return <View>
            <View style={styles.container}>
                <LinearGradient colors={['#F7D795', '#F7D794']} style={styles.inContainer}>
                    <View style={styles.left}>
                        <Text style={styles.title}>尊敬的{levelName}会员您好</Text>
                        <View style={styles.progressView}>
                            <View style={styles.lv}>
                                {levelNames}
                            </View>
                            <View style={styles.progress}>
                                <View style={[styles.progressLine, {backgroundColor: '#9B6D26'}]}/>
                            </View>
                            <View style={styles.progress}>
                                {items}
                            </View>
                            <View style={styles.experience}>
                                {expItems}
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.right} onPress={() => this._goToPromotionPage()}>
                        <View style={[styles.circle, styles.bigCircle]}>
                            <Text style={styles.see}>特权查看</Text>
                            <Image style={styles.rightImg} source={rightImg}/>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>;
    }
}

let styles = StyleSheet.create({

    container: {
        height: px2dp(100),
        width: ScreenUtil.width,
        backgroundColor: '#fff',
        marginTop: px2dp(10)
    },
    levelBottomTextBg: {
        height: 16,
        width: px2dp(38),
        borderRadius: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -px2dp(10)
    },
    levelBottomText: {
        color: '#9B6D26',
        fontSize: 11
    },
    inContainer: {
        flex: 1,
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(5),
        flexDirection: 'row'
    },
    title: {
        marginTop: px2dp(10),
        marginLeft: px2dp(10),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(14)
    },
    left: {
        flex: 1
    },
    right: {
        width: px2dp(90),
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressView: {
        flex: 1
    },
    lv: {
        height: px2dp(22),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2dp(14)
    },
    circle: {
        borderColor: '#E7AE39'
    },
    smallCircle: {
        borderWidth: px2dp(2),
        backgroundColor: '#fff',
        width: px2dp(10),
        height: px2dp(10),
        borderRadius: px2dp(10) / 2,
        borderColor: '#E7AE39',
        overflow: 'hidden'
    },
    circleView: {
        width: px2dp(10),
        height: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center'
    },
    backLine: {
        height: px2dp(3),
        backgroundColor: '#E7AE39',
        width: px2dp(10)
    },
    bigCircle: {
        borderWidth: px2dp(4),
        backgroundColor: '#fff',
        width: px2dp(50),
        height: px2dp(50),
        borderRadius: px2dp(25),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#e7ae39',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.6
    },
    progress: {
        height : px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        left: px2dp(14),
        position: 'absolute',
        top: px2dp(22),
        right: px2dp(0)
    },
    level: {
        color: '#9B6D26',
        fontSize: px2dp(11)
    },
    see: {
        marginLeft: px2dp(4),
        color: '#9B6D26',
        fontSize: px2dp(11),
        width: 30
    },
    rightImg: {
        marginLeft: 0
    },
    levelBox: {
        position: 'absolute',
        top: 0
    },
    progressLine: {
        flex: 1,
        height: px2dp(3),
        padding: -1,
        flexDirection: 'row'
    },
    experience: {
        flex: 1,
        marginTop: px2dp(15),
        marginLeft: px2dp(14),
        flexDirection: 'row'
    },
    block: {
        height: 15,
        flex: 1
    }
});
