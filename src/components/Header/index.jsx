import React, { Component } from 'react'
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
import './index.less'
import {reqWeather} from '../../api'
import weatherImg from '../../config/weatherImgConfig'
import {formatTime} from '../../utils/formatTimeUtils'
import memory from '../../utils/memoryUtils'
import storage from '../../utils/storageUtils'
import menu from '../../config/menuConfig'
import ButtonLink from '../ButtonLink/index'
class Header extends Component {
    state ={
        weatherImg:'',
        weather:'',
        currentTime:formatTime(Date.now())
    }
    // 退出登录
    quit = (e)=>{
        e.preventDefault()

        Modal.confirm({
            title: '确定要退出登录吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk:() => {
                // 删除本地和内存用户信息
                memory.user = {}
                storage.removeUserStore()
                // 跳转回登录界面
                this.props.history.replace('/login')
            },
          });
    }
    //获取天气数据
    getWeather = async(province,city,county) =>{
        const weather = await reqWeather(province,city,county)
        const getWeather = weatherImg.find(item=>item.weather === weather)
        this.setState({
            weather,
            weatherImg:getWeather.weatherImg
        })
    }
    // 实时时间
    getCurrentTime = () =>{
       this.timer = setInterval(()=>{
            const currentTime = formatTime(Date.now())
            this.setState({currentTime})
        },1000)
    }
    // 获取页标题
    getPageTitle = ()=>{
        let title
        const path = this.props.location.pathname
        menu.forEach((item) =>{
            if(item.key === path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0 )
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }
    componentDidMount(){
        this.getWeather('广东','梅州','梅江区')
        this.getCurrentTime()
        
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    render() {
        // 天气
        const {weather,weatherImg,currentTime} = this.state
        // 用户名
        const userName = memory.user.username
        // 标题
        const title = this.getPageTitle()
        return (
            <div className="header">
               <div className="header_top">
                   <span>欢迎，{userName}</span>
                   <ButtonLink onClick={this.quit}>退出</ButtonLink>
               </div>
               <div className="header_bottom">
                   <div className="header_bottom_left">
                       {title}
                   </div>
                   <div className="header_bottom_right">
                       <span>{currentTime}</span>
                       <img src={weatherImg} alt="weather" />
                       <span>{weather}</span>
                   </div>
               </div>
            </div>
        )
    }
}

export default withRouter(Header)