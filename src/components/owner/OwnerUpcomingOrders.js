import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getOwnerID, CheckValidOwner} from "../genericapis.js";
import UpdateOrderModal from "./UpdateOrderModal.js";
import OwnerMessages from "./OwnerMessages.js";
import OwnerNavbar from "./OwnerNavbar.js";
import {getOrderList, setCurrentOrder} from '../../js/actions/orderAction.js';
import { connect } from 'react-redux';
const settings = require("../../config/settings.js");

class OwnerUpcomingOrdersInner extends Component {
    state={
        message : "",
        currentOrder : {}
    };
    constructor(props){
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
    }
    componentDidMount = async()=>{
        debugger;
        axios.defaults.withCredentials = true;
        let owner_id = getOwnerID();
        let data ={
            owner_id 
        }
        let postURL = "http://"+settings.hostname+":"+settings.port+"/ownerUpcomingOrders";
        let dataObj = {
            data : data,
            url : postURL
        };
        this.props.getOrderList(dataObj);
        
    }
    toggleModal =  async(order)=>{
        console.log("state set calledd...");
        console.log("before state set..")
        console.log(order);
        await this.setState({
            currentOrder : order
        });
        console.log("after set state");
        console.log(this.state.currentOrder);
        //$("#addCartModal").modal("toggle");
        window.$('#updateStatusModal').modal('show');
       // let addCartModal = document.getElementById("addCartModal");
        //addCartModal.modal("toggle");
    }
    cancelOrder = async(order_id) =>{
         //axios req to server
         let data = {
             "order_id" : order_id, 
             order_status : "cancelled"
         };
         let postURL = "http://"+settings.hostname+":"+settings.port+"/updateOrderStatus";
         await axios({
             method: 'post',
             url: postURL,        
             data,
             config: { headers: { 'Content-Type': 'multipart/form-data' } }
         })
             .then((response) => {
                 if (response.status >= 500) {
                     throw new Error("Bad response from server");
                 }
                 return response.data;
             })
             .then((responseData) => {
                 //swal(responseData.responseMessage + " Try logging in.");
                 //console.log("after response...");
                 console.log(responseData.message);
                 alert(responseData.message);
                 //window.location.reload();
             }).catch(function (err) {
                 console.log(err)
             });
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
                <Card key={index}>
                    <Card.Body>
                        <Card.Title>
                            <h5 >Name : {order.buyer_name}</h5>
                            <h5> Address : {order.orderAddress}</h5>
                        </Card.Title>
                       <h6>Order status : {order.orderStatus}</h6>
                       <Row>
                           <Col> <h6>Total Price : {order.totalPrice}</h6> </Col>
                        </Row>
                       {renderItemsInOrder(order.orderItems)}
                       <Row></Row>
                       <Row>
                           
                            <Col xs={4} ><button className="btn btn-success" onClick={()=>this.toggleModal(order)}>Update Order</button></Col>
                            <Col xs={4}><button className="btn btn-success" onClick={()=>{this.cancelOrder(order._id)}}>Cancel Order</button></Col>
                            <Col xs={4} ><button className="btn btn-success" onClick = {()=>{this.props.setCurrentOrder({order_id :order._id}) }}>Chat</button></Col>
                        </Row>
                    </Card.Body>
                </Card>
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
        
            if( this.props.upcomingOrders.length == 0){
                if(this.state.message){
                    return <div>{this.state.message}</div>
                } else{
                    return <div><OwnerNavbar/>No upcoming orders</div>
                }
            } else {
                console.log(this.props.upcomingOrders);
                return(
                    <div>
                        <OwnerNavbar/>
                        <CheckValidOwner/>
                        <Container>
                            <Row>
                                <Col xs = {6}>
                                    <Card>YOUR UPCOMING ORDERS</Card>
                                    {this.renderUpcomingOrders()}
                                    <UpdateOrderModal order={this.state.currentOrder}></UpdateOrderModal>
                                </Col>
                            
                                <Col xs={6}>
                                        
                                    <OwnerMessages/>
                                </Col>
                            </Row>
                            
                        </Container>
                    </div>
                );
            }   
    }
}
//export default OwnerUpcomingOrders;
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
export const OwnerUpcomingOrders = connect(mapStateToProps, mapDispatchToProps)(OwnerUpcomingOrdersInner);
export default OwnerUpcomingOrders;