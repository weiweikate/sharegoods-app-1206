import {
    View,
    Image,
    StyleSheet

} from 'react-native';

import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import SubSwichView from './SubSwichView';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';


class SbSectiontHeaderView extends Component {

    static propTypes = {
        subjectType: PropTypes.number

    };

    constructor(props) {
        super(props);
    }

    render() {
        const { subjectType } = this.props;

        return (
            <View>
                <Image
                    style={SbSectiontHeaderViewStyles.topImageStyle}
                />


                {subjectType === 1 ?
                    <SubSwichView/> : null}

            </View>
        );
    }

}

const SbSectiontHeaderViewStyles = StyleSheet.create({
    topImageStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.width * 188 / 375,
        backgroundColor: 'red'
    }
});

/*活动类型one的view 只是测试 可能会有多种,再添加*/
class ActivityOneView extends Component {

    static propTypes = {
        imageUrl: PropTypes.string.isRequired
    };

    render() {
        const { imageUrl } = this.props;
        console.log(imageUrl);
        return (
            <View>
                <PreLoadImage
                    imageUri={imageUrl}
                    style={ActivityOneViewStyles.bgImageStyle}
                />
            </View>
        );
    }
}

const ActivityOneViewStyles = StyleSheet.create({
    bgImageStyle: {
        height: 100,
        width: ScreenUtils.width,
        backgroundColor: 'blue'
    }
});

export { SbSectiontHeaderView, ActivityOneView };


