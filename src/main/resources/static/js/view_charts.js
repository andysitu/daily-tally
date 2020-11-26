class TaskSelectMenu extends React.Component {
  constructor(props) {
    super(props);
    var d = new Date();
    var end = new Date(d.getFullYear(), d.getMonth()+1, 0);

    this.state = {
      tasks: [],
      graph_type: "graph_over_time",
      start_date: `${d.getFullYear()}-${d.getMonth()+1}-01`,
      end_date: `${d.getFullYear()}-${d.getMonth()+1}-${end.getDate()}`,
    }

    this.get_task_names();
  }
  get_task_names = () => {
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
        that.setState({
          tasks: tasks,
        })

      });

      xhr.open('GET', "/tasks");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send();
    });
  }

  get_task(taskid) {
    for(var i=0;i<this.state.tasks.length;i++) {
      if (this.state.tasks[i].id == taskid) {
        return this.state.tasks[i];
      }
    }
    return null;
  }

  submit_menu = (event) => {
    event.preventDefault();
    
    var formdata = new FormData(document.getElementById("chart-menu-form"));

    var start = formdata.get("start_date").split("-"),
        end =formdata.get("end_date").split("-");

    var data = {
      start_month: parseInt(start[1])-1,
      start_year: parseInt(start[0]),
      end_month: parseInt(end[1])-1,
      end_year: parseInt(end[0]),
      tasks: [],
    };

    var taskids = formdata.getAll("tasks"),
        task;
    for (var i=0; i<taskids.length; i++) {
      task = this.get_task(taskids[i]);
      data.tasks.push(
        [taskids[i], task.type]);
    }
    this.get_task_data(formdata.get("graph_type"), data);
  }

  get_task_data = (graph_type, data) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function(e){
      const taskdata = JSON.parse(this.responseText);
      taskcharts.graph(graph_type, taskdata);
    });

    xhr.open('POST', '/tasks/data')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
  }

  onTypeChanged = (e) => {
    this.setState({
      graph_type: e.currentTarget.value
    });
  }
  onChange_start_date = (event) => {
    this.setState({ start_date: event.target.value });
  }
  onChange_end_date = (event) => {
    this.setState({ end_date: event.target.value });
  }

  render() { 
    return (
      <form id="chart-menu-form" onSubmit={this.submit_menu}>
        <div className="form-group">
          <label htmlFor="tasks-select-menu">Tasks</label>
          <select name="tasks" multiple className="form-control" id="tasks-select-menu" required>
            {this.state.tasks.map((task, index)=> {
              return <option key={task.id} value={task.id}>{task.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start-date-chart-input">Start Date</label>
          <input name="start_date" type="date" value={this.state.start_date}
            onChange={this.onChange_start_date} className="form-control"
            id="start-date-chart-input" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="end-date-char-input">End Date</label>
          <input name="end_date" type="date" value={this.state.end_date}
            onChange={this.onChange_end_date} className="form-control"
            required id="end-date-char-input"></input>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" 
            checked={this.state.graph_type==="graph_over_time"} onChange={this.onTypeChanged}
            name="graph_type" value="graph_over_time" id="task-type-1"></input>
          <label className="form-check-label" htmlFor="task-type-1">Graph Over Time</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" 
            checked={this.state.graph_type==="cumulative_over_time"} onChange={this.onTypeChanged}
            name="graph_type" value="cumulative_over_time" id="task-type-2"></input>
          <label className="form-check-label" htmlFor="task-type-2">Cumulative Over Time</label>
        </div>
        <button type="submit" className="btn btn-primary">Graph</button>
      </form>);
  }
}

class ChartMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <TaskSelectMenu></TaskSelectMenu>
    </div>)
  }
}

function loadReactCharts() {
  taskcharts.load("taskChart");
  ReactDOM.render(<ChartMenu />, document.getElementById("charts-menu-container"));    
}