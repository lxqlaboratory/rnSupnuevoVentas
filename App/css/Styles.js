let Dimensions = require('Dimensions');
let {height, width} = Dimensions.get('window');

export let util_style = StyleSheet.create({
    //水平排列格式
    horizontal_style: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput_style: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        marginLeft: 6,
        height: 40,
        alignItems: 'center'
    },
    touchableOpacity_style:{
        marginLeft: 10,
        marginTop: 10,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#CAE1FF'
    }

});