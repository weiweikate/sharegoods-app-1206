/**
 * Created by xiangchen on 2018/7/23.
 */
import React, {Component} from 'react'
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity} from 'react-native'
import RefreshList from './../../../components/ui/RefreshList'
import ScreenUtils from '../../../utils/ScreenUtils'
import StringUtils from "../../../utils/StringUtils";
import NoMessage from '../res/couponsImg/icon3_03.png'
import noUseBg from '../res/couponsImg/icon_03.png'
import usedBg from '../res/couponsImg/icon1_03.png'
const noactivelist=["未","激","活"] ,usedlist=["已","使","用"],nouselist=["","","",""],loselist=["已","失","效"];
export default  class MyCouponsItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewData: [
            ],
            pageStatus: this.props.pageStatus,
            isEmpty: true,
            currentPage: 1,
            explainList:[],
        }
    }

    renderValidItem = ({item, index}) => {
        return (
            <TouchableOpacity style={{backgroundColor: '#f7f7f7'}} onPress={()=>this.clickItem(index,item)}>
                <ImageBackground style={styles.imgBg}
                  source={noUseBg} resizeMode='stretch'>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{alignSelf: 'flex-end', marginBottom: 2}}>
                                <Text style={{fontSize: 5, color: "#e60012"}}>￥</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 20, color: "#e60012"}}>{item.value}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize: 11, color: "#999999"}}>满{item.useConditions}可用</Text>
                        </View>
                    </View>
                    <View style={{flex: 4, alignItems: 'center'}}>
                        <Text style={{fontSize: 15, color: "#222222"}}>{item.nickname}</Text>
                        <Text style={{fontSize: 11, color: "#999999"}}>{item.name}</Text>
                        <Text style={{
                            fontSize: 11,
                            color: "#999999"
                        }}>有效期：{this.fmtDate(item.startTime)}-{this.fmtDate(item.outTime)}</Text>
                    </View>
                    <View  style={{flex: 1, alignItems: 'center'}}>
                        {item.explainList.map((item,i)=>{
                       return     <Text  key={i}  style={{fontSize: 15, color: "#fff"}}>{item}</Text>
                        })}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
    renderInvalidItem = ({item, index}) => {
        return (
            <View style={{backgroundColor: '#f7f7f7'}}>
                <ImageBackground style={styles.imgBg}
                                 source={usedBg} resizeMode='stretch'>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{alignSelf: 'flex-end', marginBottom: 2}}>
                                <Text style={{fontSize: 5, color: "#e60012"}}>￥</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 20, color: "#e60012"}}>{item.value}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize: 11, color: "#999999"}}>满{item.useConditions}可用</Text>
                        </View>
                    </View>
                    <View style={{flex: 4, alignItems: 'center'}}>
                        <Text style={{fontSize: 15, color: "#222222"}}>{item.nickname}</Text>
                        <Text style={{fontSize: 11, color: "#999999"}}>限品类: {item.name}</Text>
                        <Text style={{
                            fontSize: 11,
                            color: "#999999"
                        }}>有效期：{this.fmtDate(item.startTime)}-{this.fmtDate(item.outTime)}</Text>
                    </View>
                    <TouchableOpacity disabled={item.status==1||item.status==2} onPress={()=>this.clickItem(index,item)} style={{flex: 1, alignItems: 'center'}}>
                        {item.explainList.map((item,i)=>{
                         return    <Text key={i} style={{fontSize: 15, color: "#fff"}}>{item}</Text>
                        })}
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }

    fmtDate(obj) {
        let date = new Date(obj);
        let y = 1900 + date.getYear();
        let m = "0" + (date.getMonth() + 1);
        let d = "0" + date.getDate();
        return y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length);
    }


    renderItem = ({item, index})=> {
        // console.log(item);
        return (
            this.isValidItem(index) ? this.renderValidItem({item, index}) : this.renderInvalidItem({item, index})
        )
    };
    isValidItem = (index)=> {
        let validCode = 0;

        return this.state.viewData[index].status == validCode
    };

    render() {
        return (
            <View style={{flex:1}}>
                <RefreshList
                    style={{backgroundColor: '#f7f7f7'}}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    emptyIcon={NoMessage}
                    emptyTip={'暂无数据'}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    isHideFooter={true}
                />
                {this.props.isgiveup?
                    <View style={{ position:'absolute',
                        bottom:0,height: 48,borderTopColor:'#f7f7f7',borderTopWidth:1}}>
                    <TouchableOpacity style={{
                        width: ScreenUtils.width,
                          height:48,

                        backgroundColor: "#ffffff",
                        borderStyle: "solid"
                        ,alignItems:'center',justifyContent:'center'}}
                                      activeOpacity={0.5} onPress={this.props.giveupUse}>
                        <Text style={{fontFamily: "PingFang-SC-Medium",
                            fontSize: 14,
                            color: "#666666"}}>放弃使用优惠券</Text>
                    </TouchableOpacity></View>:<View/>}

            </View>
        )
    }

    getList = (data)=> {
        if (StringUtils.isNoEmpty(data)) {
            let arrData = this.state.currentPage == 1 ? [] : this.state.viewData
            let explainList=[];
            data.map((item, index)=> {
                switch(item.status){
                    case 0:
                        explainList=nouselist;
                        break;
                    case 1:
                      explainList=usedlist;
                        break;
                    case 2:
                        explainList=loselist;
                        break;
                    case 3:
                        explainList=noactivelist;
                        break;
                }
                arrData.push({
                    id: item.id,
                    status: item.status,
                    name: item.name,
                    startTime: item.startTime,
                    outTime: item.outTime,
                    value: item.value,
                    useConditions: item.useConditions,
                    nickname: item.nickname,
                    discountCouponId:item.discountCouponId,
                    explainList:explainList
                })

            });
            this.setState({viewData: arrData})
        } else {
            // this.setState({isEmpty:true})
        }
    };

    componentDidMount() {
        //网络请求，业务处理
        this.getDataFromNetwork()
    }

    getDataFromNetwork = ()=> {
        switch (this.state.pageStatus) {
        }
    };
    //当父组件Tab改变的时候让子组件更新
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectTab < 8) {
            console.log(nextProps.selectTab + '=======================')

        }
    }

    onLoadNumber = () => {
        this.props.onLoadNumber && this.props.onLoadTabNumber()
    };

    onRefresh = () => {
        this.setState({
            currentPage: 1
        });
        this.getDataFromNetwork()
    };

    onLoadMore = (page) => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
        this.getDataFromNetwork()
    };

    clickItem = (index,item)=> {
        if (this.props.fromOrder) {
            this.props.useCoupons({id:item.id,name:item.name,price:item.value})
        }else
            {
                this.props.nav("coupons/CouponsDetailPage", {id: item.discountCouponId})
            }

    }

}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f7f7f7',
        },
        imgBg:{
            width: ScreenUtils.width - 30,
            height: 100,
            margin: 15,
            flexDirection: 'row',
            alignItems: 'center'
        }
    }
);
