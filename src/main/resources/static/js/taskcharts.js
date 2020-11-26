var taskcharts = {
  canvas_id: undefined,
  ctx: undefined,
  chart: undefined,
  // Formats date string of "YYYY-MM-YY"
  formatDate(date) {
    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = '' + date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return year + "-" + month + "-" + day;
  },
  // gives 'rgba(x,y,z,1)' with variables being randomized integers (255)
  random_rgb() {
    var ran = Math.random,
        rou = Math.round,
        n = 255;
    return `rgba(${rou(ran()*n)},${rou(ran()*n)},${rou(ran()*n)}, 1)`;
  },
  graph(graph_type, tasks_data) {
    var datasets = [],
        labelset = new Set(),
        datestr;
    
    var task, date, dataArr,
        taskindex, arr_index, i,
        d, rgba;

    for (taskindex=0; taskindex <tasks_data.length; taskindex++) {
      task = tasks_data[taskindex];
      rgba = this.random_rgb();
      d = {
        fill: false,
        label: tasks_data[taskindex].name,
        data: [],
        backgroundColor: rgba,
        borderColor: rgba,
        lineTension: .25,
      };

      if (task.type == "countint" || task.type == "time") {
        dataArr = task.ldata;
      } else if (task.type == "amount") {
        dataArr = task.fdata;
      } else if (task.type == "basic") {
        dataArr = task.data;
      }
      
      if (graph_type == "graph_over_time") {
        for (arr_index = 0; arr_index < dataArr.length; arr_index++) {
          date = new Date(task.dates[arr_index][0], task.dates[arr_index][1], 0);

          for (i=0; i < dataArr[arr_index].length; i++) {
            date.setDate(date.getDate()+1);
            datestr = this.formatDate(date);
            labelset.add(datestr);
            d.data.push({x: datestr, y: dataArr[arr_index][i]});
          }
        }
      } else if (graph_type == "cumulative_over_time") { // cumulative plots the total
        var total = 0;
        for (arr_index = 0; arr_index < dataArr.length; arr_index++) {
          date = new Date(task.dates[arr_index][0], task.dates[arr_index][1], 0);

          for (i=0; i < dataArr[arr_index].length; i++) {
            total += dataArr[arr_index][i];
            date.setDate(date.getDate()+1);
            datestr = this.formatDate(date);
            labelset.add(datestr);
            d.data.push({x: datestr, y: total});
          }
        }
      }
      datasets.push(d);
    }
    var labels = [];

    for (datestr of labelset) {
      labels.push(datestr);
    }
    labels.sort();

    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,},
      options: {
        responsive: true,
        scanles: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            }
          }]
        }
      }
    });
  },
  load(canvas_id) {
    this.canvas_id = canvas_id;
    this.ctx = document.getElementById(canvas_id).getContext('2d');
  }
};