/**
* 发现收藏
*/
import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native'
import Waterfall from '../../components/ui/WaterFall'
import {observer} from 'mobx-react'
import { ShowRecommendModules } from './Show'
import ScreenUtils from '../../utils/ScreenUtils'
const {  px2dp } = ScreenUtils
import ItemView from './ShowHotItem'
import BasePage from '../../BasePage'
import selectedImg from '../../comm/res/show_selected.png'
import unselectedImg from '../../comm/res/show_unselected.png'

const imgWidth = px2dp(168)

@observer
export default class ShowConnectPage extends BasePage {
    state = {
        select: false,
        selectedList: {},
        allSelected: false,
        collectData: []
    }
    $navigationBarOptions = {
        title: '发现收藏',
        show: true
    }
    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity style={styles.rightButton} onPress={()=>this._onSelectedAction()}>
                <Text style={styles.select}>选择</Text>
            </TouchableOpacity>
        );
    };
   constructor(props) {
       super(props)
       this.recommendModules = new ShowRecommendModules()
   }
   componentDidMount() {
        this._refreshData()
   }

   _refreshData() {
        this.recommendModules.loadCollect().then(data => {
            this.waterfall.clear()
            if (data && data.length > 0) {
                this.waterfall.addItems(data)
            } else {
                this.waterfall.addItems([])
            }
            this.state.collectData = data
        })
   }

   _deleteSelected() {
        const { selectedList, allSelected } = this.state
        let ids = []
        if (allSelected) {
            this.state.collectData.map(value => {
                ids.push(value.id)
            })
        } else {
            ids = Object.keys(selectedList)
        }
        this.recommendModules.batchCancelConnected(ids).then(data => {
            this._refreshData()
            this.setState({select: false})
        })
   }

   _delete() {
        Alert.alert(
            '',
            '确定删除？',
            [
            {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: '确定', onPress: () => {this._deleteSelected()}},
            ],
            { cancelable: false }
        )
   }
   _onSelectedAction() {
        const {select} = this.state
        this.setState({select: !select})
   }
   infiniting(done) {
       setTimeout(() => {
           this.recommendModules.getMoreCollect().then(data=>{
                this.waterfall.addItems(data)
                this.state.collectData = [...this.state.collectData, ...data]
           })
           done()
       }, 1000)
   }
   refreshing(done) {
       setTimeout(() => {
            this._refreshData()
           done()
       }, 1000)
   }
   _gotoDetail(data) {
       const { navigation } = this.props
       navigation.navigate('show/ShowDetailPage', {id: data.id})
   }
   _selectedAction(data) {
       const { selectedList } = this.state
       if (selectedList[data.id]) {
           delete selectedList[data.id]
       } else {
           selectedList[data.id] = data.id
       }
       this.setState({selectedList: selectedList})
   }
   _selectedAllAction() {
       const {allSelected} = this.state
        this.setState({allSelected: !allSelected, selectedList: []})
   }
   renderItem = (data) => {
        let imgWide = data.imgWide ? data.imgWide : 1
        let imgHigh = data.imgHigh ? data.imgHigh : 1
        let imgHeight = (imgHigh / imgWide) * imgWidth
       const { select, allSelected, selectedList } = this.state
       return <View><ItemView
            isSelected={select}
            imageStyle={{height: imgHeight}}
            data={data}
            press={()=>this._gotoDetail(data)}
        />
        {
            select
            ?
            <TouchableOpacity style={styles.selectedView} onPress={()=>this._selectedAction(data)}>
                <Image source={allSelected ? selectedImg : (selectedList[data.id] ? selectedImg : unselectedImg)}/>
            </TouchableOpacity>
            :
            null
        }
        </View>
   }
   _keyExtractor = (data) => data.id + ''

   _render() {
       const { allSelected, select } = this.state
       return(
           <View style={styles.container}>
               <Waterfall
                   space={10}
                   ref={(ref)=>{this.waterfall = ref}}
                   columns={2}
                   infinite={true}
                   hasMore={true}
                   renderItem={item => this.renderItem(item)}
                   containerStyle={{marginLeft: 15, marginRight: 15}}
                   keyExtractor={(data) => this._keyExtractor(data)}
                   infiniting={(done)=>this.infiniting(done)}
                   refreshing={(done)=>this.refreshing(done)}
               />
               {
                select
                ?
                <View style={styles.bottomView}>
                    <TouchableOpacity style={styles.allView} onPress={()=>{this._selectedAllAction()}}>
                        <Image style={styles.allImg} source={allSelected ? selectedImg : unselectedImg}/>
                        <Text style={styles.all}>全选</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity style={styles.button} onPress={()=>this._delete()}>
                        <Text style={styles.delete}>删除</Text>
                    </TouchableOpacity>
               </View>
               :
               null
               }
           </View>
       )
   }
}

let styles = StyleSheet.create({
   container: {
       flex: 1,
       paddingTop: px2dp(12)
   },
   bottomView: {
       height: px2dp(49) + ScreenUtils.safeBottom,
       paddingBottom: ScreenUtils.safeBottom,
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#fff'
   },
   all: {
       color: '#999',
       fontSize: px2dp(13),
       marginLeft: px2dp(10)
   },
   button: {
       backgroundColor: '#FF1A54',
       width: px2dp(109),
       height: px2dp(49),
       alignItems: 'center',
       justifyContent: 'center'
   },
   delete: {
       color: '#fff',
       fontSize: px2dp(16)
   },
   select: {
       color: '#FF1A54',
       fontSize: px2dp(15)
   },
   rightButton: {
       width: px2dp(52),
       height: (49),
       alignItems: 'center',
       justifyContent: 'center'
   },
   allImg: {
       marginLeft: px2dp(20)
   },
   allView: {
        height: px2dp(49),
        flexDirection: 'row',
        alignItems: 'center'
   },
   selectedView: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px2dp(30),
        height: px2dp(30),
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    }
})
