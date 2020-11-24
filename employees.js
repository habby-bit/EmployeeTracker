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

            case "View all Employees":
                viewAllEmployees();
                break;
        
            case "View a Specific Employee":
                viewEmployee();
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
    var query = "SELECT departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id";

    connection.query(query, (err, res) => {
        console.log("\n")
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

            var query = "SELECT departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id WHERE ?";

            connection.query(query, answer, (err, res) => {
                console.log("\n")
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
            var query = "INSERT INTO departments SET ?";
            connection.query (query, answer, (err, res) => {
                    if (err) throw err;

                    console.log("\n Sucessfully inserted your new department! \n")
                    askAgain();
                }
              );

        })
    });
};
 
viewAllRoles = () => {
    var query = "SELECT roles.title, departments.department_name, roles.salary, employees.first_name, employees.last_name FROM departments JOIN roles ON departments.id = roles.department_id JOIN employees ON roles.id = employees.role_id";

    connection.query(query, (err, res) => {
        console.log("\n")
        console.table(res);
        askAgain();
    });     
};

viewRole = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                name: 'title',
                type: 'rawlist',
                message: 'What role would you like to view?',
                choices: () => {
                    const roleArray = res.map((r) => r.title);
                    return roleArray;
                }
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            var query = "SELECT roles.title, departments.department_name, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id WHERE ?";

            connection.query(query, answer, (err, res) => {
                console.log("\n")
                console.table(res);
                askAgain();
            });      

        })
    });
};

addRole = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name: 'department_name',
                type: 'rawlist',
                message: 'For what department would you like to add a role?',
                choices: () => {
                    const depArray = res.map((r) => r.department_name);
                    return depArray;
                }
            },
            {
                name: 'title',
                message: 'What role would you like to add?'
            },
            {
                name: 'salary',
                message: 'What is their salary?'
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            var query1 = "SELECT id FROM departments WHERE ?";
            connection.query (query1, {department_name: answer.department_name}, (err, res) => {
                    if (err) throw err;
                    let depId = res[0].id

                var query2 = "INSERT INTO roles SET ?";
                connection.query (query2, 
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: depId
                    },
                    (err, res) => {
                        if (err) throw err;

                        console.log("\n Sucessfully inserted your new role! \n")
                        askAgain();
                    }
                );
                }
            );

        })
    });
};

viewAllEmployees = () => {
    var query = "SELECT employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id";

    connection.query(query, (err, res) => {
        console.log("\n")
        console.table(res);
        askAgain();
    });     
};

viewEmployee = () => {
    connection.query('SELECT first_name, last_name FROM employees', (err, res) => {
        if (err) throw err;
        console.log("res: ", res)
        inquirer
        .prompt([
            {
                name: 'fullname',
                type: 'rawlist',
                message: 'What employee would you like to view?',
                choices: () => {
                    function getFullName(e) {
                        var fullname = [e.first_name,e.last_name].join(" ");
                        return fullname;
                    }
                    return res.map(getFullName);
                }
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            var objAnswer = answer.fullname.split(" ");

            var query = "SELECT employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE ? AND ?";
            
            connection.query(query, 
                [
                {
                    first_name: objAnswer[0]
                },
                { 
                    last_name: objAnswer[1]
                } 
                ],

                (err, res) => {
                    console.log("\n")
                    console.table(res);
                    askAgain();
            });      

        })
    });
};
