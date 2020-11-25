var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

// Creating the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employeesDB"
});


// Connecting to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  askUser();
});

// Ask user what they would like to do
askUser = () => {
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

// Ask the user if they'd like to do something else
anotherAction = () => {
    inquirer.prompt([
        {
           type: "confirm",
           name: "choice",
           message: "Would you like to do something else?"
        }
    ])
    .then(val => {
        if (val.choice) {
            askUser();
        } 
        else {
            connection.end();
        }
    });
}

// Function to view all departments
viewAllDepartments = () => {

    // Running query to view all departments
    var query = "SELECT departments.id, departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id ORDER BY departments.id ASC";
    connection.query(query, (err, res) => {
        console.log("\n")
        console.table(res);
        anotherAction();
    });     
};

// Function to view a specific department
viewDepartment = () => {

    // Running a query to create department list during user prompts
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

            // Running query to view the specific department
            var query = "SELECT departments.id, departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id WHERE ?";

            connection.query(query, answer, (err, res) => {
                console.log("\n")
                console.table(res);
                anotherAction();
            });      
        })
    });
};

// Function to add a new department
addDepartment = () => {

    // Running a query to create department list during user prompts
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;

        // Display current departments to user
        const depArray = res.map((r) => r.department_name);
        console.log("\nHere are the current departments: " + depArray + "\n")

        // Asking user what department they'd like to add
        inquirer
        .prompt([
            {
                name: 'department_name',
                message: 'What department would you like to add?'
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            // Running a query to create a new department
            var query = "INSERT INTO departments SET ?";
            connection.query (query, answer, (err, res) => {
                if (err) throw err;

                console.log("\n Sucessfully added your new department! \n")
                anotherAction();
            });
        })
    });
};
 
// Function to view all roles
viewAllRoles = () => {

    // Running query to view all roles
    var query = "SELECT roles.id, roles.title, roles.salary, departments.department_name, employees.first_name, employees.last_name FROM roles LEFT JOIN departments ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id ORDER BY roles.id ASC";
    connection.query(query, (err, res) => {
        console.log("\n")
        console.table(res);
        anotherAction();
    });     
};

// Function to view a specific role
viewRole = () => {

    // Running a query to create role list during user prompts
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

            // Running a query to view a specific role
            var query = "SELECT roles.id, roles.title, roles.salary, departments.department_name, employees.first_name, employees.last_name FROM departments LEFT JOIN roles ON departments.id = roles.department_id LEFT JOIN employees ON roles.id = employees.role_id WHERE ?";
            connection.query(query, answer, (err, res) => {
                console.log("\n")
                console.table(res);
                anotherAction();
            });      
        })
    });
};

// Function to add a role
addRole = () => {

    // Running a query to create department list during user prompts
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

            // Running query to get the specific department_id
            var query1 = "SELECT id FROM departments WHERE ?";
            connection.query (query1, {department_name: answer.department_name}, (err, res) => {
                    if (err) throw err;
                    let depId = res[0].id

                // Running query to create a new role with the specific department_id
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
                        anotherAction();
                });
            });
        });
    });
};

// Function to view all employees
viewAllEmployees = () => {
    
    // Running query to view all departments
    var query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY employees.id ASC";
    connection.query(query, (err, res) => {
        console.log("\n")
        console.table(res);
        anotherAction();
    });     
};

// Function to view a specific employee
viewEmployee = () => {

    // Running a query to create employee list during user prompts
    connection.query('SELECT first_name, last_name FROM employees', (err, res) => {
        if (err) throw err;

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

            // Getting the employees name and splitting into first_name and last_name
            var objAnswer = answer.fullname.split(" ");

            // Running query to view the specific employee
            var query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE ? AND ?";
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
                    anotherAction();
            });      

        })
    });
};

// Function to add an employee
addEmployee = () => {

    // Running a query to create department list during user prompts
    var query1 = 'SELECT * FROM roles';
    connection.query(query1, (err, rolesRes) => {
        if (err) throw err;

    // Running a query to create manager list during user prompts
    var query2 = 'SELECT first_name, last_name, manager_id FROM employees WHERE manager_id IS NULL'; 
    connection.query(query2, (err, manRes) => {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name: 'first_name',
                message: 'What is their first name?'
            },
            {
                name: 'last_name',
                message: 'What is their last name?'
            },
            {
                name: 'title',
                type: 'rawlist',
                message: 'What is their role?',
                choices: () => {
                    const rolArray = rolesRes.map((r) => r.title);
                    return rolArray;
                }
            },
            {
                name: 'manager',
                type: 'rawlist',
                message: 'Who is their manager?',
                choices: () => {
                    function getFullName(e) {
                        var fullname = [e.first_name, e.last_name].join(" ");
                        return fullname;
                    }
                    return manRes.map(getFullName);
                }
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            // Running query to get the specific role id
            var query1 = "SELECT id FROM roles WHERE ?";
            connection.query (query1, {title: answer.title}, (err, res) => {    
                if (err) throw err;
                let roleId = res[0].id

                // Getting the employees name and splitting into first_name and last_name
                var objAnswer = answer.manager.split(" ");

                // Running query to get the specific employee id
                var query2 = "SELECT id FROM employees WHERE ?";
                connection.query (query2,                    [
                    {
                        first_name: objAnswer[0]
                    },
                    { 
                        last_name: objAnswer[1]
                    } 
                    ],
                    (err, res) => {  
                    if (err) throw err;

                    let managerId = res[0].id

                    // Running query to create a new employee with the specific role_id and manager_id
                    var query3 = "INSERT INTO employees SET ?";
                    connection.query (query3, 
                        [
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: roleId,
                            manager_id: managerId
                        }
                        ],
                        (err, res) => {
                            if (err) throw err;

                            console.log("\n Sucessfully inserted your new employee! \n")
                            anotherAction();
                    });
                });
            });
        });
    });
    });
};

// Function to update an employee role
updateEmployeeRole = () => {

    // Running a query to create roles list during user prompts
    connection.query('SELECT title FROM roles', (err, roleRes) => {
        if (err) throw err;

    // Running a query to create employee list during user prompts
    var query = 'SELECT first_name, last_name FROM employees';
    connection.query(query, (err, res) => {
        if (err) throw err;

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
            },
            {
                name: 'title',
                type: 'rawlist',
                message: 'What role would you like to give them?',
                choices: () => {
                    const roleArray = roleRes.map((r) => r.title);
                    return roleArray;
                }
            }
        ])
        .then(function(answer) {
            if (err) throw err;

            // Running query to get the specific role_id
            var query1 = "SELECT id FROM roles WHERE ?"
            connection.query (query1, {title: answer.title}, (err, res) => {
                if (err) throw err;
                let roleId = res[0].id

                // Getting the employees name and splitting into first_name and last_name
                var objAnswer = answer.fullname.split(" ");

                // Running query to get the specific employee
                var query2 = "SELECT first_name, last_name FROM employees WHERE ?";
                connection.query (query2,                 
                    [
                    {
                        first_name: objAnswer[0]
                    },
                    { 
                        last_name: objAnswer[1]
                    } 
                    ],
                    (err, res) => {  
                    if (err) throw err;

                    // Running query to update the role of the specific employee
                    var query3 = "UPDATE employees SET ? WHERE ? AND ?";
                    connection.query (query3, 
                        [
                        {
                            role_id: roleId

                        },
                        {
                            first_name: res[0].first_name

                        },
                        {
                            last_name: res[0].last_name

                        }
                        ],
                        (err, res) => {
                        if (err) throw err;

                        console.log("\n Sucessfully updated your employees role! \n")
                        anotherAction();
                    });
                });
            });
        });
    });
    });
}