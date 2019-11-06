import React,{Component} from "react";
import BuyerNavbar from "./BuyerNavbar.js";
import {CheckValidBuyer} from "../genericapis.js";
import {BuyerHomeComponent1} from "./BuyerHomeComponent1.js";
import {BuyerHomeComponent2} from "./BuyerHomeComponent2.js";
import {BuyerSearchResults} from "./BuyerSearchResults.js";
import { connect } from 'react-redux';

export class BuyerHomeInner extends Component{
    state={
        "newsearch" : true,
    }
    constructor(props){
        super(props);
        this.state.newsearch = true;
        this.searchHandler = this.searchHandler.bind(this);
    }
   /* filterByCuisine(){
        let dropdownChangeHandler = (evt)=>{
            let changedValue = evt.target.value;
            let newRestList = this.state.restaurantsList.filter((restaurant)=>{
                if(restaurant.owner_restCusine  === changedValue){
                    return true;
                } else {
                    return false;
                }
            });
            return newRestList;
        };
    }*/
    searchHandler(restaurantsList){
        this.setState({
            restaurantsList,
            newsearch : false
        });
    }
    render(){
        let renderComponent = <BuyerHomeComponent2></BuyerHomeComponent2>
        console.log("new search state value is.."+this.state.newsearch)
       // if(!this.state.newsearch){
           if(this.props.restaurantsList){
            console.log("in if..");
             renderComponent = <BuyerSearchResults restaurantsList = {this.props.restaurantsList}></BuyerSearchResults>
             
        }
        return(
                <div>
                    <CheckValidBuyer/>
                    <BuyerNavbar></BuyerNavbar>
                    <BuyerHomeComponent1 searchHandler={this.searchHandler}></BuyerHomeComponent1>
                    {renderComponent}
                </div>
        )
    }
}
//export default BuyerHomeInner;

const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        restaurantsList : state.restaurantSearchReducer.restaurantsList
    }
}
//export default signIn;
/*const mapDispatchToProps = function(dispatch){
    return {
        signIn : (formData) => dispatch(signIn(formData))
    }
}*/
export const BuyerHome = connect(mapStateToProps, null)(BuyerHomeInner);
export default BuyerHome;
