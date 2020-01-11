import React from "react";
import { Link } from "react-router-dom";

class NewTask extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: "",
			description: "",
			deadline: null,
			tags: [],
			completed: false
		}
		
		this.tagsOnChange = this.tagsOnChange.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.stripHtmlEntities = this.stripHtmlEntities.bind(this)
	}
	
	stripHtmlEntities(str) {
		return String(str)
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
	}
	
	onChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}
	
	tagsOnChange(event) {
		let the_tags = event.target.value.split(',').map(item => item.trim())
		this.state['tags'] = the_tags
		this.setState({ ['tags']: the_tags })
	}
	
	onSubmit(event) {
		event.preventDefault()
		const url = "/api/v1/tasks/create"
		const { title, deadline, tags, completed, description } = this.state
		
		if (title.length == 0) 
			return
		
		const body = { 
			title,
			deadline,
			tags,
			completed,
			description: description.replace(/\n/g, "<br> <br>")
		}
		
		
		const token = document.querySelector('meta[name="csrf-token"]').content
		fetch(url, {
			method: "POST",
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
			throw new Error("Network response was bad :(")
		})
		.then(response => this.props.history.push(`/tasks`))
		.catch(error => console.log(error.message));
	}
	
	render() {
		return (
			<div className = "container">
				<h1 className = "font-weight-normal mb-5 header1">
					New Task
				</h1>
				<form onSubmit = {this.onSubmit}>
					<div className = "form-group">
						<label htmlFor = "taskTitle">Task title</label>
						<input
							type = "text"
							name = "title" 
							id = "taskTitle"
							className = "form-control"
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
							onChange = {this.tagsOnChange}
						/>
						<small id = "tagsHelp" className = "form-text text-muted">
							Separate each tag with a comma.
						</small>
					</div>
					<button type="submit" className="btn custom-button mt-3">
                Create Task
              </button>
              <Link to="/tasks" className="btn btn-link mt-3">
                Back to Tasks
              </Link>
            </form>
          </div>
		);
	}
}

export default NewTask