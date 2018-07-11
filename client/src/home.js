import React, {Component} from 'react';
import {apiBaseUrl} from './parameters';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import HistoryListItem from './history_list_item';
import CircularProgress from 'material-ui/CircularProgress';

class Home extends Component{

    constructor(props){
        super(props);
        this.state = {
            message: '',
            requestProgress: false,
            urlList: []
        };
        this.refresh();
    }

    refresh = () => {
        fetch(apiBaseUrl+'/display')
            .then( (res) => {
                return res.json();
            })
            .then( (data) => {

                this.setState({
                    urlList : data
                });
            });
    }

    saveurl = () => {
        this.setState({requestProgress: true});

        var data = {"longURL":this.refs.longURL.getValue(), "shortURL":this.refs.shortURL.getValue(), "expirationTime":this.refs.expTime.getValue()};
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
                    message: "successfully created short URL: https://url-minify.herokuapp.com/" +data.shortURL + " for long URL: " + data.longURL,
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
        if(this.state.urlList.length === 0)
            list = (<h3>No URLs to show</h3>);
        else
            list = (
                <div style={{width:'60%'}}>
                    {
                        this.state.urlList.map( (url,i)=>{
                            return (
                                <HistoryListItem
                                    key={i}
                                    shortURL={url._id}
                                    longURL={url.long_url}
                                    expirationTime={url.expiration_time}
                                    editable={false}/>
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
            <div className='Home'>
                <MuiThemeProvider>
                    <div>
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
                                <RaisedButton
                                    className='Button'
                                    label="Shorten"
                                    primary={true}
                                    onClick={(event) => this.saveurl()}/>
                            </form>
                        </div>

                        {requestStatus}

                        <center>
                            <h3>Recently shortened URLs</h3>
                            {list}
                        </center>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

}

export default Home;