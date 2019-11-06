import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import {signupBuyer} from '../js/actions/signupAction';
import {isFieldEmpty} from "./genericapis";

const settings = require("../config/settings.js");

class SignupBuyer extends Component{
    constructor(props){
        super(props);
        //this.state.displayMessage = "";
        this.submitHandler = this.submitHandler.bind(this);
    }
    //backend="http://54.147.235.117:3001/signupbuyer";
    async submitHandler(evt){
        debugger;
        evt.preventDefault();
        console.log(evt.target);
        var formData = new FormData(evt.target);
        let data = { "name": formData.get('name'), "email": formData.get('email'), "password": formData.get('password') }
        this.props.signupBuyer(data);
    }
    showDisplayMessage=(message)=>{
        debugger;
        console.log("message is...");
        console.log(message);
        if(!isFieldEmpty(message)){
            return(
                <div className = "form-group">
                        <label>{message} Click <a href="/signin">here</a> to login</label>
                    </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
    render(){
        console.log("in render...display message is..");
        console.log(this.props.responseMessage);
        debugger;
        return(
            <div>
            <div id="grubhubFixedTop" className="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6} className="card signupsignin-card">
                        <h5 id="SignInText">Signup Buyer</h5>    
                            <hr/>
                        <form onSubmit={this.submitHandler} name="signupbuyer">
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" name="name" required className="form-control" placeholder="Enter your Name"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" name="email" required className="form-control" placeholder="Enter your Email"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label"> Password</label>
                                <input type="password" name="password" required className="form-control" placeholder=" Password"/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                            {this.showDisplayMessage(this.props.responseMessage)}
                        </form>
                    </Col>
                </Row>
            </Container>
            </div>
        );
    }
}
//{this.state.displayMessage}
const mapStateToProps = (state, ownProps) => {
    console.log("in map state to props..");
    console.log(state);
    return{
        responseMessage : state.signinSignupReducer.responseMessage
    }
}
//export default SignupBuyer;
const mapDispatchToProps = function(dispatch){
    return {
        signupBuyer : (formData) => dispatch(signupBuyer(formData)),
        signupOwner : (formData) => dispatch(signupBuyer(formData))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignupBuyer);