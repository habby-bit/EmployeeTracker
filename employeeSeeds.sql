-- Department Seeds

INSERT INTO departments (department_name)
VALUES ("Sound"), ("Lighting"), ("Costume");

-- Role Seeds

INSERT INTO roles (title, salary, department_id)
VALUES ("Sound Manager", 100000, 1), ("Lead Sound Designer", 80000, 1), 
("Assistant Sound Designer", 60000, 1), ("Lighting Manager", 140000, 2),
("Lead Lighting Designer", 120000, 2), ("Assistant Lighting Designer", 100000, 2), 
("Costume Manager", 120000, 3), ("Lead Costume Designer", 100000, 3), 
("Assistant Costume Designer", 80000, 3); 


-- Employee Seeds

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Oliver", "Queen", 1, NULL), ("Felicity", "Smoak", 2, 1),("John", "Diggle", 3, 1), 
("Barry", "Allen", 4, NULL), ("Iris", "West-Allen", 5, 4), ("Cisco", "Ramon", 5, 4), 
("Caitlin", "Snow", 6, 4), ("Joe", "West", 6, 4), ("Kara", "Danvers", 7, NULL), 
("Alex", "Danvers", 8, 9),("Jean", "Jones", 8, 9), ("Winn", "Schott", 9, 9), ("Lena", "Luther", 9, 9);
