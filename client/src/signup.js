import React, { Component } from 'react';
import {apiBaseUrl} from "./parameters";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            message: '',
            showProgressBar: false
        }
    }

    sendRequest = () => {
        this.setState({
            showProgressBar: true
        });

        var data = {
            "email": this.state.email,
            "userName": this.state.username,
            "password": this.state.password
        };
        data = JSON.stringify(data);

        fetch(apiBaseUrl+'/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: data
        }).then( (res) => {
            return res.json();
        }).then( (data) => {
            this.setState({
                message: data.message,
                showProgressBar: false
            });
        });
    }

    render() {
        var progressBar;
        if(this.state.showProgressBar)
           progressBar = (<CircularProgress size={50} thickness={7}/>);
        else
            progressBar = null;

        return (
            <div className='Signup'>
                <MuiThemeProvider>
                    <div>
                        <TextField
                            hintText="Enter your UserName"
                            floatingLabelText="UserName"
                            onChange = {(event,newValue) => this.setState({username:newValue})}/>
                        <br/>

                        <TextField
                            hintText="Enter your Email"
                            type="email"
                            floatingLabelText="Email"
                            onChange = {(event,newValue) => this.setState({email:newValue})}/>
                        <br/>

                        <TextField
                            type = "password"
                            hintText="Enter your Password"
                            floatingLabelText="Password"
                            onChange = {(event,newValue) => this.setState({password:newValue})}/>
                        <br/>

                        <div>
                            <RaisedButton
                                className='Button'
                                label="Signup"
                                primary={true}
                                onClick={(event) => this.sendRequest()}/>
                            <RaisedButton
                                className='Button'
                                label="Login"
                                secondary={true}
                                onClick={(event) => this.props.showLoginPage()}/>
                        </div>

                        {progressBar}
                        <p className='errorMessage'>{this.state.message}</p>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Signup;