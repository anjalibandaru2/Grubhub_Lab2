import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import {signupOwner} from '../js/actions/signupAction';
import {isFieldEmpty} from "./genericapis";


export class SignupOwner extends Component{
   /* state = {
        submitHandler : "",
        displayMessage : ""
    }*/
    constructor(props){
        super(props);
       // this.state.displayMessage = "";
        this.submitHandler = this.submitHandler.bind(this);
    }
    //backend="http://54.147.235.117:3001/signupowner";
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
    async submitHandler(evt){
        evt.preventDefault();
        console.log(evt.target);
        var formData = new FormData(evt.target);
        let data = { "name": formData.get('name'), "email": formData.get('email'), "password": formData.get('password'), "restName" : formData.get('restName'), "restZipcode" : formData.get('restZipCode')};
        this.props.signupOwner(data);
    }
    render(){
        return(
            <div>
            <div id="grubhubFixedTop" className="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6}  className="card signupsignin-card">
                        <h5 id="SignInText">Signup Owner</h5>    
                            <hr/>
                        <form onSubmit={this.submitHandler} name="signupOwner">
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" required name="name" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" required name="email" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Password</label>
                                <input type="password" required name="password" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant name</label>
                                <input type="text" required name="restName" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant zipcode</label>
                                <input type="number" required name="restZipCode" className="form-control"/>
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
        signupOwner : (formData) => dispatch(signupOwner(formData))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignupOwner);

//export default SignupOwner;