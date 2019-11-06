import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, isFieldEmpty} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";
import {getCart} from '../../js/actions/cartAction.js';
import {placeOrder} from '../../js/actions/orderAction.js';
import { connect } from 'react-redux';

const settings = require("../../config/settings.js");

class CartInner extends Component{
    state={
        orderAddress: ""
    };
    constructor(props){
        super(props);
        this.state.orderAddress = "";
        this.changeHandler = this.changeHandler.bind(this);
    }
    componentDidMount = async()=>{
        debugger;
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        }
        let postURL = "http://"+settings.hostname+":"+settings.port+"/getCart";
        let dataObj = {
            url :postURL,
            data : data
        };
        this.props.getCart(dataObj);
    }
    placeOrder = async ()=> {
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data = {
            buyer_id,
            orderAddress : this.state.orderAddress
        };
        let postURL = "http://"+settings.hostname+":"+settings.port+"/placeOrder";
        let dataObj = {
            data :data,
            url :postURL
        };
        this.props.placeOrder(dataObj);
    }

    renderCartItems=()=>{
        let renderListItem = function(item,index){
            return (
                <Row key={index} className="cartItem">
                    <Col xs={3}>{item.item_name}</Col>
                    <Col xs={3}>{item.item_quantity}</Col>
                    <Col xs={3}>{item.item_calculatedPrice}</Col>
                </Row>
            );
        }
        let itemsList =[];
        for(let index = 0; index < this.props.cartItems.length; index++){
            let item = this.props.cartItems[index];
            itemsList.push(renderListItem(item, index));
        }
       return (
       <div>
            <Row>
                <Col xs={3}>Item name</Col>
                <Col xs={3}>Quantity</Col>
                <Col xs={3}>Price</Col>
            </Row>
        {itemsList}
        <Row>Total Price : {this.props.totalPrice}</Row>
       </div>
       );
    }
    changeHandler = function(evt){
        let target = evt.target;
        let address = target.value;
        this.setState({
            orderAddress : address
        });
    }
    render(){
            if( isFieldEmpty(this.props.cartItems )){
                return (
                    <div>
                        <BuyerNavbar/> 
                        <div>No items in the cart</div>
                    </div>
                );
            } else {
                console.log(this.props.cartItems);
                return(
                    <div>
                        <BuyerNavbar/>
                        <Container>
                            <Card>YOUR ORDER</Card>
                            
                            {this.renderCartItems()}  
                                <Row><Col xs={1}><label>Address:</label></Col> <textarea onChange = {this.changeHandler}></textarea></Row>
                                <br></br>
                            <Row>
                                <button className="btn btn-success" onClick={this.placeOrder}>Place Order</button>
                            </Row>
                            {this.props.responseMessage}
                        </Container>
                    </div>
                );
            }  
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        cartItems : state.cartReducer.cartDetails.orderItems,
        totalPrice : state.cartReducer.cartDetails.totalPrice,
        responseMessage : state.orderReducer.responseMessage
    }
}
const mapDispatchToProps = function(dispatch){
    return {
        getCart : (dataObj) => dispatch(getCart(dataObj)),
        placeOrder : (dataObj) => dispatch(placeOrder(dataObj))
    }
}
export const Cart = connect(mapStateToProps, mapDispatchToProps)(CartInner);
export default Cart;