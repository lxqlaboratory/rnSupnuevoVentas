import * as types from './types';
import Config from '../../config';
import {_name} from '../../Language/IndexLanguage';
var proxy = require('../proxy/Proxy');
import PreferenceStore from '../utils/PreferenceStore';

var Platform = require('Platform');

export let loginAction = function (username, password, cb) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            var versionName = "1.0";
            let platform = 'ios';
            if (Platform.OS === 'android') {
                platform = 'android';
            }
            proxy.postes({
                url: Config.server + '/func/auth/webLogin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                   // codigo: "0000",
                    loginName: username,
                    password: password,
                    loginType: 1,
                    parameter: {appVersion: versionName}
                }
            }).then((json) => {
                if (json.errorMessageList !== null && json.errorMessageList !== undefined && json.errorMessageList.length > 0) {
                    //alert(json.errorMessageList[1]);
                    alert(_name.此帐户不存在)
                    dispatch(clearTimerAction());
                    resolve(json.errorMessageList[1]);
                }
                else {
                    proxy.postes({
                        url: Config.server + "/func/ventas/isTipsInfoRentPlanChangeForVentas",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            //userinput: "pizza",
                        }
                    }).then((json) => {
                            if (json.errorMsg !== undefined) {
                                alert(json.errorMsg);
                            } else if (json.msgType != null) {
                                if (json.msgType == '1') {
                                    alert('Al plan le quedan '
                                        + json.days
                                        + ' Días para su finalización, no se extenderá de forma automática. Debe comprar un plan para renovarlo')
                                }
                                //计划还有28天就结束了，但你并没有设置成自动延续，应该购买新的计划了
                                else if (json.msgType == '2') {
                                    alert('Al plan le quedan '
                                        + json.days
                                        + ' días para su finalización, pero el saldo actual es insuficiente, no se extenderá de forma automática')
                                }
                                //你的计划还有28天就结束了，但你账上的钱已经不够自动延续的了，
                            }
                        proxy.postes({
                            url: Config.server + '/func/ventas/getSupnuevoVentasInfoInitInfoMobile',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: {
                                platform: platform,
                                versionName: versionName,

                            }
                        }).then((json) => {
                            let jsonInfo = json;
                            var errorMsg = json.errorMsg;
                            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                                dispatch(getSession(null));
                                dispatch(clearTimerAction());
                                if (cb)
                                    cb(errorMsg);
                            }
                            else {
                                proxy.postes({
                                    url: Config.server + '/func/ventas/getVentasCommodityPriceOptionList',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: {}
                                }).then((json) => {
                                    resolve({priceModifyState: 2});
                                    if (jsonInfo.data.searchMode === null || jsonInfo.data.searchMode === undefined) {
                                        dispatch(storeSearchType(1));
                                    } else {
                                        dispatch(storeSearchType(jsonInfo.data.searchMode));
                                    }
                                    PreferenceStore.put('username', username);
                                    PreferenceStore.put('password', password);
                                    dispatch(clearTimerAction());
                                    dispatch(getSession({
                                        username: username,
                                        ventasId: jsonInfo.data.ventasId,
                                        maxOrderNum: jsonInfo.data.maxOrderNum,
                                        commodityOrderNum: jsonInfo.data.commodityOrderNum,
                                    }));
                                    if (json === null || json === undefined || json === "") {
                                        dispatch(setCommodityPriceOptionList(null));
                                    } else if (json !== null) {
                                        dispatch(setCommodityPriceOptionList(json.ArrayList));
                                    } else {
                                        dispatch(setCommodityPriceOptionList(null));
                                    }


                                }).catch((err) => {
                                    alert(err.message);
                                })
                            }
                            // })
                        }).catch((err) => {
                            alert(err.message);
                        })
                    }).catch((err) => {
                        alert(err.message);
                    })
                }
            }).catch((err) => {
                resolve(err);
                //alert(err.message);
            })
        })
    }
};

export let getCommodityPriceMainPic = function (priceId) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            if (priceId === null || priceId === undefined) {
                dispatch(setGoodsInfo(null));
                return;
            }
            proxy.postes({
                url: Config.server + '/func/ventas/getSupnuevoVentasCommodityPriceImage',
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
                    if (json !== null) {
                        if (json.pictureurl !== null && json.pictureurl !== undefined) {
                            dispatch(setCommodityPriceMainPic(json.pictureurl));
                        } else {
                            dispatch(setCommodityPriceMainPic(null));
                        }
                    }
                }
            }).catch((err) => {
                alert(err);
            });
        })
    }
};

export let getCommodityPicList = function (commodityId) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            if (commodityId === null || commodityId === undefined) {
                dispatch(setCommodityPicListNull());
                dispatch(setCommodityPriceMainPic(null));
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
                    dispatch(setCommodityPicList(json));
                }
            }).catch((err) => {
                alert(err);
            });
        })
    }
};

export let getVentasCommodityPriceOptionList = function () {
    return dispatch => {
        return new Promise((resolve, reject) => {
            proxy.postes({
                url: Config.server + '/func/ventas/getVentasCommodityPriceOptionList',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            }).then((json) => {
                var errorMsg = json.errorMsg;
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                } else {
                    if (json !== null) {
                        dispatch(setCommodityPriceOptionList(json.ArrayList));
                    } else {
                        dispatch(setCommodityPriceOptionList(null,));
                    }
                }
                resolve(1);
            }).catch((err) => {
                alert(err);
            });
        })
    }
};

export let setCommodityPriceOptionList = function (ArrayList) {
    return dispatch => {
        dispatch({
            type: types.SET_KONGJIANLIST,
            priceOptionList: ArrayList,
        });
    };
};

export let setCommodityPriceMainPic = function (pictureurl) {
    return dispatch => {
        dispatch({
            type: types.SET_MAIN_PIC,
            pictureurl: pictureurl,
        });
    };
};

export let setCommodityPicList = function (ob) {
    return dispatch => {
        dispatch({
            type: types.SET_PIC_LIST,
            picturenum1: ob[0],
            picturenum2: ob[1],
            picturenum3: ob[2],
            picturenum4: ob[3],
            picturenum5: ob[4],
            mainattachid: ob.mainattachid,
        });
    };
};
export let setCommodityPicListNull = function () {
    return dispatch => {
        dispatch({
            type: types.SET_PIC_LIST,
            picturenum1: null,
            picturenum2: null,
            picturenum3: null,
            picturenum4: null,
            picturenum5: null,
        });
    };
};

export let setGoodsInfo = function (goodsinfo) {
    return dispatch => {
        dispatch({
            type: types.SET_GOODSINFO,
            codigo: goodsinfo.codigo,
            nombre: goodsinfo.nombre,
            oldPrice: goodsinfo.oldPrice,
            price: goodsinfo.price,
            flag: goodsinfo.flag,
            suggestPrice: goodsinfo.suggestPrice,
            suggestLevel: goodsinfo.suggestLevel,
        });
    };
};

export let setTimerAction = function (timer) {
    return dispatch => {
        dispatch({
            type: types.TIMER_SET,
            timer: timer
        });
    };
};

export let clearTimerAction = function () {
    return dispatch => {
        dispatch({
            type: types.TIMER_CLEAR
        });
    };
}


export let setNetInfo = function (connectionInfoHistory) {
    return dispatch => {
        dispatch({
            type: types.SET_NETINFO,
            connectionInfoHistory: connectionInfoHistory
        })
    };
};

export let setAnnouncement = function (string) {
    return dispatch => {
        dispatch({
            type: types.SET_ANNOUNCEMENT,
            announcement: string
        });
    };
};

export let setCommodityClassList = function (commodityClassList) {
    return dispatch => {
        dispatch({
            type: types.SET_COMMODITY_CLASS_LIST,
            commodityClassList: commodityClassList
        });
    };
};

export let setWeightService = function (weightService) {
    return dispatch => {
        dispatch({
            type: types.SET_WEIGHT_SERVICE,
            weightService: weightService
        });
    };
};

export let getSession = (ob) => {
    if (ob !== null)
        return {
            type: types.AUTH_ACCESS__ACK,
            ventasId: ob.ventasId,
            auth: true,
            validate: true,
            username: ob.username,
            maxOrderNum: ob.maxOrderNum,
            commodityOrderNum: ob.commodityOrderNum,
            priceOptionList: ob.priceOptionList,
        };
    else
        return {
            type: types.AUTH_ACCESS__ACK,
            auth: false
        }
};

export let storeSearchType = (searchType) => {
    return {
        type: types.SET_SEARCHTYPE,
        searchType: searchType
    };
};

export let changeRoute = (navigator) => {
    if (navigator !== undefined && navigator !== null) {

        return {
            type: types.ROUTE_CHANGE,
            navigator: navigator
        };
    }
};

export let setTimer = (timer) => {
    if (timer !== undefined && timer !== null) {

        return {
            type: types.TIMER_SET,
            timer: timer
        };
    }
};

export let selectCarAction = function (car) {
    return {
        type: types.SELECT_CUSTOMER_CAR,
        car: car
    }
};
