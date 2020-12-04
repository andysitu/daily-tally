'use strict';

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

class Number_Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      // disabled: false,
    };
    this.timer = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.value != this.state.value) {
      // taskrow, taskid, index, new_value 
      this.checkInputTime(Object.assign({}, prevProps, {value: this.state.value}));
    }
  }

  enable = (data) => {
    // this.setState({disabled: false});
  }

  checkInputTime = (dataObj) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({disabled: true});
      this.props.interact_cell(dataObj, this.enable);
    }, 1000);
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  clickHandler(e) {
    e.target.select();
  }

  render() {
    return (
      <input 
        className="form-control count-inputs"
        // disabled={this.state.disabled}
        type="number"
        taskid={this.props.taskid}
        taskrow={this.props.taskrow}
        day={this.props.index + 1} 
        key={this.props.taskid+"-"+this.props.index} 
        onChange={this.onChange}
        onClick={this.clickHandler}
        value={this.state.value}
      ></input>);
  }
}

class TimeCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: Math.floor(this.props.data/60),
      minutes: this.props.data % 60,
    }
  }

  clickHandler = () => {
    if (this.props.interact_cell) {
      this.props.interact_cell({
        hours: this.state.hours,
        minutes: this.state.minutes,
        taskrow: this.props.taskrow,
        taskid: this.props.taskid,
        index: this.props.index,
      });
    } else {
      return;
    }
  }

  render() {
    var hours = Math.floor(this.props.data/60),
        minutes = this.props.data % 60;

    return (<td className="task-cell"
      onClick={this.clickHandler}
    >
      <div className="time-minute-cell">h: {hours}</div>
      <div className="time-hour-cell">m: {minutes}</div>
    </td>);
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

  click_cell = (e) => {
    this.props.interact_cell({
      taskrow: e.target.getAttribute("taskrow"),
      taskid: e.target.getAttribute("taskid"),
      index: parseInt(e.target.getAttribute("day"))-1,
    });
  }

  createCell = (task) => {
    var count = 0;
    if (task.type == "basic") {
      return task.data.map((data, index) => {
        var classname;
        if (data == 1) {
          classname = "task-cell basic-cell-on";
          count++;
        } else {
          classname = "task-cell basic-cell-off";
        }
        return (<td 
            className={classname} 
            taskid={task.id} 
            taskrow={this.props.taskrow} 
            day={index+1} 
            key={task.id+"-"+index} 
            onClick={this.click_cell}></td>);
        }).concat(
          [<td 
            className="task-cell-total" 
            key={"final-"+this.props.task.id}>{count}</td>]);
    } else if (task.type == "amount" || task.type == "countint") {
      var formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
      });
      var task_data = (task.type == "amount") ? task.fdata : task.ldata;
      return task_data.map((data, index) => {
        count += data;
        return (<td
            className="task-cell"
            key={task.id+"-td-"+index}
            >
              <Number_Input
                taskid={task.id}
                taskrow={this.props.taskrow}
                index={index}
                interact_cell={this.props.interact_cell}
                value={data}></Number_Input></td>);
        }).concat(
          [<td className="task-cell-total" 
          key={"final-"+task.id}>{formatter.format(count).replace(/\D00(?=\D*$)/, '')}</td>]);
    } else if (task.type == "time") {
      return task.ldata.map((data, index) => {
        count += data;
        return <TimeCell 
          data={data} key={task.id+"-"+index}
          taskid={task.id}
          taskrow={this.props.taskrow}
          index={index}
          interact_cell={this.props.interact_cell}
        ></TimeCell>
      }).concat(
        [<TimeCell
          data={count}
          key={"final-"+task.id}
        ></TimeCell>]
      );
    }
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
              <a className="dropdown-item">Type: {this.props.task.type}</a>
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
        
        {
          this.createCell(this.props.task)
        }
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

  // Called from Edit Modal Menu
  editTask = (taskid, new_taskname) => {
    const xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener('load', function(e){
      const data = JSON.parse(this.responseText);

      for(var i=0;i<that.state.tasks.length;i++) {
        if (that.state.tasks[i].id == taskid) {
          that.state.tasks[i].name = new_taskname;
          break;
        }
      }
      that.setState(that.state);
      $("#taskModal").modal('hide');
    });

    const t = this.getTaskObj(taskid);

    xhr.open('PATCH', '/tasks/' + taskid);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
      type: t.type,
      name: new_taskname,
      taskid: taskid,
    }));
  }

  getTasks = () => {
    var that = this;
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function(e){
        var tasks = JSON.parse(this.responseText);
        // sort by name for now
        tasks.sort((a, b) => {
          var aname = a.name.toLowerCase(),
              bname = b.name.toLowerCase();
          if (aname < bname) {
            return -1;
          } else if (aname > bname) {
            return 1;
          } else {
            return 0;
          }
        });
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

    var deleleted_task = that.state.tasks[taskrow];
    xhr.open('DELETE', `/tasks/delete/${taskid}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
      taskid: taskid,
      type: deleleted_task.type,
    }));
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

  interact_cell = (dataObj, doneHandler) => {
    const taskrow = dataObj.taskrow;

    const task = this.state.tasks[taskrow],
          type = task.type;

    const xhr = new XMLHttpRequest();
    const that = this;

    var sendData = {
      monthIndex: dataObj.index,
      taskId: dataObj.taskid,
      type: task.type,
      month: this.state.month,
      year: this.state.year,
    }

    if (type == "basic") {
      xhr.addEventListener('load', function(e){
        const data = JSON.parse(this.responseText);
        // Edit manually and then save to setstate - there maybe a better option
  
        that.setState(prevState => {
          var tasks = prevState.tasks.slice();
          tasks[taskrow] = data;

          return {tasks};
        });
      });
    } else if (type == "amount" || type == "countint") {
      if (type == "amount")
        sendData.fvalue = dataObj.value;
      else
        sendData.lvalue = parseInt(dataObj.value);

      xhr.addEventListener('load', function(e){
        const data = JSON.parse(this.responseText);
        console.log(data);

        that.setState(prevState => {
          var tasks = prevState.tasks.slice();
          tasks[taskrow] = data;

          return {tasks};
        });
        if (doneHandler) {
          doneHandler(data);
        }
      });
    } else if (type == "time") {
      this.showTimeMenu(dataObj);
      return;
    }

    xhr.open('PATCH', '/tasks/month');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(sendData));
  }

  updateData =(in_data) => {
    var taskObj = this.getTaskObj(in_data.taskid);

    var sendData = JSON.stringify({
      monthIndex: in_data.index,
      taskId: in_data.taskid,
      type: taskObj.type,
      month: this.state.month,
      year: this.state.year,
      lvalue: parseInt(in_data.hours) * 60 + parseInt(in_data.minutes),
    });
    
    const xhr = new XMLHttpRequest();
    const that = this;
    xhr.addEventListener('load', function(e){
      const data = JSON.parse(this.responseText);

      that.setState(prevState => {
        var tasks = prevState.tasks.slice();
        tasks[in_data.taskrow] = data;

        return {tasks};
      });
      
      $("#taskModal").modal('hide');
    });

    xhr.open('PATCH', '/tasks/month')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(sendData);
  }

  getTaskObj = (taskid) => {
    for(var i=0;i<this.state.tasks.length;i++) {
      if (this.state.tasks[i].id == taskid) {
        return this.state.tasks[i];
      }
    }
    return null;
  }

  showEditTaskMenu = (taskid) => {
    var t = this.getTaskObj(taskid);

    this.taskmenu.current.showEditMenu(taskid, t.name);
    $("#taskModal").modal('show');
  }

  showCreateTaskMenu = () => {
    this.taskmenu.current.switchType("create");
    $("#taskModal").modal('show');
  }
  showTimeMenu = (data) => {
    var task = this.getTaskObj(data.taskid);
    data.name = task.name;
    this.taskmenu.current.showTimeMenu(data, this.updateData);
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
              <th>T</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map((task, index) => {
              return <TaskRow 
                  key={index} 
                  taskrow={index} 
                  task={task}
                  interact_cell={this.interact_cell}
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
  taskcharts.load("taskChart");
  ReactDOM.render(<ChartMenu />, document.getElementById("charts-menu-container"));    
  ReactDOM.render(<TaskTable />, document.getElementById("content-container"));    
}

loadReact();