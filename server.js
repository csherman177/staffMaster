require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log("sucessfully connect to database")
);

//Inquirer Question Prompts
const questions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "Choose Option From List",
        choices: [
          "View All Departments",
          "View All Roles",
          "View Employees",
          "Add Department",
          "Add Roles",
          "Add Employee",
          "Update Role",
          "Quit",
        ],
      },
    ])

    .then((answers) => {
      const { choices } = answers;
      if (choices === "View All Departments") {
        return viewDepartments();
      } else if (choices === "View All Roles") {
        return viewRoles();
      } else if (choices === "View Employees") {
        return viewEmployees();
      } else if (choices === "Add Department") {
        return addDepartment();
      } else if (choices === "Add Roles") {
        return addRoles();
      } else if (choices === "Add Employee") {
        return updateEmployees();
      } else if (choices === "Update Role") {
        return updateEmployees();
      } else {
        process.exit();
      }
    });
};

//Function to Show All Departments - Dept Name & ID
const viewDepartments = () => {
  console.log("Showing all departments...\n");
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    questions();
  });
};

// Function to Show All Roles - Join table to add title, role, dept, salary
const viewRoles = () => {
  console.log("Showing all Roles...\n");
  const sql = `Select role.id, role.title, department.name, role.salary from role left join department on role.department_id=department.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    questions();
  });
};

// Function to Show All Employees - Join table to add id, name, title, dept, salary, reporting mgr
const viewEmployees = () => {
  console.log("Showing all employees...\n");
  const sql = `SELECT * FROM employee left join role on employee.role_id=role.id left join department on role.department_id=department.id left join employee AS manager on manager.id = employee.manager_id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    questions();
  });
};
// Function to Add Department - INSERT Statement
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "addDept",
      message: "Type in Department you want to add",
      validate: (addDept) => {
        if (addDept) {
          return true;
        } else {
          console.log("Enter in Department");
          return false;
        }
      },
    })
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log("Your Department Has Been Added");

        viewDepartments();
      });
    });
};
// Function to Add Role - INSERT Statement
const addRoles = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addTitle",
        message: "Which Title do you want to add?",
        validate: (addTitle) => {
          if (addTitle) {
            return true;
          } else {
            console.log("Enter in Title");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "addSalary",
        message: "What will the salary be?",
        validate: (addSalary) => {
          if (addSalary) {
            return true;
          } else {
            console.log("Enter in Salary");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "addDepartment",
        message: "Which Department will this be in?",
        validate: (addDepartment) => {
          if (addDepartment) {
            return true;
          } else {
            console.log("Enter in Department");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
      db.query(
        sql,
        [answer.addTitle, answer.addSalary, answer.addDepartment],
        (err, result) => {
          if (err) throw err;
          console.log("Your Department Has Been Added");

          viewRoles();
        }
      );
    });
};

// Function to Update Employee - UPDATE STatement
const updateEmployees = () => {
  const empSQL = `SELECT * FROM employee`;

  db.query(empSQL, (err, data) => {
    if (err) throw err;

    const employees = data.map((person) => ({
      name: `${person.first_name} ${person.last_name}`,
      value: person.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((empSelect) => {
        const employee = empSelect.name;
        const params = [];
        params.push(employee);
        const roleSql = `SELECT * FROM role`;


  // Function to Update Role - UPDATE Statement
        db.query(roleSql, (err, data) => {
          if (err) throw err;
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "Enter in Employee's New Role",
                choices: roles,
              },
            ])
            .then((roleSelect) => {
              const role = roleSelect.role;
              params.unshift(role);

              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

              db.query(sql, params, (err, data) => {
                if (err) throw err;
                console.log("Your role has been updated!");

                viewEmployees();
              });
            });
        });
      });
  });
};



questions();
