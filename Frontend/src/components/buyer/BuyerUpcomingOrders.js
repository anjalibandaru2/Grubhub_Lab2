import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, CheckValidBuyer} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";
import BuyerMessages from "./BuyerMessages.js";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import {getOrderList, setCurrentOrder} from '../../js/actions/orderAction.js';
import { connect } from 'react-redux';

const settings = require("../../config/settings.js");

export class BuyerUpcomingOrdersInner extends Component {
    state={
       
        upcomingOrders : []
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.state.upcomingOrders = [];
    }
    componentDidMount = async()=>{
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        };
        let postURL = "http://"+settings.hostname+":"+settings.port+"/buyerUpcomingOrders";
        let dataObj = {
            data : data,
            url : postURL
        }
        this.props.getOrderList(dataObj);
       
    }
    renderUpcomingOrders=()=>{
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
                itermsArr
            );
        }
        let renderEachOrder = (order,index)=>{
            return (
                    <Draggable>
                        <Card key={index}>
                        <Card.Body>
                            <Card.Title><h2>{order.owner_restName}</h2></Card.Title>
                        <h6>Order status : {order.orderStatus}</h6>
                        <Row>
                                <Col xs={3}>Item name</Col>
                                <Col xs={3}>Quantity</Col>
                                <Col xs={3}>Price</Col>
                            </Row>
                        {renderItemsInOrder(order.orderItems)}
                        <h6>Total price : {order.totalPrice}</h6>
                       
                        <div className="float-right"><button className="btn btn-success" onClick = {()=>{this.props.setCurrentOrder({order_id :order._id}) }}>Chat</button></div>

                        </Card.Body>
                    </Card>
                    </Draggable>
            );
        }
        let ordersList =[];
        for(let index = 0; index < this.props.upcomingOrders.length; index++){
            let order = this.props.upcomingOrders[index];
            ordersList.push(renderEachOrder(order, index));
        }
       return  (<div>{ordersList}</div>)
    }

    render(){
      
       // if(this.state.isRendered){
            if(typeof this.props.upcomingOrders === "undefined" || this.props.upcomingOrders.length == 0){
               // return (<div>No upcoming orders</div>)
                return(<div>
                    <CheckValidBuyer/>
                    <BuyerNavbar/>
                    <h6>No upcoming orders </h6>
                </div>)
            } else {
                console.log(this.props.upcomingOrders);
                return(
                    <div>
                        <CheckValidBuyer/>
                         <BuyerNavbar/>
                         <div>
                             <Row>
                                <Col xs = {6}>
                                    <Card><h3>YOUR ORDERS</h3></Card>
                                    {this.renderUpcomingOrders()}
                                </Col>
                                <Col xs={6}>
                                   
                                    <BuyerMessages/>
                                </Col>
                             </Row> 
                        </div>
                    </div>
                );
            }
        //}   
    }
}
//export default BuyerUpcomingOrders;
const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        upcomingOrders : state.orderReducer.orderList
    }
}
const mapDispatchToProps = function(dispatch){
    return {
        getOrderList : (dataObj) => dispatch(getOrderList(dataObj)),
        setCurrentOrder : (dataObj) => dispatch(setCurrentOrder(dataObj))
    }
}
export const BuyerUpcomingOrders = connect(mapStateToProps, mapDispatchToProps)(BuyerUpcomingOrdersInner);
export default BuyerUpcomingOrders;