-- Department Seeds

INSERT INTO departments (department_name)
VALUES ("Sound"), ("Lighting"), ("Costume");

-- Role Seeds

INSERT INTO roles (title, salary, department_id)
VALUES ("Sound Manager", 100000, ), ("Lead Sound Designer", 80000, ), 
("Assistant Sound Designer", 60000, ), ("Lighting Manager", 140000, ),
("Lead Lighting Designer", 120000, ), ("Assistant Lighting Designer", 100000, ), 
("Costume Manager", 120000, ), ("Lead Costume Designer", 100000, ), 
("Assistant Costume Designer", 80000, ); 


-- Employee Seeds

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Oliver", "Queen", ), ("Felicity", "Smoak", ),("John", "Diggle", ), 
("Barry", "Allen", ), ("Iris", "West-Allen", ), ("Cisco", "Ramon", ), 
("Caitlin", "Snow", ), ("Joe", "West", ), ("Kara", "Danvers", ), 
("Alex", "Danvers", ),("Jean", "Jones", ), ("Winn", "Schott", ), ("Lena", "Luther", ),
