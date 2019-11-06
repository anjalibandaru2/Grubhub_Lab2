import React,{ Component } from "react";
import {Card, Container, Col,  Row} from 'react-bootstrap';
import axios from 'axios';
import BuyerModal from "./BuyerModal.js";
import {getBuyerID, isFieldEmpty, CheckValidBuyer} from "../genericapis.js";
import $ from 'jquery';
import BuyerNavbar from "./BuyerNavbar.js";
import { connect } from 'react-redux';
import {getRestaurantDetails} from '../../js/actions/restaurantSearchAction.js';
const settings = require("../../config/settings.js");

class RestaurantDetailsInner extends Component {
    state = {
       // "isRendered" : false,
        "currentItem" : {},
        "owner_id" : this.props.match.params.owner_id
    };
    constructor(props){
        super(props);
        //this.state.isRendered = false;
        this.toggleModal = this.toggleModal.bind(this);
    }
     componentDidMount=async ()=>{
        let postURL = "http://"+settings.hostname+":"+settings.port+"/getRestaurantDetails";
        let data = {"owner_id" : this.props.match.params.owner_id};
        let dataObj = {data : data, url : postURL}
        this.props.getRestaurantDetails(dataObj); 
       /* await axios({
            method: 'post',
            url: postURL,
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {"owner_id" : this.props.match.params.owner_id},
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
                this.setState({
                    isRendered : true,
                    restaurantDetails : responseData.message,
                    owner_id : responseData.message._id
                });
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });*/
    }
     toggleModal =  async(item)=>{
        console.log("state set calledd...");
        console.log("before state set..")
        console.log(item);
        await this.setState({
            currentItem : item
        });
        console.log("after set state");
        console.log(this.state.currentItem);
        //$("#addCartModal").modal("toggle");
        window.$('#addCartModal').modal('show')
       // let addCartModal = document.getElementById("addCartModal");
        //addCartModal.modal("toggle");
    }
    displayMenuItems =(sections) =>{
        debugger;
        let renderMenuComponents = (menuList) =>{
            let menuComponents = [];
            for(let index =0; index < menuList.length; index++){
                menuComponents.push(
                    <Row key={index} data-toggle="modal" data-target="#addCartModal" onClick={()=>this.toggleModal(menuList[index])}>
                        <Card className="restaurant_item">
                        <Card.Body>
                            <Card.Title><h5>{menuList[index].item_name}</h5></Card.Title>
                            <img className="item_image" src={menuList[index].item_image}/>
                            {menuList[index].item_description}
                            {menuList[index].item_price}
                        </Card.Body>
                        </Card>
                    </Row>
                );
            }
            return menuComponents;
        }
        let allComponents = [];
        for(let i=0; i < sections.length;i++){
            let section = sections[i];
            let section_type = section["section_type"];
            let menuList = section["menu_items"];
            let menuComponents = renderMenuComponents(menuList); 
            allComponents.push(<div key = {section_type}>{menuComponents} </div>);  
        }
       /*for(let menuType in menuItems){
           let menuList = menuItems[menuType];
           let menuComponents = renderMenuComponents(menuList);
           //allComponents.push(<div key = {menuType}><h5>{menuType}</h5>{menuComponents} </div>);
           allComponents.push(<div key = {menuType}>{menuComponents} </div>);
       }*/
        
        return allComponents;
    }
    

    render(){
        let renderComponent = ()=>{
            debugger;
          //  if(!this.state.isRendered){
              if(isFieldEmpty(this.props.curr_restaurantDetails)){
                return<div></div>;
            } else {
                return (
                    <div>
                        <div className="jumbotron restaurantDetails">
                        </div>
                        <Card>
                        <Card.Body>
                            <Card.Title><h5>{this.props.curr_restaurantDetails.owner_restName}</h5></Card.Title>
                            <p>add image here</p>
                            {this.props.curr_restaurantDetails.owner_restDescription}
                            {this.props.curr_restaurantDetails.owner_restZipcode}
                        </Card.Body>
                        </Card>
                        <Card>
                        <Card.Body>
                            <Card.Title><h5>MENU</h5></Card.Title>
                        </Card.Body>
                        </Card>
                        <Container>
                            <Col xs={5}>
                            {this.displayMenuItems(this.props.curr_restaurantDetails["sections"])}
                            </Col>
                        </Container>
                    </div>
                );
            }
        }
        return (
            <div>
                <CheckValidBuyer/>
                <BuyerNavbar/>
                 {renderComponent()}
                 <BuyerModal item={this.state.currentItem} owner_id={this.state.owner_id}></BuyerModal>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        curr_restaurantDetails : state.restaurantSearchReducer.curr_restaurantDetails,
        curr_owner_id : state.restaurantSearchReducer.curr_owner_id
    }
}
//export default SignupBuyer;
const mapDispatchToProps = function(dispatch){
    return {
        getRestaurantDetails : (dataObj) => dispatch(getRestaurantDetails(dataObj))
    }
}
export const RestaurantDetails =  connect(mapStateToProps, mapDispatchToProps)(RestaurantDetailsInner);
export default RestaurantDetails;