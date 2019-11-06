import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, CheckValidBuyer} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";
import {getOrderList} from '../../js/actions/orderAction.js';
import { connect } from 'react-redux';

const settings = require("../../config/settings.js");

class BuyerPastOrdersInner extends Component {
    state={
        pastOrders : []
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.state.pastOrders = [];
    }
    componentDidMount = async()=>{
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        }
        let postURL = "http://"+settings.hostname+":"+settings.port+"/buyerPastOrders";
        let dataObj = {
            data : data,
            url : postURL
        }
        this.props.getOrderList(dataObj);
    }
    renderPastOrders=()=>{
        debugger;
        let renderItemsInOrder = (items) =>{
            let itermsArr = [];
            
            for(let i=0; i<items.length; i++){
                let item = items[i];
                itermsArr.push(
                    <Row key={i} className="orderItem">
                        <Col xs={3}>{item.item_name}</Col>
                        <Col xs={3}>{item.item_quantity}</Col>
                        <Col xs={3}>{item.item_calculatedPrice}</Col>
                </Row>
                )
            }
            return(
                <div>
                     <Row>
                    <Col xs={3}>Item Name</Col>
                    <Col xs={3}>Quantity</Col>
                    <Col xs={3}>Calculated Price</Col>
                </Row>
                {itermsArr}
                </div>
            );
        }
        let renderEachOrder = function(order,index){
            return (
                <Card key={index}>
                    <Card.Body>
                        <Card.Title><h2>{order.owner_restName}</h2></Card.Title>
                       <Row><h6>Order status : {order.orderStatus}</h6> </Row>
                       {renderItemsInOrder(order.orderItems)}
                       <Row> <h6> Total Price : {order.totalPrice} </h6> </Row>
                    </Card.Body>
                </Card>
            );
        }

        let ordersList =[];
        for(let index = 0; index < this.props.pastOrders.length; index++){
            let order = this.props.pastOrders[index];
            ordersList.push(renderEachOrder(order, index));
        }
       return  (<div>{ordersList}</div>)
    }

    render(){
       /* if(!this.state.isRendered){
            return <div></div>
        }*/
       // if(this.state.isRendered){
            if(!this.props.pastOrders || this.props.pastOrders.length == 0){
                return (
                <div>
                    <CheckValidBuyer/>
                    <BuyerNavbar/>
                    <h6>No past orders </h6>
                </div>)
            } else {
                console.log(this.props.pastOrders);
                return(
                    <div>
                        <CheckValidBuyer/>
                         <BuyerNavbar/>
                         <Container>
                        <Card>YOUR ORDERS</Card>
                        {this.renderPastOrders()}
                        </Container>
                    </div>
                );
            }
        //}   

    }
}

const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        pastOrders : state.orderReducer.orderList
    }
}
const mapDispatchToProps = function(dispatch){
    return {
        getOrderList : (dataObj) => dispatch(getOrderList(dataObj))
    }
}
export const BuyerPastOrders = connect(mapStateToProps, mapDispatchToProps)(BuyerPastOrdersInner);
export default BuyerPastOrders;