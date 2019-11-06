import React,{Component} from "react";
import {Card, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination'

export class BuyerSearchResults extends Component{
    state ={
        activePageNum : 1,
        itemsPerPage : 2
    }
    restaurant_Item=(restaurant, index)=>{
        let linkUrl = "/restaurant/"+restaurant.owner_id;
        return(
            <Link to={linkUrl} key={index} className="restaurantLink" restaurant={restaurant}>
                 <Card className="restaurant_item">
                 <Card.Body>
                    <Card.Title><h5>{restaurant.owner_restName}</h5></Card.Title>
                    {restaurant.owner_restDescription}
                    {restaurant.owner_restZipcode}
                </Card.Body>
                </Card>
            </Link>
        );
    }
    renderAllRestaurants=()=>{
        debugger;
        let restaurantsList =  this.getCurrentPageItems();
        if(!restaurantsList || restaurantsList.length === 0){
            //return <h6>No items are present with the given item name</h6>
            return <h6></h6>
        } else if(typeof restaurantsList === "string"){
            return <h6>{restaurantsList}</h6>
        } else{
            let restaurantsArr = [];
           
            for(let index = 0; index < restaurantsList.length; index++){
                let markup = this.restaurant_Item(restaurantsList[index], index);
                restaurantsArr.push(markup);
            }
            return (
                <div>
                <div>Restaurant details..</div>
                {restaurantsArr}
           </div>
            );
        }
    }
    /*renderCuisineList = ()=>{
        debugger;
        letfilterByCuisine = (evt) =>{
            
        }
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
    }*/
    setCurrPageNum = (pageNum) => {
        debugger;
        this.setState({
            activePageNum : pageNum
        });
    };
    renderPagination = (restaurantsList) =>{
        debugger;
        
        let itemsPerPage = this.state.itemsPerPage;
        let pageNumbers = [];
       // onClick={()=>{this.setState({activePageNum : index})}}
        if(restaurantsList && restaurantsList != 0){
            let noOfPages = Math.ceil(restaurantsList.length / itemsPerPage);
            for(let index=1; index <= noOfPages; index++){
                pageNumbers.push(
                    <Pagination.Item key={index} active={index === this.state.activePageNum} onClick={()=>{this.setCurrPageNum(index)}}>
                       
                            {index}
                       
                    </Pagination.Item>
                );
            }
        }
        return(
            <div className ="float-right">
                <Pagination>{pageNumbers}</Pagination>
            </div>
            
        );
        
    }

    getCurrentPageItems = () =>{
        debugger;
        let currPageNum = this.state.activePageNum;
        let restaurantsList = this.props.restaurantsList; 
        if(restaurantsList && restaurantsList != 0){
            let itemsPerPage = this.state.itemsPerPage;;
            let indexOfLastItem = currPageNum * itemsPerPage;
            let indexOfFirstItem  = indexOfLastItem - itemsPerPage;
            let currentItems = this.props.restaurantsList.slice(indexOfFirstItem, indexOfLastItem);
            return currentItems;
        } else{
            return "";
        }
    }

    render=()=>{
        return (
            <Container>
                {this.renderAllRestaurants()}
                {this.renderPagination(this.props.restaurantsList)}
            </Container>
        );
    }
}
export default BuyerSearchResults;