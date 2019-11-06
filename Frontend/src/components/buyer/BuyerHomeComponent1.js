import React,{ Component } from "react";
import {isFieldEmpty, getBuyerID} from "../genericapis.js";
import {Jumbotron, Container, Image, InputGroup, FormControl, Button, Row, Col} from 'react-bootstrap'
import "./buyerHome.css";
import { connect } from 'react-redux';
import axios from 'axios';
import {findRestaurants} from '../../js/actions/restaurantSearchAction';
const settings = require("../../config/settings.js");

class BuyerHomeComponent1Inner extends Component {
    state={
        itemOrCuisine : "",
        cuisineList : "",
        isCuisineFilterPresent : false,
    }
    constructor(props){
        super(props);
        this.itemOrCuisine = "";
        this.state.cuisineList = "";
        this.changeHandler = this.changeHandler.bind(this);
        this.filterRestaurants = this.filterRestaurants.bind(this);
    }
    changeHandler(evt){
        let itemOrCuisine = evt.target.value;
        this.setState({
            itemOrCuisine : itemOrCuisine
        });
    }
    componentDidMount(){
        this.getCuisineList();
    }
    async filterRestaurants(){
        debugger;
       // var itemOrCuisine =  this.state.itemOrCuisine;
        let postURL = "http://"+settings.hostname+":"+settings.port+"/findRestaurants";
        let data = {"itemName" : this.state.itemOrCuisine, url : postURL};

        this.props.findRestaurants(data);
        
    }
    getCuisineList= async()=>{
        debugger;
        var itemOrCuisine =  this.state.itemOrCuisine;
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let postURL = "http://"+settings.hostname+":"+settings.port+"/getCuisineList";
        await axios({
            method: 'post',
            url: postURL,
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {buyer_id : buyer_id},
            config: { headers: { 'Content-Type': 'application/json' } }
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
                //console.log(cookie.load('cookie1'));
                if(responseData.status){
                   this.setState({
                        cuisineList : responseData.message
                   });
                } else{
                    alert(responseData.message);
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
    /*renderCuisineList = ()=>{
        debugger;
        if(isFieldEmpty(this.state.cuisineList)){
            return <div></div>;
        } else{
            let cuisineList = this.state.cuisineList;
            let allCuisineArr = [];
            for(let i=0; i<cuisineList.length; i++){
                let cuisine = cuisineList[i]["owner_restCuisine"];
                allCuisineArr.push(<option key={i} onChange={filterByCuisine}>{cuisine}</option>);
            }
            return (
                <div>
                    <select>
                    {allCuisineArr}
                    </select>
                </div>
            );
        }
    }
    <Row>
                    <Col xs={6}>
                        <h5>Filter by cuisine</h5>
                        {this.renderCuisineList()}
                    </Col>
                </Row>*/
    render(){
        let filterByCuisine = (selectedCuisine) =>{
            let restaurantsList = this.props.restaurantsList;
            if(restaurantsList && restaurantsList.length > 0){
                let restaurantsListNew = restaurantsList.filter((restaurant)=>{
                    if(restaurant.owner_restCuisine === selectedCuisine) {
                        return true
                     } else {
                        return false;
                    }
                });
                this.props.searchHandler(restaurantsListNew);
            }
           
        }
        let changeHandler = (evt) =>{
            debugger;
            console.log(evt.target);
            let cuisineVal = evt.target.value;
            filterByCuisine(cuisineVal);
        }
        let showDropdown = () =>{
            if(this.state.isCuisineFilterPresent){
                let cuisineList = this.state.cuisineList;
                let allCuisineArr = [];
                for(let i=0; i<cuisineList.length; i++){
                    let cuisine = cuisineList[i]["owner_restCuisine"];
                    allCuisineArr.push(<option key={i} value = {cuisine} >{cuisine}</option>);
                }
                return(
                    <Row>
                         <Col>
                            <h5>Filter by cuisine</h5>
                        </Col>
                        <Col>
                            <select name="cuisine" onChange={changeHandler}>
                            {allCuisineArr}
                            </select>
                        </Col>
                    </Row>
                )
            }
        }

        return(
            <div className="jumbotron buyerHomeComponent1">
            <Container>
                <Row>
                    <Col xs={6}>
                    <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <i id="search_restaurant" className="fas fa-search"></i>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter food, cuisine"
                            onChange={this.changeHandler}
                            name="itemOrCuisine"
                        />
                    </InputGroup>
                    </Col>
                    <Col xs={2}>
                    <Button variant="primary" onClick={this.filterRestaurants}>Find food</Button>
                    </Col>
                </Row>
                
                    {showDropdown()}
               
            </Container>
        </div>
        );
    }

}


const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        restaurantsList : state.restaurantSearchReducer.restaurantsList
    }
}
//export default signIn;
const mapDispatchToProps = function(dispatch){
    return {
        findRestaurants : (formData) => dispatch(findRestaurants(formData))
    }
}
export const BuyerHomeComponent1 = connect(mapStateToProps, mapDispatchToProps)(BuyerHomeComponent1Inner);
export default BuyerHomeComponent1;
