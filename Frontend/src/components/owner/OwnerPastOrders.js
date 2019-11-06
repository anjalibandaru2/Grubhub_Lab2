import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getOwnerID, CheckValidOwner} from "../genericapis.js";
import OwnerNavbar from "./OwnerNavbar.js";
import {getOrderList, setCurrentOrder} from '../../js/actions/orderAction.js';
import { connect } from 'react-redux';
const settings = require("../../config/settings.js");

export class OwnerPastOrdersInner extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount = async()=>{
     
        axios.defaults.withCredentials = true;
        let owner_id = getOwnerID();
        let data ={
            owner_id 
        };
        let postURL = "http://"+settings.hostname+":"+settings.port+"/ownerPastOrders";
        let dataObj = {
            data : data,
            url : postURL
        };
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
                itermsArr
            );
        }
        let renderEachOrder = function(order,index){
            return (
                <Card key={index}>
                    <Card.Body>
                        <Card.Title><h2>{order.buyer_name}</h2></Card.Title>
                       <h6>Order status : {order.orderStatus}</h6>

                       {renderItemsInOrder(order.orderItems)}
                       <Row><Col><h6>Total Price : {order.totalPrice}</h6></Col></Row>
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
       
            if(typeof this.props.pastOrders === "undefined" || this.props.pastOrders.length == 0){
                return <div><OwnerNavbar/>No past orders</div>
            } else {
                console.log(this.props.pastOrders);
                return(
                    <div>
                        <CheckValidOwner/>
                         <OwnerNavbar/>
                         <Container>
                        <Card>YOUR ORDERS</Card>
                        {this.renderPastOrders()}
                        </Container>
                    </div>
                );
            }
        }   
    
}
//export default OwnerPastOrders;
//export default OwnerPastOrders;
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
export const OwnerPastOrders = connect(mapStateToProps, mapDispatchToProps)(OwnerPastOrdersInner);
export default OwnerPastOrders;