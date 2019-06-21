/**
 * @author xzm
 * @date 2019/6/18
 */

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import NoMoreClick from '../../components/ui/NoMoreClick';
import { MRText } from '../../components/ui';
import TagView from './components/TagView';
import RefreshFlatList from '../../comm/components/RefreshFlatList';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils';
import ShowApi from './ShowApi';

const { px2dp } = ScreenUtils;

export default class TagSelectorPage extends BasePage {
    $navigationBarOptions = {
        title: '更多标签',
        show: true
    };

    $NavBarRenderRightItem = () => {
        return (
            <NoMoreClick onPress={()=>{
                this.params.callback(this.state.selectTags);
                this.props.navigation.goBack();
            }}>
                <MRText style={styles.addStyle}>
                    添加
                </MRText>
            </NoMoreClick>
        );
    };


    constructor(props) {
        super(props);
        this.selectTags = [];
        this.state = {
            selectTags: []
        };
    }

    onSelectTag = (item) => {
        if (this.selectTags.length === 3) {
            this.$toastShow('标签太多了，别太贪心哦');
            return;
        }

        for(let i = 0;i<this.selectTags.length;i++){
            if(item.tagId === this.selectTags[i].tagId){
                this.$toastShow('您已经选过这个标签啦');
                return;
            }
        }

        this.selectTags.push(item);
        this.setState({ selectTags: this.selectTags });
    };

    deleteTag = (index) => {
        if (EmptyUtils.isEmptyArr(this.selectTags)) {
            return;
        }
        this.selectTags.splice(index, 1);
        this.setState({ selectTags: this.selectTags });
    };

    _listItemRender = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.onSelectTag(item);
            }}>
                <View style={styles.itemWrapper}>
                    <MRText style={{ color: DesignRule.textColor_instruction }}>#</MRText>
                    <MRText style={styles.tagText}>{item.name}</MRText>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _selectTagsRender = () => {
        if (EmptyUtils.isEmptyArr(this.state.selectTags)) {
            return null;
        }
        return (
            <View style={{ flexDirection: 'row', width: DesignRule.width ,height:px2dp(50),borderBottomColor:DesignRule.bgColor,borderBottomWidth:px2dp(5),alignItems:'center'}}>
                {this.state.selectTags.map((item, index) => {
                    return (<TagView style={{marginLeft:px2dp(15)}} canDelete={true} text={item.name} onPress={() => this.deleteTag(index)}/>);
                })}
            </View>
        );
    };


    _render() {
        return (
            <View style={styles.contain}>
                {this._selectTagsRender()}
                <RefreshFlatList
                    ref={(ref) => {
                        this.list = ref;
                    }}
                    renderLoadMoreComponent={()=>{return null}}
                    url={ShowApi.getAllTag}
                    renderItem={this._listItemRender}
                    style={{ flex: 1, marginTop: px2dp(15) }}
                    renderEmpty={() => {
                        return <View/>;
                    }}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: DesignRule.white
    },
    itemWrapper: {
        height: px2dp(35),
        flexDirection: 'row',
        marginBottom: px2dp(10),
        alignItems: 'center',
        paddingHorizontal: DesignRule.margin_page
    },
    tagText: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_secondTitle,
        marginLeft: px2dp(10)
    },
    addStyle: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_threeTitle
    }
});


