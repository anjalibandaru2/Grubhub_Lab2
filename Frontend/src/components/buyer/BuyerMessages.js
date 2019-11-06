import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, CheckValidBuyer} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import {sendOrderMessage} from '../../js/actions/orderAction.js';
import { connect } from 'react-redux';

const settings = require("../../config/settings.js");
class BuyerMessagesInner extends Component{
    displayMessages = () =>{
        debugger;
        let orderDetails;
        this.props.orderList.filter((order)=>{
                if(order._id == this.props.currentOrder){
                    orderDetails = order;
                    return order;
                }
            });
        let messagesList = orderDetails.messages;
        let messageMarkup = [];
        if(messagesList){
            for(let i=0; i < messagesList.length; i++){
                let curr_message = messagesList[i];
                if(curr_message.sentBy == "buyer"){
                    messageMarkup.push(<Row><Col className="offset-lg-8 list-group-item list-group-item-primary">{curr_message.message}</Col></Row>);
                } else {
                    messageMarkup.push(<Row><Col xs={6} className = "list-group-item list-group-item-primary">{curr_message.message}</Col></Row>);
                }
            }
            messageMarkup = <div>{messageMarkup}</div>
        } else{
            messageMarkup = <div></div>
        }
        return messageMarkup;
    }
    sendOrderMessage = (evt) =>{
        evt.preventDefault();
        console.log(evt.target);
        var formData = new FormData(evt.target);
        let data = { "order_message": formData.get('message'), "order_id" : this.props.currentOrder, "sentBy": "buyer" }
        let url =  "http://"+settings.hostname+":"+settings.port+"/sendOrderMessage";
        let dataObj = {
            data : data,
            url : url
        };
        this.props.sendOrderMessage(dataObj);
        //Also add this is current list of messages
    }
    render(){
        if(this.props.currentOrder){
            return(
                <div>
                    <Row> <h5>Messages</h5></Row>
                    {this.displayMessages()}
                    <Row>
                    <form onSubmit={this.sendOrderMessage}>
                        <div className = "form-group">
                            <input type="text" name="message" className="form-control" placeholder = "Enter a message"/>
                        </div>
                        <div className = "form-group">
                           <button type="submit" className="form-control btn btn-success">Send</button>
                        </div>
                        
                    </form>
                    </Row>
                   
                </div>
            );
        } else {
            return <div></div>;
        }
        
    }
}
const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        currentOrder : state.orderReducer.currentOrder,
        orderList : state.orderReducer.orderList
    }
}
const mapDispatchToProps = function(dispatch){
    return {
        sendOrderMessage : (dataObj) => dispatch(sendOrderMessage(dataObj))
    };
}
export const BuyerMessages = connect(mapStateToProps, mapDispatchToProps)(BuyerMessagesInner);
export default BuyerMessages;