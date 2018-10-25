import React, {Component} from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import MarqueeLabelVertical from '../../components/ui/MarqueeLabelVertical'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtil
import {observer} from 'mobx-react'
import { HomeShowModules, tagName } from './Show'
import homeShowImg from '../../comm/res/home_show.png'

const TagView = ({text}) => <View style={styles.tagView}>
    <Text style={styles.tag}>{text}</Text>
</View>

@observer
export default class ShowView extends Component {
    constructor(props) {
        super(props)
        this.showModules = new HomeShowModules()
        this.showModules.loadShowList()
    }
    _renderItems(item, index) {
        return <View key={index} style={styles.item}><TagView text={tagName[item.generalize ? item.generalize : 0]}/><Text numberOfLines={1} style={styles.text}>{item.title}</Text></View>
    }
    _goToShow() {
        const { navigation } = this.props
        navigation.navigate('show/ShowListPage', {fromHome: true})
    }
    _showEnd() {
        this.showModules.loadShowList()
    }
    render() {
        const { showList } = this.showModules
        if (!showList) {
            return <View/>
        }
        if (this.showModules.showList.length === 0) {
            return <View/>
        }
        return <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title} numberOfLine={2}>秀场头条</Text>
            </View>
            <Image style={styles.line} source={homeShowImg}/>
            <MarqueeLabelVertical
                onPress={()=>this._goToShow()}
                containerStyle={styles.marquee}
                dataSource={this.showModules.showList}
                renderItems={(item, index)=>this._renderItems(item, index)}
                showEnd={()=>this._showEnd()}
            />
            {
                this.showModules.showImage
                ?
                <Image style={styles.icon} source={{uri:this.showModules.showImage ? this.showModules.showImage : null}}/>
                :
                null
            }
         </View>
    }
}

const styles = StyleSheet.create({
    container: {
        height: px2dp(72),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: px2dp(2)
    },
    marquee: {
        height: px2dp(34),
        backgroundColor: '#fff',
        flex: 1
    },
    line: {
        marginLeft: px2dp(6),
        marginRight: px2dp(8)
    },
    item: {
        height: px2dp(17),
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleView: {
        alignItems: 'center',
        justifyContent: 'center',
        width:  px2dp(33),
        height: px2dp(33)
    },
    title: {
        marginLeft: px2dp(15),
        color: '#333',
        fontSize: px2dp(14),
        fontWeight: '600',
        width:  px2dp(33)
    },
    tagView: {
        width: px2dp(30),
        height: px2dp(14),
        borderRadius: px2dp(7),
        borderColor: '#D51234',
        borderWidth: onePixel,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tag: {
        color: '#D51234',
        fontSize: px2dp(11)
    },
    text: {
        color: '#666',
        fontSize: px2dp(11),
        marginLeft: px2dp(10)
    },
    icon: {
        width: px2dp(48),
        height: px2dp(48),
        marginRight: px2dp(15)
    }
})
