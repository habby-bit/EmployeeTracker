var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

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
        "View all Departments",
        "View a Specific Department",
        "Add a Department",
        "View all Roles",
        "View a Specific Role",
        "Add a Role",
        "View all Employees",
        "View a Specific Employee",
        "Add an Employee",
        "Update an Employee Role",
        "Nothing, I'm done!"
      ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View all Departments":
                viewAllDepartments();
                break;

            case "View a Specific Department":
                viewDepartment();
                break;

            case "Add a Department":
                addDepartment();
                break;

            case "View all Roles":
                viewAllRoles();
                break;

            case "View a Specific Role":
                viewRole();
                break;

            case "Add a Role":
                addRole();
                break;

            case "View a Specific Employee":
                viewEmployee();
                break;
        
            case "View all Employees":
                viewAllEmployees();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update an Employee Role":
                updateEmployeeRole();
                break;

            case "Nothing, I'm done!":
                connection.end();
                break;
        }
    });
}

askAgain = () => {
    inquirer.prompt([
        {
           type: "confirm",
           name: "choice",
           message: "Would you like to do something else?"
        }
    ])
    .then(val => {
        if (val.choice) {
            promptUser();
        } 
        else {
            connection.end();
        }
    });
}

viewAllDepartments = () => {
    var query = "SELECT departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments JOIN roles ON departments.id = roles.department_id JOIN employees ON roles.id = employees.role_id"
           
    connection.query(query, (err, res) => {
        console.table(res);
        askAgain();
    });     
};

viewDepartment = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                name: 'department_name',
                type: 'rawlist',
                message: 'What department would you like to view?',
                choices: () => {
                    const depArray = res.map((r) => r.department_name);
                    return depArray;
                }
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            var query = "SELECT departments.department_name, roles.title, employees.first_name, employees.last_name FROM departments JOIN roles ON departments.id = roles.department_id JOIN employees ON roles.id = employees.role_id WHERE ?"
           
            connection.query(query, answer, (err, res) => {
                console.table(res);
                askAgain();
            });      

        })
    });
};


addDepartment = () => {
    connection.query('SELECT * FROM departments', (err, res) => {

        const depArray = res.map((r) => r.department_name);
        
        if (err) throw err;

        console.log("\nHere are the current departments: " + depArray + "\n")

        inquirer
        .prompt([
            {
                name: 'department_name',
                message: 'What department would you like to add?'
            }
        ])
        .then(function(answer) {
            if (err) throw err;
            var query = "INSERT INTO products SET ?";
            connection.query (query, answer, (err, res) => {
                  if (err) throw err;
                  console.log(res.affectedRows + " product inserted!\n");
                  updateProduct();
                }
              );

        })
    });
};
