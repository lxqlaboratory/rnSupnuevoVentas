import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Modal,
    ActivityIndicator,
    Dimensions,
    BackAndroid,
    Platform
} from 'react-native';
import {setSpText,scaleSize} from '../../utils/ScreenUtil'

export function openWaitTip() {
    WaitTip._onRequestOpen();
}

export function closeWaitTip() {
    WaitTip._onRequestClose();
}

export default class WaitTip extends Component {

    constructor(props) {
        super(props);
        const {codes} = this.props;
        this.state = {
            modalShow: false,
        }
    }

    static _onRequestClose() {
        this.setState({modalShow: false})
    }

    static _onRequestOpen() {
        this.setState({modalShow: true})
    }

    render() {
        let modalShow = this.state.modalShow;
        if (this.props.waitShow === true) {
            modalShow = true;
        }
        if (this.props.modalShow) {
            setTimeout(() => {
                this.close()
            }, 10000);
        }
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalShow}
                onRequestClose={() => {
                    this.setState({modalShow: false})
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: 8, backgroundColor: 'rgba(0,0,0,0.3)'
                }}>
                    <ActivityIndicator
                        animating={true}
                        style={{marginTop: 10, height: 80}}
                        size="large"
                        color="#fff"
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{color: '#fff', fontSize:setSpText(34) , alignItems: 'center'}}>
                            {this.props.tipsName}
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }
}


var styles = StyleSheet.create({});


module.exports = WaitTip;
