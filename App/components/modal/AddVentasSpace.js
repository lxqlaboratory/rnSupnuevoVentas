import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Text,
    Modal,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ActivityIndicator
} from 'react-native';
import {_name} from '../../../Language/IndexLanguage';
import IconF from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import DatePicker from 'react-native-datepicker'
import Config from '../../../config';
import getVentasCommodityPriceOptionList from '../../action/actionCreator'
import {setSpText,scaleSize} from '../../utils/ScreenUtil'
var proxy = require('../../proxy/Proxy');

var {height, width} = Dimensions.get('window');


class AddVentasSpace extends Component {

    close() {

        this.props.onClose();
    }

    _handlePressCommit() {
        let zuyongfee = this.state.planInfo.rentFee * 1;
        let shanghufeebalance = this.state.shanghuyue * 1;
        if (zuyongfee > shanghufeebalance) {
            alert(_name.余额不足);
            return 0;
        } else {
            let planId = this.state.planInfo.planId;
            let startDate = this.state.kaishishijian;
            if (startDate === null) {
                alert(_name.请选择时间);
                return 0;
            }
            this.setState({confim_btn_disable: true, modalShow: true});
            proxy.postes({
                url: Config.server + '/func/ventas/addOneMergeRentPlanToVentas',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    planId: planId,
                    startDate: startDate,
                }
            }).then((json) => {
                this.setState({modalShow:false})

                setTimeout(() => {
                    this.setState({confim_btn_disable: false});
                    var errorMsg = json.errorMsg;
                    if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                        alert(errorMsg);
                        return;
                    } else {

                        Alert.alert(
                            'SUCCESS',
                            _name.购买空间成功,
                            [
                                {text: 'OK', onPress: () => this.close(), style: 'cancel'},
                            ],
                            {cancelable: false}
                        );
                    }
                }, 1000);
            }).catch((err) => {
                alert(err);
            });
        }
    }

    _handlePress1(data) {
        if (data === 0) {
            this.refs.actionSheet1.hide();
            return;
        }
        let jihuabiaozhiName = this.state.jihuabiaozhiNameList[data];
        let jihuabiaozhiList = this.state.jihuabiaozhiList;
        for (let i = 0; i < jihuabiaozhiList.length; i++) {
            if (jihuabiaozhiName === jihuabiaozhiList[i].planName) {
                this.setState({
                    planId: jihuabiaozhiList[i].planId,
                    jihuabiaozhi: jihuabiaozhiList[i].planNum,
                    jihuamingcheng: jihuabiaozhiList[i].planName,
                    jihualeixing: jihuabiaozhiList[i].planType,
                    kongjiandaxiao: jihuabiaozhiList[i].commodityCount,
                    zuyongfeiyong: jihuabiaozhiList[i].rentFee,
                    monthCount: jihuabiaozhiList[i].monthCount,
                });
            }
        }
    }

    getVentasSpaceDate() {

        var date = new Date();
        date.setDate(date.getDate());

        if (this.state.planInfo !== null) {
            let dayCount = this.state.planInfo.dayCount;
            if (dayCount == undefined || dayCount == null) {
                return;
            }
            // let dateeee = new Date(date);显示日期的dd//mm//yy，所以需要reverse之后new
            let dateeee = new Date();
            dateeee.setDate(dateeee.getDate() + dayCount);
            //let jieshuString = dateeee.toLocaleDateString().replace(new RegExp('/', 'g'), "-");这里toLocaleDateString类型不确定

            var kaishiString = this.changeToDateString(date)
            var jieshuString = this.changeToDateString(dateeee)

            this.setState({kaishishijian: kaishiString, jieshushijian: jieshuString});
        } else {
            alert(_name.请先选择计划);
            return 0;
        }
    }

    changeToDateString(date){

        let dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        let mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        let yy = date.getFullYear();

        let result = dd + '/' + mm + '/' + yy;

        return result;
    }

    constructor(props) {
        super(props);
        this.state = {
            planInfo: this.props.planInfo,
            kaishishijian: null,
            jieshushijian: null,
            shanghuyue: null,
            modalShow: false,
            confim_btn_disable: false,
        }
    }

    getSupnuevoVentasRentPlanListOfVentas() {
        proxy.postes({
            url: Config.server + '/func/ventas/getSupnuevoVentasRentPlanListOfVentas',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {

                /* let jihuabiaozhiNameList = [];
                 jihuabiaozhiNameList.push("取消");
                 for (let bject in json.ArrayList) {
                     jihuabiaozhiNameList.push(json.ArrayList[bject].planName);
                 }

                 this.setState({jihuabiaozhiList: json.ArrayList, jihuabiaozhiNameList: jihuabiaozhiNameList});
                 this.refs.actionSheet1.show();*/
            }
        }).catch((err) => {
            alert(err);
        });
    }

//获取商户余额
    getVentasFeeBalanceByVentasId() {
        proxy.postes({
            url: Config.server + '/func/ventas/getVentasFeeBalanceByVentasId',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.rentFeeBalance !== null && json.rentFeeBalance !== undefined) {
                    this.setState({shanghuyue: json.rentFeeBalance});
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    componentWillMount() {
        //this.getSupnuevoVentasRentPlanListOfVentas();
        this.getVentasSpaceDate();
        this.getVentasFeeBalanceByVentasId();
    }

    render() {

        let planInfo = this.props.planInfo;
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
                            this.close();
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                        }}>
                            <IconF name="chevron-left" color="#fff" size={25}></IconF>
                            <Text style={{fontSize: setSpText(38), textAlign: 'center', color: '#fff', paddingLeft: 10}}>
                                {_name.添加空间}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/*body*/}
                <ScrollView>
                    <View style={{height: 500}}>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.计划标志}:</Text>
                            <View style={[styles.textinput, {
                                borderColor: '#A6A6A6',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }]}>
                                <Text style={{fontSize: setSpText(30),}}>{planInfo.planNum}</Text>
                            </View>
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.计划名称}:</Text>
                            <View style={[styles.textinput, {
                                borderColor: '#A6A6A6',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }]}>
                                <Text style={{fontSize: setSpText(30),}}>{planInfo.planName}</Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: 5,
                        }}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.空间大小}:</Text>
                            <Text
                                style={[styles.textinput, {
                                    borderColor: '#A6A6A6',
                                    paddingTop: 7
                                }]}>{planInfo.commodityCount}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center', paddingTop: 5,
                        }}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.开始时间}:</Text>
                            <Text style={[styles.textinput, {
                                paddingTop: 7,
                                color:'#aaa',
                                borderWidth:0,
                            }]}>{this.state.kaishishijian}</Text>
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.结束时间}:</Text>
                            <Text style={[styles.textinput, {
                                paddingTop: 7,
                                color:'#aaa',
                                borderWidth:0,
                            }]}>{this.state.jieshushijian}</Text>
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.租用费用}:</Text>
                            <Text style={[styles.textinput, {
                                borderColor: '#A6A6A6',
                                paddingTop: 7
                            }]}>{planInfo.rentFee}</Text>
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商户余额}:</Text>
                            <Text style={[styles.textinput, {
                                borderColor: '#A6A6A6',
                                paddingTop: 7
                            }]}>{this.state.shanghuyue}</Text>
                        </View>
                        <View style={[styles.horizontal, {marginTop: 10,}]}>
                            <View style={[styles.horizontal, {paddingBottom: 20,}]}>
                                <TouchableOpacity
                                    style={[styles.popoverContent, styles.touchstyle]}
                                    disabled={this.state.confim_btn_disable}
                                    onPress={() => {
                                         Alert.alert(
                        'Please',
                        _name.确定要购买该计划吗,
                        [
                            {text: 'OK', onPress: () => this._handlePressCommit(), style: 'cancel'},
                            {text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'destructive'},
                        ],
                        {cancelable: false}
                    );

                                    }}>
                                    <Text style={{
                                        fontSize: setSpText(30),
                                        color: '#387ef5',
                                    }}>{_name.购买}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.horizontal, {paddingBottom: 20}]}>
                                <TouchableOpacity
                                    style={[styles.popoverContent, styles.touchstyle]}
                                    onPress={() => {
                                        this.close();
                                    }}>
                                    <Text style={{
                                        fontSize: setSpText(30),
                                        color: '#387ef5',
                                    }}>{_name.取消}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {/*计划标志弹窗*/}
                {/*<ActionSheet
                    ref="actionSheet1"
                    title="请选择含量单位"
                    options={this.state.jihuabiaozhiNameList}
                    cancelButtonIndex={0}
                    onPress={(index) => {
                       // this._handlePress1(index);
                    }}
                />*/}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalShow}
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
                            <Text style={{color: '#fff', fontSize: setSpText(34), alignItems: 'center'}}>
                                {_name.请等待}。。。
                            </Text>
                        </View>
                    </View>
                </Modal>

            </View>
        );
    }
}


var styles = StyleSheet.create({
    //输入框的格式
    textinput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 5,
        fontSize: setSpText(30),
        borderWidth: 1,
        borderRadius: 5,
    },
    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    popoverText: {
        fontSize: setSpText(32),
        color: '#387ef5',
    },
    popoverContent: {
        width: width / 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //按钮标准格式
    touchstyle: {
        borderWidth: 1,
        borderRadius: 5,
        width: 100,
        borderColor: '#387ef5',
        marginHorizontal: 6
    },
});


module.exports = AddVentasSpace;
