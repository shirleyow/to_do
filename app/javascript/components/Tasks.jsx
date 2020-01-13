import React from "react";
import { Link } from "react-router-dom";
import "../../../node_modules/@fortawesome/fontawesome-free/scss/fontawesome"
import "../../../node_modules/@fortawesome/fontawesome-free/scss/solid"
import "../../../node_modules/@fortawesome/fontawesome-free/scss/regular"

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    };
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
  
  render() {
	const { tasks } = this.state
	//console.log(this.state)
	const allTasks = tasks.map((task, index) => (
		<div key={index} className="col-md-6 col-lg-4">
			<div className = "card-body">
				<h5 className = "card-title"><i className = "far fa-circle"></i>   {task.title}</h5>
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
			<h4>
				No task yet!
			</h4>
      </div>
	)
	
	let today = new Date()
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	
	return (
		<>
		<Link to="/" className="btn custom-button left">
            Back
        </Link>
		<section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">All Tasks</h1>
            <p className="lead text-muted">
			{days[today.getDay()] + ", " + today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear()}
            </p>
		  </div>
		</section>
		<div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/new" className="btn custom-button">
                New Task
              </Link>
            </div>
			<div className="row">
              {tasks.length > 0 ? allTasks : noTask}
            </div>
          </main>
        </div>
      </>
    );
  }
}
export default Tasks;