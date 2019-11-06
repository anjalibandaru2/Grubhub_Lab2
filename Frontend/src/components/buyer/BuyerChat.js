import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, isFieldEmpty} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";
import {getOwnerList} from '../../js/actions/chatAction.js';
import { connect } from 'react-redux';

const settings = require("../../config/settings.js");

class BuyerChatInner extends Component{
    componentDidMount = async()=>{
        debugger;
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        }
        let postURL = "http://"+settings.hostname+":"+settings.port+"/getOwnerList";
        let dataObj = {
            url :postURL,
            data : data
        };
        this.props.getOwnerList(dataObj);
    }
    displayownerList(){
        let ownerList = this.props.ownerList;
        let owners = [];
        for(let i=0; i< ownerList.length; i++){
            owners.push(<option name="" value= {ownerList[i]._id} > {ownerList[i].owner_restName} </option>);
        }
        return owners;
    }
    render(){
        return(
            <div>
                <BuyerNavbar/>
                <Container>
                    <form>
                        <div className ="form-group">
                            <label className = "control-label">Owner</label>
                            <select name="owner_id" className = "form-control">
                                {this.displayownerList()}
                            </select>
                        </div>
                        <div className ="form-group">
                            <input type="text" name="message" className="form-control" placeholder="Message"/>
                        </div>
                        <div className ="form-group">
                            <button type="submit" className="btn btn-success">Submit</button>
                        </div>
                    </form>
                </Container>
            </div>
            
        );
       
       
    }
}
const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        ownerList : state.chatReducer.ownerList
    }
}
const mapDispatchToProps = function(dispatch){
    return {
        getOwnerList : (dataObj) => dispatch(getOwnerList(dataObj))
    }
}
export const BuyerChat = connect(mapStateToProps, mapDispatchToProps)(BuyerChatInner);
export default BuyerChat;