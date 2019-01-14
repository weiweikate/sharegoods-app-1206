import React from 'react';

import ThreeColumnListView from './components/ThreeColumnListView';
import BasePage from '../../BasePage';
import PropTypes from 'prop-types';
import TwoColumnListView from './components/TwoColumnListView';


export default class TopicPage extends BasePage {

    TopicPage
    constructor(props) {
        super(props);
        this.props.columnNumber = this.params.columnNumber;
        this.props.subjectType = this.params.subjectType;
    }



    $navigationBarOptions = {
        title: '专题',
        show: true
    };

    _render() {
        const { columnNumber, subjectType } = this.params;

        return (
            columnNumber === 3 ?
                <ThreeColumnListView
                    columnNumber={columnNumber}
                    subjectType={subjectType}
                /> :
                <TwoColumnListView
                    columnNumber={columnNumber}
                    subjectType={subjectType}
                    navigateTool={this.$navigate}
                />
        );
    }
}
TopicPage.propTypes = {
    //专题列表列数
    columnNumber: PropTypes.number,
    //0无切换 1 有切换
    subjectType: PropTypes.number
};


