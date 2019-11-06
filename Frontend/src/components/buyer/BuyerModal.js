import React,{Component} from "react";
import {Card, Container, Col,  Row} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, getUserName} from "../genericapis.js";
import {addItemToCart} from '../../js/actions/cartAction.js';
import { connect } from 'react-redux';
const settings = require("../../config/settings.js");

class BuyerModalInner extends Component{
    state={
        item_quantity : 1,
        item_name :"",
        item_description :"",
        item_price : "",
        item_id : "",
        calculatedPrice : "",
        owner_id : ""
    }
    constructor(props){
        super(props);
        console.log("in constructor of buyermodal");
        console.log(this.props);
        this.state.item_name = this.props.item.item_name;
        this.state.item_description = this.props.item.item_description;
        this.state.item_price = this.props.item.item_price;
        this.state.item_id = this.props.item.item_id;
        this.state.owner_id = this.props.owner_id;
        this.incrementQuantity = this.incrementQuantity.bind(this);
        this.decrementQuantity = this.decrementQuantity.bind(this);
        this.addItemToCart = this.addItemToCart.bind(this);
        this.calculatedPrice =  this.state.item_price;
         //  {this.state.item_name,this.state.item_description, this.state.item_price, this.state.item_id} = this.props;
    }
    static getDerivedStateFromProps(props, state) {
        console.log("in getDerivedStateFromProps" );
        console.log(state);
        console.log(props);
        if (props.item !== state.item) {
          return {
           ...state,
            item_name : props.item.item_name,
            item_description : props.item.item_description,
            item_price : props.item.item_price,
            item_id : props.item.item_id
          };
        }
        // Return null to indicate no change to state.
        return null;
      }
     /* componentWillReceiveProps(newProps){
          console.log("in componentWillReceiveProps" );
          console.log(newProps);
          this.setState({item : newProps.item});
      }*/
      incrementQuantity=()=>{
          debugger;
        console.log("increment called..");
        let newQuantity  = this.state.item_quantity + 1;
        let calculatedPrice = newQuantity * this.state.item_price;
        this.setState({
            item_quantity : newQuantity,
            calculatedPrice : calculatedPrice
        });
    }
    decrementQuantity=()=>{
        debugger;
        if(this.state.item_quantity ==1){
            return;
        }
        let newQuantity  = this.state.item_quantity - 1;
        let calculatedPrice = newQuantity * this.state.item_price;
        this.setState({
            item_quantity : newQuantity,
            calculatedPrice : calculatedPrice
        })
    }
    renderQuantityComponent=()=>{
        return(
           <div> 
               <button onClick={this.decrementQuantity}>-</button>
               <span id="quantityValue">{this.state.item_quantity}</span>
               <button onClick={this.incrementQuantity}>+</button></div>
        )
    }
    addItemToCart=async ()=>{
        //axios req to server
        let buyer_id = getBuyerID();
        let buyer_name = getUserName();
        let postURL = "http://"+settings.hostname+":"+settings.port+"/addToCart";
        let dataObj = {
            data : {"owner_id" : this.state.owner_id, item_name: this.state.item_name, buyer_id ,buyer_name, item_calculatedPrice : this.state.calculatedPrice, item_quantity : this.state.item_quantity},
            url : postURL
        }
        this.props.addItemToCart(dataObj);
      
        window.$('#addCartModal').modal('hide');
    }
    render=()=>{
        var modalId = "addCartModal";
       // var btnTarget = "#" + modalId;
        return(
            <div>
            <div className="modal" id={modalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <div className="jumbotron buyerHomeComponent1 modal-header-element"></div>
                </div>
                <div className="modal-body">
                    <Container>
                        <Row><strong>{this.state.item_name}</strong></Row>
                        <Row><strong>{this.state.item_description}</strong></Row>
                        <Row><strong>{this.state.item_price}$</strong></Row>
                        <Row>Quantity&nbsp;&nbsp;{this.renderQuantityComponent()}</Row>
                    </Container>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick = {this.addItemToCart}>Add to cart</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = function(dispatch){
    return {
        addItemToCart : (dataObj) => dispatch(addItemToCart(dataObj))
    }
}
export const BuyerModal = connect(null, mapDispatchToProps)(BuyerModalInner);
export default BuyerModal;