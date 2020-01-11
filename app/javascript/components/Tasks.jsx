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
  
  render() {
	const { tasks } = this.state
	const allTasks = tasks.map((task, index) => (
		<div key={index} className="col-md-6 col-lg-4">
			<div className = "card-body">
				<h5 className = "card-title"><i className = "far fa-circle"></i>   {task.title}</h5>
				<h6><i className = "fas fa-bars unclicked"></i> {task.description}</h6>
				<h6><i className = "fas fa-calendar-day unclicked"></i> {task.deadline}</h6>
				<h6><i className = "fas fa-tags unclicked"></i> {task.tags}</h6>
			</div>
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
	
	return (
		<>
		<Link to="/" className="btn custom-button left">
            Back
        </Link>
		<section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">All Tasks</h1>
            <p className="lead text-muted">
			{today.toString()}
            </p>
		  </div>
		</section>
		<div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/task" className="btn custom-button">
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