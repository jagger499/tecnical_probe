import React, { Component } from "react";
import axios from 'axios';

import { TopAppBar, TopAppBarRow, TopAppBarSection, TopAppBarTitle,  TopAppBarFixedAdjust} from "@rmwc/top-app-bar";
import { TextField } from '@rmwc/textfield';
import { Card } from "@rmwc/card";
import { Button } from "@rmwc/button";
import { Typography } from "@rmwc/typography";
import { SimpleDataTable } from "@rmwc/data-table";

//adding some styles
const inputStyle = {
  width : "90%",
  margin : "9px 5px"
};
const TypographyStyle = {
  margin : "5px 0 10px 5px",
  padding : "5px"
}

const cardStyle = { 
  width: "300px", 
  padding: "10px", 
  margin: "20px" ,
  marginTop: "22px",
};

const buttonStyle = {
  width: "100px",
  padding: "5px",
  margin: "20px 20px 10px 5px"
}

let tasks = [];

class App extends Component {

    constructor(){
      super();
      this.state = {
        title : "",
        type  : "",
        description : "",
        tasks: [],
        _id: ""
      };
      this.addTask = this.addTask.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleDeleteTask = this.handleDeleteTask.bind(this);
      this.handleUpdateTask = this.handleUpdateTask.bind(this);
    }

    addTask(e){
      e.preventDefault();
      if(this.state._id) {
        fetch(`/api/tasks/${this.state._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: this.state.title,
            type: this.state.type,
            description: this.state.description
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            this.setState({_id: '', type: '',title: '', description: ''});
            this.fetchTasks();
          });
      } else {
        axios.post('/api/tasks', this.state, {headers:{}})
        .then(function (response) {
          console.log(response);
        })
        .then(()=>{
          this.setState({
            title : "",
            type  : "",
            description : ""
          });
          this.fetchTasks();
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }

    handleChange(e){
      const { name, value} = e.target;
      this.setState({
        [name] : value 
      })
    }

    handleDeleteTask(id){
      axios.delete(`/api/tasks/${id}`, {headers:{}})
      .then(function(response){
        console.log(response);
      })
      .then(()=> {
        this.fetchTasks();
      })
      .catch(function(error){
        console.log(error);
      })
    }

    handleUpdateTask(id){
        fetch(`/api/tasks/${id}`)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            this.setState({
              title: data.title,
              type: data.type,
              description: data.description,
              _id: data._id
            });
          });
    }

    componentDidMount() {
      this.fetchTasks();
    }
  
    fetchTasks() {
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          this.setState({tasks: data});
          console.log(this.state.tasks);
        });
    }

    render (){
        return (
            <div>
              <TopAppBar>
                <TopAppBarRow>
                  <TopAppBarSection>
                    <TopAppBarTitle>Personal kanban</TopAppBarTitle>
                  </TopAppBarSection>
                </TopAppBarRow>
              </TopAppBar>
              <TopAppBarFixedAdjust/>
              <div className="appContainer">
              <Card className="card" outlined={true} style={cardStyle}>
                <Typography use="headline5" style={TypographyStyle}>Add task</Typography>
                <form onSubmit={this.addTask} className="form-card">
                  <TextField className="text-field" label="title..."       value={this.state.title}       onChange={this.handleChange} style={inputStyle} name="title"/>
                  <TextField className="text-field" label="type..."        value={this.state.type}        onChange={this.handleChange} style={inputStyle} name="type"/>
                  <TextField className="text-field" label="description..." value={this.state.description} onChange={this.handleChange} style={inputStyle} name="description"/>
                  <Button type="submit" label="Submit" style={buttonStyle} raised/>
                </form>
              </Card>
                <div style={{marginTop: "20px"}}>
                <Typography use="headline5" style={TypographyStyle}>Backlog</Typography>
                <table className="mdc-data-table__table">
                  <thead className="rmwc-data-table__head">
                    <tr className="rmwc-data-table__row mdc-data-table__header-row">
                      <th className="rmwc-data-table__cell mdc-data-table__header-cell" scope="col" role="columnheader">
                          title
                      </th>
                      <th className="rmwc-data-table__cell mdc-data-table__header-cell" scope="col" role="columnheader">
                          type
                      </th>
                      <th className="rmwc-data-table__cell mdc-data-table__header-cell" scope="col" role="columnheader">
                          description
                      </th>
                      <th className="rmwc-data-table__cell mdc-data-table__header-cell" scope="col" role="columnheader">
                          Edit
                      </th>
                    </tr>  
                  </thead>
                  <tbody className="mdc-data-table__content">
                      {
                        this.state.tasks.map(row => {
                          return(
                            <tr key={row._id} className="rmwc-data-table__row mdc-data-table__row">
                              <td className="mdc-data-table__cell rmwc-data-table__cell">
                                {row.title}
                              </td>
                              <td className="mdc-data-table__cell rmwc-data-table__cell">
                                {row.type}
                              </td>
                              <td className="mdc-data-table__cell rmwc-data-table__cell">
                                {row.description}
                              </td>
                              <td>
                                <Button label="Delete" onClick={() => this.handleDeleteTask(row._id)} style={{margin:"5px"}}danger raised />
                                <Button label="Update" onClick={() => this.handleUpdateTask(row._id)} style={{margin:"5px"}}outlined />
                              </td>
                            </tr>
                          )
                        })
                      }
                  </tbody>
                </table> 
                </div> 
              <div style={{ width : "100%" , display : "flex"}}>
              <Card className="card" outlined={true} style={cardStyle}>
                  <Typography use="headline5">TO DO</Typography>
                  {
                    this.state.tasks.filter(item => {
                      return item.type == "TO DO"
                    }).map(item => {
                      return(
                        <Card style={{ padding: "20px" }}>
                          <Typography use="body1">{item.title}</Typography>
                          <Typography use="caption">{item.type}</Typography>
                          <Typography use="caption">{item.description}</Typography>
                        </Card>  
                      )
                    })
                  }
              </Card>
              <Card className="card" outlined={true} style={cardStyle}>
                  <Typography use="headline5">IN PROGRESS</Typography>
                  {
                    this.state.tasks.filter(item => {
                      return item.type == "IN PROGRESS"
                    }).map(item => {
                      return(
                        <Card style={{ padding: "20px" }}>
                          <Typography use="body1">{item.title}</Typography>
                          <Typography use="caption">{item.type}</Typography>
                          <Typography use="caption">{item.description}</Typography>
                        </Card>  
                      )
                    })
                  }
              </Card>
              <Card className="card" outlined={true} style={cardStyle}>
                  <Typography use="headline5">IN REVIEW</Typography>
                  {
                    this.state.tasks.filter(item => {
                      return item.type == "IN REVIEW"
                    }).map(item => {
                      return(
                        <Card style={{ padding: "20px" }}>
                          <Typography use="body1">{item.title}</Typography>
                          <Typography use="caption">{item.type}</Typography>
                          <Typography use="caption">{item.description}</Typography>
                        </Card>  
                      )
                    })
                  }
              </Card> 
              <Card className="card" outlined={true} style={cardStyle}>
                  <Typography use="headline5">DONE</Typography>
                  {
                    this.state.tasks.filter(item => {
                      return item.type == "DONE"
                    }).map(item => {
                      return(
                        <Card style={{ padding: "20px" }}>
                          <Typography use="body1">{item.title}</Typography>
                          <Typography use="caption">{item.type}</Typography>
                          <Typography use="caption">{item.description}</Typography>
                        </Card>  
                      )
                    })
                  }
              </Card> 
              </div> 
            </div>
          </div>
        )
    }
}

export default App;