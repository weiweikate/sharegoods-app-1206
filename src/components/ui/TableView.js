/**
 * @author ZhangLei
 * @date 2018/6/7
 * @appType crm_app
 * @Description:个人中心常用的ItemUI控件
 */
import React from 'react'
import {
    View,
} from 'react-native'
import HorizonalTableView from './HorizonalTableView'
import VerticalTableView from './VerticalTableView'
import SignalTabView from './SignalTabView'
const TableView = props => {

    const {
        tableData=this.props.tableData,
        tabViewType=this.props.tabViewType,
    } = props
    renderTableView=()=>{
        switch (tabViewType){
            case 'horizontal':
                return <HorizonalTableView tableData={tableData}/>
                break
            case 'vertical':
                return <VerticalTableView tableData={tableData}/>
                break
            case 'signal':
                return <SignalTabView tableData={tableData}/>
                break
        }
    }
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {this.renderTableView()}
        </View>
    )

}

export default TableView
