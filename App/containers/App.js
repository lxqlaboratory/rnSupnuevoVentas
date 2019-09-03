import React from 'react';
import {
    AppState,
    Modal,
    NetInfo,
    View,
    StyleSheet,
    Text,
    TabBarIOS,
    Navigator,
    BackAndroid,
    Platform,
    ToastAndroid
} from 'react-native';
import {_name} from '../../Language/IndexLanguage';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome.js';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabNavigator from 'react-native-tab-navigator';
import Login from '../containers/Login';
import Query from '../containers/Query';
import MainList from '../containers/MainList';


import {setNetInfo} from '../action/actionCreator';

const tabBarTintColor = '#f8f8f8';// 标签栏的背景颜色
const tabTintColor = '#3393F2'; // 被选中图标颜色

class App extends React.Component {

    constructor(props) {
        super(props);
        const {dispatch} = this.props;
        this.state = {
            tab: '改价',
            selectedTab: '改价',
            isConnected: null,
        }
    }


    render() {
        let auth = this.props.auth;
        if (auth === true) {

            var defaultStyle = {
                backgroundColor: '#eeecf3',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60
            };

            var defaultSceneStyle = {};

            return (
                <View style={{flex: 1,}}>
                    <Navigator
                        ref="navigator"
                        initialRoute={{name: MainList, component: MainList}}
                        configureScene={(route) => {
                            return ({
                                ...Navigator.SceneConfigs.PushFromRight,
                                gestures: null
                            });
                        }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            return (<Component {...route.params} navigator={navigator}/>);
                        }}
                    />
                </View>

            );
        }
        else {
            return (<Login/>);
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange.bind(this)
        );
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }

    }

    _handleConnectionInfoChange(connectionInfo) {
        const connectionInfoHistory = this.props.connectionInfoHistory.slice();
        connectionInfoHistory.push(connectionInfo);
        const {dispatch} = this.props;
        dispatch(setNetInfo(connectionInfoHistory));

    }

    componentWillUnmount() {

        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );

        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }

    onBackAndroid = () => {
        if (this.props.auth == true) {


            if (this.refs.navigator.getCurrentRoutes() != undefined) {
                const routers = this.refs.navigator.getCurrentRoutes();
                if (routers.length > 1) {
                    this.refs.navigator.pop();
                    return true;
                }
            }
        }
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show(_name.再按一次退出应用, ToastAndroid.SHORT);
        return true;
    };
}

var styles = StyleSheet.create({
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 60
    },
    text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        textAlign: 'center'
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    }
});


export default connect(
    (state) => ({
        auth: state.user.auth,
        connectionInfoHistory: state.netInfo.connectionInfoHistory,
    })
)(App);