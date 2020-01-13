import React from "react";
import { Link } from "react-router-dom"; 

class EditTask extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			title: "",
			description: "",
			deadline: null,
			tags: []
		}
		
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
    }
	
	onChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	onSubmit(event) {
		event.preventDefault();
		const url = `/api/v1/tasks/update/${this.props.match.params.id}`;
		if (this.state['tags'].length != 0) {
			this.state['tags'] = "a" + this.state['tags'] + ", hello" // for the tags to be read correctly a character is added at the front and another tag is added at the back.
			this.state['tags'] = this.state['tags'].split(',').map(
				item => item.trim()
			).filter(function(item) {
				return item != "";
			}).join()
		} 
		const { title, deadline, tags, description } = this.state
		
		if (title.length == 0) 
			return
		
		const body = { 
			title,
			deadline,
			tags,
			description: description.replace(/\n/g, "<br> <br>")
		}
		
		const token = document.querySelector('meta[name="csrf-token"]').content
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
		.then(response => this.props.history.push(`/tasks`))
		.catch(error => console.log(error.message));
	}
		
	componentDidMount() {
		const url = `/api/v1/tasks/index`;
		
		fetch(url)
			.then(response => {
				if(response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => { response.map(
				item => {
					if (item.id == this.props.match.params.id) {
						this.setState({ 
							title: item.title,
							deadline: item.deadline,
							description: item.description,
							tags: item.tags
						});
					} // can be more efficient
			})})
			.catch(() => this.props.history.push("/tasks"));
	}
	
	render() {
		return (
			<div className = "container">
				<h1 className = "font-weight-normal mb-5 header1">
					Edit Task
				</h1>
				<form onSubmit = {this.onSubmit}>
					<div className = "form-group">
						<label htmlFor = "taskTitle">Task title</label>
						<input
							type = "text"
							name = "title" 
							id = "taskTitle"
							className = "form-control"
							value = { this.state.title }
							required
							onChange = {this.onChange}
						/>
					</div>
					<div className = "form-group">
						<label htmlFor = "taskDescription">Description</label>
						<textarea
							name = "description"
							id = "taskDescription"
							className = "form-control"
							placeholder = "Optional"
							rows = "3"
							value = { this.state.description }
							onChange = {this.onChange}
						/>
					</div>
					<div className = "form-group">
						<label htmlFor = "taskDeadline">Deadline</label>
						<input
							type = "date"
							name = "deadline"
							id = "taskDeadline"
							className = "form-control"
							placeholder = "Optional"
							value = { this.state.deadline ? this.state.deadline : "" }
							onChange = {this.onChange}
						/>
					</div>
					<div className = "form-group">
						<label htmlFor = "taskTags">Tag(s)</label>
						<input
							type = "text"
							name = "tags"
							id = "taskTags"
							className = "form-control"
							placeholder = "Optional"
							value = { this.state.tags.toString() }
							onChange = {this.onChange}
						/>
						<small id = "tagsHelp" className = "form-text text-muted">
							Separate each tag with a comma.
						</small>
					</div>
					<button type="submit" className="btn custom-button mt-3">
                Save Task
              </button>
              <Link to="/tasks" className="btn btn-link mt-3">
                Back to Tasks
              </Link>
            </form>
          </div>
		);
	}
}

export default EditTask;
