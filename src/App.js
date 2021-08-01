import React,{Component} from 'react'
// import { Button } from 'antd'
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'
export default class APP extends Component{
    render(){
        return (
            <BrowserRouter >
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={Admin}/>
                    <Redirect to="/login"/>
                </Switch>
            </BrowserRouter>
        )
    }
}