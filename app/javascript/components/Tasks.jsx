import React from "react";
import { Link } from "react-router-dom";
import "../../../node_modules/@fortawesome/fontawesome-free/scss/fontawesome";
import "../../../node_modules/@fortawesome/fontawesome-free/scss/solid";
import "../../../node_modules/@fortawesome/fontawesome-free/scss/regular";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
	  search: "",
	  searchBy: "Tags"
    };
	
	this.updateSearch = this.updateSearch.bind(this);
  }
  
  componentDidMount() {
	const url = "/api/v1/tasks/index";
	fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Network response was bad :(");
		})
		.then(response => this.setState({ tasks: response }))
		.catch(error => console.log(error));
  }
  
  toggleCheck(id, task) {
	const url = `/api/v1/tasks/update/${id}`;
	const token = document.querySelector('meta[name="csrf-token"]').content
	const bool = task.completed ? false : true;
	const body = { completed: bool }
	
	fetch(url, {
		method: "PUT",
		headers: {
			"X-CSRF-Token": token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		}
		throw new Error("Network response was not ok.");
	})
	.then(() => window.location.replace("/tasks"))
	.catch(error => console.log(error.message));
  }
  
  deleteTask(id) {
	const url = `/api/v1/destroy/${id}`;
	const token = document.querySelector('meta[name="csrf-token"]').content;

	if (window.confirm('Are you sure?')) {
		fetch(url, {
		  method: "DELETE",
		  headers: {
			"X-CSRF-Token": token,
			"Content-Type": "application/json"
		  }
		})
		  .then(response => {
			if (response.ok) {
			  return response.json();
			}
			throw new Error("Network response was not ok.");
		  })
		  .then(() => window.location.replace("/tasks"))
		  .catch(error => console.log(error.message));
	}
  }
  
  updateSearch(event) {
	this.setState({ search: event.target.value });
  }
  
  updateSearchBy(name) {
	this.setState({ searchBy: name });
	const tablink = document.getElementsByClassName("tablinks active");
	tablink[0].className = "tablinks";
	document.getElementById(name).className += " active";
	document.getElementById("search").placeholder = "Search for task(s) by " + name;
	if (name == "Tags") {
	  document.getElementById("search").placeholder += ", separated by commas";
	}
	if (name == "Deadline") {
		document.getElementById("search").type = "date";
	} else {
		document.getElementById("search").type = "text";
	}
  }
  
  includes(list) {
	var check = false;
	const tags = [...new Set(this.state.search.toLowerCase().split(',').map(
				item => item.trim()
			).filter(function(item) {
				return item != "";
			}))]
	for (var y in tags) {
		check = false;
		for (var x in list) {
			if(list[x].indexOf(tags[y]) == 0) {
			  check = true;
			  break;
			}
		}
		if (check == false) return false;
	}
	return true;
  }
  
  includesTD(task) {
	return task.title.toLowerCase().indexOf(this.state.search.toLowerCase())!= -1 || task.description.toLowerCase().indexOf(this.state.search.toLowerCase())!= -1;
  }
   
  render() {
    var uncomp = [];
    if (this.state.searchBy == "Tags") {
      uncomp = this.state.tasks.filter(t => !t.completed && (this.state.search != "" ? this.includes(t.tags.map(v => v.toLowerCase())) : true));
    } else if (this.state.searchBy == "Title/Description") {
	  uncomp = this.state.tasks.filter(t => !t.completed && (this.state.search ? this.includesTD(t) : true))
    } else {
	  uncomp = this.state.tasks.filter(t => !t.completed && (this.state.search ? t.deadline == this.state.search : true));
    }
    const allTasks = uncomp.map((task, index) => (
		<div key={index} className="col-md-6 col-lg-4">
			<div className = "card-body">
				<h5 className = "card-title"><i className = "far fa-circle" id = "checked" onClick = {(e) => this.toggleCheck(task.id, task)}></i>   {task.title}</h5>
				<h6><i className = "fas fa-bars unclicked"></i> {task.description}</h6>
				<h6><i className = "fas fa-calendar-day unclicked"></i> {task.deadline}</h6>
				<h6><i className = "fas fa-tags unclicked"></i> {task.tags.map(
					item => <span className = "tag">{item}</span>
				)}</h6>
			</div>
			<button type="button" id = "trash" className="btn btn-sm btn-danger" onClick={(e) => this.deleteTask(task.id)}>
				<i className ="fas fa-trash-alt"></i>
			</button>
			<Link to = {`/update/${task.id}`} className="btn btn-sm btn-primary">
				<i className ="fas fa-edit"></i>
			</Link>
		</div>
	))
	
	// note that allTasks here refers to all ongoing tasks.
  
  var comp = [];
  if (this.state.searchBy == "Tags") {
    comp = this.state.tasks.filter(t => t.completed && (this.state.search != "" ? this.includes(t.tags.map(v => v.toLowerCase())) : true));
  } else if (this.state.searchBy == "Title/Description") {
	comp = this.state.tasks.filter(t => t.completed && (this.state.search ? this.includesTD(t) : true))
  } else {
	comp = this.state.tasks.filter(t => t.completed && (this.state.search ? t.deadline == this.state.search : true));
  }
  const completedTasks = comp.map((task, index) => (
		<div key={index} className="col-md-6 col-lg-4">
			<div className = "card-body">
				<h5 className = "card-title"><i className = "far fa-circle" id = "checked" onClick = {(e) => this.toggleCheck(task.id, task)}></i>   <span className="striked">{task.title}</span></h5>
				<h6><i className = "fas fa-bars unclicked"></i> {task.description}</h6>
				<h6><i className = "fas fa-calendar-day unclicked"></i> {task.deadline}</h6>
				<h6><i className = "fas fa-tags unclicked"></i> {task.tags.map(
					item => <span className = "tag">{item}</span>
				)}</h6>
			</div>
			<button type="button" id = "trash" className="btn btn-sm btn-danger" onClick={(e) => this.deleteTask(task.id)}>
				<i className ="fas fa-trash-alt"></i>
			</button>
			<Link to = {`/update/${task.id}`} className="btn btn-sm btn-primary">
				<i className ="fas fa-edit"></i>
			</Link>
		</div>
	))
	
	const noTask = (
		<div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
			<h5>
				No task yet!
			</h5>
      </div>
	)
	
	let today = new Date()
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let currentTasksLength = uncomp.length;
	let completedTasksLength = comp.length;
	let tags = [];
	this.state.tasks.map(
		item => {
			tags.concat(item.tags)
		}
	)
	tags = [...new Set(tags)];
	
	return (
		<>
		<Link to="/" className="btn custom-button left">
            Back
        </Link>
		<section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-4">
            <h1 className="display-4">All Tasks</h1>
            <p className="lead text-muted">
			{days[today.getDay()] + ", " + today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear()}
            </p>
		  </div>
		</section>
		<div>
          <main className="container pb-5">
			<div className="text-right mb-2">
			  <Link to="/new" className="btn custom-button">
				New Task
			  </Link>
			</div>
			<div className = "tab">
				<button className="tablinks active" id = "Tags" onClick = {(e) => this.updateSearchBy("Tags")}>
					By Tag(s)
				</button>
				<button className="tablinks" id = "Title/Description" onClick = {(e) => this.updateSearchBy("Title/Description")}>
					By Title/Description
				</button>
				<button className="tablinks" id = "Deadline" onClick = {(e) => this.updateSearchBy("Deadline")}>
					By Deadline
				</button>
			</div>
			<div id = "searchbar" className = "input-group md-form form-sm form-2 pl-0 mb-5">
			  <input onChange = {this.updateSearch} value = {this.state.search} type = "text" className ="form-control" id = "search" placeholder="Search for task(s) by Tags, separated by commas" aria-label="Search for task(s)"></input>
			  <div className="input-group-append">
				<span className="input-group-text" id="basic-text1"><i className="fas fa-search text-grey" aria-hidden="true"></i></span>
			  </div>
			</div>
			
			<div className="current">
			  <h3>{currentTasksLength} Current Task(s):</h3>
				<div className="row">{currentTasksLength > 0 ? allTasks : noTask}</div>
			</div>
			
			<div className="completed">  
			  <h3>{completedTasksLength} Completed Task(s):</h3>
				<div className="row">{completedTasksLength > 0 ? completedTasks : noTask}</div>
            </div>
          </main>
        </div>
      </>
    );
  }
}
export default Tasks;