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
import { orderDetailAfterServiceModel } from '../../model/OrderDetailModel';
import { observer } from 'mobx-react/native';
import res from '../../res';
const productDetailImg = res.productDetailImg;
const {px2dp} = ScreenUtils;

@observer
export default class OrderDetailStatusView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        // const {statusMsg} = orderStatusModel
        return(
            <View>
                <ImageBackground style={styles.redRectangle} source={productDetailImg}>
                    <UIImage source={this.props.leftTopIcon} style={{ height: px2dp(25), width:px2dp(25), marginTop: px2dp(-22) }}/>
                    <View style={{ marginTop:px2dp(-22)}}>
                        <UIText value={orderDetailAfterServiceModel.totalAsList.buyState} style={styles.textStyle}/>
                        {StringUtils.isNoEmpty(orderDetailAfterServiceModel.moreDetail) ?
                            <UIText value={orderDetailAfterServiceModel.moreDetail}
                                    style={{ color: 'white', fontSize: px2dp(13), marginLeft: px2dp(10) }}/> : null
                        }
                    </View>
                </ImageBackground>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    redRectangle: {
        width: ScreenUtils.width,
        height: px2dp(100),
        flexDirection: 'row',
        paddingLeft: px2dp(22),
        position: 'absolute',
        alignItems: 'center'
    },
    textStyle:{
        color: 'white',
        fontSize: px2dp(18),
        marginLeft: px2dp(10)
    }
})
