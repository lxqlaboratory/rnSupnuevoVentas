import * as types from '../action/types';

const initialState = {
    ventasId: null,
    merchantType: null,
    merchantStates: null,
    validate: false,
    auth: false,
    info: null,
    announcement: null,
    maxOrderNum: null,
    commodityOrderNum: null,
    searchType: 1,
    priceOptionList: null,
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case types.AUTH_ACCESS__ACK:
            return Object.assign({}, state, {
                validate: action.validate,
                auth: action.auth,
                ventasId: action.ventasId,
                merchantType: action.merchantType,
                merchantStates: action.merchantStates,
                username: action.username,
                maxOrderNum: action.maxOrderNum,
                commodityOrderNum: action.commodityOrderNum,
            });
            break;
        case types.SET_SEARCHTYPE:
            return Object.assign({}, state, {
                searchType: action.searchType,
            });
            break;
        case types.SET_ANNOUNCEMENT:
            return Object.assign({}, state, {
                announcement: action.announcement,
            });
            break;
        case types.SET_KONGJIANLIST:
            return Object.assign({}, state, {
                priceOptionList: action.priceOptionList,
            });
            break;

        default:
            return state;
    }
}

export default user;
