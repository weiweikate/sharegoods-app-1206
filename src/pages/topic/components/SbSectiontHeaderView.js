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
import DesignRule from 'DesignRule';

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
        height: ScreenUtils.width * 375 / 750,
        backgroundColor: DesignRule.mainColor
    }
});

/*活动类型one的view 只是测试 可能会有多种,再添加*/
class ActivityOneView extends Component {

    static propTypes = {
        imageUrl: PropTypes.string.isRequired,
        ratio: PropTypes.number
    };

    render() {
        const { imageUrl, ratio } = this.props;
        console.log(this.props);
        return (
            <View>
                <PreLoadImage
                    imageUri={imageUrl}
                    style={[
                        ActivityOneViewStyles.bgImageStyle,
                        ratio ?
                            {
                                height: ScreenUtils.width * ratio
                            }
                            :
                            null

                    ]}

                />
            </View>
        );
    }
}

const ActivityOneViewStyles = StyleSheet.create({
    bgImageStyle: {
        height: ScreenUtils.width * 16 / 75,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    }
});

export { SbSectiontHeaderView, ActivityOneView };


