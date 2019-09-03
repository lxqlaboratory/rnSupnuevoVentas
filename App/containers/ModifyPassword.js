import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ListView,
    Modal
} from 'react-native';

var proxy = require('../proxy/Proxy');
import {connect} from 'react-redux';
import Config from '../../config';
import IconF from 'react-native-vector-icons/Feather';
import AddVentasSpace from '../components/modal/AddVentasSpace';
import {_name} from '../../Language/IndexLanguage';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import {setSpText,scaleSize} from '../utils/ScreenUtil'

class MyPlanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPassword:'',
            newPassword:'',
            reconfirmPassword:'',
        }
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

        modifyPassword() {
            var username = this.props.username;
            var oldPassword = this.state.oldPassword;
            var newPassword = this.state.newPassword;
            var reconfirmPassword = this.state.reconfirmPassword;

            const {dispatch} = this.props;
            if (oldPassword === null || oldPassword === undefined) {
                alert(_name.请输入密码);
                return;
            }
            if (newPassword === null || newPassword === undefined) {
                alert(_name.请输入密码);
                return;
            }
            if (reconfirmPassword === null || reconfirmPassword === undefined) {
                alert(_name.请输入密码);
                return;
            }

            if(reconfirmPassword!=newPassword){
                alert(_name.确认密码应与新密码一致);
                return;
            }

            proxy.postes({
                url: Config.server + "/func/ventas/ModifySupnuevoVentasPasswordMobile",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    username:username,
                }
            }).then((json) => {
                if (json.data.errorMsg !== null && json.data.errorMsg !== undefined) {
                    alert(_name.旧密码输入错误);
                    return 0;
                }
                else if (json.data.message !== undefined && json.data.message !== null) {
                    var message = json.data.message;
                    alert(_name.修改成功);
                    this.goBack();
                } else {
                    //alert("error");
                    return 0;
                }

            }).catch((err) => {
                alert(err);
            });
        }

    componentWillMount() {
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={{
                    backgroundColor: '#387ef5',
                    height: 55,
                    paddingLeft: 12,
                    paddingTop: 10
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.goBack();
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: 10,
                        }}>
                            <IconF name="chevron-left" color="#fff" size={25}></IconF>
                            <Text style={{fontSize: setSpText(36), textAlign: 'center', color: '#fff'}}>
                                {_name.修改密码}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.horizontal}>
                    <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 10
                            }]}>{_name.旧密码}:</Text>
                    <TextInput
                        style={styles.textinput}
                        onChangeText={(oldPassword) => {
                                    this.setState({oldPassword: oldPassword})
                                }}
                        value={this.state.oldPassword}
                        secureTextEntry={true}
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent"
                    >
                    </TextInput>
                </View>

                <View style={styles.horizontal}>
                    <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 10
                            }]}>{_name.新密码}:</Text>
                    <TextInput
                        style={styles.textinput}
                        onChangeText={(newPassword) => {
                                    this.setState({newPassword: newPassword})
                                }}
                        value={this.state.newPassword}
                        secureTextEntry={true}
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent">
                    </TextInput>
                </View>

                <View style={styles.horizontal}>
                    <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 10
                            }]}>{_name.确认密码}:</Text>
                    <TextInput
                        style={styles.textinput}
                        onChangeText={(reconfirmPassword) => {
                                    this.setState({reconfirmPassword: reconfirmPassword})
                                }}
                        value={this.state.reconfirmPassword}
                        secureTextEntry={true}
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent">
                    </TextInput>
                </View>

                <View style={styles.horizontal}>
                    <TouchableOpacity style={{backgroundColor: '#387ef5',height: 50,marginTop:20,padding:10,paddingHorizontal:20,borderRadius:5}}
                    onPress={()=>{
                        this.modifyPassword();
                    }}>
                        <Text style={{fontSize:setSpText(34),color:'#fff'}}>{_name.确认}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}


var styles = StyleSheet.create({
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    renderText: {
        fontSize: setSpText(34),
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    //显示标题字体格式
    titletext: {
        color: '#222',
        fontSize: setSpText(30),
    },
    //输入框的格式
    textinput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: setSpText(30),
        borderWidth: 1,
        borderRadius: 5,
        color: "black"
    },
    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingRight:10,
    },
});


module.exports = connect(state => ({

    })
)(MyPlanList);
