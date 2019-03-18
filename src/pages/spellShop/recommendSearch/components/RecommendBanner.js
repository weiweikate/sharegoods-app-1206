import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import XGSwiper from '../../../../components/ui/XGSwiper';
import EmptyUtils from '../../../../utils/EmptyUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import UIImage from '@mr/image-placeholder';

export class RecommendBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageIndex: 0
        };
    }

    _renderStyleOne = () => {
        const bannerCount = this.props.bannerList.length;
        let items = [];
        for (let i = 0; i < bannerCount; i++) {
            if (this.state.messageIndex === i) {
                items.push(<View key={i} style={styles.activityIndex}/>);
            } else {
                items.push(<View key={i} style={styles.index}/>);
            }
        }
        return <View style={styles.indexView}>
            {items}
        </View>;
    };

    _onPress = (item) => {
        this.props.onPress && this.props.onPress(item);
    };

    _renderViewPageItem = (item) => {
        const { imgUrl } = item;
        return (
            <UIImage style={{ width: ScreenUtils.width, height: ScreenUtils.autoSizeWidth(230) }}
                     source={{ uri: imgUrl }}
                     resizeMode="cover"
            />);
    };

    render() {
        const { bannerList } = this.props;
        return (
            <View>
                <XGSwiper height={ScreenUtils.autoSizeWidth(230)} width={ScreenUtils.width}
                          renderRow={this._renderViewPageItem}
                          dataSource={EmptyUtils.isEmptyArr(bannerList) ? [] : bannerList}
                          onDidChange={(item, index) => {
                              if (this.state.messageIndex !== index) {
                                  this.setState({
                                      messageIndex: index
                                  });
                              }
                          }}
                          onPress={this._onPress}/>
                {this._renderStyleOne()}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    indexView: {
        position: 'absolute',
        bottom: 13,
        left: 0,
        width: ScreenUtils.width,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    activityIndex: {
        width: 24,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#eee',
        marginLeft: 2.5,
        marginRight: 2.5
    },
    index: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#eee',
        marginLeft: 2.5,
        marginRight: 2.5
    }
});


export default RecommendBanner;
