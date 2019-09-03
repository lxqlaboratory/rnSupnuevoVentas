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
import {setSpText,scaleSize} from '../utils/ScreenUtil'
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class MyPlanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            planList: [],
            planInfo: null,
            modalShow_AddVentasSpace: false,
            shanghuyue: "",
        }
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    openModal(planInfo) {
        this.setState({modalShow_AddVentasSpace: true, planInfo: planInfo});
    }

    closeModal() {
        this.setState({modalShow_AddVentasSpace: false});

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

    getSupnuevoVentasSelfRentPlanListOfVentas() {
        proxy.postes({
            url: Config.server + '/func/ventas/getSupnuevoVentasSelfRentPlanListOfVentas',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
                return 0;
            } else {
                if (json.ArrayList !== undefined && json.ArrayList !== null) {
                    var list = json.ArrayList;
                    if(list.length==0)
                        alert(_name.我的空间为空);
                    this.setState({planList: list});

                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    changeToDateString(date){

        let dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        let mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        let yy = date.getFullYear();

        let result = dd + '/' + mm + '/' + yy;

        return result;
    }

    renderRow(rowData) {

        var flag = 0;

        let startDate = new Date(rowData.startDate);
        let endDate = new Date(rowData.endDate);
        let now = new Date();
        if((now>=startDate)&&(now<=endDate))flag = 1;

        startDate = this.changeToDateString(startDate);
        endDate = this.changeToDateString(endDate);
        now = this.changeToDateString(now);

        var row = (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 140,
                backgroundColor: '#E5E5E5',
                paddingLeft: 15,
                paddingTop: 10,
                borderRadius: 10,
                margin: 10,
            }}>
                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                        this.openModal(rowData);
                    }}
                >
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.商品数量}: </Text>
                        <Text style={styles.renderText}> {rowData.commodityCount}</Text>
                        <View style={{flex:1,alignItems:'flex-end',paddingRight:5}}>
                            {flag==0?
                                <View style={{padding:5,borderWidth:1,borderColor:'red',borderRadius:5}}>
                                    <Text style={{color:'red',fontSize:setSpText(32)}}>{_name.未运行}</Text>
                                </View>:
                                <View style={{padding:5,borderWidth:1,borderColor:'green',borderRadius:5}}>
                                    <Text style={{color:'green',fontSize:setSpText(32)}}>{_name.运行中}</Text>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.租用天数} : </Text>
                        <Text style={styles.renderText}> {rowData.rentDays}</Text>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.开始时间} : </Text>
                        <Text style={styles.renderText}> {startDate}</Text>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.结束时间} : </Text>
                        <Text style={styles.renderText}> {endDate}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        );

        return row;
    }

    componentWillMount() {
        this.getSupnuevoVentasSelfRentPlanListOfVentas();
        this.getVentasFeeBalanceByVentasId();
    }

    render() {
        let listView = null;
        let infoList = this.state.planList;
        if (infoList !== undefined && infoList !== null) {
            let data = infoList;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(this)}
                />
        }
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
                            <Text style={{fontSize:setSpText(36), textAlign: 'center', color: '#fff'}}>
                                {_name.个人空间记录}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginHorizontal: 10,
                    paddingLeft: 10,
                    paddingTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#B8B8B8'
                }}>
                    <Text style={{fontSize: setSpText(33)}}>{_name.商户余额} : {this.state.shanghuyue}</Text>
                </View>
                <View style={{flex: 1}}>
                    {listView}
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
        fontSize: setSpText(32),
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
});


module.exports = connect(state => ({})
)(MyPlanList);
