import BasePage from '../../../../BasePage';
import React from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback, Alert
} from 'react-native';
import res from '../../res';
import apiEnvironment from '../../../../api/ApiEnvironment';

const { autoSizeWidth } = ScreenUtils;

import DesignRule from '../../../../constants/DesignRule';
import { MRText as Text, MRTextInput  as TextInput } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineAPI from '../../api/MineApi';


const {
    mentor_error_icon,
    mentor_right_icon,
    mentor_search_icon
} = res.mentor;
export default class SetMentorPage extends BasePage {
    constructor(props) {
        super(props);

        this.state = {
            mentorNickName: '',
            hasError: false,
            canSet: false,
            hasSearch: false,
            searchErrorMsg: '',
            searchCode: '',
            nowSearch: ''
        };


    }

    $navigationBarOptions = {
        show: true,
        title: '我的顾问'
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    componentDidMount() {

    }


    _searchWithCode = () => {
        this.setState({
            searchCode: this.state.nowSearch
        });
        let params = {
            tutorCode: this.state.nowSearch
        };
        MineAPI.findTutor(params).then((data) => {
            this.setState({
                hasError:false,
                canSet:data.data.status === 1,
                hasSearch:true,
                searchErrorMsg:'',
                mentorNickName:data.data.nickName
            })

        }).catch((error) => {
            this.setState({
                hasError:true,
                canSet:false,
                hasSearch:true,
                searchErrorMsg:error.msg
            })
        });
    };

    _bindTutor=()=>{
        let params = {
            tutorCode: this.state.nowSearch
        };
        MineAPI.bindTutor(params).then(data=>{
            this.$toastShow('顾问设置成功');
            this._saveUser();

        }).catch((error)=>{
            this.$toastShow(error.msg)
        })
    }


    _saveUser=()=>{
        MineAPI.getUser().then(res => {
            this.$navigateBack();
        }).catch(err => {
        });
    }
    _mentorResult = () => {
        let canSet = (
            <View style={styles.rowStyle}>
                <Text style={styles.canSetTextStyle}>
                    可设置
                </Text>
                <Image resizeMode={'stretch'} source={mentor_right_icon} style={styles.iconStyle}/>
            </View>
        );

        let noCanSet = (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate('HtmlPage', {
                    title: '我的顾问',
                    uri: apiEnvironment.getCurrentH5Url() + '/static/protocol/consultant-explain.html'
                });
            }}>
                <View style={styles.rowStyle}>
                    <Text style={styles.noCanSetTextStyle}>
                        不可设置
                    </Text>
                    <Image resizeMode={'stretch'} source={mentor_error_icon} style={styles.iconStyle}/>
                </View>
            </TouchableWithoutFeedback>
        );

        return (
            <View style={styles.resultWrapper}>
                <Text style={styles.mentorNickNameStyle}>
                    顾问：{this.state.mentorNickName}
                </Text>
                {this.state.canSet ? canSet : noCanSet}
            </View>
        );
    };

    _searchErrorRender = () => {
        return (
            <View style={styles.resultWrapper}>
                <Text style={styles.errorMsgStyle}>
                    {this.state.searchErrorMsg}
                </Text>
            </View>
        );
    };

    _noSearch = () => {
        return (
            <View style={styles.resultWrapper}/>
        );
    };

    _buttonRender = () => {
        let canCommit = (this.state.searchCode === this.state.nowSearch && this.state.hasSearch && !this.state.hasError && this.state.canSet);
        let color = canCommit ? DesignRule.textColor_btnText : DesignRule.textColor_placeholder;
        return (
            <TouchableWithoutFeedback disabled={!canCommit} onPress={()=>{
                Alert.alert(
                    `你确定要将"${this.state.mentorNickName}"设置为您的顾问？`,
                    null,
                    [
                        {text: '取消', onPress: () => console.log('取消'),style: 'cancel'},
                        {text: '确定', onPress: () => this._bindTutor()},
                    ],
                    { cancelable: false }
                )
            }}>
                <View style={[styles.buttonStyle, { backgroundColor: color }]}>
                    <Text style={styles.buttonTextStyle}>
                        设置他为我的顾问
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _searchRender = () => {
        return (
            <View style={styles.searchWrapper}>
                <View style={styles.textInputWrapper}>
                    <Image resizeMode={'stretch'} source={mentor_search_icon} style={styles.searchIconStyle}/>
                    <TextInput placeholder={'请输入顾问的会员号'} style={styles.textInputStyle}
                               keyboardType={'numeric'}
                               onChangeText={(text) => {
                                   this.setState({
                                       nowSearch: text
                                   });
                               }}
                    />
                </View>

                <TouchableWithoutFeedback onPress={this._searchWithCode}>
                    <View style={styles.searchButtonWrapper}>
                        <Text style={styles.searchTextStyle}>
                            查询
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    _render() {

        let view = null;
        if (this.state.hasSearch) {
            if (this.state.hasError) {
                view = this._searchErrorRender();
            } else {
                view = this._mentorResult();
            }
        } else {
            view = this._noSearch();
        }

        return (
            <View style={styles.container}>
                <Text style={styles.titleMentorStyle}>设置我的顾问</Text>
                {this._searchRender()}
                {view}
                {this._buttonRender()}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleMentorStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_24,
        marginVertical: DesignRule.margin_listGroup,
        marginLeft: DesignRule.margin_page
    },
    textInputWrapper: {
        height: autoSizeWidth(36),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DesignRule.white,
        flex: 1,
        borderRadius: autoSizeWidth(18),
        marginRight: DesignRule.margin_page
    },
    textInputStyle: {
        color: '#333333',
        fontSize: DesignRule.fontSize_threeTitle,
        marginHorizontal: 7
    },
    resultWrapper: {
        height: 17,
        marginLeft: DesignRule.margin_page,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:10
    },
    mentorStyle: {
        color: DesignRule.textColor_mainTitle
    },
    iconStyle: {
        width: 14,
        height: 14,
        marginLeft:5
    },
    canSetTextStyle: {
        color: DesignRule.color_green,
        fontSize: DesignRule.fontSize_22,
        marginLeft: DesignRule.margin_page
    },
    noCanSetTextStyle: {
        color: DesignRule.textColor_redWarn,
        fontSize: DesignRule.fontSize_22,
        marginLeft: DesignRule.margin_page
    },
    mentorNickNameStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_22
    },
    errorMsgStyle: {
        color: DesignRule.textColor_redWarn,
        fontSize: DesignRule.fontSize_22
    },
    buttonStyle: {
        width: DesignRule.width - 80,
        height: DesignRule.height_bigBtn,
        borderRadius: DesignRule.height_bigBtn / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48,
        alignSelf: 'center'
    },
    buttonTextStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_mediumBtnText
    },
    searchWrapper: {
        width: DesignRule.width,
        paddingHorizontal: DesignRule.margin_page,
        height: 36,
        flexDirection: 'row'
    },
    searchIconStyle: {
        width: 18,
        height: 18,
        marginLeft: 16
    },
    searchButtonWrapper: {
        height: autoSizeWidth(36),
        borderRadius: autoSizeWidth(18),
        width: autoSizeWidth(63),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.white
    },
    searchTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    rowStyle:{
        flexDirection:'row',
        alignItems:'center'
    }
});
