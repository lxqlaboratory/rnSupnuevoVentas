/**
 * Created by danding on 16/11/13.
 */

import React from 'react';

var {
    Component
} = React;

import {
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    TabBarIOS,
    Dimensions,
    Button,
    ScrollView,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';

var {height, width} = Dimensions.get('window');
var Platform = require('Platform');
import {loginAction, setTimerAction} from '../action/actionCreator';

var proxy = require('../proxy/Proxy');
import PreferenceStore from '../utils/PreferenceStore';

var thiz = null;
import {_name} from '../../Language/IndexLanguage';
import {setSpText,scaleSize} from '../utils/ScreenUtil'


var Login = React.createClass({

    onLoginPressed: function () {
        var user = this.state.user;
        var username = user.username;
        var password = user.password;
        if (username !== undefined && username !== null && username !== '') {
            if (password !== undefined && password !== null && password !== '') {
                this.setState({showProgress: true});
                const {dispatch} = this.props;
                if (Platform.OS === 'android') {
                    this.timer = setInterval(
                        function () {

                            var loginDot = this.state.loginDot;
                            if (loginDot === '......')
                                loginDot = '.';
                            else
                                loginDot += '.';

                            this.setState({loginDot: loginDot});

                        }.bind(this)
                        ,
                        600
                    );
                    dispatch(setTimerAction(this.timer));
                    dispatch(loginAction(username, password))
                        .then((json) => {
                            setTimeout(() => {
                                this.setState({showProgress: false});
                            }, 100)

                        });
                }

                else {
                    this.setState({animating: true, querenstate: true});
                    dispatch(loginAction(username, password))
                        .then((json) => {
                            this.showProgress();
                        });
                }
            } else {
                Alert.alert(
                    _name.错误,
                    _name.请填写密码后再点击登录,
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        },
                    ]
                );
            }
        } else {
            Alert.alert(
                _name.错误,
                _name.请填写用户名后再点击登录,
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    },
                ]
            );
        }
    },

    showProgress() {
        this.setState({animating: false, querenstate: false});
    },

    getInitialState: function () {
        return ({
            user: {},
            querenstate: false,
            modalVisible: false,
            showProgress: false,
            loginDot: '.',
            animating: false,
        });
    },


    render: function () {

        const shadowOpt = {
            width: width - 20,
            height: 200,
            color: "#000",
            border: 2,
            radius: 3,
            opacity: 0.2,
            x: 0,
            y: 1.5,
            style: {marginVertical: 5}
        };
        if (Platform.OS === 'android') {
            return (
                <ScrollView>
                    <View style={[styles.container]}>

                        <View style={[{
                            backgroundColor: '#387ef5',
                            padding: 10,
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }]}>
                            <Text style={{color: '#fff', fontSize:setSpText(38)}}>supnuevo_ventas</Text>
                        </View>

                        <View style={{justifyContent: 'center', flexDirection: 'row', padding: 10, marginTop: 10}}>

                            <View style={{
                                position: "relative",
                                width: width - 20,
                                height: 200,
                                backgroundColor: "#fff",
                                borderRadius: 20,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                padding: 15,
                                overflow: "hidden",
                            }}>
                                <Image style={styles.logo} source={require('../img/cart.png')}/>
                            </View>

                        </View>

                        <View style={{padding: 10, paddingTop: 2}}>
                            {/*输入用户名*/}
                            <View style={{
                                height: 110, borderWidth: 1,
                                borderColor: '#ddd', borderRadius: 10,
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginBottom: 3,
                                    borderBottomWidth: 0.5,
                                    borderColor: "#ddd",
                                    marginHorizontal: 20,
                                }}>
                                    <View style={{
                                        flex: 6,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                    }}>
                                        <Text style={{fontSize:setSpText(32), color: '#444'}}>{_name.用户名}</Text>
                                    </View>
                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <TextInput
                                            style={{
                                                height: 46,
                                                flex: 1,
                                                paddingLeft: 5,
                                                paddingRight: 10,
                                                paddingTop: 2,
                                                paddingBottom: 2,
                                                fontSize: setSpText(32),
                                            }}
                                            onChangeText={(username) => {

                                                this.state.user.username = username;
                                                this.setState({user: this.state.user});
                                            }}
                                            value={this.state.user.username}
                                            placeholder={_name.在此输入用户名}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                                {/*输入密码*/}
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginHorizontal: 20,
                                }}>
                                    <View style={{
                                        flex: 6,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                    }}>
                                        <Text style={{fontSize: setSpText(32), color: '#444'}}>{_name.密码}</Text>
                                    </View>
                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <TextInput
                                            style={{
                                                height: 46,
                                                flex: 1,
                                                paddingLeft: 5,
                                                paddingRight: 10,
                                                paddingTop: 2,
                                                paddingBottom: 2,
                                                fontSize: setSpText(32)
                                            }}
                                            onChangeText={(password) => {
                                                this.state.user.password = password;
                                                this.setState({user: this.state.user});
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.user.password}
                                            placeholder={_name.在此输入密码}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/*登录*/}
                            <View style={[styles.row, {borderBottomWidth: 0, marginTop: 20}]}>

                                <TouchableOpacity style={{
                                    flex: 1,
                                    backgroundColor: '#387ef5',
                                    padding: 12,
                                    borderRadius: 6,
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }} onPress={() => {
                                    this.onLoginPressed()
                                }}>
                                    <Text style={{color: '#fff', fontSize: setSpText(36)}}>{_name.登录}</Text>
                                </TouchableOpacity>
                            </View>


                            <Modal
                                animationType={"fade"}
                                transparent={true}
                                visible={this.state.showProgress}
                                onRequestClose={() => {
                                    this.setState({showProgress: false})
                                }}
                            >
                                <View style={[styles.modalContainer, styles.modalBackgroundStyle]}>
                                    <ActivityIndicator
                                        animating={true}
                                        style={[styles.loader, {height: 80}]}
                                        size="large"
                                        color="#fff"
                                    />
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style={{color: '#fff', fontSize:setSpText(36), alignItems: 'center'}}>
                                            please wait logining
                                        </Text>
                                        <Text style={{color: '#fff', fontSize: setSpText(40), alignItems: 'center'}}>
                                            {this.state.loginDot}
                                        </Text>
                                    </View>
                                </View>
                            </Modal>

                        </View>

                    </View>
                </ScrollView>
            );
        } else {
            return (
                <ScrollView>
                    <View style={[styles.container]}>

                        <View style={[{
                            backgroundColor: '#387ef5',
                            padding: 10,
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }]}>
                            <Text style={{color: '#fff', fontSize: setSpText(40)}}>supnuevo_ventas</Text>
                        </View>

                        <View style={{justifyContent: 'center', flexDirection: 'row', padding: 10, marginTop: 10}}>
                            <View style={{
                                position: "relative",
                                width: width - 20,
                                height: 200,
                                backgroundColor: "#fff",
                                borderRadius: 3,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                padding: 15,
                                overflow: "hidden"
                            }}>
                                <Image style={styles.logo} source={require('../img/cart.png')}/>
                            </View>

                        </View>

                        <View style={{padding: 10, paddingTop: 2}}>
                            {/*输入用户名*/}
                            <View style={{
                                height: 110, borderWidth: 1,
                                borderColor: '#ddd', borderRadius: 10,
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginBottom: 3,
                                    borderBottomWidth: 0.5,
                                    borderColor: "#ddd",
                                    marginHorizontal: 20,
                                }}>
                                    <View style={{
                                        flex: 3,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                    }}>
                                        <Text style={{fontSize:setSpText(32), color: '#444'}}>{_name.用户名}:</Text>
                                    </View>
                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <TextInput
                                            style={{
                                                height: 46,
                                                flex: 1,
                                                paddingLeft: 5,
                                                paddingRight: 5,
                                                paddingTop: 2,
                                                //paddingBottom: 2,
                                                fontSize: setSpText(32),
                                            }}
                                            onChangeText={(username) => {

                                                this.state.user.username = username;
                                                this.setState({user: this.state.user});
                                            }}
                                            value={this.state.user.username}
                                            placeholder={_name.在此输入用户名}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                                {/*输入密码*/}
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginHorizontal: 20,
                                }}>
                                    <View style={{
                                        flex: 3,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                    }}>
                                        <Text style={{fontSize:setSpText(32), color: '#444'}}>{_name.密码}:</Text>
                                    </View>
                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <TextInput
                                            style={{
                                                height: 46,
                                                flex: 1,
                                                paddingLeft: 5,
                                                paddingRight: 5,
                                                paddingTop: 2,
                                                //paddingBottom: 2,
                                                fontSize: setSpText(32)
                                            }}
                                            onChangeText={(password) => {
                                                this.state.user.password = password;
                                                this.setState({user: this.state.user});
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.user.password}
                                            placeholder={_name.在此输入密码}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/*登录*/}
                            <View style={[styles.row, {borderBottomWidth: 0, marginTop: 20}]}>

                                <TouchableOpacity style={{
                                    flex: 1,
                                    backgroundColor: '#387ef5',
                                    padding: 12,
                                    borderRadius: 6,
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                                                  disabled={this.state.querenstate}
                                                  onPress={() => {
                                                      this.onLoginPressed()
                                                  }}>
                                    <Text style={{color: '#fff', fontSize:setSpText(36)}}>{_name.登录}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.modalContainerIOS]}>
                                <ActivityIndicator
                                    animating={this.state.animating}
                                    color={'#000000'}
                                    size="large"
                                >
                                </ActivityIndicator>
                            </View>
                        </View>
                        {/*IOS端的<Modal>标签无法关闭*/}
                    </View>
                </ScrollView>
            );
        }

    },

    componentDidMount() {

        //fetch username and password
        var username = null;
        var password = null;
        PreferenceStore.get('username').then((val) => {
            username = val;
            return PreferenceStore.get('password');
        }).then((val) => {
            password = val;
            if (username !== undefined && username !== null && username != ''
                && password !== undefined && password !== null && password != '') {
                //TODO:auto-login
                this.setState({
                    user: {
                        username: username,
                        password: password
                    }
                })

            }
        })


    },
});


export default connect(
    (state) => ({
        auth: state.user.auth,

    })
)(Login);


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    modalContainerIOS: {
        justifyContent: 'center',
        padding: 8,
    },
    loader: {
        marginTop: 10,

    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    logo: {
        width: width / 2,
        height: 170
    },
    heading: {
        fontSize: setSpText(40),
        marginTop: 10
    },
    input: {
        width: 240,
        justifyContent: 'center',
        height: 42,
        marginTop: 10,
        padding: 4,
        fontSize: setSpText(30),
        borderWidth: 1,
        borderColor: '#48bbec',
        color: '#48bbec',
        borderBottomWidth: 0
    },
    title: {
        fontSize: setSpText(40),

    },
    button: {
        marginRight: 10
    },
    buttonText: {
        fontSize: setSpText(36),
        color: 'white',
        alignSelf: 'center'
    },

    error: {
        color: 'red',
        paddingTop: 10,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    }

});
