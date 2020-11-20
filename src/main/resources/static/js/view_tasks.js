'use strict';

class DateMenu extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.prevMonth} className="btn btn-outline-dark">{"<"}</button>
        <span> Year {this.props.year} Month {this.props.month+1} </span>
        <button onClick={this.props.nextMonth} className="btn btn-outline-dark">{">"}</button>
      </div>
    );
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
    if (type == "create" || type ==  "edit") {
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

class CreateTaskButton extends React.Component {
  showModal = ()=> {
    this.props.showCreateTaskMenu();
  }
  render() { 
    return (
      <button type="button" onClick={this.showModal} className="btn btn-primary" data-toggle="modal">
        Create Task
      </button>
    );
  }
}

class TaskRow extends React.Component {
  constructor(props) {
    super(props);
  }

  delTask = (event) => {
    event.preventDefault();
    this.props.delete_task(event.target.getAttribute("taskid"), event.target.getAttribute("taskrow"));
  }

  editTask = (event) => {
    event.preventDefault();
    this.props.show_edit_menu(event.target.getAttribute("taskid"));
  }

  render () {
    return (
      <tr >
        <td>
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle"
              type="button" data-toggle="dropdown">
                {this.props.task.name}
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" 
                  href={"./tasks/delete/" + this.props.task.id}
                  taskid={this.props.task.id}
                  taskrow={this.props.taskrow}
                  onClick={this.delTask}
              >Delete</a>
              <a className="dropdown-item" 
                  href={"./tasks/edit/" + this.props.task.id}
                  taskid={this.props.task.id}
                  onClick={this.editTask}
              >Edit</a>
            </div>
          </div>
        </td>
        {this.props.task.data.map((data, index) => {
          if (this.props.task.type == "basic") {
            if (data == 1)
              return <td 
                  className="task-cell basic-cell-on" 
                  taskid={this.props.task.id} 
                  taskrow={this.props.taskrow} 
                  day={index+1} 
                  key={this.props.task.id+"-"+index} 
                  onClick={this.props.click_cell}></td>
            else
              return <td className="task-cell basic-cell-off" 
                  taskid={this.props.task.id} 
                  taskrow={this.props.taskrow} 
                  day={index+1} 
                  key={this.props.task.id+"-"+index} 
                  onClick={this.props.click_cell}></td>
          }
          
        })}
      </tr>
    );
  }
}

class TaskTable extends React.Component {
  constructor(props) {
    super(props);
    const d = new Date();
    this.state = {
      tasks: [],
      year: d.getFullYear(),
      month: d.getMonth(),
      numDays: new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(),
    };
    this.getTasks()

    // Will be saved in render() under <TaskMenu ref>
    this.taskmenu = React.createRef();
  }

  nextMonth = () => this.moveMonth(1);
  prevMonth= () => this.moveMonth(-1);

  moveMonth(month_value) {
    var d = new Date(this.state.year, this.state.month + month_value);
    // Preset states so that getTasks can use it since setState takes time to render
    this.state.month = d.getMonth();
    this.state.year = d.getFullYear();
    
    this.setState({
      year: d.getFullYear(),
      month: d.getMonth(),
      numDays: new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(),
    });
    
    this.getTasks(); 
  }

  editTask = (taskid, taskname) => {
    const xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener('load', function(e){
      const data = JSON.parse(this.responseText);

      for(var i=0;i<that.state.tasks.length;i++) {
        if (that.state.tasks[i].id == taskid) {
          that.state.tasks[i].name = taskname;
          break;
        }
      }
      that.setState(that.state);
      $("#taskModal").modal('hide');
    });

    xhr.open('PATCH', '/tasks/' + taskid);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
      name: taskname,
      taskid: taskid,
    }));
  }

  getTasks = () => {
    var that = this;
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function(e){
        var tasks = JSON.parse(this.responseText);
        console.log(tasks);
        that.setState({
          tasks: tasks
        });
      });

      xhr.open('GET', `/tasks?year=${that.state.year}&month=${that.state.month}`);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send();
    });
  }

  deleteTask = (taskid, taskrow) => {
    var that = this;
    var response = confirm("Are you sure you want to delete " +
          that.state.tasks[taskrow].name + "?");
    if (!response)
      return;
    const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function(e){
        that.state.tasks.splice(taskrow, 1);
        that.setState({
          tasks: that.state.tasks,
        })
      });

      xhr.open('GET', `/tasks/delete/${taskid}`);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send();
  }

  createTask = () => {
    const xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener('load', function(e){
      $("#taskModal").modal('hide');
      const data = JSON.parse(this.responseText);

      data.forEach( (value, index) => {
        that.setState({
          tasks: that.state.tasks.concat(data)
        });
      });

      document.getElementById("taskForm").reset();
    });

    xhr.open('POST', '/tasks');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
      name: $("#taskNameInput").val(),
      year: this.state.year,
      month: this.state.month,
      type: $("#taskTypeSelect").val(),
    }));
  }

  click_cell= (e, ...t) => {
    const task = this.state.tasks[e.target.getAttribute("taskrow")];
    const type = task.type,
          day = e.target.getAttribute("day"),
          taskid = e.target.getAttribute("taskid"),
          taskrow = e.target.getAttribute("taskrow");

    if (type == "basic") {
      var sendData = {
        monthIndex: day-1,
        taskId: taskid,
        taskType: type,
        month: this.state.month,
        year: this.state.year,
      }
      
    }
    const xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener('load', function(e){
      const data = JSON.parse(this.responseText);
      // Edit manually and then save to setstate - there maybe a better option
      that.state.tasks[taskrow] = data;

      that.setState({tasks: that.state.tasks});
    });

    xhr.open('PATCH', '/tasks/month');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(sendData));
  }

  showEditTaskMenu = (taskid) => {
    var t = "unknown";
    for(var i=0;i<this.state.tasks.length;i++) {
      if (this.state.tasks[i].id == taskid) {
        t = this.state.tasks[i];
        break;
      }
    }
    this.taskmenu.current.showEditMenu(taskid, t.name);
    $("#taskModal").modal('show');
  }

  showCreateTaskMenu = () => {
    this.taskmenu.current.switchType("create");
    $("#taskModal").modal('show');
  }
  
  render() {
    const tasks = this.state.tasks;
    let days = [];
    for (var i=0;i<this.state.numDays;i++){
      days.push(<th key={"dayTH-" + (i+1)}>{i+1}</th>)
    }
    
    return (
      <div>
        <DateMenu 
          year={this.state.year} 
          month={this.state.month} 
          nextMonth={this.nextMonth}
          prevMonth={this.prevMonth}
        />

        <CreateTaskButton showCreateTaskMenu={this.showCreateTaskMenu} />

        <TaskMenu ref={this.taskmenu} 
          editTask={this.editTask}
          createTask={this.createTask} />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              {days}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              return <TaskRow 
                  key={index} 
                  taskrow={index} 
                  task={task} 
                  click_cell={this.click_cell}
                  delete_task={this.deleteTask}
                  show_edit_menu={this.showEditTaskMenu}
              ></TaskRow>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

function loadReact() {
  ReactDOM.render(<TaskTable />, document.getElementById("content-container"));    
}

loadReact();