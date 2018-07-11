import React, {Component} from 'react';
import {apiBaseUrl} from './parameters';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import HistoryListItem from './history_list_item';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = {
            email: this.props.userData.email,
            userName: this.props.userData.userName,
            authToken: document.cookie,
            urlList: 'firstTime',
            requestProgress: false
        };

        this.refresh();
    }

    refresh = () => {
        fetch(apiBaseUrl+'/history', {
            method: 'GET',
            headers: {'Authorization':'Bearer '+this.state.authToken}
        }).then( (res)=>{
            return res.json();
        }).then( (data) =>{
            if(data.status === 'success')
                this.setState({
                   urlList: data.urlList
                });
            else if(data.message === 'Authorization failed')
                this.props.logout();
        }).catch( () => {
            this.props.logout();
        });
    }

    saveurl = () => {
        this.setState({requestProgress: true});

        if(this.refs.isPublic.state.switched)
            this.savePublic();
        else
            this.savePrivate();
    }

    savePublic = () => {
        var data = {
            "longURL":this.refs.longURL.getValue(),
            "shortURL":this.refs.shortURL.getValue(),
            "expirationTime":this.refs.expTime.getValue()};
        data = JSON.stringify(data);

        fetch(apiBaseUrl+'/shorten/public', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: data
        }).then( (res) => {
            return res.json();
        }).then( (data) => {
            if(data.status === 'success'){
                this.setState({
                    message: "successfully created short URL: https://url-minify.herokuapp.com/" + data.shortURL + " for long URL: " + data.longURL,
                    requestProgress: false
                });
                this.refresh();
                // var frm = document.getElementsByName('data_entry')[0];
                // frm.reset();  // Reset
            }else{
                this.setState({
                    message: data.message,
                    requestProgress: false
                });
            }
        });
    }

    savePrivate = () => {
        var data = {
            "longURL":this.refs.longURL.getValue(),
            "shortURL":this.refs.shortURL.getValue(),
            "expirationTime":this.refs.expTime.getValue()
        };
        data = JSON.stringify(data);

        fetch(apiBaseUrl+'/shorten/private', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.authToken
            },
            body: data
        }).then( (res) => {
            return res.json();
        }).then( (data) => {
            if(data.status === 'success'){
                this.setState({
                    message: "successfully created short URL: " + data.shortURL + " for long URL: " + data.longURL,
                    requestProgress: false
                });
                this.refresh();
                var frm = document.getElementsByName('data_entry')[0];
               frm.reset();  // Reset
            }else{
                this.setState({
                    message: data.message,
                    requestProgress: false
                });
            }
        });
    }

    render(){
        var list;
        if(this.state.urlList === 'firstTime')
            list = (<CircularProgress size={50} thickness={7}/>);
        else if(this.state.urlList.length === 0)
            list = (<h3>No any URLs to show</h3>);
        else
            list = (
                <div style={{width:'60%'}}>
                    <h3>Your shortened URLs</h3>
                    {
                        this.state.urlList.map( (url,i)=>{
                            return (
                                <HistoryListItem
                                    key={i}
                                    shortURL={url.short_url}
                                    longURL={url.long_url}
                                    refreshDashboard={this.refresh}
                                    editable={true}/>
                            );
                        })
                    }
                </div>
            );

        var requestStatus;
        if(this.state.requestProgress)
            requestStatus = (<CircularProgress size={50} thickness={7}/>);
        else
            requestStatus = (<p className='errorMessage'>{this.state.message}</p>);

        return (
          <div className='Dashboard'>
              <MuiThemeProvider>
                  <div>
                      <h1>Welcome to your dashboard</h1>

                      <div>
                          <form name="data_entry" >
                              <TextField
                                  ref="longURL"
                                  hintText="  Example - https://www.youtube.com/  "
                                  floatingLabelText="Long URL"
                                  style = {{width: 750}}
                              />
                              <br/>
                              <TextField
                                  ref="shortURL"
                                  hintText="(optional)  Example - UTube123"
                                  floatingLabelText="Shorten URL"/>
                              <br/>
                              <TextField
                                  ref="expTime"
                                  hintText="(optional) Example - 1000"
                                  floatingLabelText="expiration time"/>
                              <br/>

                              <center>
                                  <Checkbox
                                      label="Public"
                                      ref="isPublic"
                                      style={{width:0, 'marginTop':10}}/>
                              </center>

                              <RaisedButton
                                  className='Button'
                                  label="Shorten"
                                  primary={true}
                                  onClick={(event) => this.saveurl()}/>
                          </form>
                      </div>

                      {requestStatus}

                      <center>
                          {list}
                      </center>
                  </div>
              </MuiThemeProvider>
          </div>
        );
    }
}

export default Dashboard;