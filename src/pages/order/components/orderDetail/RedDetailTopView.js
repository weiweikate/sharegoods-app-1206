import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
} from 'react-native';
import {
    UIText, UIImage
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { orderStatusModel } from '../../model/OrderDetailModel';
import { observer } from 'mobx-react/native';

@observer
export default class RedDetailTopView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const {statusMsg} = orderStatusModel
        return(
            <View>
                <ImageBackground style={styles.redRectangle} source={this.props.productDetailImg}>
                    <UIImage source={this.props.leftTopIcon} style={{ height: 25, width: 25, marginTop: -22 }}/>
                    <View style={{ marginTop: -22 }}>
                        <UIText value={this.props.buyState} style={styles.textStyle}/>
                        {StringUtils.isNoEmpty(statusMsg) ?
                            <UIText value={statusMsg}
                                    style={{ color: 'white', fontSize: 13, marginLeft: 10 }}/> : null
                        }
                    </View>
                </ImageBackground>
            </View>
        )
    }

}
const styles=StyleSheet.create({
    redRectangle: {
        width: ScreenUtils.width,
        height: 100,
        flexDirection: 'row',
        paddingLeft: 22,
        position: 'absolute',
        alignItems: 'center'
    },
    textStyle:{
        color: 'white',
        fontSize: 18,
        marginLeft: 10
    }
})
