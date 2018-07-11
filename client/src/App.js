import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton';
import Login from './login';
import Signup from "./signup";
import Dashboard from "./dashboard";
import Home from "./home";

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            authToken: document.cookie,
            pageTitle: document.cookie ? 'Dashboard' : 'WELCOME',
            userData: {}
        };
    }

    login = (data) => {
        document.cookie = data.authToken;
        this.setState({
            authToken: document.cookie,
            pageTitle: 'Dashboard',
            userData: {
                email: data.email,
                userName: data.userName,
                authToken: document.cookie
            }
        });
    }

    logout = (event) => {
        document.cookie = '';
        this.setState({
            authToken:document.cookie,
            pageTitle: 'WELCOME',
            userData: {}
        });
    }



    showSignupPage = () => {
        document.cookie = '';
        this.setState({
            authToken: '',
            pageTitle: 'Signup',
        });
    }

    showLoginPage = () => {
        document.cookie = '';
        this.setState({
            authToken: '',
            pageTitle: 'Login',
            userData: {}
        });
    }

    render() {
        var content;
        if(this.state.pageTitle === 'Dashboard')
            content = (<Dashboard userData={this.state.userData} logout={this.logout}/>);
        else if(this.state.pageTitle === 'Login')
            content = (<Login login={this.login} showSignupPage={this.showSignupPage}/>);
        else if(this.state.pageTitle === 'Signup')
            content = (<Signup showLoginPage={this.showLoginPage}/>);
        else if(this.state.pageTitle === 'WELCOME')
            content = (<Home />);

        var logoutButton;
        if(this.state.pageTitle === 'Dashboard')
            logoutButton = <FlatButton
                label="Logout"
                onClick={this.logout}/>;
        else if(this.state.pageTitle === 'WELCOME')
            logoutButton = <FlatButton
                label="Login"
                onClick={this.showLoginPage}/>;
        else logoutButton = null;

        return (
            <div className="App">
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title={this.state.pageTitle}
                            className="AppBar"
                            showMenuIconButton={false}
                            zDepth={2}
                            iconElementRight={logoutButton}/>

                        {content}
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}




export default App;
