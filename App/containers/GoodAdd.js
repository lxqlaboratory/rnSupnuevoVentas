/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    PermissionsAndroid,
    CameraRoll,
    TouchableHighlight,
    ScrollView,
    ListView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Button,
    DeviceEventEmitter,
} from 'react-native';

import {connect} from 'react-redux';

import IconI from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import ActionSheet from 'react-native-actionsheet';
import {_name} from '../../Language/IndexLanguage';

import IconE from 'react-native-vector-icons/Entypo';
import IconS from 'react-native-vector-icons/SimpleLineIcons';
import Camera from 'react-native-camera';
import Modalbox from 'react-native-modalbox';
import {storeSearchType, getCommodityPriceMainPic,getVentasCommodityPriceOptionList} from "../action/actionCreator";
import IconF from 'react-native-vector-icons/Feather';
import WaitTip from '../components/modal/WaitTip';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
import Config from '../../config';
import RNFS from 'react-native-fs';
import {setSpText,scaleSize} from '../utils/ScreenUtil'
var Popover = require('react-native-popover');
var count = 0;

class GoodAdd extends Component {

    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCameraBarcode() {
        this.setState({cameraBarcodeModalVisible: false});
    }

        cancel() {
        //this.props.reset();
        const {dispatch} = this.props;
        dispatch(getCommodityPriceMainPic(this.state.priceId));
        dispatch(getVentasCommodityPriceOptionList());
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    back(){
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    alerterr() {
        alert("error");
    }

//显示下拉数据列表
    showPopover(ref) {
        console.log("showPopover");
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            switch (ref) {
                case "textinput1":
                    this.setState({
                        buttonRect: {x: px, y: py, width: width, height: height},
                        displayArea: {x: px, y: py + 50, width: width, height: height + 100},
                        zhongleiVisible: true,
                    });
                    break;
                case "textinput2":
                    this.setState({
                        buttonRect: {x: px, y: py, width: width, height: height},
                        displayArea: {x: px, y: py + 50, width: width + 100, height: height + 100},
                        pinpaiVisible: true,
                    });
                    break;
                case "textinput3":
                    this.setState({
                        buttonRect: {x: px, y: py, width: width, height: height},
                        displayArea: {x: px, y: py + 50, width: width + 100, height: height + 100},
                        miaoshuVisible: true,
                    });
                    break;
                case "textinput4":
                    this.setState({
                        buttonRect: {x: px, y: py, width: width, height: height},
                        displayArea: {x: px, y: py + 50, width: width + 100, height: height + 100},
                        hanliangVisible: true,
                    });
                    break;
                case "menu":
                        this.setState({
                            menuVisible: true,
                            buttonRect: {x: px, y: py, width: width, height: height},
                            displayArea: {x: px, y: py + 50, width: width + 200, height: height + 40},
                        });
                    break;
                default:
                    return false;
            }


        });
    }

    closePopover(flag) {
        switch (flag) {
            case 1:
                this.setState({
                    zhongleiVisible: false,
                });
                break;
            case 2:
                this.setState({
                    pinpaiVisible: false,
                });
                break;
            case 3:
                this.setState({
                    miaoshuVisible: false,
                });
                break;
            case 4:
                this.setState({
                    hanliangVisible: false,
                });
                break;
            default:
                return false;
        }
    }

    confirm() {
        //修改信息

        if (this.state.codigo === null || this.state.codigo === undefined || this.state.codigo === '') {
            alert(_name.商品条码不能为空);
            return false;
        }
        if (this.state.descripcion === null || this.state.descripcion === undefined || this.state.descripcion === '') {
            alert(_name.商品名称不能为空);
            return false;
        }

        this.saveOrUpdateSupnuevoCommodityMobile(0);

    }

    saveOrUpdateSupnuevoCommodityMobile(isPhoto){

        let catalogId = this.state.catalogId;
        catalogId = catalogId*1;

        if(catalogId==null || catalogId==undefined || catalogId==''){
            alert(_name.没有选择类别);
            return 0;
        }

        var commodityleixingInfo = this.state.commodityleixinginfo;
        var commoditymiaoshuinfo = this.state.commoditymiaoshuinfo;
        var commoditypinpaiinfo = this.state.commoditypinpaiinfo;
        var commoditychicuninfo = this.state.commoditychicuninfo;

        if(commodityleixingInfo==null||commodityleixingInfo==undefined||commodityleixingInfo==''){
            alert(_name.没有选择类型);
            return 0;
        }

        if(commoditypinpaiinfo==null||commoditypinpaiinfo==undefined||commoditypinpaiinfo==''){
            alert(_name.没有选择品牌);
            return 0;
        }

        if(commoditymiaoshuinfo==null||commoditymiaoshuinfo==undefined||commoditymiaoshuinfo==''){
            alert(_name.没有选择描述);
            return 0;
        }

        if(commoditychicuninfo==null||commoditychicuninfo==undefined||commoditychicuninfo==''){
            alert(_name.没有选择含量);
            return 0;
        }

        var isPhoto = isPhoto;

        this.setState({baocunButtonDisabled: true, bgColor: '#D4D4D4', waitShow: true});

        proxy.postes({
            url: Config.server + '/func/ventas/saveOrUpdateSupnuevoCommodityMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: this.state.commodityId,
                catalogId: catalogId,
                codigo: this.state.codigo,
                codigoBulto1: this.state.codigoBulto1,
                codigoBulto2: this.state.codigoBulto2,
                codigoBulto3: this.state.codigoBulto3,
                codigoBulto4: this.state.codigoBulto4,
                codigoBulto5: this.state.codigoBulto5,
                descripcion: this.state.descripcion,
                tamanoBulto1: this.state.tamanoBulto1,
                tamanoBulto2: this.state.tamanoBulto2,
                tamanoBulto3: this.state.tamanoBulto3,
                tamanoBulto4: this.state.tamanoBulto4,
                tamanoBulto5: this.state.tamanoBulto5,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            var message = json.message;
            var commodityId = json.commodityId;

            this.setState({baocunButtonDisabled: false, bgColor: '#11c1f3', waitShow: false});

            setTimeout(() => {

                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {

                    var errorTxt = '';

                    switch (errorMsg){
                        case 1:errorTxt=_name.已有相同条码商品;break;
                        case 2:errorTxt=_name.已有相同类型商品;break;
                    }

                    if(errorMsg==1) {

                        Alert.alert(_name.保存失败,
                            errorTxt + '\n' +
                            _name.刚输入的条形码+':' + this.state.codigo + '\n' +
                            _name.库里原有的条形码+':' + json.codigo,
                            [
                                {
                                    text: _name.查看已有商品,
                                    onPress: () => {
                                        this.setState({
                                            descripcion: json.descripcion,
                                            codigo: json.codigo,
                                            commodityId: json.commodityId,
                                            codigoBulto1: json.codigoBulto1,
                                            codigoBulto2: json.codigoBulto2,
                                            codigoBulto3: json.codigoBulto3,
                                            codigoBulto4: json.codigoBulto4,
                                            codigoBulto5: json.codigoBulto5,
                                            tamanoBulto1: json.tamanoBulto1,
                                            tamanoBulto2: json.tamanoBulto2,
                                            tamanoBulto3: json.tamanoBulto3,
                                            tamanoBulto4: json.tamanoBulto4,
                                            tamanoBulto5: json.tamanoBulto5,

                                            catalogId1: json.rubroId + "",
                                            catalogId2: json.presentacionId + "",
                                            catalogId3: json.marcaId + "",
                                            catalogId4: json.tamanoId + "",
                                            catalogId: json.tamanoId + "",
                                            commodityleixing: [],//下拉列表数据
                                            commodityleixinginfo: json.rubroName + "",//类型的属性
                                            commodityleixingId: json.rubroId + "",
                                            commoditymiaoshu: [],//下拉列表数据
                                            commoditymiaoshuinfo: json.presentacionName + "",//描述的属性
                                            commoditymiaoshuinfoId: json.presentacionId + "",
                                            commoditypinpai: [],//下拉列表数据
                                            commoditypinpaiinfo: json.marcaName + "",//品牌的属性
                                            commoditypinpaiinfoId: json.marcaId + "",
                                            commoditychicun: [],//下拉列表数据
                                            commoditychicuninfo: json.tamanoName + "",//含量的属性
                                            commoditychicuninfoId: json.tamanoId + "",
                                            commodityleiChange: null,
                                            commoditypinpaiChange: null,
                                            commoditymiaoshuChange: null,
                                            commodityhanliangChange: null,
                                            baocunButtonDisabled: false,//保存按钮设置只点一次
                                            zhongleiVisible: false,
                                            pinpaiVisible: false,
                                            miaoshuVisible: false,
                                            hanliangVisible: false,
                                            commoditypinpaidisable: false,
                                            commoditymiaoshudisable: false,
                                            commoditychicundisable: false,
                                        })

                                    }
                                },
                                {
                                    text: _name.取消,
                                    onPress: () => {
                                    },
                                },
                            ]);

                    }else {

                        Alert.alert(_name.保存失败,
                            errorTxt + '\n' +
                            _name.刚输入的条形码+':' + this.state.codigo + '\n' +
                            _name.库里原有的条形码+':' + json.codigo,
                            [
                                {
                                    text: _name.使用原条码,
                                    onPress: () => {
                                        this.setState({
                                            descripcion: json.descripcion,
                                            codigo: json.codigo,
                                            commodityId: json.commodityId,
                                            codigoBulto1: json.codigoBulto1,
                                            codigoBulto2: json.codigoBulto2,
                                            codigoBulto3: json.codigoBulto3,
                                            codigoBulto4: json.codigoBulto4,
                                            codigoBulto5: json.codigoBulto5,
                                            tamanoBulto1: json.tamanoBulto1,
                                            tamanoBulto2: json.tamanoBulto2,
                                            tamanoBulto3: json.tamanoBulto3,
                                            tamanoBulto4: json.tamanoBulto4,
                                            tamanoBulto5: json.tamanoBulto5,

                                            catalogId1: json.rubroId + "",
                                            catalogId2: json.presentacionId + "",
                                            catalogId3: json.marcaId + "",
                                            catalogId4: json.tamanoId + "",
                                            catalogId: json.tamanoId + "",
                                            commodityleixing: [],//下拉列表数据
                                            commodityleixinginfo: json.rubroName + "",//类型的属性
                                            commodityleixingId: json.rubroId + "",
                                            commoditymiaoshu: [],//下拉列表数据
                                            commoditymiaoshuinfo: json.presentacionName + "",//描述的属性
                                            commoditymiaoshuinfoId: json.presentacionId + "",
                                            commoditypinpai: [],//下拉列表数据
                                            commoditypinpaiinfo: json.marcaName + "",//品牌的属性
                                            commoditypinpaiinfoId: json.marcaId + "",
                                            commoditychicun: [],//下拉列表数据
                                            commoditychicuninfo: json.tamanoName + "",//含量的属性
                                            commoditychicuninfoId: json.tamanoId + "",
                                            commodityleiChange: null,
                                            commoditypinpaiChange: null,
                                            commoditymiaoshuChange: null,
                                            commodityhanliangChange: null,
                                            baocunButtonDisabled: false,//保存按钮设置只点一次
                                            zhongleiVisible: false,
                                            pinpaiVisible: false,
                                            miaoshuVisible: false,
                                            hanliangVisible: false,
                                            commoditypinpaidisable: false,
                                            commoditymiaoshudisable: false,
                                            commoditychicundisable: false,
                                        })
                                    }
                                },
                                {
                                    text: _name.使用新条码,
                                    onPress: () => {
                                        //将库里的条码属性置空
                                        proxy.postes({
                                            url: Config.server + '/func/ventas/saveConflictCommoditySupnuevoCommodityMobile',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: {
                                                commodityId: null,
                                                originCommodity:json.commodityId,
                                                errorMsg:errorMsg,
                                                catalogId: catalogId,
                                                codigo: this.state.codigo,
                                                codigoBulto1: this.state.codigoBulto1,
                                                codigoBulto2: this.state.codigoBulto2,
                                                codigoBulto3: this.state.codigoBulto3,
                                                codigoBulto4: this.state.codigoBulto4,
                                                codigoBulto5: this.state.codigoBulto5,
                                                descripcion: this.state.descripcion,
                                                tamanoBulto1: this.state.tamanoBulto1,
                                                tamanoBulto2: this.state.tamanoBulto2,
                                                tamanoBulto3: this.state.tamanoBulto3,
                                                tamanoBulto4: this.state.tamanoBulto4,
                                                tamanoBulto5: this.state.tamanoBulto5,
                                            }
                                        }).then((json) => {
                                            var error = json.errorMsg;
                                            if(error!=null && error!=undefined)
                                                alert(_name.保存失败)
                                            else
                                            {
                                                alert(_name.保存成功)
                                                DeviceEventEmitter.emit('codigo',commodityId)
                                                this.cancel();
                                            }
                                        })
                                    },
                                },
                                {
                                    text: _name.取消,
                                    onPress: () => {
                                    },
                                },
                            ]);

                    }

                }
                if (message !== null && message !== undefined && message !== "") {
                    //alert(message);
                    this.setState({commodityId:commodityId})
                    if(isPhoto==1){

                        alert(_name.保存成功)

                    }else
                    {
                        DeviceEventEmitter.emit('codigo',commodityId)
                        this.cancel();
                    }


                }

            }, 1000);
        }).catch((err) => {
            this.setState({wait: false, bgColor: '#11c1f3'});
            alert(err);
        });

    }


//获取用户相册权限，用来保存照片
    requestExternalStoragePermission = async (data) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title':_name.申请相册权限,
                    'message': 'We need your permission to use your album',
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
//拍照获取照片
    takePicture = async function () {
        let picnum = this.state.picturenum;
        let _this = this;

        if (this.camera) {
            try {
                // this.show("11");
                // const options = {quality: 0.2};
                let path = await this.camera.capture()
                    .then(function (data) {
                        return data.path;
                        // path = data.path;
                    })
                    .catch(err => this.show(err));
                // this.show("33");
                let base64S = await RNFS.readFile(path, 'base64')
                    .then((content) => {
                        return content;
                    })
                    .catch((err) => {
                        alert("unloading error: " + err);
                    });
                // this.show("22");
                var flag = this.uploadCommodityImage(picnum, base64S);

                if(flag==0){_this.setState({cameraModalVisible: false});return;}

                if (picnum === 1) {//ios拍照关闭不了modal，fuck
                    this.setState({picturenum1: path, cameraModalVisible: false});
                }
                if (picnum === 2) {
                    this.setState({picturenum2: path, cameraModalVisible: false});
                }
                if (picnum === 3) {
                    this.setState({picturenum3: path, cameraModalVisible: false});
                }
                if (picnum === 4) {
                    this.setState({picturenum4: path, cameraModalVisible: false});
                }
                if (picnum === 5) {
                    this.setState({picturenum5: path, cameraModalVisible: false});
                }
                _this.setState({cameraModalVisible: false});
                // let permission = this.requestExternalStoragePermission(data);
            }
            catch
                (e) {
                console.log(e);
            }

        }
    };

    uploadCommodityImage(index, fileData) {//拍照完之后上传图片

        let commodityId = this.state.commodityId;
        if (commodityId === null || commodityId === undefined) {
            Alert.alert(
                'Alert',
                _name.请先存储商品信息再拍照,
                [
                    {text: _name.保存, onPress: () =>{
                        this.saveOrUpdateSupnuevoCommodityMobile(1)
                    }},
                    {text: _name.取消,onPress:()=>{},style:'cancel'}
                ],
                {cancelable: false}
            );
            return 0;
        }
        else {
            proxy.postes({
                url: Config.server + '/func/ventas/uploadSupnuevoVentasCommodityImage',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    index: index,
                    commodityId: this.state.commodityId,
                    fileData: fileData,
                }
            }).then((json) => {
                var errorMsg = json.errorMsg;
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);

                } else {
                    //this.closeCamera();
                    alert("ok");

                }
            }).catch((err) => {
                alert(err);
            });
       }
    }

    deleteCommodityImage(index) {//选中后删除照片
        let commodityId = this.state.commodityId;
        if (commodityId === null || commodityId === undefined) {
            alert(_name.没有产品);
            return;
        }

        var picture;

        switch (index){
            case 1:
                picture = this.state.picturenum1;
                break;
            case 2:
                picture = this.state.picturenum2;
                break;
            case 3:
                picture = this.state.picturenum3;
                break;
            case 4:
                picture = this.state.picturenum4;
                break;
            case 5:
                picture = this.state.picturenum5;
                break;
        }

        if(picture ==null || picture == undefined||picture == ""){
            alert('照片不存在')
            return ;
        }

        proxy.postes({
            url: Config.server + '/func/ventas/deleteSupnuevoVentasCommodityImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                index: index,
                commodityId: this.state.commodityId * 1,
                priceId:this.state.priceId * 1,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(_name.您没有权限删除照片);
                return 0;
            } else {
                this.getCommodityImageList(this.state.commodityId);
            }
        }).catch((err) => {
            alert(err);
        });
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    saveImg(img) {
        var promise = CameraRoll.saveToCameraRoll(img, "photo");
        promise.then(function (result) {
            console.log('保存成功！地址如下：\n' + result);
        }).catch(function (error) {
            console.log('保存失败！\n' + error);
        });
    }

    //通过品牌尺寸进行查询
    getCommodityByCatalog(catalogId) {
        console.log("getCommodityByCatalog");
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
                catalogId: catalogId,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {


            }
        }).catch((err) => {
            alert(err);
        });
    }

//rowData.value是parentId
    getCommodityCatalog(parentId, flag) {
        if (parentId === null && flag === 1) {
            this.setState({
                commoditychicuninfo: null,
                commoditypinpaiinfo: null,
                commoditymiaoshuinfo: null,
                commoditychicun: [],
                commoditypinpai: [],
                commoditymiaoshu: [],
                commoditypinpaidisable: false,
                commoditymiaoshudisable: false,
                commoditychicundisable: false,
            });
        }
        if (flag === 2) {
            this.setState({
                commoditychicuninfo: null,
                commoditymiaoshuinfo: null,
                commoditychicun: [],
                commoditymiaoshu: [],
                commoditymiaoshudisable: false,
                commoditychicundisable: false,
            });
        }
        if (flag === 3) {
            this.setState({
                commoditychicuninfo: null,
                commoditychicun: [],
                commoditychicundisable: false,
            });
        }
        if (parentId === null && flag !== 1) {
            this.closePopover();
            return false;
        }
        if (parentId === "" && flag !== 1) {
            this.closePopover(flag);
            return false;
        }
        if (parentId !== null) {
            parentId = parentId * 1;
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
                if (json !== null) {
                    if (json.arrayList !== undefined) {
                        if (flag === 1 || flag === null) {
                            this.setState({commodityleixing: json.arrayList});
                            this.showPopover("textinput1");
                        }
                        if (flag === 2) {
                            this.setState({commoditypinpai: json.arrayList});
                            this.showPopover("textinput2");
                        }
                        if (flag === 3) {
                            this.setState({commoditymiaoshu: json.arrayList});
                            this.showPopover("textinput3");
                        }
                        if (flag === 4) {
                            this.setState({commoditychicun: json.arrayList});
                            this.showPopover("textinput4");
                        }
                    }
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    addCommodityCatalog(parentId, catalogName, num) {
        if (catalogName === null || catalogName === undefined) {
            // alert("error no data to add");
            return 0;
        }
        if (parentId !== null) {
            parentId = parentId * 1;
        }
        if (num !== null || num !== undefined) {
            num = num * 1;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/addNewCommodityCatalog',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                parentId: parentId,
                catalogName: catalogName,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                //alert(errorMsg);
                alert(_name.该目录已存在);
                return 0;
            } else {
                if (json.catalogId !== null && json.catalogId !== undefined) {
                    switch (num) {
                        case 1:
                            this.setState({
                                commodityleixinginfo: json.catalogName,
                                catalogId1:json.catalogId,
                                catalogId:json.catalogId,
                                commodityleiChange: null,
                                commoditypinpaiinfo: null,
                                commoditymiaoshuinfo: null,
                                commoditychicuninfo: null,
                                commoditypinpaidisable: true,
                                commoditymiaoshudisable: false,
                                commoditychicundisable: false,
                            });
                            break;
                        case 2:
                            this.setState({
                                commoditypinpaiinfo: json.catalogName,
                                catalogId2:json.catalogId,
                                catalogId:json.catalogId,
                                commoditypinpaiChange: null,
                                commoditymiaoshuinfo: null,
                                commoditychicuninfo: null,
                                commoditymiaoshudisable: true,
                                commoditychicundisable: false,
                            });
                            break;
                        case 3:
                            this.setState({
                                commoditymiaoshuinfo: json.catalogName,
                                catalogId3:json.catalogId,
                                catalogId:json.catalogId,
                                commoditymiaoshuChange: null,
                                commoditychicuninfo: null,
                                commoditychicundisable: true,
                            });
                            break;
                        case 4:
                            this.setState({
                                commoditychicuninfo: json.catalogName,
                                catalogId4:json.catalogId,
                                catalogId:json.catalogId,
                                commodityhanliangChange: null,
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    modifyCommodityCatalog(parentId,catalogId, catalogName, num) {
        if (catalogId === null || catalogId === undefined) {
            alert("error:no data to modify");
            return 0;
        }
        parentId = parentId * 1;
        catalogId = catalogId * 1;
        if (num !== null || num !== undefined) {
            num = num * 1;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/modifyCommodityCatalog',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                parentId: parentId,
                catalogId: catalogId,
                catalogName: catalogName,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
                return 0;
            } else {
                if (json.message !== null && json.message !== undefined) {
                    switch (num) {
                        case 1:
                            this.setState({
                                commodityleixinginfo: json.catalogName,
                                catalogId1:json.catalogId,
                                catalogId:json.catalogId,
                                commodityleiChange: null,
                                commoditypinpaiinfo: null,
                                commoditymiaoshuinfo: null,
                                commoditychicuninfo: null,
                                commoditypinpaidisable: true,
                                commoditymiaoshudisable: false,
                                commoditychicundisable: false,
                            });
                            break;
                        case 2:
                            this.setState({
                                commoditypinpaiinfo: json.catalogName,
                                catalogId2:json.catalogId,
                                catalogId:json.catalogId,
                                commoditypinpaiChange: null,
                                commoditymiaoshuinfo: null,
                                commoditychicuninfo: null,
                                commoditymiaoshudisable: true,
                                commoditychicundisable: false,
                            });
                            break;
                        case 3:
                            this.setState({
                                commoditymiaoshuinfo: json.catalogName,
                                catalogId3:json.catalogId,
                                catalogId:json.catalogId,
                                commoditymiaoshuChange: null,
                                commoditychicuninfo: null,
                                commoditychicundisable: true,
                            });
                            break;
                        case 4:
                            this.setState({
                                commoditychicuninfo: json.catalogName,
                                catalogId4:json.catalogId,
                                catalogId:json.catalogId,
                                commodityhanliangChange: null,
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    deleteCommodityCatalog(catalogId, isCommodity,num) {
        if (catalogId === null || catalogId === undefined) {
            alert("error no data to add");
            return 0;
        }

        catalogId = catalogId * 1;
        if (num !== null || num !== undefined) {
            num = num * 1;
        }

        proxy.postes({
            url: Config.server + '/func/ventas/deleteCommodityCatalog',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                catalogId: catalogId,
                isCommodity: isCommodity,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if (json.message !== null && json.message !== undefined) {
                    switch (num) {
                        case 1:
                            this.setState({
                                commodityleixinginfo: null,
                                catalogId1:null,
                                catalogId:null,
                                commodityleiChange: null,
                                commoditypinpaiinfo: null,
                                commoditymiaoshuinfo: null,
                                commoditychicuninfo: null,
                                commoditypinpaidisable: false,
                                commoditymiaoshudisable: false,
                                commoditychicundisable: false,
                            });
                            break;
                        case 2:
                            this.setState({
                                commoditypinpaiinfo:null,
                                catalogId2:null,
                                catalogId:this.state.catalogId1,
                                commoditypinpaiChange: null,
                                commoditymiaoshuinfo: null,
                                commoditychicuninfo: null,
                                commoditymiaoshudisable: false,
                                commoditychicundisable: false,
                            });
                            break;
                        case 3:
                            this.setState({
                                commoditymiaoshuinfo:null,
                                catalogId3:null,
                                catalogId:this.state.catalogId2,
                                commoditymiaoshuChange: null,
                                commoditychicuninfo: null,
                                commoditychicundisable: false,
                            });
                            break;
                        case 4:
                            this.setState({
                                commoditychicuninfo:null,
                                catalogId4:null,
                                catalogId:this.state.catalogId3,
                                commodityhanliangChange: null,
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    selectSupnuevoVentasCommodityImage(index) {
        let priceId = this.state.priceId;
        if (index === null || index === undefined) {
            alert("error no data to add");
            return 0;
        }
        if (priceId === null || priceId === undefined) {
            alert("error no data to add");
            return 0;
        }
        proxy.postes({
            url: Config.server + '/func/ventas/selectSupnuevoVentasCommodityImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                priceId: priceId * 1,
                index: index,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if (json.message !== null && json.message !== undefined) {
                    alert(_name.设置图片成功);
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    setref(data) {
        let flag = this.state.commodityflag;
        if (flag === null) {
            this.setState({commodityleixinginfo: data.label, catalogId1: data});
            this.getCommodityCatalog(data.value, 2);
        }
        if (flag === 2) {
            this.setState({commoditypinpaiinfo: data.label, catalogId2: data});
            this.getCommodityCatalog(data.value, 3);
        }
        if (flag === 3) {
            this.setState({commoditymiaoshuinfo: data.label, catalogId3: data});
            this.getCommodityCatalog(data.value, 4);
        }
        if (flag === 4) {
            this.setState({commoditychicuninfo: data.label, catalogId4: data});
        }
    }

    testButton(num) {//对用户触摸事件进行处理
        count++;
        this.timer = setTimeout(() => {

            if (count === 1) {
                this.selectPic(num);
            }
            if (count === 2) {
                this.onLongPress(num)
            }
            count = 0;
            clearTimeout(this.timer);

        }, 500);
    }

    onLongPress(num) {
        if (num === 1) {
            if (this.state.picturenum1 !== null) {
                this.selectSupnuevoVentasCommodityImage(1);
            } else {
                alert("error");
            }
        }
        if (num === 2) {
            if (this.state.picturenum2 !== null) {
                this.selectSupnuevoVentasCommodityImage(2);
            } else {
                alert("error");
            }
        }
        if (num === 3) {
            if (this.state.picturenum3 !== null) {
                this.selectSupnuevoVentasCommodityImage(3);
            } else {
                alert("error");
            }
        }
        if (num === 4) {
            if (this.state.picturenum4 !== null) {
                this.selectSupnuevoVentasCommodityImage(4);
            } else {
                alert("error");
            }
        }
        if (num === 5) {
            if (this.state.picturenum4 !== null) {
                this.selectSupnuevoVentasCommodityImage(5);
            } else {
                alert("error");
            }
        }
    }

    deleteButton(num) {//长按的方法
        Alert.alert(
            'Alert',
            _name.是否删除该照片,
            [
                {
                    text: _name.删除, onPress: () => {
                    this.deleteCommodityImage(num);
                }
                },
                {
                    text: _name.取消, onPress: () =>{}, style: 'cancel'
                },
            ]
        )
    }

    setPicture(picturenum) {
        this.setState({cameraModalVisible: true, picturenum: picturenum});
    }

    selectPic(picturenum) {//点击图片
        if (picturenum === 1) {
            if (this.state.picturenum1 === null) {
                this.setPicture(1);
            } else {
                this.setState({picturenum: picturenum, bigPictureVisiable: true, pictureuri: this.state.picturenum1});
            }
        }
        if (picturenum === 2) {
            if (this.state.picturenum2 === null) {
                this.setPicture(2);
            } else {
                this.setState({picturenum: picturenum, bigPictureVisiable: true, pictureuri: this.state.picturenum2});
            }
        }
        if (picturenum === 3) {
            if (this.state.picturenum3 === null) {
                this.setPicture(3);
            } else {
                this.setState({picturenum: picturenum, bigPictureVisiable: true, pictureuri: this.state.picturenum3});
            }
        }
        if (picturenum === 4) {
            if (this.state.picturenum4 === null) {
                this.setPicture(4);
            } else {
                this.setState({picturenum: picturenum, bigPictureVisiable: true, pictureuri: this.state.picturenum4});
            }
        }
        if (picturenum === 5) {
            if (this.state.picturenum5 === null) {
                this.setPicture(5);
            } else {
                this.setState({picturenum: picturenum, bigPictureVisiable: true, pictureuri: this.state.picturenum5});
            }
        }
    }

    renderRow_zhonglei(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        commodityleixinginfo: rowData.catalogName,
                        catalogId1: rowData.catalogId,
                        zhongleiVisible: false,
                        catalogId: rowData.catalogId,//商品保存的时候的catalogId
                        commoditypinpaidisable: true
                    });
                }}>
                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize:setSpText(34)}}>{rowData.catalogName}</Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_pinpai(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        commoditypinpaiinfo: rowData.catalogName,
                        catalogId2: rowData.catalogId,
                        pinpaiVisible: false,
                        catalogId: rowData.catalogId,//商品保存的时候的catalogId
                        commoditymiaoshudisable: true
                    });
                }}>
                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize:setSpText(34)}}>{rowData.catalogName}</Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_miaoshu(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        commoditymiaoshuinfo: rowData.catalogName,
                        catalogId3: rowData.catalogId,
                        catalogId: rowData.catalogId,//商品保存的时候的catalogId
                        miaoshuVisible: false,
                        commoditychicundisable: true
                    });
                }}>
                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize:setSpText(34)}}>{rowData.catalogName}</Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_chicun(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        commoditychicuninfo: rowData.catalogName,
                        catalogId4: rowData.catalogId,
                        catalogId: rowData.catalogId,//商品保存的时候的catalogId
                        hanliangVisible: false
                    });
                }}>
                    <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Text style={{fontSize:setSpText(34)}}>{rowData.catalogName}</Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
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

//清除定时器
    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    constructor(props) {
        super(props);
        this.state = {
            scaleArr: [],
            wait: false,
            bgColor: '#11c1f3',
            codeNumlist: [],
            codeendnum: null,
            menuVisible: false,
            buttonRect: null,
            displayArea: {x: 5, y: 20, width: width - 10, height: height - 25},

            catalogId1: null,//商品类的Data这是一个对象，下边的info是存储的属性
            catalogId2: null,//商品品牌的Data
            catalogId3: null,//商品描述的Data
            catalogId4: null,//商品含量的Data，存储整个data对象方便添加，修改删除
            commodityflag: null,//用于区分四个输入框哪个选择的
            cameraModalVisible: false,//开启相机的modal
            bigPictureVisiable: false,//查看大图的modal
            picturenum1: null,//base64格式显示图片，或者是图片地址
            picturenum2: null,
            picturenum3: null,
            picturenum4: null,
            picturenum5: null,
            picturenum: null,//目前选择的第几个图片
            pictureuri: null,//查看大图的base64或者uri
            commodityId: null,
            catalogId: null,
            codigo: this.props.codeNum,
            priceId: null,
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
            commodityleixing: [],//下拉列表数据
            commodityleixinginfo: null,//类型的属性
            commodityleixingId: null,
            commoditymiaoshu: [],//下拉列表数据
            commoditymiaoshuinfo: null,//描述的属性
            commoditymiaoshuinfoId: null,
            commoditypinpai: [],//下拉列表数据
            commoditypinpaiinfo: null,//品牌的属性
            commoditypinpaiinfoId: null,
            commoditychicun: [],//下拉列表数据
            commoditychicuninfo: null,//含量的属性
            commoditychicuninfoId: null,
            commodityleiChange: null,
            commoditypinpaiChange: null,
            commoditymiaoshuChange: null,
            commodityhanliangChange: null,
            baocunButtonDisabled: false,//保存按钮设置只点一次
            zhongleiVisible: false,
            pinpaiVisible: false,
            miaoshuVisible: false,
            hanliangVisible: false,
            commoditypinpaidisable: false,
            commoditymiaoshudisable: false,
            commoditychicundisable: false,

            isBack:false,

            cameraBarcodeModalVisible: false,
            camera: {
                // aspect: Camera.constants.Aspect.fill,
                // captureTarget: Camera.constants.CaptureTarget.disk,
                // type: Camera.constants.Type.back,
                // orientation: Camera.constants.Orientation.auto,
                // flashMode: Camera.constants.FlashMode.auto
            },
            isCodigoChange:this.props.codeNum==null?true:false,
            openFlash:false,
        };
    }

    render() {
        let visble = this.state.cameraModalVisible;
        let name = _name.name;
        var listView_commodityleixing = null;
        var listView_commoditypinpai = null;
        var listView_commoditymiaoshu = null;
        var listView_commoditychicun = null;
        var commodityleixing = this.state.commodityleixing;
        var commoditymiaoshu = this.state.commoditymiaoshu;
        var commoditypinpai = this.state.commoditypinpai;
        var commoditychicun = this.state.commoditychicun;
        var username = this.props.username;
        if (this.state.commodityleixinginfo === null || this.state.commodityleixinginfo === "null" || this.state.commodityleixinginfo === "undefined") {
            this.state.commodityleixinginfo = "";
        }
        if (this.state.commoditymiaoshuinfo === null || this.state.commoditymiaoshuinfo === "null" || this.state.commoditymiaoshuinfo === "undefined") {
            this.state.commoditymiaoshuinfo = "";
        }
        if (this.state.commoditypinpaiinfo === null || this.state.commoditypinpaiinfo === "null" || this.state.commoditypinpaiinfo === "undefined") {
            this.state.commoditypinpaiinfo = "";
        }
        if (this.state.commoditychicuninfo === null || this.state.commoditychicuninfo === "null" || this.state.commoditychicuninfo === "undefined") {
            this.state.commoditychicuninfo = "";
        }
        if (commodityleixing === null) {
            commodityleixing = [];
        }
        if (commoditymiaoshu === null) {
            commoditymiaoshu = [];
        }
        if (commoditypinpai === null) {
            commoditypinpai = [];
        }
        if (commoditychicun === null) {
            commoditychicun = [];
        }

        if (commodityleixing.length !== 0 && commodityleixing !== [] && commodityleixing !== undefined && commodityleixing !== null) {
            let data = commodityleixing;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commodityleixing =
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_zhonglei.bind(this)}
                        showsVerticalScrollIndicator={true}
                    />;
        }
        if (commoditymiaoshu.length !== 0 && commoditymiaoshu !== [] && commoditymiaoshu !== undefined && commoditymiaoshu !== null) {
            let data = commoditymiaoshu;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commoditymiaoshu =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_miaoshu.bind(this)}
                        showsVerticalScrollIndicator={true}
                    />
                </ScrollView>;
        }
        if (commoditypinpai.length !== 0 && commoditypinpai !== [] && commoditypinpai !== undefined && commoditypinpai !== null) {
            let data = commoditypinpai;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commoditypinpai =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_pinpai.bind(this)}
                        showsVerticalScrollIndicator={true}
                    />
                </ScrollView>;
        }
        if (commoditychicun.length !== 0 && commoditychicun !== [] && commoditychicun !== undefined && commoditychicun !== null) {
            let data = commoditychicun;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView_commoditychicun =
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow_chicun.bind(this)}
                        showsVerticalScrollIndicator={true}
                    />
                </ScrollView>;
        }
        let cat = this.state.catalogId1;
        var openFlash = this.state.openFlash;

        return (
            <View style={{flex: 1}}>

                {/* header bar */}
                <View style={[{
                    height: 55,
                    backgroundColor: '#387ef5',
                    paddingLeft: 6,
                    alignItems: 'center',
                    flexDirection: 'row'
                }, styles.card]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.cancel();
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                        }}>
                            <IconF name="chevron-left" color="#fff" size={25}></IconF>
                            <Text style={{fontSize:setSpText(36), textAlign: 'center', color: '#fff'}}>
                                {_name.添加新的商品}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* body */}
                <ScrollView>
                    <View style={{height: 550}}>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginHorizontal: 5,
                                marginVertical: 10,
                            }]}>{_name.商品类}:</Text>
                            <View style={[styles.horizontal, {
                                flex: 1,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: 5,
                            }]
                            }>
                                <TextInput
                                    ref="textinput1"
                                    style={{
                                        flex: 1,
                                        height: 40,
                                        fontSize: setSpText(30),
                                        color: "black"
                                    }}

                                    value={this.state.commodityleixinginfo}
                                    editable={false}
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent">
                                </TextInput>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.getCommodityCatalog(null, 1);

                                        //this.setState({zhongleiVisible: true});
                                    }}
                                >
                                    <IconE style={{

                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                    }} name="chevron-small-down" color="black" size={25}/>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.refs.commoditylei.open()
                                }}
                            >
                                <IconS style={{
                                    marginHorizontal: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }} name="note" color="black" size={30}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品品牌}:</Text>
                            <View style={[styles.horizontal, {
                                flex: 1,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: 5,
                            }]
                            }>
                                <TextInput
                                    ref="textinput2"
                                    style={{
                                        flex: 1,
                                        height: 40,
                                        fontSize: setSpText(30),
                                        color: "black"
                                    }}

                                    value={this.state.commoditypinpaiinfo}
                                    editable={false}
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent">
                                </TextInput>
                                {
                                    this.state.commoditypinpaidisable === true ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                {
                                                    this.state.catalogId1 !== null ?
                                                        this.getCommodityCatalog(this.state.catalogId1, 2)
                                                        :
                                                        this.alerterr();
                                                }
                                                this.refs.commoditypinpai.close();
                                            }}
                                        >
                                            <IconE style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                            }} name="chevron-small-down" color="black" size={25}/>
                                        </TouchableOpacity>
                                        :
                                        <View>
                                        </View>
                                }
                            </View>
                            {
                                this.state.commoditypinpaidisable === true ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refs.commoditypinpai.open()
                                        }}>
                                        <IconS style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="note" color="black" size={30}/>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity>
                                        <IconS style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="note" color="#989898" size={30}/>
                                    </TouchableOpacity>
                            }

                        </View>
                        <View style={styles.horizontal}>
                            <Text
                                style={[styles.titletext, {
                                    marginVertical: 10,
                                    marginHorizontal: 5
                                }]}>{_name.描述}:</Text>
                            <View style={[styles.horizontal, {
                                flex: 1,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: 5,
                            }]
                            }>
                                <TextInput
                                    ref="textinput3"
                                    style={{
                                        flex: 1,
                                        height: 40,
                                        fontSize: setSpText(30),
                                        color: "black"
                                    }}

                                    value={this.state.commoditymiaoshuinfo}
                                    editable={false}
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent">
                                </TextInput>
                                {
                                    this.state.commoditymiaoshudisable === true ?

                                        <TouchableOpacity
                                            onPress={() => {
                                                {
                                                    this.state.catalogId2 !== null ?
                                                        this.getCommodityCatalog(this.state.catalogId2, 3)
                                                        :
                                                        this.alerterr();
                                                }
                                                this.refs.commoditymiaoshu.close()

                                            }}

                                        >
                                            <IconE style={{

                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                            }} name="chevron-small-down" color="black" size={25}/>
                                        </TouchableOpacity>
                                        :
                                        <View></View>
                                }
                            </View>
                            {
                                this.state.commoditymiaoshudisable === true ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refs.commoditymiaoshu.open()
                                        }}>
                                        <IconS style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="note" color="black" size={30}/>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity>
                                        <IconS style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="note" color="#989898" size={30}/>
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.含量}:</Text>
                            <View style={[styles.horizontal, {
                                flex: 1,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: 5,
                            }]
                            }>
                                <TextInput
                                    ref="textinput4"
                                    style={{
                                        flex: 1,
                                        height: 40,
                                        fontSize: setSpText(30),
                                        color: "black"
                                    }}

                                    value={this.state.commoditychicuninfo}
                                    editable={false}
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent">
                                </TextInput>
                                {
                                    this.state.commoditychicundisable === true ?

                                        <TouchableOpacity
                                            onPress={() => {
                                                {
                                                    this.state.catalogId3 !== null ?
                                                        this.getCommodityCatalog(this.state.catalogId3, 4)
                                                        :
                                                        this.alerterr();
                                                }
                                                this.refs.commodityhanliang.close()
                                            }}

                                        >
                                            <IconE style={{

                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                            }} name="chevron-small-down" color="black" size={25}/>
                                        </TouchableOpacity>
                                        :
                                        <View></View>
                                }
                            </View>
                            {
                                this.state.commoditychicundisable === true ?

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refs.commodityhanliang.open()
                                        }}
                                    >
                                        <IconS style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="note" color="black" size={30}/>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity>
                                        <IconS style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="note" color="#989898" size={30}/>
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品名称}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(descripcion) => {
                                    this.setState({descripcion: descripcion})
                                }}
                                value={this.state.descripcion}

                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={styles.horizontal}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品条码}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(codigo) => {
                                    this.setState({codigo: codigo})
                                }}
                                value={this.state.codigo}
                                editable={this.state.isCodigoChange}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                            <TouchableOpacity
                                onPress={() => {
                                            this.setState({cameraBarcodeModalVisible: true})
                                        }}
                            >
                                <IconI style={{
                                            marginHorizontal: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }} name="md-barcode" size={30}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.leftstyle}>
                            <Text style={[styles.titletext, {
                                marginVertical: 10,
                                marginHorizontal: 5
                            }]}>{_name.商品图像}:</Text>

                        </View>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                        >
                            <TouchableOpacity
                                ref="picture1"
                                onPress={() => {
                                    this.testButton(1);
                                    //this.selectPic(1);
                                }}
                                onLongPress={() => {
                                    // this.onLongPress(1);
                                    this.deleteButton(1);
                                }}
                            >
                                <View style={styles.picstyle}>
                                    {this.state.picturenum1 === null ?
                                        <IconI name="ios-add" size={40} color="#222"/>
                                        :
                                        <Image resizeMode="contain" style={{
                                            width: 120,
                                            height: 120,
                                        }}
                                               source={{uri: this.state.picturenum1}}
                                        />

                                    }
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture2"
                                style={styles.picstyle}
                                onPress={() => {
                                    this.testButton(2);
                                }}
                                onLongPress={() => {
                                    //this.onLongPress(2);
                                    this.deleteButton(2);
                                }}
                            >
                                {this.state.picturenum2 === null ?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 120,
                                        height: 120,
                                    }}
                                           source={{uri: this.state.picturenum2}}
                                    />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture3"
                                style={styles.picstyle}
                                onPress={() => {
                                    this.testButton(3);
                                }}
                                onLongPress={() => {
                                    // this.onLongPress(3);
                                    this.deleteButton(3);
                                }}
                            >
                                {this.state.picturenum3 === null ? <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 120,
                                        height: 120,
                                    }}
                                           source={{uri: this.state.picturenum3}}
                                    />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture4"
                                style={styles.picstyle}
                                onPress={() => {
                                    this.testButton(4);
                                    //this.selectPic(4);
                                }}
                                onLongPress={() => {
                                    //this.onLongPress(4);
                                    this.deleteButton(4);
                                }}
                            >
                                {this.state.picturenum4 === null ?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 120,
                                        height: 120,
                                    }}
                                           source={{uri: this.state.picturenum4}}
                                    />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture5"
                                style={styles.picstyle}
                                onPress={() => {
                                    //this.selectPic(5);
                                    this.testButton(5);
                                }}
                                onLongPress={() => {
                                    // this.onLongPress(5);
                                    this.deleteButton(5);
                                }}
                            >
                                {this.state.picturenum5 === null ?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 120,
                                        height: 120,
                                    }}
                                           source={{uri: this.state.picturenum5}}
                                    />
                                }
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {this.state.isBack?
                        <View style={[styles.horizontal, {paddingBottom: 20}]}>
                            <TouchableOpacity
                                style={[styles.popoverContent, styles.touchstyle, {
                                borderBottomWidth: 1,
                                borderBottomColor: '#ddd'
                            }]}
                                onPress={() => {
                                this.back();
                            }}>
                                <Text style={[styles.popoverText, {color: '#FFFFFF'}]}>{_name.返回}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={[styles.horizontal, {paddingBottom: 20}]}>
                            <TouchableOpacity
                                style={[styles.popoverContent, styles.touchstyle, {
                                borderBottomWidth: 1,
                                borderBottomColor: '#ddd'
                            }]}
                                onPress={() => {
                                this.confirm();
                            }}>
                                <Text style={[styles.popoverText, {color: '#FFFFFF'}]}>{_name.保存}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
                {/*照片选择组件*/}
                {/* //相机组件*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {
                        this.setState({cameraModalVisible: false});
                    }}
                >
                    <Camera
                        ref={(ref) => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        playSoundOnCapture={false}
                        fixOrientation={true}
                        captureQuality="medium"
                        captureTarget={Camera.constants.CaptureTarget.temp}
                        aspect={Camera.constants.Aspect.fill}
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
                            onPress={() => this.takePicture()}
                            style={[styles.capture, {
                                backgroundColor: 'transparent',
                            }]}
                        >
                            <IconE name="camera" color="#222" size={30}></IconE>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({cameraModalVisible: false})
                            }}
                            style={[styles.capture, {
                                backgroundColor: 'transparent',
                            }]}
                        >
                            <IconE name="circle-with-cross" color="#222" size={30}/>

                        </TouchableOpacity>
                    </View>
                </Modal>
                {/*四个编辑弹出框*/}
                <Modalbox
                    backButtonClose={true}
                    style={[styles.container]}
                    position={"center"}
                    ref={"commoditylei"}
                    animationType={"slide"}>
                    <View style={{marginTop: 10, width: 300, flex: 1}}>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.分类}:</Text>
                            <TextInput
                                style={[styles.textview]}
                                value={null}
                                editable={false}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.商品类}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(commodityleiChange) => {
                                    this.setState({commodityleiChange: commodityleiChange})
                                }}
                                value={this.state.commodityleiChange}

                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1}]}>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.addCommodityCatalog(null, this.state.commodityleiChange, 1);
                                                  this.refs.commoditylei.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize:setSpText(30)}}>{_name.添加}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.modifyCommodityCatalog(null,this.state.catalogId1, this.state.commodityleiChange, 1);
                                                  this.refs.commoditylei.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.修改}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.deleteCommodityCatalog(this.state.catalogId1,false,1);
                                                  this.refs.commoditylei.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.删除}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.refs.commoditylei.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.取消}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modalbox>
                <Modalbox
                    backButtonClose={true}
                    style={[styles.container]}
                    position={"center"}
                    ref={"commoditypinpai"}
                    animationType={"slide"}>
                    <View style={{marginTop: 10, width: 300, flex: 1}}>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.商品类}:</Text>
                            <TextInput
                                style={[styles.textview]}
                                value={this.state.commodityleixinginfo}
                                editable={false}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.商品品牌}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(commoditypinpaiChange) => {
                                    this.setState({commoditypinpaiChange: commoditypinpaiChange})
                                }}
                                value={this.state.commoditypinpaiChange}

                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1}]}>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  {
                                                      this.state.catalogId1 !== null ?
                                                          this.addCommodityCatalog(this.state.catalogId1, this.state.commoditypinpaiChange, 2)
                                                          :
                                                          this.alerterr();
                                                  }

                                                  this.refs.commoditypinpai.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.添加}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.modifyCommodityCatalog(this.state.catalogId1,this.state.catalogId2, this.state.commoditypinpaiChange, 2);
                                                  this.refs.commoditypinpai.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.修改}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.deleteCommodityCatalog(this.state.catalogId2,false,2);
                                                  this.refs.commoditypinpai.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.删除}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.refs.commoditypinpai.close();
                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.取消}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modalbox>
                <Modalbox
                    backButtonClose={true}
                    style={[styles.container]}
                    position={"center"}
                    ref={"commoditymiaoshu"}
                    animationType={"slide"}>
                    <View style={{marginTop: 10, width: 300, flex: 1}}>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.商品品牌}:</Text>
                            <TextInput
                                style={[styles.textview]}
                                value={this.state.commoditypinpaiinfo}
                                editable={false}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.描述}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(commoditymiaoshuChange) => {
                                    this.setState({commoditymiaoshuChange: commoditymiaoshuChange})
                                }}
                                value={this.state.commoditymiaoshuChange}

                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1}]}>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  {
                                                      this.state.catalogId2 !== null ?
                                                          this.addCommodityCatalog(this.state.catalogId2, this.state.commoditymiaoshuChange, 3)
                                                          :
                                                          this.alerterr();
                                                  }

                                                  this.refs.commoditymiaoshu.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.添加}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.modifyCommodityCatalog(this.state.catalogId2,this.state.catalogId3, this.state.commoditymiaoshuChange, 3);
                                                  this.refs.commoditymiaoshu.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.修改}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.deleteCommodityCatalog(this.state.catalogId3,false,3);
                                                  this.refs.commoditymiaoshu.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.删除}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.refs.commoditymiaoshu.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.取消}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modalbox>
                <Modalbox
                    backButtonClose={true}
                    style={[styles.container]}
                    position={"center"}
                    ref={"commodityhanliang"}
                    animationType={"slide"}>
                    <View style={{marginTop: 10, width: 300, flex: 1}}>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.描述}:</Text>
                            <TextInput
                                style={[styles.textview]}
                                value={this.state.commoditymiaoshuinfo}
                                editable={false}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1, marginHorizontal: 5}]}>
                            <Text>{_name.含量}:</Text>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={(commodityhanliangChange) => {
                                    this.setState({commodityhanliangChange: commodityhanliangChange})
                                }}
                                value={this.state.commodityhanliangChange}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent">
                            </TextInput>
                        </View>
                        <View style={[styles.horizontal, {flex: 1}]}>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  {
                                                      this.state.catalogId3 !== null ?
                                                          this.addCommodityCatalog(this.state.catalogId3, this.state.commodityhanliangChange, 4)
                                                          :
                                                          this.alerterr();
                                                  }
                                                  this.refs.commodityhanliang.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.添加}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.modifyCommodityCatalog(this.state.catalogId3,this.state.catalogId4, this.state.commodityhanliangChange, 4);
                                                  this.refs.commodityhanliang.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.修改}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.deleteCommodityCatalog(this.state.catalogId4,false,4);
                                                  this.refs.commodityhanliang.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.删除}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalboxButton}
                                              onPress={() => {
                                                  this.refs.commodityhanliang.close();

                                              }}>
                                <Text style={{color: '#387ef5', fontSize: setSpText(30)}}>{_name.取消}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modalbox>
                {/*四个输入框里面的下拉框*/}
                <Popover
                    isVisible={this.state.zhongleiVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={this.state.displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.setState({zhongleiVisible: false});
                    }}>
                    <View style={{height: 300}}>
                        {listView_commodityleixing}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.pinpaiVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={this.state.displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.setState({pinpaiVisible: false});
                    }}>
                    <View style={{height:300}}>
                        {listView_commoditypinpai === null ? <Text style={{fontSize:setSpText(34)}}>no data</Text> : listView_commoditypinpai}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.miaoshuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={this.state.displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.setState({miaoshuVisible: false})
                    }}>
                    <View style={{height:300}}>
                        {listView_commoditymiaoshu === null ? <Text style={{fontSize:setSpText(34)}}>no data</Text> : listView_commoditymiaoshu}
                    </View>
                </Popover>
                <Popover
                    isVisible={this.state.hanliangVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={this.state.displayArea}
                    placement="bottom"
                    onClose={() => {
                        this.setState({hanliangVisible: false});
                    }}>
                    <View style={{height:300}}>
                        {listView_commoditychicun === null ? <Text style={{fontSize:setSpText(34)}}>no data</Text> : listView_commoditychicun}
                    </View>
                </Popover>
                {/*显示大图*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.bigPictureVisiable}
                    onRequestClose={() => {
                        this.setState({bigPictureVisiable: false});
                    }}>
                    <Image resizeMode="contain" style={{
                        flex: 1
                    }}
                           source={{uri: this.state.pictureuri}}
                    />
                    <View style={{
                        height: 100,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({bigPictureVisiable: false})
                            }}
                            style={[styles.capture, {
                                backgroundColor: 'transparent',
                            }]}
                        >
                            <IconE name="circle-with-cross" color="#222" size={30}/>

                        </TouchableOpacity>
                    </View>
                </Modal>

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
                                var {type, data, bounds} = barcode;
                                if (data !== undefined && data !== null) {
                                    console.log('barcode data=' + data + 'barcode type=' + type);
                                    this.state.codeendnum = data;
                                    this.setState({codeendnum:data,codigo:data,isCodigoChange:false})
                                    this.closeCameraBarcode();
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

                <WaitTip
                    ref="waitTip"
                    waitShow={this.state.waitShow}
                    tipsName="please wait..."
                />
            </View>
        );
    }
}


var styles = StyleSheet.create({
    //图片格式
    picstyle: {
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
    textview: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: setSpText(30),
        color: "black"
    },
    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight:5,
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
        marginHorizontal: 10
    },
    //弹出框里面的button
    modalboxButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: '#387ef5',
        alignItems: 'center',
        marginHorizontal: 5,
        padding: 6,
        borderRadius: 4,
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
    container: {
        marginRight: 10,
        borderRadius: 10,
        width: 300,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    popoverText: {
        fontSize: setSpText(34)
    },
    popoverContent: {
        width: 200,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    button: {
        width: 100,
        margin: 10,
        paddingTop: 15,
        paddingBottom: 15,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'blue'
    }
});


module
    .exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
    })
)(GoodAdd);

