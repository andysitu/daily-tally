class DateMenu extends React.Component {
  render() {
    return (
      <span>
        <button onClick={this.props.prevMonth} className="btn btn-outline-dark">{"<"}</button>
        <span> Year {this.props.year} Month {this.props.month+1} </span>
        <button onClick={this.props.nextMonth} className="btn btn-outline-dark">{">"}</button>
      </span>
    );
  }
}

class TimeMenu extends React.Component {
  submit = (event) => {
    event.preventDefault();

    var minutes = document.getElementById("minutes-input").value,
        hours = document.getElementById("hours-input").value;
      
    if (!minutes || !hours) {
      alert("Minutes or Hours is empty.");
      return;
    }

    var data = this.props.data;
    data.minutes = minutes;
    data.hours = hours;
    this.props.submitHandler(data);
  }

  render() {
    return (
      <div>
        <div className="modal-body">
          <form onSubmit={this.submit}>
            <div className="form-group">
              <label>Task Name</label>
            </div>
            <div className="form-group">
              <label>Hours</label>
              <input className="form-control" type="number" required
                defaultValue={this.props.hours} id="hours-input"></input>
            </div>
            <div className="form-group">
              <label>Minutes</label>
              <input className="form-control" type="number" required 
                defaultValue={this.props.minutes} id="minutes-input"></input>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" onClick={this.submit} className="btn btn-primary">Save</button>
        </div>
      </div>);
  }
}

class TaskMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu_type: "create",
      task_name: "",
      task_id: "",
    }
  }

  // Will be called outside this class/function
  switchType = (type) =>  {
    if (type == "create" || type ==  "edit" || type == "time") {
      this.setState({menu_type: type});
    }
  }

  // Will be called outside this class/function
  showEditMenu(taskid, taskName) {
    this.state.task_name = taskName;
    this.state.task_id = taskid;
    this.switchType("edit");

    // Manually set it since warnings popped up
    document.getElementById("taskNameInput").value = taskName;
  }

  //data - taskid, hours, minutes
  showTimeMenu = (data, submitHandler) => {
    this.data = data;
    this.state.submitHandler = submitHandler;
    this.switchType("time");
  }

  saveTask = (event) => {
    event.preventDefault();
    this.props.createTask();
  }

  editTask = (event) => {
    event.preventDefault();
    this.props.editTask(
        this.state.task_id, document.getElementById("taskNameInput").value);
  }

  createMenuBody() {
    if (this.state.menu_type == "create")
      return this.createTaskMenu();
    else if (this.state.menu_type == "edit")
      return this.editTaskMenu();
    else if (this.state.menu_type == "time") {
      return (<
        TimeMenu
          hours={this.data.hours}
          minutes={this.data.minutes}
          data={this.data}
          submitHandler={this.state.submitHandler}
      ></TimeMenu>)
    }
  }

  editTaskMenu() {
    return (
      <div>
        <div className="modal-body">
          <form id="taskForm" onSubmit={this.editTask}>
            <div className="form-group">
              <label htmlFor="taskNameInput">Task Name</label>
              <input type="text" className="form-control" name="task_name" id="taskNameInput"></input>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" onClick={this.editTask} className="btn btn-primary">Save</button>
        </div>
      </div>
    );
  }

  createTaskMenu() {
    return (
      <div>
      <div className="modal-body">
        <form id="taskForm" onSubmit={this.saveTask}>
          <div className="form-group">
            <label htmlFor="taskNameInput">Task Name</label>
            <input type="text" className="form-control" name="task_name" id="taskNameInput"></input>
          </div>
          <div className="form-group">
            <label htmlFor="taskTypeSelect">Task Type</label>
            <select className="form-control" name="task_type" id="taskTypeSelect">
              <option value="basic">Basic</option>
              <option value="amount">Add Amount</option>
              <option value="countint">Count Integers</option>
              <option value="time">Record of Time</option>
            </select>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" onClick={this.saveTask} className="btn btn-primary">Save</button>
      </div>
      </div>
    );
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" id="taskModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Title</h5>
              <button type="button" className="close" data-dismiss="modal" arial-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            
            { this.createMenuBody() }
          </div>
        </div>
      </div>
    )
  }
}