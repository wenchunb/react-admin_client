import axios from 'axios'
import {message} from 'antd'
export default function ajax(url,data={},type='GET'){
    // 返回自定义的Promise；先通过axios发送请求，再通过then，和catch拿到请求成功和失败的数据
    // 成功时通过Promise的resolve把数据传出去，用await ajax() 发送请求时可以获得请求成功的值
    // 失败时发送请求失败消息，
    return new Promise((resolve,reject) =>{
        let promise
        if(type === 'GET'){
            promise = axios.get(url,{
                params:data
            })
        }else{
            promise = axios.post(url,data)
        }
        promise.then(respone =>{
            resolve(respone.data)
        }).catch(err =>{
            message.error('登录失败'+err)
        })
    })

}