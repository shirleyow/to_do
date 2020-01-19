import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import $ from 'jquery';
import "../../../node_modules/@fortawesome/fontawesome-free/scss/fontawesome";
import "../../../node_modules/@fortawesome/fontawesome-free/scss/solid";
import "../../../node_modules/@fortawesome/fontawesome-free/scss/regular";
import "../../../node_modules/select2/dist/css/select2.min.css";
import "../../../node_modules/select2/dist/js/select2.min.js";
import "../../../node_modules/daterangepicker/moment.min.js";
import "../../../node_modules/daterangepicker/daterangepicker.js";
import "../../../node_modules/daterangepicker/daterangepicker.css";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      search: "",
      searchBy: "Title/Description",
      searchTags: [],
      searchSDate: null,
      searchEDate: null,
      toggle: false
    };

    this.updateSearch = this.updateSearch.bind(this);
    this.updateSearchTags = this.updateSearchTags.bind(this);
    this.updateToggle = this.updateToggle.bind(this);
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
    $('.js-example-basic-multiple')
      .select2({
        placeholder: "Search for task(s) by Tags"
      });

    $('.js-example-basic-multiple')
      .on('change', () => {
        var data = $('.js-example-basic-multiple').select2('data').map(
          (item) => item.text
        );
        this.setState({ searchTags: data });
      });

    $('#searchDate').daterangepicker({
      autoUpdateInput: false,
      locale: {
        cancelLabel: 'Clear'
      }
    });

    $('#searchDate').on('apply.daterangepicker', (ev, picker) => {
      $('#searchDate').val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      this.setState({ searchSDate: picker.startDate._d });
      this.setState({ searchEDate: picker.endDate._d });
    });

    $('#searchDate').on('cancel.daterangepicker', (ev, picker) => {
      $('#searchDate').val('');
      this.setState({ searchSDate: null });
      this.setState({ searchEDate: null });
    });
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

  updateToggle(event) {
    this.setState({ toggle: !this.state.toggle });
  }

  updateSearch(event) {
    this.setState({ search: event.target.value });
  }

  updateSearchTags(event) {
    this.setState({ searchTags: event.target.value });
  }

  updateOrderBy(name) {
    if (name == "Latest") {
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
      var other = "DeadlineO";
    } else if (name == "DeadlineO") {
      const url = "/api/v1/tasks/index2";
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was bad :(");
        })
        .then(response => this.setState({ tasks: response }))
        .catch(error => console.log(error));
      var other = "Latest";
    }
    document.getElementById(other).className = "btn btn-secondary btn-sm orderBy";
    document.getElementById(name).className += " active";
  }

  updateSearchBy(name) {
    this.setState({ searchBy: name });
    const tablink = document.getElementsByClassName("tablinks active");
    tablink[0].className = "tablinks";
    document.getElementById(name).className += " active";
    if (name == "Tags") {
      document.getElementById("selectTags").style.display = "block";
      document.getElementsByClassName("selection")[0].style.display = "block";
      document.getElementsByClassName("select2")[0].style.display = "block";
      document.getElementById("search").style.display = "none";
      document.getElementById("searchDate").style.display = "none";
      document.getElementsByClassName("select2-search__field")[0].style.width = "auto";
    } else if (name == "Title/Description") {
      document.getElementById("selectTags").style.display = "none";
      document.getElementsByClassName("selection")[0].style.display = "none";
      document.getElementsByClassName("select2")[0].style.display = "none";
      document.getElementById("search").style.display = "block";
      document.getElementById("searchDate").style.display = "none";
    } else {
      document.getElementById("selectTags").style.display = "none";
      document.getElementsByClassName("selection")[0].style.display = "none";
      document.getElementsByClassName("select2")[0].style.display = "none";
      document.getElementById("search").style.display = "none";
      document.getElementById("searchDate").style.display = "block";
    }
  }

  includes(list) {
    var check = false;
    const tags = [...new Set(this.state.searchTags.map(
      item => item.toLowerCase().trim()
    ).filter(function (item) {
      return item != "";
    }))]
    for (var y in tags) {
      check = false;
      for (var x in list) {
        if (list[x] == tags[y]) {
          check = true;
          break;
        }
      }
      if (check == false) return false;
    }
    return true;
  }

  includesTD(task) {
    return task.title.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1 || task.description.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1;
  }

  checkOption(option) {
    var x = document.getElementById("selectTags");
    for (var i = 0; i < x.length; i++) {
      if (x.options[i].value == option) {
        return true;
      }
    }
    return false;
  }

  returnDate(deadline) {
    let short_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let short_days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = new Date(deadline);
    return (short_days[d.getDay()] + ", " + d.getDate() + " " + short_months[d.getMonth()] + " " + d.getFullYear());
  }

  returnTags() {
    var tags = [];
    this.state.tasks.map(
      item => {
        tags = tags.concat(item.tags);
      }
    )
    tags = [...new Set(tags)];
    var x = document.getElementById("selectTags");
    if (x != null && tags.length != x.length) {
      for (var t in tags) {
        if (!this.checkOption(tags[t])) {
          var option = document.createElement("option");
          option.text = tags[t];
          option.value = tags[t];
          x.add(option);
        }
      }
    }
  }

  dueDays(deadline) {
    const oneDay = 24 * 60 * 60 * 1000;
    const theDate = new Date(deadline);
    const today = new Date();
    const num = Math.round((theDate - today) / oneDay);

    if (num < 0) {
      return (
        <small className="overdue"><b>Overdue for {Math.abs(num)} {Math.abs(num) == 1 ? "day" : "days"}</b></small>
      )
    } else if (num == 0) {
      return (
        <small className="today"><b>Due today</b></small>
      )
    } else if (num <= 7) {
      return (
        <small className="due"><b>Due in {num} {num == 1 ? "day" : "days"}</b></small>
      )
    } else {
      return "";
    }
  }

  render() {
    var uncomp = [];
    if (this.state.searchBy == "Tags") {
      uncomp = this.state.tasks.filter(t => !t.completed && t.tags.length != 0 && (this.state.searchTags != [] ? this.includes(t.tags.map(v => v.toLowerCase())) : true));
    } else if (this.state.searchBy == "Title/Description") {
      uncomp = this.state.tasks.filter(t => !t.completed && (this.state.search ? this.includesTD(t) : true))
    } else {
      uncomp = this.state.tasks.filter(t => !t.completed && t.deadline && (this.state.searchSDate ? (this.state.searchSDate <= new Date(t.deadline) && new Date(t.deadline) <= this.state.searchEDate) : true));
    }
    const allTasks = uncomp.map((task, index) => (
      <div key={index} className="col-md-6 col-lg-4">
        <div className="card-body">
          <h5 className="card-title"><i className="far fa-circle" id="checked" onClick={(e) => this.toggleCheck(task.id, task)}></i>   {task.title}</h5>
          <h6 style={task.description ? {} : { display: "none " }}><i className="fas fa-bars unclicked"></i> {task.description}</h6>
          <h6 style={task.deadline ? {} : { display: "none " }}><i className="fas fa-calendar-day unclicked"></i> {task.deadline ? this.returnDate(task.deadline) : ""}</h6>
          <h6 style={task.tags.length != 0 ? {} : { display: "none " }}><i className="fas fa-tags unclicked"></i> {task.tags.map(
            item => <span className="tag">{item}</span>
          )}</h6>
          <div>{task.deadline ? this.dueDays(task.deadline) : ""}</div>
        </div>
        <button type="button" id="trash" className="btn btn-sm btn-danger" onClick={(e) => this.deleteTask(task.id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
        <Link to={`/update/${task.id}`} className="btn btn-sm btn-primary">
          <i className="fas fa-edit"></i>
        </Link>
      </div>
    ))

    // note that allTasks here refers to all ongoing tasks.

    var comp = [];
    if (this.state.searchBy == "Tags") {
      comp = this.state.tasks.filter(t => t.completed && t.tags.length != 0 && (this.state.searchTags != [] ? this.includes(t.tags.map(v => v.toLowerCase())) : true));
    } else if (this.state.searchBy == "Title/Description") {
      comp = this.state.tasks.filter(t => t.completed && (this.state.search ? this.includesTD(t) : true))
    } else {
      comp = this.state.tasks.filter(t => t.completed && t.deadline && (this.state.searchSDate ? (this.state.searchSDate <= new Date(t.deadline) && new Date(t.deadline) <= this.state.searchEDate) : true));
    }
    const completedTasks = comp.map((task, index) => (
      <div key={index} className="col-md-6 col-lg-4">
        <div className="card-body">
          <h5 className="card-title"><i className="far fa-circle" id="checked" onClick={(e) => this.toggleCheck(task.id, task)}></i>   <span className="striked">{task.title}</span></h5>
          <h6 id="desc" style={task.description ? {} : { display: "none " }}><i className="fas fa-bars unclicked"></i> {task.description}</h6>
          <h6 id="dl" style={task.deadline ? {} : { display: "none " }}><i className="fas fa-calendar-day unclicked"></i> {task.deadline ? this.returnDate(task.deadline) : ""}</h6>
          <h6 id="tgs" style={task.tags.length != 0 ? {} : { display: "none " }}><i className="fas fa-tags unclicked"></i> {task.tags.map(
            item => <span className="tag">{item}</span>
          )}</h6>
        </div>
        <button type="button" id="trash" className="btn btn-sm btn-danger" onClick={(e) => this.deleteTask(task.id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
        <Link to={`/update/${task.id}`} className="btn btn-sm btn-primary">
          <i className="fas fa-edit"></i>
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
            <div className="tab">
              <button className="tablinks active" id="Title/Description" onClick={(e) => this.updateSearchBy("Title/Description")}>
                By Title/Description
                </button>
              <button className="tablinks" id="Tags" onClick={(e) => this.updateSearchBy("Tags")}>
                By Tag(s)
                </button>
              <button className="tablinks" id="Deadline" onClick={(e) => this.updateSearchBy("Deadline")}>
                By Deadline
                </button>
            </div>
            <div id="searchbar" className="input-group md-form form-sm form-2 pl-0">
              <select id="selectTags" className="js-example-basic-multiple" name="searchTags" value={this.state.searchTags} onChange={this.updateSearchTags} multiple="multiple" style={{ width: "96%", display: "none" }}>
                {this.returnTags()}
              </select>
              <input onChange={this.updateSearch} value={this.state.search} type="text" className="form-control" id="search" placeholder="Search for task(s) by Title/Description" aria-label="Search for task(s)"></input>
              <input type="text" name="searchDate" id="searchDate" style={{ width: "96%", display: "none" }} placeholder="Search for task(s) by Deadline" aria-label="Search for task(s)"></input>
              <div className="input-group-append">
                <span className="input-group-text" id="basic-text1"><i className="fas fa-search text-grey" aria-hidden="true"></i></span>
              </div>
            </div>
            <div className="orderTabs mb-5 pt-4">
              <b>Sort by: </b>
              <button className="btn btn-sm btn-secondary orderBy active" id="Latest" onClick={(e) => this.updateOrderBy("Latest")}>
                Latest
              </button>
              <button className="btn btn-sm btn-secondary orderBy" id="DeadlineO" onClick={(e) => this.updateOrderBy("DeadlineO")}>
                Deadline
              </button>
              <label className="switch" style = {{ float: "right" }}>
                <input type="checkbox" value = {this.state.toggle} onChange = {this.updateToggle}>
                </input>
                <span className="slider round"></span>
              </label>
              <label style = {{ float: "right", paddingRight: "10px" }}>{this.state.toggle ? "Completed " : "Ongoing "}</label>
            </div>

            {this.state.toggle ? (
              <div className="completed">
              <h3>{completedTasksLength} Completed Task(s):</h3>
              <div className="row">{completedTasksLength > 0 ? completedTasks : noTask}</div>
            </div>
            ) : (
              <div className="current">
              <h3>{currentTasksLength} Current Task(s):</h3>
              <div className="row">{currentTasksLength > 0 ? allTasks : noTask}</div>
            </div>
            )}
          </main>
        </div>
      </>
    );
  }
}
export default Tasks;
