
import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from 'react-native-grid-view';
import { connect } from 'react-redux';
import {setSpText,scaleSize} from '../../utils/ScreenUtil'
var {height, width} = Dimensions.get('window');
import {_name} from '../../../Language/IndexLanguage';


class CodeNumModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    getCommodityBySearchEngine(descripcion,start){
        if(this.props.getCommodityBySearchEngine!==undefined&&this.props.getCommodityBySearchEngine!==null)
        {
            this.props.getCommodityBySearchEngine(descripcion,start);
        }
    }

    onCodigoSelect(code){
        if(this.props.onCodigoSelect!==undefined&&this.props.onCodigoSelect!==null)
        {
            this.props.onCodigoSelect(code);
        }
    }


    renderRow(rowData){

        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        //TODO:close this modal
                        this.close();
                        this.onCodigoSelect(rowData.value);
                    }.bind(this)}>
                    <View style={{flex:1,flexDirection:'row',padding:13,borderBottomWidth:1,borderColor:'#ddd',justifyContent:'flex-start'}}>
                        <Text style={{fontSize:setSpText(34),color:'#323232'}}>{rowData.codigo}-{rowData.label}</Text>
                    </View>
                </TouchableOpacity>

            </View>;

        return row;
    }


    constructor(props)
    {
        super(props);
        const {codeNumlist}=this.props;
        this.state={
            codeNumlist:this.props.codeNumlist,
            start:this.props.start,
            descripcion:this.props.descripcion,
            max:this.props.max,
        }
    }

    render(){

        var listView=null;
        const {codeNumlist}=this.props;
        if(codeNumlist!==undefined&&codeNumlist!==null&&Object.prototype.toString.call(codeNumlist)=='[object Array]')
        {

            var data=codeNumlist;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}
                        onEndReachedThreshold={800}
                        onEndReached={() => this._endReached()}
                    />;
        }else{
            this.getCommodityBySearchEngine(this.state.descripcion,this.state.start)
        }


        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>

                {/*header*/}
                <View style={[{backgroundColor:'#11c1f3',padding:4,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1,paddingLeft:10}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:setSpText(34),flex:3,textAlign:'center',color:'#fff'}}>

                    </Text>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>

                {/*条型码-描述列表*/}
                <View style={{padding:10}}>
                    {listView}
                    <View style={{height:50,width:width}}>
                    </View>
                </View>


            </View>
        );
    }

    _endReached() {
        // if (this.state.codeNumlist.length !== 0) {
        //     this.state.start += this.state.max;
        //     this.getCommodityBySearchEngine(this.state.descripcion,this.state.start);
        // }
    }

}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff'
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems:'flex-start'
    },
    item: {
        backgroundColor: '#fff',
        borderRadius:4,
        margin: 3,
        width: 100,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
        marginRight:10
    },
    selectedItem:{
        backgroundColor: '#63c2e3',
        borderRadius:4,
        margin: 3,
        width: 100,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
        marginRight:10
    },
    listView: {
        paddingTop: 20,
        backgroundColor: 'transparent',
    },
    thumb: {
        width: 30,
        height: 30,
    }
});


module.exports = CodeNumModal;
