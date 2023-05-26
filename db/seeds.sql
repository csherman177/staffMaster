INSERT INTO department (name)
VALUES ('Accounting'),
       ('Marketing'),
       ('IT');

INSERT INTO role (title, salary, department_id)
VALUES ('Controller', 120000.00, 1),
       ('Accountant', 50000.00, 1),
       ('Graphic Designer', 80000.00, 2),
       ('Social Media Specialist', 50000.00, 2),
       ('Director of IT', 95000.00, 3),
       ('IT Specialist', 60000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Amanda', 'Smith', 1, NULL),
       ('Jerry', 'Seinfeld', 2, 1),
       ('Ron', 'Swanson', 3,NULL),
       ('Michael', 'Scott', 4,3),
       ('Walter', 'White', 5,NULL),
       ('Leslie', 'Knope', 6,5);
