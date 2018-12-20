import React,{Component} from 'react';
import {
    View,Text,
} from 'react-native';
var url = 'http://172.16.10.22:9090/api/test/makeSureOrder';
var url1 = 'http://172.16.10.22:9090/api/test/data';
export default class PromiseTestPage extends Component{

    componentDidMount(){

        // this.renderAll.then((value)=> { // 建议大家在浏览器中看看这里的value值
        //     console.log(value); })
        this.renderAll();

    }
    renderAll() {
        let arrs=[url,url1];
        Promise.all(arrs.map(item=>{
         let data= fetch(item);
            return data;
        })).then(resp=>{
         let  ata= []
             resp.map(item=>{
               ata.push(item.json()) ;
            })
            return ata;
        }).then(resp=>resp.map(item=>{
            item.then(res=>{
                console.log(res);
            })
        }))
        // fetch(url).then(res=>{console.log('tt',typeof res,res),res.json()}).then(resp=>{
        //     console.log('test',typeof resp,resp);
        // })

    }

        render(){
            return(
                <View>
                    <Text>fasfdasfasdfasdfasdf</Text>
                </View>
        )

}

}
