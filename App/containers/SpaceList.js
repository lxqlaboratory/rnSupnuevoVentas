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
import {getVentasCommodityPriceOptionList} from '../action/actionCreator'
import {setSpText,scaleSize} from '../utils/ScreenUtil'
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class SpaceList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            planList: [],
            planInfo: null,
            modalShow_AddVentasSpace: false,
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
                if (json.ArrayList !== undefined && json.ArrayList !== null) {
                    this.setState({planList: json.ArrayList});
                    if (json.ArrayList.length==0)
                        alert(_name.计划为空)
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData) {
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
                        <Text style={styles.renderText}>{_name.计划名称} : </Text>
                        <Text style={styles.renderText}> {rowData.planName}</Text>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.购买天数} : </Text>
                        <Text style={styles.renderText}> {rowData.dayCount}</Text>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.商品数量} : </Text>
                        <Text style={styles.renderText}> {rowData.commodityCount}</Text>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{_name.租用费用} : </Text>
                        <Text style={styles.renderText}> {rowData.rentFee}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );

        return row;
    }

    componentDidMount() {
        this.getSupnuevoVentasRentPlanListOfVentas();
    }

    render() {
        var listView = null;
        var infoList = this.state.planList;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        if (infoList !== undefined && infoList !== null && infoList.length>0) {
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(infoList)}
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
                            paddingTop: 10,
                        }}>
                            <IconF name="chevron-left" color="#fff" size={25}></IconF>
                            <Text style={{fontSize: setSpText(36), textAlign: 'center', color: '#fff'}}>
                                {_name.计划列表}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    {listView}
                </View>
                {/*增加空间modal*/}
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalShow_AddVentasSpace}
                    onRequestClose={() => {
                        this.setState({modalShow_AddVentasSpace: false})
                    }}
                >
                    <AddVentasSpace
                        planInfo={this.state.planInfo}
                        onClose={() => {
                        this.closeModal()
                        const {dispatch} = this.props;
                        dispatch(getVentasCommodityPriceOptionList()).then((json)=>{
                            console.log('ok')
                        })
                        }}
                    />
                </Modal>
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
)(SpaceList);
