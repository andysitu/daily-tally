# daily-tally

I keep track of things in Google Spreadsheets, and this is my attempt at creating something like it.

An application to keep track of daily tasks and data. The 4 current types possible are daily tasks, integer values, floating point values, and time (in terms of hours and minutes).

## Basic Info

Application using Java with Spring Boot and MongoDB for the backend and React for the frontend page generation given by Thymeleaf in the basic page template and static files to the browser. 

Chart.js is use for the chart generation. Plain JS for the Ajax communications between the browser and server.

## Installation for testing

Install MongoDB and then run the database server. With Windows, this is done by running `./mongod` from the MongoDB bin folder. Then, Spring was run by navigating to the repository main folder and then running `./mnvw spring-boot:run`

The web page is accessed from the browser `http://localhost:8080/view_tasks`

## Images

![Tasks Page](/docs/imgs/tasks_page.png)

![Charts Page](/docs/imgs/charts_page.png)

## Other
Previous attempts were done in Python with Django (https://github.com/rarafon/mysite/tree/master/checktasks) and C# with ASP.NET (https://github.com/rarafon/DailyMarker).