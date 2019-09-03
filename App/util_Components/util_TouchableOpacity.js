import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Modal,
    ActivityIndicator,
    Dimensions,
    BackAndroid,
    TouchableOpacity,
    Platform
} from 'react-native';
import util_style from '../css/Styles'

export default class util_TouchableOpacity extends Component {

    static defaultProps = {
        context: 1000,
    };

    render() {

        return (
            <TouchableOpacity style={
                util_style.touchableOpacity_style
            } {...this.props}>
                <View style={{padding: 7}}>
                    <Text style={{color: '#343434', fontSize: 20}}>{this.props.context}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}