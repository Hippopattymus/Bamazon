var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

function displayProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    var displayTable = new Table({
      head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
      colWidths: [10, 25, 25, 10, 25]
    });
    for (var i = 0; i < res.length; i++) {
      displayTable.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    //console.log(displayTable);
    //displayTable.toString();
    console.log(displayTable);
    purchasePrompt();
  });
}

function purchasePrompt() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "Please enter Item ID you like to purchase.",
        filter: Number
      },
      {
        name: "Quantity",
        type: "input",
        message: "How many items do you wish to purchase?",
        filter: Number
      }
    ])
    .then(function(answers) {
      purchaseOrder(answers.ID, answers.Quantity);
    });

  function purchaseOrder(ID, purchaseQuantity) {
    connection.query("SELECT * FROM products WHERE id = ?", ID, function(
      err,
      res
    ) {
      if (err) throw err;
      if (purchaseQuantity <= res[0].stock_quantity) {
        var totalCost = res[0].price * purchaseQuantity;
        console.log("Good news your order is in stock!");
        console.log(
          "Your total cost for " +
            purchaseQuantity +
            " " +
            res[0].product_name +
            " is " +
            totalCost +
            ". Thank you!"
        );

        var newStock = res[0].stock_quantity - purchaseQuantity;

        connection.query(
          "UPDATE products SET ? WHERE ? ",
          [
            {
              stock_quantity: newStock
            },
            {
              id: ID
            }
          ],
          function(err, res) {
            if (err) throw err;
          }
        );
      } else {
        console.log(
          "Insufficient quantity. Sorry, we do not have enough " +
            res[0].product_name +
            "to complete your order."
        );
      }
      displayProducts();
    });
  }
}

displayProducts();
