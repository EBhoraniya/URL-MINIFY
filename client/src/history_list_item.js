import React, {Component} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {apiBaseUrl} from "./parameters";


class HistoryListItem extends Component{

    constructor(props){
        super(props);
        this.state = {
            shortURL: this.props.shortURL,
            longURL: this.props.longURL,
            hovered: false,
            authToken: document.cookie
        };
    }

    mouseOver = (element) => {
        this.setState({
            hovered: true
        });
    }

    mouseLeave = () => {
        this.setState({
            hovered: false
        });
    }

    sendRequest = ()=>{
        var data = {

            "shortURL":this.state.shortURL

        };
        data = JSON.stringify(data);

        fetch(apiBaseUrl+'/private', {
            method: 'DELETE',
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
                    message: "successfully deleted short URL: " + data.shortURL,
                    requestProgress: false
                });
                this.props.refreshDashboard();
            }else{
                this.setState({
                    message: data.message,
                    requestProgress: false
                });
            }
        });
    }

    render(){
        var hiddenContent;
        if(this.state.hovered && this.props.editable)
            hiddenContent = (
              <CardActions>


                  <RaisedButton
                      label='Delete'
                      secondary={true}
                      onClick={(event) => this.sendRequest()}
                  />
              </CardActions>
            );
        else
            hiddenContent = null;

        var  surl= "https://url-minify.herokuapp.com/" + this.state.shortURL;

        return (
            <div className="HistoryListItem" onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}>
                <MuiThemeProvider>
                    <Card>
                        <CardText>
                            <b>Short URL:</b> <a href={surl} target="_blank">{surl}</a>
                            <br/>
                            <b>Long URL:</b> <a href={this.state.longURL} target="_blank">{this.state.longURL}</a>
                        </CardText>
                        {hiddenContent}
                    </Card>
                </MuiThemeProvider>
            </div>
        );
    }

}

export default HistoryListItem;