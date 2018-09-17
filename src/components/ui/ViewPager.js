import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

const ViewPager = props => {
    const {
        horizontal = true,
        autoplay = false,
        dotStyle,
        activeDotStyle,
        dotColor,
        activeDotColor,
        renderPagination,
        arrayData,
        renderItem,
        ...attributes
    } = props;

    const styles = StyleSheet.create({
        wrapper: {}
    });

    const renderItems = () => {
        if (arrayData) {
            let itemViews = [];
            arrayData.map((item, key) => {
                itemViews.push(<View style={{ flex: 1 }} key={key}>
                    {renderItem(item)}
                </View>);
            });

            return itemViews;
        }

    };
    const renderSwiper = () => {
        if (arrayData && arrayData.length > 0) {
            if (renderPagination) {
                return (
                    <Swiper style={styles.wrapper}
                            paginationStyle={{ marginBottom: -20 }}
                            horizontal={horizontal}
                            renderPagination={renderPagination}
                            autoplay={autoplay}
                            dotStyle={dotStyle}
                            activeDotStyle={activeDotStyle}
                            dotColor={dotColor}
                            activeDotColor={activeDotColor}
                            autoplayTimeout={6}
                            removeClippedSubviews={false}>
                        {renderItems()}
                    </Swiper>);
            } else {
                return (
                    <Swiper style={styles.wrapper}
                            paginationStyle={{ marginBottom: -20 }}
                            horizontal={horizontal}
                            autoplay={autoplay}
                            dotStyle={dotStyle}
                            activeDotStyle={activeDotStyle}
                            dotColor={dotColor}
                            activeDotColor={activeDotColor}
                            autoplayTimeout={6}
                            removeClippedSubviews={false}>
                        {renderItems()}
                    </Swiper>);
            }
        }
    };

    return (
        <View  {...attributes}>
            {renderSwiper()}
        </View>
    );
};

ViewPager.propTypes = {
    arrayData: PropTypes.array,
    renderItem: PropTypes.func,
    dotStyle: PropTypes.any,
    activeDotStyle: PropTypes.any,
    renderPagination: PropTypes.func
};

export default ViewPager;
