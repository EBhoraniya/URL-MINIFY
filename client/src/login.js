import React, {Component} from 'react';
import {apiBaseUrl} from "./parameters";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';


class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            message: '',
            showProgressBar: false
        };
    }

    sendRequest = () => {
        this.setState({
            showProgressBar: true
        });

        var data = {"email":this.refs.email.getValue(), "password":this.refs.password.getValue()};
        data = JSON.stringify(data);

        fetch(apiBaseUrl+'/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: data
        }).then( (res) => {
            return res.json();
        }).then( (data) => {
            if(data.status === 'success'){
                this.props.login(data);
            }else{
                this.setState({
                    message: data.message,
                    showProgressBar: false
                });
            }
        });
    }

    render(){
        var requestStatus;
        if(this.state.showProgressBar)
            requestStatus = (<CircularProgress size={50} thickness={7}/>);
        else
            requestStatus = (<p className='errorMessage'>{this.state.message}</p>);

        return (
            <div>
                <div className='Login'>
                    <MuiThemeProvider>
                        <div>
                            <TextField
                                ref="email"
                                floatingLabelText="Email"
                                hintText="email address"/>
                            <br/>

                            <TextField
                                ref="password"
                                floatingLabelText="Password"
                                type="password"
                                hintText="your password"/>
                            <br/>

                            <div>
                                <RaisedButton
                                    className='Button'
                                    label="Login"
                                    primary={true}
                                    onClick={(event) => this.sendRequest()}/>
                                <RaisedButton
                                    className='Button'
                                    label="Signup"
                                    secondary={true}
                                    onClick={(event) => this.props.showSignupPage()}/>
                            </div>

                            {requestStatus}

                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }
}

export default Login;