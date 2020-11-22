var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employeesDB"
});

connection.connect(function(err) {
  if (err) throw err;
  promptUser();
});

promptUser = () => {
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View a Department",
        "Add a Department",
        "View a Role",
        "Add a Role",
        "View an Employee",
        "Add an Employee",
        "Update an Employee Role",
        "Nothing, I'm done!"
      ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View a Department":
                viewDepartment();
                break;

            case "Add a Department":
                addDepartment();
                break;

            case "View a Role":
                viewRole();
                break;

            case "Add a Role":
                addRole();
                break;

            case "View an Employee":
                viewEmployee();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update an Employee Role":
                updateEmployeeRole();
                break;

            case "Nothing, I'm done!":
                nothingDone();
                break;
        }
    });
}