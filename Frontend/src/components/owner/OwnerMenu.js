import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import './OwnerCss.css';
import axios from 'axios';
import ModalDialog from "../ModalDialog.js";
import OwnerNavbar from "./OwnerNavbar";
import {getOwnerID, isFieldEmpty, CheckValidOwner} from "../genericapis.js";
import { connect } from 'react-redux';
import {addSectionToMenu, getAllMenuItems, addItemToSection, deleteSection} from '../../js/actions/ownerMenuAction';
const settings = require("../../config/settings.js");
class AddSectionTemplate extends Component{
    state={
        section_type : ""
    }
    constructor(props){
        super(props);
        this.state.section_type = "";
        this.changeHandler = this.changeHandler.bind(this);
        this.addSection = this.addSection.bind(this);
    }
    changeHandler(evt){
        let value = evt.target.value;
        this.state.section_type = value;
    }
    addSection = (evt)=>{
        evt.preventDefault();
        let data = {
            owner_id : getOwnerID(),
            section_type : this.state.section_type
         };
        this.props.addSectionToMenu(data);
    }
    render(){
        return(
            <form id = "addSection" onSubmit={this.addSection}>
            <Row>
                <Col xs={6}> <input type="text" className="form-control" placeholder="section name" onChange ={this.changeHandler}/>  </Col>
                <Col xs={6}> <button type="submit" className="btn btn-success">Add Section</button> </Col>
            </Row>
        </form>
        );
       
    }
}
function MenuItem(props){
    return(
        <div  className="media col-xs-6 menuItem">
                <div className="media-body">
                    <h5>{props.item_name}</h5>
                    <h6>Price : {props.item_price}</h6>
                    <p class="itemDescription">{props.item_description}</p>
                </div>
                <div className="media-right">
                <img className="item_image" src={props.item_image}/>
                </div>
          </div>
    )
}
class MenuTypeInner extends Component{
    state={
        section_type : "",
        menu_items : "",
        section_id : ""
    }
    constructor(props){
        super(props);
        this.state.section_type = this.props.section_type;
        this.state.menu_items = this.props.menu_items;
        this.state.section_id = this.props.section_id;
        //this.state.menuItemsObj = this.props.menuItemsObj;
    }
    displayMenuItems(){
        var children = [];
        let section_type = this.props.section_type;
        let menu_items = this.props.menu_items;
       // var menu_items =  this.state.menu_items;
        if(!isFieldEmpty(menu_items)){
            menu_items.forEach((item)=>{
                console.log(item);
                let menuElement = <MenuItem key={item.item_id} item_id={item.item_id} item_image={item.item_image} item_name = {item.item_name} item_description={item.item_description} item_price={item.item_price} section_type={section_type}></MenuItem>;
                children.push(menuElement);
            });
            return(
               <Row>{children}</Row> 
            )
        } else {

            return (<div>No menu Items</div>);
        }
        
    }
    deleteSection(section_type){
        let data = {owner_id : getOwnerID(), section_type };
        this.props.deleteSection(data);
    }

    addItem(){

    }

    render(){
        /*<Col xs={2} className="float-right"><button className = "btn btn-success">Add items</button></Col>*/
        var modalId = this.props.section_type + "modal";
        return(
            <Card>
                <Card.Body>
                    <Card.Title><h2 className="menu-title">{this.state.section_type }</h2></Card.Title>
                    {this.displayMenuItems()}
                        
                        <Col xs={2} className="float-right">
                            <ModalDialog id={modalId} btnName="Add items" modalType="add" section_type={this.props.section_type} modalSubmitHandler={this.addItem} addItemToSection = {this.props.addItemToSection}/>
                        </Col>

                        <Col xs={2} className="float-right"><button className = "btn btn-success">Update section</button></Col>
                        <Col xs={2} className="float-right"><button className = "btn btn-success" onClick={()=>{this.deleteSection(this.props.section_type)}}>Delete section</button></Col>
                </Card.Body>
            </Card>
        )
    }
}

class AllMenuItems extends Component{
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(){
        
    }
    render=()=>{
        debugger;
        let menuItemsArr = [];
        let allMenuItems = this.props.allMenuItems;
        for(let index = 0; index < allMenuItems.length; index++){
            let menuItemsObj = allMenuItems[index];
            let {section_type, menu_items} = menuItemsObj;
            menuItemsArr.push(<MenuType key={index} section_type={section_type} menu_items  = {menu_items} ></MenuType>);
            
        }
        return(
            menuItemsArr    
        );
    }
}

class OwnerMenuInner extends Component{
    state={
        isRendered : false
    }
    constructor(props){
        super(props);
        //this.state.allMenuItems = [];
        this.state.isRendered = false;
    }
    componentDidMount(){
        //initialize allmenuitems
        debugger;
        axios.defaults.withCredentials = true;
        //var owner_id = cookie.load("user_id");
        let owner_id = getOwnerID();
        var data = {owner_id};
        this.props.getAllMenuItems(data);
    }

    render(){
        /* <AllMenuItems allMenuItems = {this.state.allMenuItems}/> */
      /*  if(!this.state.isRendered){
            return <div></div>;
        } else{*/
            return(
                <div>
                    <CheckValidOwner/>
                    <OwnerNavbar></OwnerNavbar>
                    <Container>
                        <AddSectionTemplate addSectionToMenu = {this.props.addSectionToMenu}/>
                        <AllMenuItems allMenuItems = {this.props.allMenuItems}/> 
                    </Container>
                </div>
            );
        //}
        
    }
}
const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        responseMessage : state.ownerMenuReducer.responseMessage,
        allMenuItems : state.ownerMenuReducer.allMenuItems
    }
}
//export default SignupBuyer;
const mapDispatchToProps = function(dispatch){
    return {
        addSectionToMenu : (data) => dispatch(addSectionToMenu(data)),
        getAllMenuItems : (data) => dispatch(getAllMenuItems(data)),
        addItemToSection : (data) => dispatch(addItemToSection(data)),
        deleteSection : (data) => dispatch(deleteSection(data))
    }
}
export const OwnerMenu =  connect(mapStateToProps, mapDispatchToProps)(OwnerMenuInner);
const MenuType =  connect(mapStateToProps, mapDispatchToProps)(MenuTypeInner);
export default OwnerMenu;