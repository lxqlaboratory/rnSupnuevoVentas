import React, {Component} from 'react';

import {
    NetInfo,
    ListView,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    ActivityIndicator,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    UIManager,
    TouchableOpacity,
    Platform
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Camera from 'react-native-camera';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import commodityinfo from './Commodityinfo';
import query from './Query';
import IconEV from 'react-native-vector-icons/EvilIcons';
import {storeSearchType, getCommodityPriceMainPic, getVentasCommodityPriceOptionList} from "../action/actionCreator";
import Modalbox from 'react-native-modalbox';
import AddVentasSpace from '../components/modal/AddVentasSpace';
import WaitTip from '../components/modal/WaitTip';
import SpaceList from './SpaceList';
import MyPlanList from './MyPlanList';
import ModifyPassword from './ModifyPassword';
import {_name} from '../../Language/IndexLanguage';
import {setSpText,scaleSize} from '../utils/ScreenUtil'
import Config from '../../config';

var Popover = require('react-native-popover');
var proxy = require('../proxy/Proxy');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class MainList extends Component {

    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCameraBarcode(barcode) {
        this.setState({cameraBarcodeModalVisible: false});
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val});
    }

    closePopover() {//关闭搜索方式
        this.setState({menuVisible: false, textVisible: false});
    }

    closeModal() {//关闭添加空间
        this.setState({modalShow_AddVentasSpace: false});
    }


    showPopover(ref) {//ox,oy,width,height,px,py
        if (ref == "text") {
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                this.setState({
                    textVisible: true,
                    buttonRect: {x: px, y: py, width: width, height: height},
                    displayArea: {x: px, y: py + 50, width: width, height: height + 40},
                });
            });
        } else if (ref == "menu") {
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                this.setState({
                    menuVisible: true,
                    buttonRect: {x: px + 20, y: py + 50, width: width+200, height: height+40},
                    displayArea: {x: px, y: py + 50, width: width + 200, height: height + 40},
                });
            });
        }

    }

    navigatorToModifyPassword() {

        var oldPassword = this.props.password;
        var username = this.props.username;

        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ModifyPassword',
                component: ModifyPassword,
                params: {
                    oldPassword: oldPassword,
                    username:username,
                }
            })
        }
    }

    navigatorquery(rowId, priceId, commodityId) {
        let nanf = this.state.priceOptionList;
        this.setState({codeendnum: null});
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'query',
                component: query,
                params: {
                    currentOrderNum: rowId,
                    priceId: priceId,
                    commodityId: commodityId,
                }
            })
        }
    }

    navigatorToMyPlanList() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'MyPlanList',
                component: MyPlanList,
                params: {}
            })
        }
    }

    navigatorToSpaceList() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'SpaceList',
                component: SpaceList,
                params: {}
            })
        }
    }

    navigatorcommodityadd() {
        this.setState({codeendnum: null, modalShow: false, sousuoButtonAble: false});
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'commodityinfo',
                component: commodityinfo,
                params: {
                    codigoBulto1: null,
                    codigoBulto2: null,
                    codigoBulto3: null,
                    codigoBulto4: null,
                    codigoBulto5: null,
                    descripcion: null,
                    tamanoBulto1: null,
                    tamanoBulto2: null,
                    tamanoBulto3: null,
                    tamanoBulto4: null,
                    tamanoBulto5: null,
                    commodityleixinginfo: null,//类型的属性
                    commodityleixingId: "",
                    commoditymiaoshuinfo: "",//描述的属性
                    commoditymiaoshuinfoId: "",
                    commoditypinpaiinfo: "",//品牌的属性
                    commoditypinpaiinfoId: "",
                    commoditychicuninfo: "",//含量的属性
                    commoditychicuninfoId: "",
                }
            })
        }
    }

    onCodigoSelect(priceId) {
        const {dispatch} = this.props;
        if (priceId === null || priceId === undefined) {
            return 0;
        }
        proxy.postes({
            url: Config.server + "/func/ventas/getCommodityPriceFormByPriceId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
            }
        }).then((json) => {
            if (json.errorMsg !== null && json.errorMsg !== undefined) {
                //alert(json.errorMsg);
                return 0;
            }
            else if (json.priceId !== undefined && json.priceId !== null) {
                this.navigatorquery(json.orderNum, json.priceId);
            } else {
                //alert("error");
                return 0;
            }

        }).catch((err) => {
            alert(err);
        });
    }

    chaxun(barcode) {
        var codeendnum = barcode
        //var codeendnum = this.state.codeendnum;
        if (codeendnum === null || codeendnum === 0 || codeendnum === "") {
            alert('no data');
            return 0;
        }
        //this.setState({waitShow: true, sousuoButtonAble: true});
        // this.setState({modalShow: true, sousuoButtonAble: true});
        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityListByInputStringMobile2',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                descripcion: codeendnum,
            }
        }).then((json) => {
            //this.setState({waitShow: false, sousuoButtonAble: false,});
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
                return 0;
            } else {
                if (json.array === undefined || json.array === null) {
                    alert(_name.该商品在我的supnuevo空间中不存在);
                    return 0;
                } else if (json.array.length > 1) {
                    var codes = json.array;
                    this.showPopover('text');
                    this.setState({codeNumlist: codes});
                } else if (json.array.length === 0) {
                    alert(_name.该商品在我的supnuevo空间中不存在);
                    return 0;
                } else if (json.array.length === 1) {
                    let ject = json.array[0];
                    this.navigatorquery(ject.orderNum, ject.priceId, ject.commodityId);
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData, sectionId, rowId) {//rowData.value是priceId
        var row = (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                height: 40,
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderColor: '#eee',
            }}>
                <TouchableOpacity
                    style={{flex: 1,flexDirection:'row'}}
                    onPress={() => {
                        this.navigatorquery(rowId * 1 + 1, rowData.value, rowData.enLabel)
                    }}
                    onLongPress={()=>{
                        Alert.alert(
                        'Alert Title',
                        _name.想做哪种操作,
                        [
                            {text: _name.删除, onPress: () =>
                            {
                                this.deleteButton(rowData.value);

                            }},
                            {text: _name.插入, onPress: () =>
                            {
                                this.insertButton(rowData.value);

                            }},
                            {text: _name.移动到, onPress: () =>
                            {
                                this.setState({modalShow_move:true})
                                this.setState({pressIndex:rowId*1+1,priceId:rowData.value,commodityId:rowData.enLabel})
                            }},
                            {text: _name.取消, onPress: () =>
                            {
                                console.log('Cancel Pressed')
                            }}
                         ]
                        );
                    }}
                >
                    <Text style={{fontSize:setSpText(32),fontWeight:'bold'}}>   {rowData.num} </Text>
                    <Text style={{fontSize:setSpText(30)}}>   {rowData.label} </Text>
                </TouchableOpacity>
            </View>
        );

        return row;
    }

    renderRow_userSeach(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.closePopover();
                    this.onCodigoSelect(rowData.priceId);
                }}>

                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize:setSpText(30)}}>
                            {this.state.searchstate === 4 ? rowData :
                            rowData.codigo+'-'+rowData.descripcion}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    insertButton(priceId) {
        const {dispatch} = this.props;
        if (priceId === null || priceId === undefined) {
            alert("error");
            return 0;
        }
        this.setState({waitShow: true});
        proxy.postes({
            url: Config.server + '/func/ventas/insertSupnuevoVentasCommodityPrice',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                this.setState({waitShow: false});
                setTimeout(() => {
                    alert(_name.空间已满请先删除或购买更多SOS空间);
                }, 1000);
            } else {
                if (json.massage !== undefined && json.massage !== null) {
                    dispatch(getVentasCommodityPriceOptionList());
                    //alert(json.massage);
                }
            }
            this.setState({waitShow: false});
        }).catch((err) => {
            alert(err);
        });
    }

    deleteButton(priceId) {
        const {dispatch} = this.props;
        if (priceId === null || priceId === undefined) {
            alert("error");
            return 0;
        }
        this.setState({waitShow: true});
        proxy.postes({
            url: Config.server + '/func/ventas/deleteSupnuevoVentasCommodityPrice',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if (json.massage !== undefined && json.massage !== null) {
                    dispatch(getVentasCommodityPriceOptionList());
                    //alert(json.massage);
                }
            }
            this.setState({waitShow: false});
        }).catch((err) => {
            alert(err);
        });
    }

    yidongButton(priceId,commodityId) {
        this.setState({modalShow_move:false})
        if (priceId === null || priceId === undefined) {
            alert("error M319");
            return 0;
        }
        if(commodityId === null || commodityId === undefined){
            //选中的空间无内容，不能移动
            alert('EL ESPACIO ESTA VACIO. NO SE PUEDE MOVER');
            return 0;
        }
        let priceOptionList = this.props.priceOptionList;
        let site = this.state.site;
        if (site !== null) {
            site = site * 1;
        }
        if (priceOptionList === null || priceOptionList === undefined) {
            alert("error M328");
            return 0;
        }
        if(site<=0 || site>priceOptionList.length)
        {
            //输入空间号无效
            alert('NUMERO DE ESPACIO INGRESADO INVALIDO');
            return 0;
        }

        this.moveSupnuevoVentasCommodityPrice(priceId);

    }

    moveSupnuevoVentasCommodityPrice(priceId) {
        const {dispatch} = this.props;
        let site = this.state.site;
        this.setState({waitShow: true});

        proxy.postes({
            url: Config.server + '/func/ventas/moveSupnuevoVentasCommodityPrice',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
                site: site * 1,
            }
        }).then((json) => {

            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                this.setState({waitShow:false})
                setTimeout(() => {
                    alert(errorMsg);
                }, 1000);
            } else {
                if (json.massage !== undefined && json.massage !== null) {
                    dispatch(getVentasCommodityPriceOptionList()).then(()=>{
                        setTimeout(() => {
                            this.setState({waitShow: false});
                        }, 1000);
                    });
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    qingkongButton(priceId) {
        const {dispatch} = this.props;
        if (priceId === null || priceId === undefined) {
            alert("error");
            return 0;
        }
        this.setState({waitShow: true});
        proxy.postes({
            url: Config.server + '/func/ventas/clearSupnuevoVentasCommodityPrice',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.massage !== undefined && json.massage !== null) {
                    dispatch(getVentasCommodityPriceOptionList());
                    //alert(json.massage);
                }

            }
            this.setState({waitShow: false});
        }).catch((err) => {
            alert(err);
        });
    }


    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            waitShow: false,
            showProgress: true,
            modalShow: false,
            total: [],//每一行的sum数组
            total_1: 0,//最后显示的total总数
            total_2: 0,
            codeNum: null,
            commodityList: [],
            codes: [],
            commodity: null,
            commodityId:null,
            cameraModalVisible: false,
            usertextinput: null,
            price: 0,
            priceId: null,
            codesModalVisible: false,
            text: null,
            sousuoButtonAble: false,
            priceOptionList: this.props.priceOptionList,
            codeendnum: null,
            menuVisible: false,
            buttonRect: null,
            displayArea: null,
            textVisible: false,
            userinputseach: [],
            codeNumlist: [],
            site: null,//用户输入的移动的位置
            modalShow_AddVentasSpace: false,

            cameraBarcodeModalVisible: false,
            modalShow_move:false,
            camera: {
                // aspect: Camera.constants.Aspect.fill,
                // captureTarget: Camera.constants.CaptureTarget.disk,
                // type: Camera.constants.Type.back,
                // orientation: Camera.constants.Orientation.auto,
                // flashMode: Camera.constants.FlashMode.auto
            },
            pressIndex:0,

            openFlash: false,
        }
    }

    render() {

        var commodityListView = null;
        var commodityList = this.props.priceOptionList;
        let username = this.props.username;
        let ventasid = this.props.ventasId;
        let codeNumlist = this.state.codeNumlist;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var userinputseach = null;
        var openFlash = this.state.openFlash;
        //用户输入查询结果显示
        if (codeNumlist.length !== 0 && codeNumlist !== [] && codeNumlist !== undefined && codeNumlist !== null) {
            var data = codeNumlist;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            userinputseach =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_userSeach.bind(this)}
                    />
                </ScrollView>;
        }
        let displayArea = {x: 0, y: 20, width: width, height: height};
        //主页面列表显示
        if (commodityList !== undefined && commodityList !== null && commodityList.length > 0) {
            commodityListView = (
                <ListView
                    dataSource={ds.cloneWithRows(commodityList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }
        return (
            <View style={{flex: 1,backgroundColor:'#fff'}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    height: 55,
                    paddingLeft: 6,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'
                }, styles.card]}>
                    <View style={{}}>
                    </View>
                    <Text style={{fontSize:setSpText(33), textAlign: 'center', color: '#fff', paddingTop: 10,}}>
                        {username}
                    </Text>
                    <TouchableOpacity ref="menu" style={{
                        paddingRight: 10, paddingTop: 10
                    }}
                                      onPress={this.showPopover.bind(this, 'menu')}>
                        <Icon name="chevron-circle-left" color="#fff" size={30}></Icon>
                    </TouchableOpacity>
                </View>

                {/* body */}
                <View style={{flex: 1}}>
                    <View style={{
                        flexDirection: 'row', flex: 1, justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextInput
                            ref="text"
                            style={{
                                flex: 3,
                                borderWidth: 1,
                                padding: 10,
                                marginTop: 10,
                                marginLeft: 6,
                                height: 40,
                                alignItems: 'center'
                            }}
                            value={this.state.codeendnum}
                            onChangeText={(codeendnum) => {
                                this.setState({codeendnum: codeendnum})
                            }}
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                            //keyboardType="numeric"
                            //clearTextOnFocus="true"//only ios
                        />

                        <TouchableOpacity style={{
                            flex: 2,
                            flexDirection: 'row',
                            marginLeft: 3,
                            marginTop: 10,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#CAE1FF'
                        }} onPress={() => {
                            var barcode = this.state.codeendnum
                            this.chaxun(barcode)
                        }} disabled={this.state.sousuoButtonAble}
                    >
                        <View style={{padding: 3}}>
                            <Text style={{color: '#343434', fontSize:setSpText(26)}}>{_name.搜索}</Text>
                        </View>
                    </TouchableOpacity>

                        <TouchableOpacity style={{
                            flex: 2,
                            flexDirection: 'row',
                            marginLeft: 3,
                            marginTop: 10,
                            height: 40,
                            marginRight: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#CAE1FF'
                        }} onPress={() => {
                            this.setState({cameraBarcodeModalVisible: true})
                        }}
                        >
                            <View style={{padding: 3}}>
                                <Text style={{color: '#343434', fontSize:setSpText(26)}}>{_name.扫描}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40,
                        borderBottomWidth: 2,
                        borderColor: '#A1A1A1',
                        marginHorizontal: 10
                    }}>
                        <Text style={{fontSize:setSpText(30)}}>{_name.我的supnuevo空间}</Text>
                    </View>
                    {/* ListView */}
                    <View style={{flexDirection: 'row', flex: 8, padding: 2}}>
                        {commodityListView}
                    </View>
                </View>
                <Popover
                    isVisible={this.state.textVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 150}}>
                        {userinputseach}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <TouchableOpacity
                        style={[styles.popoverContent, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                        onPress={() => {
                            this.closePopover();
                            this.navigatorToMyPlanList();
                        }}>
                        <Text style={[styles.popoverText, {color: '#444'}]}>{_name.查看消费记录}</Text>
                    </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.popoverContent, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                            onPress={() => {
                            this.setState({menuVisible: false});
                            this.navigatorToSpaceList();
                        }}>
                            <Text style={[styles.popoverText, {color: '#444'}]}>{_name.购买空间}</Text>
                        </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.popoverContent, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                        onPress={() => {
                            this.setState({menuVisible: false});
                            this.navigatorToModifyPassword();
                        }}>
                        <Text style={[styles.popoverText, {color: '#444'}]}>{_name.修改密码}</Text>
                    </TouchableOpacity>
                </Popover>
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
                        onClose={() => {
                            this.closeModal()
                        }}
                    />
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.modalShow_move}
                    onRequestClose={()=>{
                        this.setState({modalShow_move: false})
                    }}
                    animationType={"slide"}>
                    <View style={styles.modelbox}>

                        <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center',padding:3,marginTop:10}}>
                        <Text style={{fontSize:setSpText(34), color: '#000',}}>
                            INGRESE EL NUMERO DE ESPACIO
                        </Text>
                        <Text style={{fontSize:setSpText(34), color: '#000',}}>
                            PARA MOVER EL PRODUCTO
                        </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30
                        }}>
                            <Text style={{fontSize:setSpText(34), color: '#000',}}>
                                {this.state.pressIndex}
                            </Text>
                            <Text style={{fontSize:setSpText(34), color: '#000',marginLeft:5}}>
                                {_name.移动到}
                            </Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    paddingLeft: 10,
                                    height: 40,
                                    width: 60,
                                    marginLeft:5,
                                }}
                                value={null}
                                onChangeText={(site) => {
                                    this.setState({site: site})
                                }}
                                underlineColorAndroid="transparent"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30
                        }}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            height: 40,
                            borderRadius: 4,
                            backgroundColor: '#CAE1FF'
                        }} onPress={() => {
                            this.yidongButton(this.state.priceId,this.state.commodityId);
                        }}>
                            <Text style={{textAlign: 'center'}}>
                                {_name.确认}
                            </Text>
                        </TouchableOpacity>

                            <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            height: 40,
                            borderRadius: 4,
                            marginLeft:20,
                            backgroundColor: '#CAE1FF'
                        }} onPress={() => {
                            this.setState({modalShow_move:false})
                        }}>
                                <Text style={{textAlign: 'center'}}>
                                    {_name.取消}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
                <WaitTip
                    ref="waitTip"
                    waitShow={this.state.waitShow}
                    tipsName="please wait..."
                />

                {/*part*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraBarcodeModalVisible}
                    onRequestClose={() => {
                            this.setState({cameraBarcodeModalVisible: false})
                        }}
                >
                    <Camera
                        ref={ref => {
                                this.camera = ref;
                            }}
                        style={styles.preview}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        torchMode={openFlash ? Camera.constants.TorchMode.on:Camera.constants.TorchMode.off}
                        onBarCodeRead={(barcode) => {
                                this.closeCameraBarcode();
                                var {type, data, bounds} = barcode;
                                if (data !== undefined && data !== null) {
                                    console.log('barcode data=' + data + 'barcode type=' + type);
                                    this.state.codeendnum = data;
                                    this.setState({codeendnum:data});
                                    setTimeout(() => this.chaxun(data), 1000)
                                }
                            }}
                    />
                    <View style={[styles.box]}>
                    </View>
                    <View style={{
                        position: 'absolute',
                        right: 1 / 2 * width - 100,
                        top: 1 / 2 * height,
                        height: 100,
                        width: 200,
                        borderTopWidth: 1,
                        borderColor: '#e42112',
                        backgroundColor: 'transparent'
                    }}>
                    </View>
                    <View style={[styles.overlay, styles.bottomOverlay,{flexDirection:'column'}]}>

                        <TouchableOpacity
                            onPress={() => {
                                this.changeFlash()
                            }}
                        >
                            <Icon name="flash" size={30} color="#fff"/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.captureButton,{marginTop:20}]}
                            onPress={() => {
                                 this.closeCameraBarcode();
                            }}
                        >
                            <Icon name="times-circle" size={50} color="#343434"/>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        );
    }
}


var styles = StyleSheet.create({

    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelbox: {
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 250,
        backgroundColor: '#ffffff',
        marginTop:(height-250)/2,
        marginLeft:(width-300)/2,
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    body: {
        padding: 10
    },
    popoverContent: {
        width: 280,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: setSpText(30)
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        password: state.user.password,
        commodityClassList: state.sale.commodityClassList,
        weightService: state.sale.weightService,
        sessionId: state.user.sessionId,
        ventasId: state.user.ventasId,
        priceOptionList: state.user.priceOptionList,
    })
)(MainList);
