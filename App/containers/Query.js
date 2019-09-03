/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import {
    NetInfo,
    CameraRoll,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    ListView,
    Image,
    Picker,
    Button,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    PermissionsAndroid,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import IconE from 'react-native-vector-icons/Entypo';
import IconEV from 'react-native-vector-icons/EvilIcons';
import IconF from 'react-native-vector-icons/Feather';
import IconFo from 'react-native-vector-icons/FontAwesome';
import {_name} from '../../Language/IndexLanguage';
import Config from '../../config';
import GoodAdd from './GoodAdd';
import Camera from 'react-native-camera';
import commodityinfo from './Commodityinfo';
import Modalbox from 'react-native-modalbox';
import {
    storeSearchType,
    getCommodityPriceMainPic,
    getVentasCommodityPriceOptionList,
    setCommodityPriceMainPic,
    getCommodityPicList,
    setCommodityPicListNull
} from "../action/actionCreator";
import PopupDialog from 'react-native-popup-dialog';
import ImageP from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import ModalDropdown from 'react-native-modal-dropdown';
import {setSpText,scaleSize} from '../utils/ScreenUtil';
import CodeNumModal from '../components/modal/CodeNumModal'

let NativeModules = require('NativeModules');
var Popover = require('react-native-popover');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');

class Query extends Component {

    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCodeNumModal(val) {
        this.setState({codeNumModalVisible: val,start:0,codeNumlist:[]});
    }

    closeCameraBarcode() {
        this.setState({cameraBarcodeModalVisible: false});
    }

    cancel() {
        //this.props.reset();
        const {dispatch} = this.props;
        dispatch(setCommodityPicListNull());
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val, goods: {}, selectedCodeInfo: {}, priceShow: null, hasCodigo: false});
    }

    showPopover(ref) {
        let _width = width;
        if (ref == "menu") {//输入框下边的查询提示框
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                this.setState({
                    menuVisible: true,
                    buttonRect: {x: px, y: py, width: width, height: height},
                    displayArea: {x: px, y: py + 50, width: width + 200, height: height + 40},
                });
            });
        } else if (ref == "commodityInfo") {//右上角的弹出框
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                this.setState({
                    commodityInfoVisable: true,
                    buttonRect: {x: px + 20, y: py + 40, width: 200, height: height},
                });
            });
        } else if (ref == "mulu1") {
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluVisible_1: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "mulu2") {
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluVisible_2: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "mulu3") {
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluVisible_3: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "mulu4") {
            this.refs[ref].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluVisible_4: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "muluInfo1") {
            this.refs.mulu1.measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluInfoVisible_1: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "muluInfo2") {
            this.refs["mulu2"].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluInfoVisible_2: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "muluInfo3") {
            this.refs["mulu3"].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluInfoVisible_3: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        } else if (ref == "muluInfo4") {
            this.refs["mulu4"].measure((ox, oy, width, height, px, py) => {
                console.log(ox, oy, width, height, px, py);
                this.setState({
                    muluInfoVisible_4: true,
                    buttonRect: {x: px - 50, y: py, width: 200, height: height},
                });
            });
        }

    }

    closePopover() {//关闭搜索方式
        this.setState({
            menuVisible: false,
            commodityInfoVisable: false,
            muluVisible_1: false,
            muluVisible_2: false,
            muluVisible_3: false,
            muluVisible_4: false
        });
    }

    closeMuluInfoPopover() {//关闭搜索方式
        this.setState({
            muluInfoVisible_1: false,
            muluInfoVisible_2: false,
            muluInfoVisible_3: false,
            muluInfoVisible_4: false
        });
    }

    onCodigoSelect(commodityId) {//commodityId查询到的商品的commodityId
        let commodityId1 = this.state.commodityId;//commodityId是原先空间上的commodityId
        console.log(this.state.commodityId);
        proxy.postes({
            url: Config.server + "/func/ventas/getCommodityPriceFormByCommodityId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId + '',
            }
        }).then((json) => {
            this.resolveSearchBackJson(json);
        }).catch((err) => {
            alert(err);
        });
    }

    resolveSearchBackJson(json) {
        const {dispatch} = this.props;
        if (json !== undefined && json !== null && json.length !== 0) {
            if (json.errorMsg !== undefined && json.errorMsg !== null) {
                alert(json.errorMsg);
                return 0;
            }
            if (json.orderNum !== null && json.priceId !== null) {//首先判断搜索的商品在空间列表中存不存在
                // Alert.alert(
                //     'Please',
                //     _name.空间内已存在此商品,
                //     [
                //         {
                //             text: _name.跳转, onPress: () => {
                //             this.setState({priceId: json.priceId});
                //             this.setCommogity(json);
                //             dispatch(getCommodityPriceMainPic(this.state.priceId))
                //         }, style: 'cancel'
                //         },
                //         {text: _name.取消, onPress: () => console.log('OK Pressed'), style: 'destructive'},
                //     ],
                //     {cancelable: false}
                // );

                this.setState({priceId: json.priceId});
                dispatch(setCommodityPicListNull());
                dispatch(getCommodityPicList(json.commodityId));
                // dispatch(getCommodityPriceMainPic(json.priceId));
                this.setCommogity(json);

            } else if (this.state.commodityId !== null && this.state.commodityId !== json.commodityId && this.state.commodityId !== undefined) {
                json.orderNum = this.state.currentOrderNum;

                this.setCommogity(json);
                dispatch(setCommodityPicListNull());
                dispatch(getCommodityPicList(json.commodityId));

            } else if (this.state.commodityId === undefined || this.state.commodityId == null) {
                if (json.orderNum === null) {
                    json.orderNum = this.state.currentOrderNum;
                }
                if (json.priceId === null) {
                    this.setCommogity(json);
                    //dispatch(getCommodityPriceMainPic(this.state.priceId));
                } else {
                    this.setState({priceId: json.priceId});
                    this.setCommogity(json);
                    //dispatch(getCommodityPriceMainPic(json.priceId));
                }
                dispatch(getCommodityPicList(json.commodityId));
            }else{
                this.setCommogity(json);
                dispatch(setCommodityPicListNull());
                dispatch(getCommodityPicList(json.commodityId));
            }
        } else {
            alert("error");
            return 0;
        }
    }

    renderRow(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.closePopover();
                    this.onCodigoSelect(rowData.value);
                }}>

                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize: setSpText(30)}}>
                            {rowData.label}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    queryGoodsCode(codeNum) {
        //this.setState({showProgress: true});
        // this.showPopover.bind(this, 'menu');
        if (codeNum === "" || codeNum === null || codeNum.length === 0 || codeNum === undefined) {
            alert(_name.请输入条码);
            return;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/getQueryDataListByInputStringMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                codigo: codeNum,
            }
        }).then((json) => {
            this.setState({showProgress: false});
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    let codeNumlist = [];
                    for (let i = 0; i < codes.length; i++) {
                        codeNumlist[i] = codes[i].codigo;
                    }
                    this.showPopover('menu');
                    this.setState({codeNumlist: codes});
                } else if (json.array === null) {
                    Alert.alert(
                        'Please',
                        _name.没有条码是否添加,
                        [
                            {text: 'OK', onPress: () => this.navigatorcommodityadd(codeNum), style: 'cancel'},
                            {text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'destructive'},
                        ],
                        {cancelable: false}
                    );
                }
                else if (json.object !== undefined) {
                    this.onCodigoSelect(json.object.commodityId);

                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    queryGoodsCodeByName(codeNum) {
        // this.showPopover.bind(this, 'menu');
        if (codeNum === "" || codeNum === null || codeNum.length === 0) {
            alert(_name.请输入名称);
            return;
        }
        const {merchantId} = this.props;
        proxy.postes({
            url: Config.server + '/func/ventas/getDescripcionListByDescripcionPrefix',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                descripcion: codeNum,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.tmpList !== undefined && json.tmpList !== null && json.tmpList.length > 0) {
                    var codes = json.tmpList;
                    this.showPopover('menu');
                    this.setState({codeNumlist: codes, datalist: codes});
                } else if (json.tmpList === 0) {
                    alert("no data!");
                    return 0;
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    selectSupnuevoVentasCommodityImage() {
//mainattachid是n，第一张就是mainattachid的图片，后边的是1，2，3.。。类推
        const {dispatch} = this.props;
        let priceId = this.state.priceId;
        let index = this.state.mainpicattachId;//用户自己选择的主要图片id
        let mainattachid = this.props.mainattachid;//原先的图片id
        if (index === null || index === undefined) {
            index = 1;
        }
        else if (index === 1) {
            index = mainattachid;
        } else if (index === 2) {//用户选择第二张图片,因为mainattachid=1，第二张图片的实际id是1，在render里显示的因为mainattachid是几都第一个显示
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                index = 1;
            }
        } else if (index === 3) {
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                if (mainattachid === 3 || mainattachid === 4 || mainattachid === 5) {
                    index = 2;
                }
            }
        } else if (index === 4) {
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                if (mainattachid === 4 || mainattachid === 5) {
                    index = 3;
                }
            }
        } else if (index === 5) {
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                if (mainattachid === 5) {
                    index = 4;
                }
            }
        }
        if (priceId === null || priceId === undefined) {
            alert("error no data to add");
            return 0;
        }
        let commodityId = this.state.commodityId;

        proxy.postes({
            url: Config.server + '/func/ventas/selectSupnuevoVentasCommodityImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
                index: index,
                commodityId: commodityId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            //alert(json + "##" + json.attachId + "##" + json.index + "##" + json.count + "##" + json.errorMsg);

            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.message !== null && json.message !== undefined) {
                    return 1;
                }
            }
            return 1;
        }).catch((err) => {
            alert(err);
        });
        return 1;
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    navigatorcommodityadd(codeNum) {
        this.setState({codeendnum: null});
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'GoodAdd',
                component: GoodAdd,
                params: {
                    codeNum:codeNum
                }
            })
        }
    }

    navigatorcommodityinfo() {
        if (this.state.commodityId === null || this.state.commodityId === undefined) {
            this.navigatorcommodityadd();
            return 0;
        }
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'commodityinfo',
                component: commodityinfo,
                params: {
                    priceId: this.state.priceId,
                    commodityId: this.state.commodityId,
                    descripcion: this.state.descripcion,
                    tamanoId: this.state.tamanoId,
                    tamanoName: this.state.tamanoName,
                    presentacionId: this.state.presentacionId,
                    presentacionName: this.state.presentacionName,
                    marcaId: this.state.marcaId,
                    marcaName: this.state.marcaName,
                    rubroId: this.state.rubroId,
                    rubroName: this.state.rubroName,
                    codigo: this.state.codigo,
                    codigoBulto1: this.state.codigoBulto1,
                    codigoBulto2: this.state.codigoBulto2,
                    codigoBulto3: this.state.codigoBulto3,
                    codigoBulto4: this.state.codigoBulto4,
                    codigoBulto5: this.state.codigoBulto5,
                    tamanoBulto1: this.state.tamanoBulto1,
                    tamanoBulto2: this.state.tamanoBulto2,
                    tamanoBulto3: this.state.tamanoBulto3,
                    tamanoBulto4: this.state.tamanoBulto4,
                    tamanoBulto5: this.state.tamanoBulto5,
                }
            })
        }
    }

    buttoncommit(){//saveMode:1 插入 2 覆盖 3 取消
        let price = this.state.price;

        if (price === null || price === "" || price === undefined) {
            alert(_name.请输入价格);
            return 0;
        }

        if(!isNumber(price)){
            alert(_name.价格输入不合法);
            return 0;
        }

        if (this.state.commodityId === null || this.state.commodityId === "") {
            alert(_name.请输入条码);
            return 0;
        }

        let originCommodityId = this.state.originCommodityId;
        let currentCommodityId = this.state.commodityId;

        if(originCommodityId!=undefined && originCommodityId!=null &&
           currentCommodityId!=undefined && currentCommodityId!=null &&
           originCommodityId!=currentCommodityId) {

            Alert.alert(
                'Alert',
                _name.现在输入的商品和原商品不一致,
                [
                    {
                        text: _name.插入, onPress: () =>
                        this.insertcommit()
                    },
                    {
                        text: _name.覆盖, onPress: () =>
                        this.savecommit()
                    },
                    {
                        text: _name.取消, onPress: () =>
                        console.log("cancel")
                    }
                ],
                {cancelable: false}
            );
        }else{
            this.savecommit();
        }
    }

    insertcommit(){
        const {dispatch} = this.props;
        let priceId = this.state.priceId;
        if (priceId === null || priceId === undefined) {
            alert("error");
            return 0;
        }
        this.setState({showProgress: true});
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
                this.setState({showProgress:false})
                setTimeout(() => {
                    alert(_name.空间已满请先删除或购买更多SOS空间);
                }, 1000);
            } else {
                if (json.massage !== undefined && json.massage !== null) {
                    //dispatch(getVentasCommodityPriceOptionList());
                    //alert(json.massage);
                    this.setState({priceId:json.newPriceId})
                    this.savecommit();
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    savecommit() {
        this.selectSupnuevoVentasCommodityImage();
        let index = this.state.mainpicattachId;//用户自己选择的主要图片id
        let mainattachid = this.props.mainattachid;//原先的图片id
        if (index === null || index === undefined) {
            index = 1;
        }
        else if (index === 1) {
            index = mainattachid;
        } else if (index === 2) {//用户选择第二张图片,因为mainattachid=1，第二张图片的实际id是1，在render里显示的因为mainattachid是几都第一个显示
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                index = 1;
            }
        } else if (index === 3) {
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                if (mainattachid === 3 || mainattachid === 4 || mainattachid === 5) {
                    index = 2;
                }
            }
        } else if (index === 4) {
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                if (mainattachid === 4 || mainattachid === 5) {
                    index = 3;
                }
            }
        } else if (index === 5) {
            if (mainattachid !== 1 && mainattachid !== null && mainattachid !== undefined) {
                if (mainattachid === 5) {
                    index = 4;
                }
            }
        }
        //#######################

        let currentOrderNum = this.state.currentOrderNum;
        let priceId = this.state.priceId;
        price = this.state.price;
        let commodityId = this.state.commodityId;
        let codigoEntreno = this.state.codigoEntreno;
        let priceBulto1 = this.state.priceBulto1;
        let priceBulto2 = this.state.priceBulto2;
        let priceBulto3 = this.state.priceBulto3;
        let priceBulto4 = this.state.priceBulto4;
        let priceBulto5 = this.state.priceBulto5;
        let mainpicattachId = this.state.mainpicattachId;
        if (price === "") {
            price = null;
        }
        if (priceBulto1 === "") {
            priceBulto1 = null;
        }
        if (priceBulto2 === "") {
            priceBulto2 = null;
        }
        if (priceBulto3 === "") {
            priceBulto3 = null;
        }
        if (priceBulto4 === "") {
            priceBulto4 = null;
        }
        if (priceBulto5 === "") {
            priceBulto5 = null;
        }
        if (priceId !== null) {
            priceId = priceId * 1;
        } else {
            alert("error");
            return 0;
        }
        const {dispatch} = this.props;
        this.setState({tijiaoAble: true, showProgress: true});
        proxy.postes({
            url: Config.server + '/func/ventas/saveOrUpdateSupnuevoVentasCommodityPrice',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId,
                index: index,
                currentOrderNum: currentOrderNum,
                priceId: priceId,
                codigoEntreno: codigoEntreno,
                price: price,
                priceBulto1: priceBulto1,
                priceBulto2: priceBulto2,
                priceBulto3: priceBulto3,
                priceBulto4: priceBulto4,
                priceBulto5: priceBulto5,
            }
        }).then((json) => {
            // alert(json + "##" + json.attachId + "##" + json.index + "##" + json.count + "##" + json.errorMsg);

            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
                Alert.alert(
                    'error',
                    errorMsg,
                    [
                        {
                            text: _name.跳转,
                            onPress: () => this.setState({tijiaoAble: false, showProgress: false}),
                            style: 'cancel'
                        },
                        {text: _name.取消, onPress: () => console.log('OK Pressed'), style: 'destructive'},
                    ],
                    {cancelable: false}
                );
            } else {
                if (json.message !== null && json.message !== undefined) {
                    //alert(json.message);

                    dispatch(getVentasCommodityPriceOptionList()).then((json) => {
                        this.cancel();
                        this.setState({tijiaoAble: false, showProgress: false});
                    });
                }
            }
        }).catch((err) => {
            alert(err);
        });

    }

    getMaxOrderNum() {
        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityPriceMaxOrderNumOfVentas',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if (json.maxOrderNum !== null && json.maxOrderNum !== undefined) {
                    maxOrderNum = json.maxOrderNum;
                    this.setState({maxOrderNum: maxOrderNum});
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    resetCommogity() {
        this.setState({
            tamanoId: null,//商品含量
            tamanoName: null,
            presentacionId: null,//商品描述
            presentacionName: null,
            marcaId: null,//商品品牌
            marcaName: null,
            rubroId: null,//商品类
            rubroName: null,
            commodityId: null,
            codigoBulto1: null,
            tamanoBulto1: null,
            codigoBulto2: null,
            tamanoBulto2: null,
            codigoBulto3: null,
            tamanoBulto3: null,
            codigoBulto4: null,
            tamanoBulto4: null,
            codigoBulto5: null,
            tamanoBulto5: null,
            priceBulto1: "",
            priceBulto2: "",
            priceBulto3: "",
            priceBulto4: "",
            priceBulto5: "",
            orderNum: null,
            codigoEntreno: null,
            codigo: null,
            price: "",
        });
    }

    setCommogity(json) {
        let goodInfo = json;//price传过来是Integer，Textinput只显示String
        if (goodInfo.priceBulto1 === undefined || goodInfo.priceBulto1 === null) {
            goodInfo.priceBulto1 = "";
        }
        if (goodInfo.priceBulto2 === undefined || goodInfo.priceBulto2 === null) {
            goodInfo.priceBulto2 = "";
        }
        if (goodInfo.priceBulto3 === undefined || goodInfo.priceBulto3 === null) {
            goodInfo.priceBulto3 = "";
        }
        if (goodInfo.priceBulto4 === undefined || goodInfo.priceBulto4 === null) {
            goodInfo.priceBulto4 = "";
        }
        if (goodInfo.priceBulto5 === undefined || goodInfo.priceBulto5 === null) {
            goodInfo.priceBulto5 = "";
        }
        if (goodInfo.price === undefined || goodInfo.price === null) {
            goodInfo.price = "";
        }
        if (goodInfo.orderNum === undefined || goodInfo.orderNum === null) {
            goodInfo.orderNum = this.state.currentOrderNum;
        }
        this.setState({
            descripcion: goodInfo.descripcion,
            currentOrderNum: goodInfo.orderNum,
            tamanoId: goodInfo.tamanoId,//类：商品含量
            tamanoName: goodInfo.tamanoName,
            presentacionId: goodInfo.presentacionId,//类：商品描述
            presentacionName: goodInfo.presentacionName,
            marcaId: goodInfo.marcaId,//类：商品品牌
            marcaName: goodInfo.marcaName,
            rubroId: goodInfo.rubroId,//类：商品类
            rubroName: goodInfo.rubroName,
            commodityId: goodInfo.commodityId,
            codigoBulto1: goodInfo.codigoBulto1,
            tamanoBulto1: goodInfo.tamanoBulto1,
            codigoBulto2: goodInfo.codigoBulto2,
            tamanoBulto2: goodInfo.tamanoBulto2,
            codigoBulto3: goodInfo.codigoBulto3,
            tamanoBulto3: goodInfo.tamanoBulto3,
            codigoBulto4: goodInfo.codigoBulto4,
            tamanoBulto4: goodInfo.tamanoBulto4,
            codigoBulto5: goodInfo.codigoBulto5,
            tamanoBulto5: goodInfo.tamanoBulto5,
            priceBulto1: goodInfo.priceBulto1 + "",
            priceBulto2: goodInfo.priceBulto2 + "",
            priceBulto3: goodInfo.priceBulto3 + "",
            priceBulto4: goodInfo.priceBulto4 + "",
            priceBulto5: goodInfo.priceBulto5 + "",
            orderNum: goodInfo.orderNum,//11111111111
            codigoEntreno: goodInfo.codigoEntreno,
            codigo: goodInfo.codigo,
            price: goodInfo.price + "",
            showProgress: false,
        });
    }

    //通过priceId进行查询
    getCommodityByPriceId(priceId) {
        const {dispatch} = this.props;
        if (priceId === null || priceId === undefined) {
            return false;
        }

        //this.setState({showProgress: true});
        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityPriceFormByPriceId',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
            } else {
                //if (json.commodityId !== null && json.commodityId !== undefined) {
                    this.setCommogity(json);
                    // dispatch(getCommodityPriceMainPic(priceId));
                    // if (this.state.commodityId !== null && this.state.commodityId !== undefined) {
                    //     dispatch(getCommodityPicList(this.state.commodityId));
                    // }
                //}
            }
            this.setState({showProgress: false});

        }).catch((err) => {
            alert(err);
        });
    }

    getCommodityImageList(commodityId) {
        if (commodityId === null || commodityId === undefined) {
            return;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/getSupnuevoVentasCommodityImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                this.setState({
                    picturenum1: json[0],
                    picturenum2: json[1],
                    picturenum3: json[2],
                    picturenum4: json[3],
                    picturenum5: json[4]
                });

            }
        }).catch((err) => {
            alert(err);
        });
    }

    //通过编号进行查询
    getCommodityByOrderNumber(ordernumber) {
        const {dispatch} = this.props;
        let maxnumber = this.state.maxOrderNum;
        if (ordernumber > maxnumber || ordernumber < 1) {
            return false;
        }

        if(ordernumber!=null && ordernumber!=undefined)
        ordernumber = ordernumber*1;

        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityPriceFormByOrderNum',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderNum: ordernumber,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }

            else if (json.commodityId !== null && json.commodityId !== undefined) {
                //this.getCommdityImage(json.priceId);
                dispatch(getCommodityPriceMainPic(json.priceId));
                this.setCommogity(json);
            } else if (json.commodityId === null || json.commodityId === undefined) {
                this.setState({currentOrderNum: ordernumber});
                dispatch(setCommodityPriceMainPic(null));
                this.resetCommogity();
            }

        }).catch((err) => {
            alert(err);
        });
    }

    getCommdityImage(priceId) {
        if (priceId === null || priceId === undefined) {
            this.setState({pictureurl: null});
            return;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/getSupnuevoVentasCommodityPriceImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json !== null) {
                    if (json.pictureurl !== null && json.pictureurl !== undefined) {
                        this.setState({pictureurl: json.pictureurl});
                    } else {
                        this.setState({pictureurl: null});
                    }
                }

            }
        }).catch((err) => {
            alert(err);
        });
    }

//通过品牌尺寸进行查询
    getCommodityByCatalog(catalogId) {
        if (catalogId === null || catalogId === undefined) {
            alert(_name.没有选择类别);
            return 0;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityPriceFormByCatalog',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                catalogId: catalogId * 1,
            }
        }).then((json) => {
            this.resolveSearchBackJson(json);
        }).catch((err) => {
            alert(err);
        });
    }

    //通过搜索引擎进行查询
    getCommodityBySearchEngine(descripcion,start) {
        if (descripcion === null || descripcion === undefined) {
            //alert("没有选择类别");
            return 0;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityBySearchEngineOld',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                descripcion: descripcion,
                // start:start,
                // max:this.state.limit,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                //alert(errorMsg);
                return 0;
            } else {
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    //codes = codes.concat(this.state.codeNumlist)
                    //this.showPopover('menu');
                    this.setState({codeNumlist: codes,codeNumModalVisible:true});
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    requestExternalStoragePermission = async (data) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': _name.申请相机权限,
                    'message': '一个很牛逼的应用想借用你的摄像头，' +
                    '然后你就可以拍出酷炫的皂片啦。'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("现在你获得摄像头权限了");
                this.saveImg(data.uri);
            } else {
                console.log("用户并不屌你");

            }
        } catch (err) {
            alert(err);
            console.warn(err)
        }
    };

    takePicture = async function () {
        this.setState({cameraModalVisible: true});
        console.log(this.camera);
        if (this.camera) {
            try {
                const options = {quality: 0.5, base64: true};
                const data = await this.camera.takePictureAsync(options);
                console.log(data);
                console.log("data.uri:" + data.uri);
                let permission = this.requestExternalStoragePermission(data);


                /*NativeModules.RNImageToBase64.getBase64String(data.uri, (err, base64) => {
                    // Do something with the base64 string
                    console.log("image base 64: ", base64);
                });*/
            }
            catch (e) {
                console.log(e);
            }

        }
    };

    saveImg(img) {
        var promise = CameraRoll.saveToCameraRoll(img, "photo");
        promise.then(function (result) {
            console.log('保存成功！地址如下：\n' + result);
        }).catch(function (error) {
            console.log('保存失败！\n' + error);
        });
    }

    getPhotos(img) {
        var promise = CameraRoll.saveToCameraRoll(img, "photo");
        promise.then(function (result) {
            console.log('保存成功！地址如下：\n' + result);
        }).catch(function (error) {
            console.log('保存失败！\n' + error);
        });
    }

    showpopupDialog() {//类型品牌描述尺寸查询法
        this.popupDialog.show();
    }

    dismisspopupDialog() {
        this.popupDialog.dismiss();
    }

    queryGoodsBeforeOrNext(orderNum){
        const {dispatch} = this.props;
        if(orderNum>=0 && orderNum<this.state.maxOrderNum){
            //this.resetCommogity();
            var priceId = 0;
            var commodityId = 0;
            var priceOptionList = this.props.priceOptionList;
            priceId = priceOptionList[orderNum].value;
            commodityId = priceOptionList[orderNum].enLabel;
            this.setState({priceId:priceId,originCommodityId:commodityId})

            if (priceId !== null && priceId !== undefined) {
                this.getCommodityByPriceId(priceId);
                dispatch(getCommodityPicList(commodityId));
            }
        }
    }

    queryGoods() {//判断搜索方式
        this.refs.menu.blur();
        if (this.state.searchstate == 1) {
            this.queryGoodsCode(this.state.codeendnum);
        }
        /* if (this.state.searchstate == 2) {
             this.closePopover();
             this.showpopupDialog();
             this.getCommodityCatalog(null);
         }*/
        if (this.state.searchstate == 3) {
            this.queryGoodsCodeByName(this.state.codeendnum);
        }
        if (this.state.searchstate == 4) {
            this.getCommodityBySearchEngine(this.state.codeendnum,0);
        }
    }

    renderRow_leixing(rowData) {
        var row =
            <TouchableOpacity onPress={() => {
                this.setState({
                    commodityleixinginfo: rowData.catalogName,
                    mulu1Id: rowData.catalogId,
                    muluVisible_1: false
                });//this不是指的最初级
            }}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <Text style={{fontSize:setSpText(30)}}>{rowData.catalogName}</Text>
                </View>
            </TouchableOpacity>;
        return row;
    }

    renderRow_miaoshu(rowData) {
        var row =
            <TouchableOpacity onPress={() => {
                this.setState({
                    commoditymiaoshuinfo: rowData.catalogName,
                    mulu2Id: rowData.catalogId,
                    muluVisible_2: false
                });
            }}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <Text style={{fontSize:setSpText(30)}}>{rowData.catalogName}</Text>
                </View>
            </TouchableOpacity>;
        return row;
    }

    renderRow_pinpai(rowData) {
        var row =
            <TouchableOpacity onPress={() => {
                this.setState({
                    commoditypinpaiinfo: rowData.catalogName,
                    mulu3Id: rowData.catalogId,
                    muluVisible_3: false
                });
            }}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <Text style={{fontSize:setSpText(30)}}>{rowData.catalogName}</Text>
                </View>
            </TouchableOpacity>;
        return row;
    }

    renderRow_chicun(rowData) {
        var row =
            <TouchableOpacity onPress={() => {
                this.getCommodityByCatalog(rowData.catalogId);
                this.setState({
                    commoditychicuninfo: rowData.catalogName,
                    mulu4Id: rowData.catalogId,
                    muluVisible_4: false
                });
            }}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <Text style={{fontSize:setSpText(30)}}>{rowData.catalogName}</Text>
                </View>
            </TouchableOpacity>;
        return row;
    }

    //目录选择之后要重置后边的目录
    resetzhonglei(idx, value) {
        this.setState({
            commodityleixinginfo: value.catalogName,
            commoditypinpaiinfo: null,
            commoditymiaoshuinfo: null,
            commoditychicuninfo: null
        });
        this.getCommodityCatalog(value.value, 2);
    }

    resetpinpai(idx, value) {
        this.setState({commoditypinpaiinfo: value.catalogName, commoditymiaoshuinfo: null, commoditychicuninfo: null});
        this.getCommodityCatalog(value.value, 3);
    }

    resetmiaoshu(idx, value) {
        this.setState({commoditymiaoshuinfo: value.catalogName, commoditychicuninfo: null});
        this.getCommodityCatalog(value.value, 4);
    }

    resetchicun(idx, value) {
        this.setState({commoditychicuninfo: value.catalogName});
        // this.getCommodityCatalog(value.value, 4);
    }


    getCommodityCatalog(parentId, flag) {
        if (parentId === null && flag === null) {
            this.setState({
                commoditychicuninfo: null,
                commoditypinpaiinfo: null,
                commoditymiaoshuinfo: null
            });
        }
        if (flag === 2) {
            this.setState({
                commoditychicuninfo: null,
                commoditypinpaiinfo: null,
            });
        }
        if (flag === 3) {
            this.setState({
                commoditychicuninfo: null,
            });
        }
        if (parentId !== null) {
            parentId = parentId * 1;
        }
        if (flag !== null && parentId === null) {
            return 0;
        }
        switch (flag) {
            case null:
                this.showPopover("mulu1");
                break;
            case 1:
                this.showPopover("mulu1");
                break;
            case 2:
                this.showPopover("mulu2");
                break;
            case 3:
                this.showPopover("mulu3");
                break;
            case 4:
                this.showPopover("mulu4");
                break;
            default:
                break;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/getCommodityCatalogListOptionInfoList',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                parentId: parentId,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if (json.arrayList !== null && json.arrayList !== undefined) {
                    if (flag === 1 || flag === null) {
                        this.setState({commodityleixing: json.arrayList});
                    }
                    if (flag === 2) {
                        this.setState({commoditymiaoshu: json.arrayList});
                    }
                    if (flag === 3) {
                        this.setState({commoditypinpai: json.arrayList});
                    }
                    if (flag === 4) {
                        this.setState({commoditychicun: json.arrayList});
                    }
                }

            }
        }).catch((err) => {
            alert(err);
        });
    }

    setSearchModeInfoMobile(searchMode) {//1,2,3,4
        if (searchMode === null || searchMode === undefined) {
            return;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/setSupnuevoVentasInfoSearchModeInfoMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                searchMode: searchMode + '',
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
        }).catch((err) => {
            alert(err);
        });
    }

    storeQueryType(num) {//存储查询方式
        const {dispatch} = this.props;
        dispatch(storeSearchType(num));
        setTimeout(() => {
            this.refs.modal1.close()
        }, 800);
        // setTimeout(this.refs.modal1.close(),1000);
        this.setState({searchstate: num, codeendnum: null});
        if (num == 2) {
            this.closePopover();
            //this.showpopupDialog();
            //this.getCommodityCatalog(null, null);
        }
        this.setSearchModeInfoMobile(num);
    }

    searchCommodityName(codeendnum) {
        if (codeendnum !== null)
            if (this.state.searchstate === "3" || this.state.searchstate === 3) {
                if (this.state.datalist.length !== 0) {
                    let userinput = codeendnum;
                    let codeNumlist = this.state.datalist;
                    let codeNamelist = [];
                    let lengthU = userinput.length;
                    for (let i = 0; i < codeNumlist.length; i++) {
                        let label = codeNumlist[i].label.substring(0, lengthU).toLowerCase();
                        let input = userinput.toLowerCase();//都转成小写进行比较
                        if (input === label) {
                            codeNamelist.push(codeNumlist[i]);
                        }
                    }
                    if (codeNamelist.length > 0) {
                        this.setState({codeNumlist: codeNamelist});
                        this.showPopover('menu');
                    } else {
                        alert("no product");
                        this.closePopover('menu');
                        this.setState({codeNumlist: []});
                    }
                }
            }
    }

    clickPic(num) {
        let mainpicattachId = this.state.mainpicattachId;
        let onclickChangeColor = this.state.onclickChangeColor;
        if (mainpicattachId === num && onclickChangeColor === num) {
            this.setState({mainpicattachId: null, onclickChangeColor: null});
        } else if (mainpicattachId !== num && onclickChangeColor !== num) {
            this.setState({mainpicattachId: num, onclickChangeColor: num});
        }
    }

     componentDidMount() {
        // this.setState({showProgress: true});

         this.refreshlistener=DeviceEventEmitter.addListener('refresh', (data)=>{

             var commodityId = this.state.commodityId;
             this.onCodigoSelect(commodityId);
         });

         this.codigolistener=DeviceEventEmitter.addListener('codigo', (data)=>{

             var commodityId = data;
             this.onCodigoSelect(commodityId);
         });

        const {dispatch} = this.props;
        if (this.state.priceId !== null && this.state.priceId !== undefined) {
            this.getCommodityByPriceId(this.state.priceId);
            dispatch(getCommodityPicList(this.props.commodityId));
        }
    }

    componentWillUnmount()
    {
        if(this.refreshlistener)
            this.refreshlistener.remove();

        if(this.codigolistener)
            this.codigolistener.remove();
    }


    constructor(props) {
        super(props);
        this.state = {
            Gsuggestlevel: null,
            uploadModalVisible: false,
            bgColor: '#387ef5',
            flag: 1,
            goods: {},
            wait: false,
            codesModalVisible: false,
            selectedCodeInfo: {},
            priceShow: null,
            inputPrice: null,
            taxMark: 0,
            amount: 0,
            taxArr: [],
            sizeArr: [],
            hasCodigo: false,
            barcodeX: null,
            barcodeY: null,
            barcodeWidth: null,
            barcodeHeight: null,
            buttonRect: null,
            commodityInfoVisable: false,
            displayArea: null,
            cameraModalVisible: false,
            muluVisible_1: false,//四个目录弹出框的显示
            muluVisible_2: false,//四个目录弹出框的显示
            muluVisible_3: false,//四个目录弹出框的显示
            muluVisible_4: false,//四个目录弹出框的显示
            mulu1Id: null,
            commodityleixing: [],//目录1
            commodityleixinginfo: null,
            mulu2Id: null,
            commoditymiaoshu: [],//目录2
            commoditymiaoshuinfo: null,
            mulu3Id: null,
            commoditypinpai: [],//目录3
            commoditypinpaiinfo: null,
            mulu4Id: null,
            commoditychicun: [],//目录4
            commoditychicuninfo: null,
            muluInfoVisible_1: null,//长按显示详细信息
            muluInfoVisible_2: null,
            muluInfoVisible_3: null,
            muluInfoVisible_4: null,

            showProgress: false,//等待提示
            tijiaoAble: false,//提交按钮的使用
            leixing: null,
            datalist: [],
            searchstate: this.props.searchType,//搜索类型
            searchModalVisible: false,
            price: null,
            currentOrderNum: this.props.currentOrderNum,
            maxOrderNum: this.props.maxOrderNum,
            priceId: this.props.priceId,
            commodityId: this.props.commodityId,
            codes: null,
            codeNumlist: [],
            codeendnum: null,//查询输入的条码
            codigoEntreno: null,//商品内码
            codigo: null,//商品条码
            codigoBulto1: null,//商品条码1
            codigoBulto2: null,
            codigoBulto3: null,
            codigoBulto4: null,
            codigoBulto5: null,
            descripcion: null,//商品名称
            tamanoBulto1: null,//第一种包装含量
            tamanoBulto2: null,
            tamanoBulto3: null,
            tamanoBulto4: null,
            tamanoBulto5: null,
            priceBulto1: null,//包装1价格
            priceBulto2: null,
            priceBulto3: null,
            priceBulto4: null,
            priceBulto5: null,

            tamanoId: null,
            tamanoName: null,
            presentacionId: null,
            presentacionName: null,
            marcaName: null,
            marcaId: null,
            rubroId: null,
            rubroName: null,
            picturenum1: this.props.picturenum1,
            picturenum2: this.props.picturenum2,
            picturenum3: this.props.picturenum3,
            picturenum4: this.props.picturenum4,
            picturenum5: this.props.picturenum5,
            mainpicattachId: null,//存储设置主要图片的id
            onclickChangeColor: 0,//选择图片是改变颜色，标记
            mainattachid: this.props.mainattachid,//后端传过来主要图片是第一个，自己处理显示顺序

            inputOrderNum:null,

            cameraBarcodeModalVisible: false,
            camera: {
                // aspect: Camera.constants.Aspect.fill,
                // captureTarget: Camera.constants.CaptureTarget.disk,
                // type: Camera.constants.Type.back,
                // orientation: Camera.constants.Orientation.auto,
                // flashMode: Camera.constants.FlashMode.auto
            },

            codeNumModalVisible:false,
            //每次展示20条
            start: 0,
            limit: 20,

            originCommodityId:this.props.commodityId,
            openFlash: false,
        };
        this.showpopupDialog = this.showpopupDialog.bind(this);

    }

    render() {
        let maxOrderNum = this.state.maxOrderNum;
        let currentOrderNum = this.state.currentOrderNum;
        if (maxOrderNum === null) {
            this.state.maxOrderNum = 0;
        }
        let displayArea = {x: 0, y: 20, width: width, height: height};
        let pictureurl = this.props.pictureurl;//显示图片
        let priceId = this.state.priceId;
        if (priceId === "null" || priceId === null) {
            pictureurl = null;//如果没有priceId就不显示图片
        }
        let tamanoBulto1 = this.state.tamanoBulto1;
        let tamanoBulto2 = this.state.tamanoBulto2;
        let tamanoBulto3 = this.state.tamanoBulto3;
        let tamanoBulto4 = this.state.tamanoBulto4;
        let tamanoBulto5 = this.state.tamanoBulto5;
        let codigoBulto1 = this.state.codigoBulto1;
        let codigoBulto2 = this.state.codigoBulto2;
        let codigoBulto3 = this.state.codigoBulto3;
        let codigoBulto4 = this.state.codigoBulto4;
        let codigoBulto5 = this.state.codigoBulto5;
        let mainattachid = this.props.mainattachid;
        let picnum1url;
        let picnum2url;
        let picnum3url;
        let picnum4url;
        let picnum5url;
        if (mainattachid === null || mainattachid === undefined) {
            picnum1url = this.props.picturenum1;
            picnum2url = this.props.picturenum2;
            picnum3url = this.props.picturenum3;
            picnum4url = this.props.picturenum4;
            picnum5url = this.props.picturenum5;
        } else if (mainattachid === 1) {
            picnum1url = this.props.picturenum1;
            picnum2url = this.props.picturenum2;
            picnum3url = this.props.picturenum3;
            picnum4url = this.props.picturenum4;
            picnum5url = this.props.picturenum5;
        } else if (mainattachid === 2) {
            picnum1url = this.props.picturenum2;
            picnum2url = this.props.picturenum1;
            picnum3url = this.props.picturenum3;
            picnum4url = this.props.picturenum4;
            picnum5url = this.props.picturenum5;
        } else if (mainattachid === 3) {
            picnum1url = this.props.picturenum3;
            picnum2url = this.props.picturenum1;
            picnum3url = this.props.picturenum2;
            picnum4url = this.props.picturenum4;
            picnum5url = this.props.picturenum5;
        } else if (mainattachid === 4) {
            picnum1url = this.props.picturenum4;
            picnum2url = this.props.picturenum1;
            picnum3url = this.props.picturenum2;
            picnum4url = this.props.picturenum3;
            picnum5url = this.props.picturenum5;
        } else if (mainattachid === 5) {
            picnum1url = this.props.picturenum5;
            picnum2url = this.props.picturenum1;
            picnum3url = this.props.picturenum2;
            picnum4url = this.props.picturenum3;
            picnum5url = this.props.picturenum4;
        }
        if (tamanoBulto1 === null) {
            tamanoBulto1 = "";
        }
        if (tamanoBulto2 === null) {
            tamanoBulto2 = '';
        }
        if (tamanoBulto3 === null) {
            tamanoBulto3 = '';
        }
        if (tamanoBulto4 === null) {
            tamanoBulto4 = "";
        }
        if (tamanoBulto5 === null) {
            tamanoBulto5 = '';
        }
        //console.log(tamanoBulto5);
        if (codigoBulto1 === null) {
            codigoBulto1 = "";
        }
        if (codigoBulto2 === null) {
            codigoBulto2 = "";
        }
        if (codigoBulto3 === null) {
            codigoBulto3 = "";
        }
        if (codigoBulto4 === null) {
            codigoBulto4 = "";
        }
        if (codigoBulto5 === null) {
            codigoBulto5 = "";
        }
        let price5 = this.state.priceBulto5;
        var listView = null;
        var listView_commodityleixing = null;
        var listView_commoditymiaoshu = null;
        var listView_commoditypinpai = null;
        var listView_commoditychicun = null;
        let searchstate = this.state.searchstate;
        var infoList = this.state.codeNumlist;
        var username = this.props.username;
        //用户条码查询的popver
        if (infoList.length !== 0 && infoList !== [] && infoList !== undefined && infoList !== null) {
            let data = infoList;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        }
        //目录查询的第一个popover
        let commodityleixing = this.state.commodityleixing;
        if (commodityleixing.length !== 0 && commodityleixing !== [] && commodityleixing !== undefined && commodityleixing !== null) {
            let data = commodityleixing;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commodityleixing =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_leixing.bind(this)}
                    />
                </ScrollView>;
        }
        //目录查询的第二个popover
        let commoditymiaoshu = this.state.commoditymiaoshu;
        if (commoditymiaoshu.length !== 0 && commoditymiaoshu !== [] && commoditymiaoshu !== undefined && commoditymiaoshu !== null) {
            let data = commoditymiaoshu;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commoditymiaoshu =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_miaoshu.bind(this)}
                    />
                </ScrollView>;
        }
        //目录查询的第三个popover
        let commoditypinpai = this.state.commoditypinpai;
        if (commoditypinpai.length !== 0 && commoditypinpai !== [] && commoditypinpai !== undefined && commoditypinpai !== null) {
            let data = commoditypinpai;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commoditypinpai =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_pinpai.bind(this)}
                    />
                </ScrollView>;
        }
        //目录查询的第四个popover
        let commoditychicun = this.state.commoditychicun;
        if (commoditychicun.length !== 0 && commoditychicun !== [] && commoditychicun !== undefined && commoditychicun !== null) {
            let data = commoditychicun;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commoditychicun =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_chicun.bind(this)}
                    />
                </ScrollView>;
        }

        var openFlash = this.state.openFlash;

        return (
            <View style={{flex: 1,backgroundColor:'#fff'}}>

                {/* header bar */}
                <View style={{
                    backgroundColor: '#387ef5',
                    height: 55,
                    paddingLeft: 6,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.cancel();
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                        }}>
                            <IconF name="chevron-left" color="#fff" size={25}></IconF>
                            <Text style={{fontSize: setSpText(40), textAlign: 'center', color: '#fff'}}>
                                {username}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        ref="commodityInfo"
                        style={{paddingRight: 10, paddingTop: 10}}
                        onPress={() => {
                            this.showPopover('commodityInfo');
                        }}>
                        <IconFo name="chevron-circle-left" color="#fff" size={30}></IconFo>
                    </TouchableOpacity>
                </View>
                {/*//标题栏下边的输入选择框*/}
                {
                    searchstate == 2 ?
                        <View>
                            <View style={[{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 5
                            }]}>
                                <View>
                                    <Text style={styles.popoverText}>{_name.目录搜索}</Text>
                                </View>
                                <View style={{paddingRight: 10}}>
                                </View>
                            </View>
                            <View style={{
                                height: 50, flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 5,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                    borderWidth: 1,
                                    marginLeft: 3,
                                    paddingLeft: 3,
                                    paddingRight: 3,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    borderRadius: 5,
                                }}>
                                    <TouchableOpacity
                                        style={{flex: 1,}}
                                        onLongPress={() => {
                                            this.showPopover("muluInfo1")
                                        }}
                                    >
                                        <TextInput
                                            ref="mulu1"
                                            style={{
                                                height: 40,
                                                fontSize: setSpText(30),
                                                color: "black"
                                            }}
                                            value={this.state.commodityleixinginfo}
                                            editable={false}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent">
                                        </TextInput>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.getCommodityCatalog(null, null);
                                            //this.showPopover("mulu1");
                                        }}
                                    >
                                        <IconE style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="chevron-small-down" color="black" size={25}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                    borderWidth: 1,
                                    marginLeft: 3,
                                    paddingLeft: 3,
                                    paddingRight: 3,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    borderRadius: 5,
                                }}>
                                    <TouchableOpacity
                                        style={{flex: 1,}}
                                        onLongPress={() => {
                                            this.showPopover("muluInfo2")
                                        }}
                                    >
                                        <TextInput
                                            ref="mulu2"
                                            style={{
                                                height: 40,
                                                fontSize: setSpText(30),
                                                color: "black"
                                            }}
                                            value={this.state.commoditymiaoshuinfo}
                                            editable={false}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent">
                                        </TextInput>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.getCommodityCatalog(this.state.mulu1Id, 2);
                                            //this.showPopover("mulu2");
                                        }}
                                    >
                                        <IconE style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="chevron-small-down" color="black" size={25}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                    borderWidth: 1,
                                    marginLeft: 3,
                                    paddingLeft: 3,
                                    paddingRight: 3,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    borderRadius: 5,
                                }}>
                                    <TouchableOpacity
                                        style={{flex: 1,}}
                                        onLongPress={() => {
                                            this.showPopover("muluInfo3")
                                        }}
                                    >
                                        <TextInput
                                            ref="mulu3"
                                            style={{
                                                height: 40,
                                                fontSize: setSpText(30),
                                                color: "black"
                                            }}
                                            value={this.state.commoditypinpaiinfo}
                                            editable={false}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent">
                                        </TextInput>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.getCommodityCatalog(this.state.mulu2Id, 3);
                                            //this.showPopover("mulu3");
                                        }}
                                    >
                                        <IconE style={{

                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="chevron-small-down" color="black" size={25}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                    borderWidth: 1,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    paddingLeft: 3,
                                    paddingRight: 3,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    borderRadius: 5,
                                }}>
                                    <TouchableOpacity
                                        style={{flex: 1,}}
                                        onLongPress={() => {
                                            this.showPopover("muluInfo4")
                                        }}
                                    >
                                        <TextInput
                                            ref="mulu4"
                                            style={{
                                                height: 40,
                                                fontSize: setSpText(30),
                                                color: "black"
                                            }}
                                            value={this.state.commoditychicuninfo}
                                            editable={false}
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent">
                                        </TextInput>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.getCommodityCatalog(this.state.mulu3Id, 4);
                                            // this.showPopover("mulu4");
                                        }}
                                    >
                                        <IconE style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="chevron-small-down" color="black" size={25}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        :
                        <View>

                            <View style={[{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingLeft: 5,
                                paddingTop:5,
                            }]}>
                                <View>
                                    {
                                        searchstate == 1 ?
                                            <Text style={styles.popoverText}>{_name.条码搜索}</Text>
                                            : <View/>
                                    }
                                    {
                                        searchstate == 2 ?
                                            <Text style={styles.popoverText}>{_name.目录搜索}</Text>
                                            : <View/>
                                    }
                                    {
                                        searchstate == 3 ?
                                            <Text style={styles.popoverText}>{_name.名称搜索}</Text>
                                            : <View/>
                                    }
                                    {
                                        searchstate == 4 ?
                                            <Text style={styles.popoverText}>{_name.引擎查询}</Text>
                                            : <View/>
                                    }
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={{
                                        // flex:1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#CAE1FF',
                                        borderTopRightRadius: 4,
                                        borderBottomRightRadius: 4,
                                        alignItems: 'center',
                                        height: 40,
                                        width: 100,
                                        marginHorizontal: 4,
                                        borderRadius: 4,
                                    }}
                                        onPress={() => {
                                        //改过popover的源码的backcolor，改成（0，0，0，0）
                                        this.queryGoods();
                                        //this.showpopupDialog();
                                        //this.queryGoodsCode(this.state.codeendnum);
                                    }}>
                                        <Text style={[{
                                        fontSize: setSpText(30),
                                        color: '#000000',
                                        textAlign: 'center'
                                    }]}>{_name.搜索}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{
                                height: 55,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                                marginRight:5,
                            }}>
                                <TextInput
                                    ref="menu"
                                    style={[styles.textinput, {marginLeft: 5,}]}
                                    onChangeText={(codeendnum) => {
                                        this.setState({codeendnum: codeendnum});
                                        this.searchCommodityName(codeendnum);
                                    }}
                                    value={this.state.codeendnum}

                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                                {
                                    searchstate==1?
                                    <TouchableOpacity
                                        style={{
                                        // flex:1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#CAE1FF',
                                        borderTopRightRadius: 4,
                                        borderBottomRightRadius: 4,
                                        alignItems: 'center',
                                        height: 40,
                                        width: 100,
                                        marginHorizontal: 4,
                                        borderRadius: 4,
                                    }}
                                        onPress={() => {
                                        this.setState({cameraBarcodeModalVisible: true})
                                    }}>
                                        <Text style={[{
                                        fontSize: setSpText(30),
                                        color: '#000000',
                                        textAlign: 'center'
                                    }]}>{_name.扫描}</Text>
                                    </TouchableOpacity>
                                        :null
                                }
                            </View>
                        </View>
                }

                <ScrollView>
                    {
                        <View style={[{
                            flex:1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                            paddingVertical:10,

                        }]}>
                            <View style={{flex:1}}>
                                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}
                                                  onPress={() => {
                                                      //前一个商品
                                        var orderNum = this.state.currentOrderNum;
                                        if(orderNum==1){alert(_name.已是第一个产品);return;}
                                        orderNum--;
                                        this.queryGoodsBeforeOrNext(orderNum-1)
                                    }}
                                >
                                    <IconF name="chevron-left" color="#666" size={40}/>
                                </TouchableOpacity>
                            </View>

                                <View style={{flex:4}}>
                                    <TouchableOpacity
                                        style={[{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',height: 55}]}
                                        onPress={()=>{
                                            this.refs.jumpModal.open();
                                        }}>
                                        <View style={{justifyContent: 'center', alignItems: 'center', width: 120,height: 35, borderWidth: 1,borderRadius: 5, marginRight: 5,}}>
                                            <Text style={{fontSize: setSpText(30)}}>
                                                {this.state.currentOrderNum === null ? "   " : this.state.currentOrderNum}/{this.state.maxOrderNum}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            <View style={{flex:1}}>
                            <TouchableOpacity
                                style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}
                                onPress={() => {
                                    //后一个商品
                                        var orderNum = this.state.currentOrderNum;
                                        if(orderNum==this.state.maxOrderNum){alert(_name.已是最后一个商品);return;}
                                        orderNum++;
                                        this.queryGoodsBeforeOrNext(orderNum-1)
                                    }}>
                                <IconF name="chevron-right" color="#666" size={40}/>
                            </TouchableOpacity>
                            </View>

                        </View>
                    }

                    {/*显示主列表*/}

                    <View style={{flex: 1}}>
                        {/*<View style={styles.leftstyle}>
                            <Text style={[styles.titletext, {
                                marginVertical: 5,
                                marginHorizontal: 5
                            }]}>{_name.商品图像}:</Text>
                        </View>*/}
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                            pagingEnabled={true}
                        >
                            {picnum1url !== null ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.clickPic(1);
                                    }}
                                >
                                    {
                                        this.state.onclickChangeColor === 1 ?
                                            <Image resizeMode="contain"
                                                   style={[styles.picstyle, {borderWidth: 2, borderColor: 'red'}]}
                                                   source={{uri: picnum1url}}
                                            />
                                            :
                                            <Image resizeMode="contain"
                                                   style={styles.picstyle}
                                                   source={{uri: picnum1url}}
                                            />
                                    }
                                </TouchableOpacity>
                                :
                                <View style={[styles.picstyle, styles.horizontal]}>
                                    <IconFo name="camera" color="#B2B2B2" size={100}/>
                                </View>
                            }
                            {picnum2url !== null ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.clickPic(2);
                                    }}
                                >{
                                    this.state.onclickChangeColor === 2 ?
                                        <Image resizeMode="contain"
                                               style={[styles.picstyle, {borderWidth: 2, borderColor: 'red'}]}
                                               source={{uri: picnum2url}}
                                        />
                                        :
                                        <Image resizeMode="contain"
                                               style={styles.picstyle}
                                               source={{uri: picnum2url}}
                                        />
                                }
                                </TouchableOpacity>
                                :
                                <View style={[styles.picstyle, styles.horizontal]}>
                                    <IconFo name="camera" color="#B2B2B2" size={100}/>
                                </View>
                            }
                            {picnum3url !== null ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.clickPic(3);
                                    }}
                                >{
                                    this.state.onclickChangeColor === 3 ?
                                        <Image resizeMode="contain"
                                               style={[styles.picstyle, {borderWidth: 2, borderColor: 'red'}]}
                                               source={{uri: picnum3url}}
                                        />
                                        :
                                        <Image resizeMode="contain"
                                               style={styles.picstyle}
                                               source={{uri: picnum3url}}
                                        />
                                }
                                </TouchableOpacity>
                                :
                                <View style={[styles.picstyle, styles.horizontal]}>
                                    <IconFo name="camera" color="#B2B2B2" size={100}/>
                                </View>
                            }
                            {picnum4url !== null ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.clickPic(4);
                                    }}
                                >{
                                    this.state.onclickChangeColor === 4 ?
                                        <Image resizeMode="contain"
                                               style={[styles.picstyle, {borderWidth: 2, borderColor: 'red'}]}
                                               source={{uri: picnum4url}}
                                        />
                                        :
                                        <Image resizeMode="contain"
                                               style={styles.picstyle}
                                               source={{uri: picnum4url}}
                                        />
                                }</TouchableOpacity>
                                :
                                <View style={[styles.picstyle, styles.horizontal]}>
                                    <IconFo name="camera" color="#B2B2B2" size={100}/>
                                </View>
                            }
                            {picnum5url !== null ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.clickPic(5);
                                    }}
                                >
                                    {
                                        this.state.onclickChangeColor === 5 ?
                                            <ImageP resizeMode="contain"
                                                    style={[styles.picstyle, {borderWidth: 2, borderColor: 'red'}]}
                                                    indicator={ProgressBar}
                                                    source={{uri: picnum5url}}
                                            />
                                            :
                                            <ImageP resizeMode="contain"
                                                    style={styles.picstyle}
                                                    indicator={ProgressBar}
                                                    source={{uri: picnum5url}}
                                            />
                                    }</TouchableOpacity>
                                :
                                <View style={[styles.picstyle, styles.horizontal]}>
                                    <IconFo name="camera" color="#B2B2B2" size={100}/>
                                </View>
                            }
                        </ScrollView>

                        <View style={[styles.horizontal]}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品价格}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(price) => {
                                    this.setState({price: price})
                                }}
                                value={this.state.price}

                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>

                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品条码}:</Text>
                            <Text style={{
                                flex: 1,
                                height: 40,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 8,
                                fontSize: setSpText(30),
                                color: 'black',
                            }}>
                                {this.state.codigo}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 10,
                        }}>
                            <Text style={[styles.titletext, {
                                marginHorizontal: 5
                            }]}>{_name.商品名称}:</Text>
                            <Text style={{
                                flex: 1,
                                height: 40,
                                paddingLeft: 10,
                                paddingRight: 10,
                                fontSize: setSpText(30),
                                color: 'black',
                            }}>
                                {this.state.descripcion}
                            </Text>
                        </View>

                        <View style={[styles.horizontal,{paddingBottom:10}]}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品内码}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(codigoEntreno) => {
                                    this.setState({codigoEntreno: codigoEntreno})
                                }}
                                value={this.state.codigoEntreno}

                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>

                    </View>
                </ScrollView>
                <View style={[styles.horizontal, {paddingBottom: 10, paddingTop: 10}]}>
                    <TouchableOpacity
                        style={[styles.popoverContent, styles.touchstyle]}
                        disabled={this.state.tijiaoAble}
                        onPress={() => {
                            this.buttoncommit();

                        }}>
                        <Text style={[styles.popoverText, {color: '#FFFFFF'}]}>{_name.提交}</Text>
                    </TouchableOpacity>
                </View>
                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={this.state.displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 300}}>
                        {listView}
                    </View>
                </Popover>
                {/*目录弹出框四个*/}
                <Popover
                    isVisible={this.state.muluVisible_1}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 150}}>
                        {listView_commodityleixing}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.muluVisible_2}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 150}}>
                        {listView_commoditymiaoshu}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.muluVisible_3}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 150}}>
                        {listView_commoditypinpai}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.muluVisible_4}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <View style={{height: 150}}>
                        {listView_commoditychicun}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.muluInfoVisible_1}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closeMuluInfoPopover()
                    }}>
                    <Text style={{height: 30, fontSize: setSpText(30), padding: 5}}>
                        {this.state.commodityleixinginfo}
                    </Text>
                </Popover>
                <Popover
                    isVisible={this.state.muluInfoVisible_2}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closeMuluInfoPopover()
                    }}>
                    <Text style={{height: 30, fontSize: setSpText(30), padding: 5}}>
                        {this.state.commoditymiaoshuinfo}
                    </Text>
                </Popover>
                <Popover
                    isVisible={this.state.muluInfoVisible_3}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closeMuluInfoPopover()
                    }}>
                    <Text style={{height: 30, fontSize: setSpText(30), padding: 5}}>
                        {this.state.commoditypinpaiinfo}
                    </Text>
                </Popover>
                <Popover
                    isVisible={this.state.muluInfoVisible_4}
                    fromRect={this.state.buttonRect}
                    placement="bottom"
                    onClose={() => {
                        this.closeMuluInfoPopover()
                    }}>
                    <Text style={{height: 30, fontSize: setSpText(30), padding: 5}}>
                        {this.state.commoditychicuninfo}
                    </Text>
                </Popover>
                <Popover
                    isVisible={this.state.commodityInfoVisable}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    onClose={() => {
                        this.closePopover()
                    }}>
                    <TouchableOpacity
                        style={[styles.popoverContentIm, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                        onPress={() => {
                            this.closePopover();
                            this.navigatorcommodityadd();
                        }}>
                        <Text style={[{alignItems: 'center', fontSize: setSpText(30), color: '#444'}]}>{_name.添加新的商品}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.popoverContentIm, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                        onPress={() => {
                            this.closePopover();
                            this.navigatorcommodityinfo()
                        }}>
                        <Text style={[{alignItems: 'center', fontSize: setSpText(30), color: '#444'}]}>{_name.修改商品详细信息}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.popoverContentIm, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                        onPress={() => {
                            this.closePopover();
                            this.refs.modal1.open()
                        }}>
                        <Text style={[{alignItems: 'center', fontSize:setSpText(30), color: '#444'}]}>{_name.修改搜索方式}</Text>
                    </TouchableOpacity>
                </Popover>
                <Modalbox
                    backButtonClose={true}
                    style={[styles.container]}
                    position={"center"}
                    ref={"modal1"}
                    animationType={"slide"}>
                    <View style={{borderBottomWidth: 0, justifyContent: 'center', flexDirection: 'row',}}>
                        <ScrollView>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity style={[{
                                    flexDirection: 'row',
                                    padding: 8,
                                    paddingLeft: 20,
                                }]}
                                                  onPress={() => {
                                                      this.storeQueryType("1");
                                                      //this.setState({searchstate: 1})
                                                  }}>
                                    {searchstate == "1" ?
                                        <IconF name="disc" color="#387ef5" size={30}/> :
                                        <IconF name="circle" color="#387ef5" size={30}/>
                                    }
                                    <Text style={{color: '#000000', fontSize:setSpText(30), paddingTop: 4,}}>{_name.条码搜索}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{paddingRight: 10,}}
                                    onPress={() => {
                                        this.refs.modal1.close()
                                    }}
                                >
                                    <IconEV name="close" color="#000" size={30}/>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[{
                                flexDirection: 'row',
                                padding: 8,
                                paddingLeft: 20,
                                paddingRight: 20
                            }]}
                                              onPress={() => {
                                                  this.storeQueryType("2");
                                                  //this.setState({searchstate: 2})
                                              }}>
                                {searchstate == "2" ?
                                    <IconF name="disc" color="#387ef5" size={30}/> :
                                    <IconF name="circle" color="#387ef5" size={30}/>
                                }
                                <Text style={{color: '#000000', fontSize:setSpText(30), paddingTop: 4}}>{_name.目录搜索}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{
                                flexDirection: 'row',
                                padding: 8,
                                paddingLeft: 20,
                                paddingRight: 20
                            }]}
                                              onPress={() => {
                                                  this.storeQueryType("3");
                                                  //this.setState({searchstate: 3})
                                              }}>
                                {searchstate == "3" ?
                                    <IconF name="disc" color="#387ef5" size={30}/> :
                                    <IconF name="circle" color="#387ef5" size={30}/>
                                }
                                <Text style={{color: '#000000', fontSize:setSpText(30), paddingTop: 4}}>{_name.商品名称查询}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{
                                flexDirection: 'row',
                                padding: 8,
                                paddingLeft: 20,
                                paddingRight: 20
                            }]}
                                              onPress={() => {
                                                  this.storeQueryType("4");
                                                  // this.setState({searchstate: 4})
                                              }}>
                                {searchstate == "4" ?
                                    <IconF name="disc" color="#387ef5" size={30}/> :
                                    <IconF name="circle" color="#387ef5" size={30}/>
                                }
                                <Text style={{color: '#000000', fontSize:setSpText(30), paddingTop: 4}}>{_name.引擎查询}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modalbox>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {
                        this.setState({cameraModalVisible: false});
                    }}
                >
                    <Camera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                    />
                    <View style={{
                        height: 100,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={this.takePicture.bind(this)}
                            style={[styles.capture, {
                                backgroundColor: 'transparent',
                            }]}
                        >
                            <IconE name="camera" color="#222" size={30}></IconE>

                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showProgress}
                    onRequestClose={() => {
                        this.setState({showProgress: false})
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
                            <Text style={{color: '#fff', fontSize:setSpText(36), alignItems: 'center'}}>
                                please wait....
                            </Text>
                        </View>
                    </View>
                </Modal>

                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}>
                    <View style={{flex: 1, backgroundColor: '#CAE1FF'}}>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10, color: "black"}}
                                       placeholder="商品类型"
                                /*onChangeText={(commodityleixinginfo) => {
                                    this.setState({commodityleixinginfo: commodityleixinginfo})
                                }}*/
                                       value={this.state.commodityleixinginfo}
                                       placeholderTextColor="#aaa"
                                       underlineColorAndroid="transparent"
                                       editable={false}
                            />
                            <ModalDropdown style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           options={this.state.commodityleixing}
                                           renderRow={this.renderRow_leixing.bind(this)}
                                           onSelect={(idx, value) => this.resetzhonglei(idx, value)}>
                                <IconE name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10, color: "black"}}
                                       placeholder="品牌"
                                       editable={false}
                                       placeholderTextColor="#aaa"
                                       value={this.state.commoditypinpaiinfo}
                                       underlineColorAndroid="transparent"
                            />
                            <ModalDropdown options={this.state.commoditypinpai}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           renderRow={this.renderRow_pinpai.bind(this)}
                                           onSelect={(idx, value) => this.resetpinpai(idx, value)}>
                                <IconE name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10, color: "black"}}
                                       placeholder="描述"
                                       editable={false}
                                       placeholderTextColor="#aaa"
                                       value={this.state.commoditymiaoshuinfo}
                                       underlineColorAndroid="transparent"
                            />
                            <ModalDropdown options={this.state.commoditymiaoshu}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           renderRow={this.renderRow_miaoshu.bind(this)}
                                           onSelect={(idx, value) => this.resetmiaoshu(idx, value)}>
                                <IconE name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10, color: "black"}}
                                       placeholder="尺寸"
                                       editable={false}
                                       placeholderTextColor="#aaa"
                                       value={this.state.commoditychicuninfo}
                                       underlineColorAndroid="transparent"
                            />
                            <ModalDropdown options={this.state.commoditychicun}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           renderRow={this.renderRow_chicun.bind(this)}
                                           onSelect={(idx, value) => this.resetchicun(idx, value)}>
                                <IconE name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={{flex: 2}}>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                backgroundColor: 'white',
                                borderRadius: 4,
                                marginLeft: 120,
                                marginRight: 120,
                                marginBottom: 10,
                                marginTop: 15
                            }} onPress={() => {
                                this.getCommodityByCatalog(this.state.commoditychicuninfo)
                            }
                            }>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize:setSpText(36)}}>OK</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PopupDialog>

                {/*跳转商品*/}
                <Modalbox
                    backButtonClose={true}
                    style={[styles.container]}
                    position={"center"}
                    ref={"jumpModal"}
                    animationType={"slide"}>
                    <View style={{borderBottomWidth: 0, justifyContent: 'center', flexDirection: 'column',}}>

                        <TouchableOpacity
                            style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}
                            onPress={() => {
                                        this.refs.jumpModal.close()
                                    }}
                        >
                            <IconEV name="close" color="#000" size={30}/>
                        </TouchableOpacity>

                        <View style={{flex:2,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                            <Text style={{fontSize:setSpText(30), color: '#444'}}>
                                {_name.请输入要跳转的页面}
                            </Text>
                        </View>

                        <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput
                                    style={{height: 40,flex: 1,paddingLeft: 20,paddingRight: 10,paddingTop: 2,paddingBottom: 2,borderWidth:1,fontSize:setSpText(30)}}
                                    onChangeText={(inputOrderNum) => {
                                        this.setState({inputOrderNum: inputOrderNum})
                                    }}
                                    placeholder="page"
                                    placeholderTextColor="#aaa"
                                />
                            </View>
                        </View>

                        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
                        <TouchableOpacity style={{
                            width:100,
                            height:40,
                            backgroundColor: '#387ef5',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          onPress={() => {
                                              var inputOrderNum = this.state.inputOrderNum;
                                              inputOrderNum = inputOrderNum*1;

                                              if(inputOrderNum>0 && inputOrderNum<=this.state.maxOrderNum){
                                                this.queryGoodsBeforeOrNext(inputOrderNum-1)
                                                this.refs.jumpModal.close();
                                              }else{
                                                alert(_name.所输入页面不正确)
                                              }
                                          }}>
                            <Text style={{fontSize:setSpText(30), color: '#fff'}}>{_name.跳转}</Text>
                        </TouchableOpacity></View>

                    </View>
                </Modalbox>

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
                                    setTimeout(() => this.queryGoodsCode(data), 1000)
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

                {/*引擎查询*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.codeNumModalVisible}
                    onRequestClose={() => {
                            this.closeCodeNumModal(!this.state.codeNumModalVisible)
                        }}>

                    <CodeNumModal
                        onClose={() => {
                                this.closeCodeNumModal(!this.state.codeNumModalVisible)
                            }}
                        onCodigoSelect={
                                (code) => {
                                    this.onCodigoSelect(code);
                                }}
                        getCommodityBySearchEngine={
                            (descripcion,start)=>{
                                this.getCommodityBySearchEngine(descripcion,start)
                            }
                        }
                        codeNumlist={this.state.codeNumlist}
                        start={this.state.start}
                        max = {this.state.limit}
                        descripcion={this.state.codeendnum}
                    />
                </Modal>

            </View>);
    }
}

function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

var styles = StyleSheet.create({

    //输入框的格式
    textinput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: setSpText(30),
        borderWidth: 1,
        borderRadius: 5,
    },
    //图片格式
    picstyle: {
        width: width - 20,
        height: width - 40,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "black",
    },
    //图片格式
    smallpicstyle: {
        width: 120,
        height: 120,
        padding: 10,
        marginTop: 30,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "black",
    },
    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 10,
    },
    //靠左排列格式
    leftstyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    //靠右排列格式
    rightstyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    //显示标题字体格式
    titletext: {
        color: '#222',
        fontSize: setSpText(30),
    },
    //按钮标准格式
    touchstyle: {
        backgroundColor: '#387ef5',
        borderRadius: 5,
        marginHorizontal: 6,
        width: 200
    },
    container: {
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
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
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    discountUnselected: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#eee',
        marginRight: .5,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center'
    },
    discountSelected: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#387ef5',
        marginRight: .5,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center'
    },
    popoverContent: {
        width: width / 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverContentIm: {
        width: 280,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        fontSize: setSpText(30)
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
    table: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#343434',
        //marginBottom: 10,
        marginRight: 10,
        marginTop: 15,
        marginLeft: 10,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    dropdown: {
        flex: 1,
        paddingRight: 10,
        backgroundColor: 'transparent',
        borderLeftWidth: 1,
        borderLeftColor: '#ddd',
    },
    dropdown_dropdownTextStyle: {
        width: 200,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: '#20C3DD'
    },
});


module.exports = connect(state => ({
        merchantId: state.user.ventasId,
        username: state.user.username,
        sessionId: state.user.sessionId,
        maxOrderNum: state.user.maxOrderNum,
        searchType: state.user.searchType,
        pictureurl: state.sale.pictureurl,
        picturenum1: state.sale.picturenum1,
        picturenum2: state.sale.picturenum2,
        picturenum3: state.sale.picturenum3,
        picturenum4: state.sale.picturenum4,
        picturenum5: state.sale.picturenum5,
        mainattachid: state.sale.mainattachid,
        priceOptionList: state.user.priceOptionList,
    })
)(Query);