import React,{Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    UIText
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { orderDetailModel } from '../../model/OrderDetailModel';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
const {px2dp} = ScreenUtils;

@observer
export default class OrderDetailStatusView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        // const {statusMsg} = orderStatusModel
        return(
                <LinearGradient style={styles.redRectangle}
                                 start={{x: 0, y: 0}}
                                 end={{x: 1, y: 0}}
                                colors={['#FF0050','#F94B35', '#FF2035','#F80759']}
                                locations={[0,0.3,0.7,1]}
                >
                    <View style={{ marginTop:px2dp(-22)}}>
                        <UIText value={orderDetailModel.buyState} style={styles.textStyle}/>
                        {StringUtils.isNoEmpty(orderDetailModel.moreDetail) ?
                            <UIText value={orderDetailModel.moreDetail}
                                    style={{ color: 'white', fontSize: px2dp(13), marginLeft: px2dp(10) }}/> : null
                        }
                    </View>
                                     </LinearGradient>

        )
    }

}
const styles = StyleSheet.create({
    redRectangle: {
        width: ScreenUtils.width,
        height: px2dp(100),
        flexDirection: 'row',
        paddingLeft: px2dp(22),
        alignItems: 'center'
    },
    textStyle:{
        color: 'white',
        fontSize: px2dp(18),
        marginLeft: px2dp(10)
    }
})
