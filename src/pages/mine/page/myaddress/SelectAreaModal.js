/**
 * @author zhoujianxin
 * @date on 2019/10/11.
 * @desc 地区选择弹框
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image
} from 'react-native';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';

import res from '../../res';
import MineAPI from '../../api/MineApi';
import {MRText} from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import DesignRule from '../../../../constants/DesignRule';
import Modal from '../../../../comm/components/CommModal';
import ScreenUtils from '../../../../utils/ScreenUtils';
import EmptyUtils from '../../../../utils/EmptyUtils';


@observer
export default class SelectAreaModal extends Component {
    addressSelectModel = new AddressSelectModel();

    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    componentDidMount() {
        this.addressSelectModel.requestWithCode(0);
    }

    dealData = (data) => {
        let arr = [];
        let code = 0;
        let index = 0;
        if (data.provinceCode && data.provinceName) {
            arr.push({code: data.provinceCode, name: data.provinceName, fatherCode: 0});
            index = 0;
            code = 0;
        }

        if (data.cityCode && data.cityName) {
            arr.push({code: data.cityCode, name: data.cityName, fatherCode: data.provinceCode || ''});
            index = 1;
            code = data.provinceCode;
        }

        if (data.areaCode && data.areaName) {
            arr.push({code: data.areaCode, name: data.areaName, fatherCode: data.cityCode || ''});
            index = 2;
            code = data.cityCode;
        }

        if (data.streetCode && data.streetName) {
            arr.push({code: data.streetCode, name: data.streetName, fatherCode: data.areaCode || ''});
            index = 3;
            code = data.areaCode;
        }
        return {arr, code ,index};
    }

    open(data) {
        const {setSelectItems,requestWithCode} = this.addressSelectModel;
        if (data && data.from === 'edit') {
            let initSelectData = this.dealData(data);
            this.addressSelectModel.itemIndex = initSelectData.index;
            setSelectItems(initSelectData.arr);
            requestWithCode(initSelectData.code,true);
        }
        this.setState({visible: true});
    };

    close() {
        const {setClickState} = this.addressSelectModel;
        setClickState(true);
        this.setState({visible: false});
    };

    _renderItem = ({item}) => {
        const {callBack} = this.props;
        const {requestWithCode, itemIndex, selectItems, clickState, setClickState} = this.addressSelectModel;
        return (
            <NoMoreClick style={{height: 40, justifyContent: 'center'}} onPress={() => {
                if (!clickState) {
                    return;
                }
                setClickState();
                //点击列当前的城市
                selectItems[itemIndex] = item;
                if (itemIndex === 3) {
                    this.close();
                    let areaText = selectItems[0].name + selectItems[1].name + selectItems[2].name + selectItems[3].name||'';
                    let data = {
                        provinceCode: selectItems[0].code,
                        provinceName: selectItems[0].name,
                        cityCode: selectItems[1].code,
                        cityName: selectItems[1].name,
                        areaCode: selectItems[2].code,
                        areaName: selectItems[2].name,
                        streetCode: selectItems[3].code,
                        streetName: selectItems[3].name,
                        areaText
                    };
                    callBack && callBack(data);
                    return;
                }
                //下一页
                requestWithCode(item.code);
            }}>
                <MRText style={[styles.itemText, {color: item.code && item.name ? DesignRule.textColor_mainTitle:'#FF0050' }]}>
                    {item.code && item.name ? item.name : '暂不选择'}
                </MRText>
            </NoMoreClick>
        );
    };

    _keyExtractor = (item) => {
        return item.code + '';
    };

    _ItemSeparatorComponent = () => {
        return (
            <View style={styles.separatorView}/>
        );
    };

    renderContent = () => {
        const {selectItems, contentList,addressList, itemIndex, setClickState, requestWithCode} = this.addressSelectModel;
        return (
            <View style={{width: ScreenUtils.width, height: ScreenUtils.height * 0.6}}>
                <View style={styles.titleStyle}>
                    <View style={{flex: 1}}/>
                    <MRText style={{fontSize: 15, color: '#666'}}>所在地区</MRText>
                    <View style={{flex: 1, alignItems: 'flex-end', marginRight: 18}}>
                        <NoMoreClick style={{height: 40, justifyContent: 'center'}}
                                     onPress={() => {
                                         this.close()
                                     }}>
                            <Image style={{width: 18, height: 18}} source={res.address.dizhi_img_Close}/>
                        </NoMoreClick>
                    </View>
                </View>
                <View style={styles.separatorView}/>
                <View style={{height: 40, backgroundColor: 'white'}}>
                    <ScrollView style={styles.titleContainer}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                bounces={false}

                    >
                        {
                            selectItems.map((item, index) => {
                                if (!item.name) {
                                    return null;
                                }
                                return (
                                    <NoMoreClick key={index} onPress={() => {
                                        setClickState(true);
                                        this.addressSelectModel.itemIndex = index;
                                        selectItems.forEach((item, index1) => {
                                            if (index1 === index) {
                                                console.log('addressListindex',JSON.stringify(contentList[index]))
                                                if (contentList && EmptyUtils.isEmpty(contentList[index])) {
                                                    item.fatherCode && requestWithCode(item.fatherCode, true);
                                                } else {
                                                    selectItems[index1] = {name: '请选择'};
                                                }
                                            } else if (index1 > index) {
                                                selectItems[index1] = {};
                                            }
                                        });

                                    }}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <MRText
                                                style={[styles.titleText, {color: index === itemIndex ? '#FF0050' : DesignRule.textColor_mainTitle}]}>
                                                {item.name}
                                            </MRText>
                                        </View>
                                        <View style={{
                                            height: 2,
                                            marginHorizontal: 15,
                                            backgroundColor: index === itemIndex ? DesignRule.mainColor : 'white',
                                            borderRadius: 1
                                        }}/>
                                    </NoMoreClick>
                                );
                            })
                        }
                    </ScrollView>
                    <View style={styles.separatorView}/>
                </View>
                <FlatList data={addressList}
                          style={{backgroundColor: 'white'}}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          ItemSeparatorComponent={this._ItemSeparatorComponent}
                          showsVerticalScrollIndicator={false}/>
            </View>
        )
    };

    render() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    this.close();
                }}
                visible={this.state.visible}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden'
    },
    titleContainer: {
        flex: 1, flexDirection: 'row'
    },
    titleText: {
        marginHorizontal: 15,
        fontSize: 14,
    },
    itemText: {
        marginLeft: 15,
        fontSize: 14,
    },
    separatorView: {
        height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg
    }
});

class AddressSelectModel {
    //当前列表项数据
    @observable itemIndex = -1;
    @observable selectItems = [{name: '请选择'}, {}, {}, {}];
    @observable contentList = [[], [], [], []];
    @observable clickState = true; //防止快速点击


    @computed get addressList() {
        console.log('addressList',JSON.stringify(this.contentList[this.itemIndex]))
        return this.contentList[this.itemIndex] || [];
    }

    @action setSelectItems=(data)=>{
        this.selectItems = data;
    };

    @action setClickState = (state) => {
        this.clickState = state;
    };

    @action initData = () => {
        this.clickState = true; //防止快速点击
    };

    //请求下一页
    @action requestWithCode = (code,type=false) => {
        MineAPI.getAreaList({fatherCode: code}).then((data) => {
            let dataitem = data.data||[];
            this.clickState = true;
            if(type){
                if (this.itemIndex === 3) {
                    dataitem.unshift({
                        'code': '',
                        'name': '',
                        'fatherCode': data.data[0].fatherCode || ''
                    })
                }
                this.contentList[this.itemIndex] = dataitem || [];
                return;
            }
            //当前列表项数据
            if (this.itemIndex === -1) {
                this.itemIndex = 0;
            } else if (this.itemIndex === 0) {
                this.itemIndex = 1;
            } else if (this.itemIndex === 1) {
                this.itemIndex = 2;
            } else if (this.itemIndex === 2) {
                this.itemIndex = 3;
                dataitem.unshift({'code': '', 'name': '', 'fatherCode': data.data[0].fatherCode || ''})
            }

            this.contentList[this.itemIndex] = dataitem;
            this.selectItems[this.itemIndex] = {name: '请选择'};

        });
    };
}
