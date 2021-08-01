import React, { Component } from 'react'
import {Switch,Redirect,Route} from 'react-router-dom'
import ProductHome from './ProductHome'
import ProductAddUpadte from './ProductAddUpadte'
import ProductDetail from './ProductDetail'
import './Product.less'
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome}/>
                <Route path='/product/addupdate' component={ProductAddUpadte}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}
