
import React, {Component} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';

export default class Demo2 extends Component {

    state = {cookie: null};

    componentDidMount() {

    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={{margin: 15, color: '#e60012'}}>demo2222</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    }
});
