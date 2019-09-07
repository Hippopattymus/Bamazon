var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Hippo91^",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
});

function inquirerForUpdates() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "Choose an option below to manage current inventory:",
        choices: [
          "Display Inventory",
          "Low Inventory",
          "Restock Inventory",
          "Add New Product",
          "Remove An Existing Product"
        ]
      }
    ])
    .then(function(answers) {
      switch (answers.action) {
        case "Display Inventory":
          displayInventory();
          break;
        case "Low Inventory":
          lowInventory();
          break;
        case "Restock Inventory":
          restockRequest();
          break;
        case "Add New Product":
          addRequest();
          break;
        case "Remove An Existing Product":
          removeRequest();
          break;
      }
    });
}

function displayInventory() {
  var theDisplayTable = new Table({
    head: ["ID", "Product Name", "Category", "Price", "Quantity"],
    colWidths: [10, 20, 20, 10, 10]
  });

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < res.length; i++) {
      theDisplayTable.push([
        res[i].id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(theDisplayTable.toString());
    inquirerForUpdates();
  });
}

function lowInventory() {
  var table = new Table({
    head: ["ID", "Item", "Department", "Price", "Stock"],
    colWidths: [10, 20, 20, 10, 10]
  });

  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 5) {
        table.push([
          res[i].id,
          res[i].product_name,
          res[i].department_name,
          res[i].price,
          res[i].stock_quantity
        ]);
      }
    }
    console.log(table.toString());
    inquirerForUpdates();
  });
}

function restockRequest() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message:
          "What is the item number of the item you would like to restock?"
      },
      {
        name: "Quantity",
        type: "input",
        message: "What is the quantity you would like to have in stock?"
      }
    ])
    .then(function(answers) {
      restockInventory(answers.ID, answers.Quantity);
    });

  function restockInventory(ID, quantity) {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: quantity
        },
        {
          id: ID
        }
      ],
      function(err, res) {
        if (err) {
          console.log(err);
        }
        inquirerForUpdates();
      }
    );
  }
}

function addRequest() {
  inquirer
    .prompt([
      //don't have to ask for id because its set to auto-increment
      {
        name: "Name",
        type: "input",
        message: "What is the name of product you would like to stock?"
      },
      {
        name: "Category",
        type: "input",
        message: "What is the category for product?"
      },
      {
        name: "Price",
        type: "input",
        message: "What is the price for item?"
      },
      {
        name: "Quantity",
        type: "input",
        message: "What is the quantity you would like to add?"
      }
    ])
    .then(function(answers) {
      buildNewItem(
        answers.Name,
        answers.Category,
        answers.Price,
        answers.Quantity
      );
    });

  function buildNewItem(name, category, price, quantity) {
    connection.query(
      "INSERT INTO products SET ?",
      [
        {
          product_name: name,
          department_name: category,
          price: price,
          stock_quantity: quantity
        }
      ],
      function(err, res) {
        if (err) {
          console.log(err);
        }
        inquirerForUpdates();
      }
    );
  }
}

function removeRequest() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "What is the item number of the item you would like to remove?"
      }
    ])
    .then(function(answers) {
      removeInventory(answers.ID);
    });

  function removeInventory(ID) {
    connection.query("DELETE FROM products WHERE id = ?", ID, function(
      err,
      res
    ) {
      // console.log("Deleted Row(s):" + res.affectedRows);
      inquirerForUpdates();
    });
  }
}
inquirerForUpdates();
