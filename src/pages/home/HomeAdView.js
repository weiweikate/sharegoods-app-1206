import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './Modules';
import { adModules } from './HomeAdModel';
import { observer } from 'mobx-react';
import ImageLoad from '@mr/image-placeholder';

const { px2dp } = ScreenUtils;

const bannerWidth = ScreenUtils.width
const defaultBannerHeight = px2dp(80)

const adWidth = (ScreenUtils.width - px2dp(35)) / 2
const adHeight = adWidth * (160 / 340)

const radius = (5)

@observer
export default class HomeAdView extends Component {

    constructor(props) {
        super(props)
        // adModules.adHeights[0] = adViewHeight
        this.adRadius = [
            {borderTopLeftRadius: radius, overflow: 'hidden'},
            {borderTopRightRadius: radius, overflow: 'hidden'},
            {borderBottomLeftRadius: radius, overflow: 'hidden'},
            {borderBottomRightRadius: radius, overflow: 'hidden'},
        ]
        this.hasLoadImg = {}
        this.state = {
            imageHeight : []
        }
    }

    _adAction(value) {
        const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
        const { navigate } = this.props;
        const params = homeModule.paramsNavigate(value);
        navigate(router, { ...params, preseat: 'home_ad' });
    }

    _renderBanner() {
        const { banner } = adModules
        if (banner.length === 0) {
            return null
        }
        let items = []
        banner.map((val, index) => {
            console.log('getBanner', this.hasLoadImg)
            if (!this.hasLoadImg[val.imgUrl]) {
                Image.getSize(val.imgUrl, (width, height)=> {
                    let h = bannerWidth * (height / width)
                    adModules.adHeights.push(h)
                    let imageHeights = this.state.imageHeight
                    imageHeights.push({height: h})
                    this.setState({
                        imageHeight: imageHeights
                    })
                })
                this.hasLoadImg[val.imgUrl] = true
            }
            
            items.push(
                <TouchableWithoutFeedback onPress={()=> this._adAction(val)}>
                    <View style={styles.banner} key={'banner' + index}>
                        <Image style={[styles.bannerImage, {height: adModules.adHeights[index] ? adModules.adHeights[index] : 0}]} source={{uri: val.imgUrl}}/>
                    </View>
                </TouchableWithoutFeedback>
            )
        })
        console.log('getBanner imageHeights', this.state.imageHeight)
        
        return <View>{items}</View>
    }

    _renderAd() {
        const { ad } = adModules;
        let items = [];
        ad.map((value, index) => {
            items.push(<TouchableWithoutFeedback key={index} onPress={() => this._adAction(value)}>
                <View style={[styles.ad, this.adRadius[index]]}>
                    <ImageLoad source={{ uri: value.imgUrl }} style={styles.ad}/>
                </View>
            </TouchableWithoutFeedback>);
        })
        return <View style={styles.adrow}>
            {items}
        </View>
    }

    render() {
        return <View style={styles.container}>
            <View style={styles.tran}/>
            {this._renderBanner()}
            {this._renderAd()}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtils.width,
        paddingTop: px2dp(10)
    },
    banner: {
        marginBottom: px2dp(15)
    },
    bannerImage: {
        width: bannerWidth,
        height: defaultBannerHeight,
    },
    adrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    ad: {
        width: adWidth,
        height: adHeight,
        marginBottom: px2dp(4)
    },
    tran: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: px2dp(54),
        backgroundColor: '#fff'
    }
});
