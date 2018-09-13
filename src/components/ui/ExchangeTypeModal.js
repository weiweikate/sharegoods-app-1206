import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Modal,
    NativeModules,
    TouchableOpacity,
} from 'react-native'
import {color} from "../../constants/Theme";
import close from '../../pages/mine/res/userInfoImg/close.png';
import {
     UIText, UIImage
} from '../ui';

class ExchangeTypeModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            number:1,
            list:this.props.detail,
            currentSelect:this.getSize(),
        }
    }
    getSize=()=>{
        this.updateView()
        let arr = new Array(this.props.detail.length);
        arr.fill(-1);
        return arr
    }
    isSelectFinish=()=>{
        for (let i=0;i<this.state.list.length;i++){
            if (this.state.currentSelect[i]==-1){
                return false
            }
        }
        return true
    }
    render() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={this.props.isShow}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }

    renderList=()=>{
        let arr=[]
        for (let i=0;i<this.state.list.length;i++){
            arr.push(
                <View style={{paddingLeft:5,paddingRight:15}}>
                    <UIText value={this.state.list[i].title} style={{color:color.gray_666,fontSize:13,marginTop:15,paddingLeft:10}}/>
                    <View style={{flexDirection:'row',marginTop:15}}>
                        {this.renderItemList(i)}
                    </View>
                </View>
            )
        }
        return arr
    }
    renderItemList=(index)=>{
        let arr=[]
        for (let i=0;i<this.state.list[index].arr.length;i++){
            arr.push(
                <View style={this.state.currentSelect[index]==i?styles.viewSelect:styles.viewUnselect}>
                    <UIText value={this.state.list[index].arr[i]} style={this.state.currentSelect[index]==i?styles.textSelect:styles.textUnselect} onPress={()=>{
                        let currentSelect=this.state.currentSelect
                        currentSelect[index]=i
                        this.setState({currentSelect:currentSelect,})
                    }}/>
                </View>
            )
        }
        return arr
    }
    updateView=()=>{
        this.setState({list:this.props.detail,})
        setTimeout(()=> {
            this.updateView()
        }, 100);

    }
    renderContent(){
        return(
            <View style={{justifyContent:'center',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                <View style={{flex:1,backgroundColor:color.white}}>
                    <View style={{height:53,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                        <UIImage source={close} style={{width:23,height:23,marginRight:16}} onPress={()=>this.props.closeWindow()} />
                    </View>
                    <View style={{height:1,marginLeft:15,marginRight:15,backgroundColor:color.line}}/>
                    {this.renderList()}
                    <View style={{height:1,backgroundColor:color.line,marginTop:10,marginBottom:15}}/>
                    <View style={{flexDirection:'row',justifyContent:'space-between',height:60,alignItems:'center',paddingLeft:15,paddingRight:15,}}>
                        <UIText value={'换货数量'} style={{fontSize:13,color:color.gray_666}}/>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={styles.rectangle} onPress={()=>{this.reduce()}}>
                                <UIText value={'-'} style={{fontSize:15,color:color.gray_DDD}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.rectangle,{width:46,borderLeftWidth:0,borderRightWidth:0}]}>
                                <UIText value={this.state.number} style={{fontSize:15,color:color.black_222}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rectangle} onPress={()=>{this.add()}}>
                                <UIText value={'+'} style={{fontSize:15,color:color.black_222}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{height:49,backgroundColor:color.red,justifyContent:'center',alignItems:'center'}} onPress={()=>{

                    }}>
                        <UIText value={'确认'} style={{color:color.white,textAlign:'center',justifyContent:'center',alignItems:'center'}} onPress={()=>this.finish()}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    finish=()=>{
        if(this.isSelectFinish()){
            this.props.commit({currentSelect:this.state.currentSelect,number:this.state.number})
        }else{
            NativeModules.commModule.toast('请勾选完全')
        }
    }
    add=()=>{
        let number=this.state.number
        this.setState({number:number+1})
    }
    reduce=()=>{
        let number=this.state.number
        if (number>1){
            this.setState({number:number-1})
        }
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:'flex-end',
        flex: 1,
    },viewUnselect:{
        justifyContent:'center',backgroundColor:color.gray_EEE,borderRadius:5,height:30,paddingLeft:10,paddingRight:10,marginLeft:10
    },textUnselect:{
        color:color.black_222,fontSize:13
    },viewSelect:{
        justifyContent:'center',backgroundColor:color.red,borderRadius:5,height:30,paddingLeft:10,paddingRight:10,marginLeft:10
    },textSelect:{
        color:color.white,fontSize:13
    },rectangle:{
        height:30,width:30,justifyContent:'center',borderWidth:1,borderColor:color.gray_DDD,alignItems:'center'
    }
});

export default ExchangeTypeModal
