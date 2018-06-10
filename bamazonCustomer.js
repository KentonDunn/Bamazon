require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.password,
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!")
    readProducts();

});

function readProducts() {
    console.log("WELCOME TO BAMAZON!!!   \n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity + " unit(s)");
        }
        console.log("-----------------------------------");
        start();
        //connection.end();
    });
}
//I want to use a constructor to allow for product order arrays(ID and quantity) to be kept
function ProductOrder(id, quantity) {
    this.id = id;
    this.quantity = quantity;
    this.printInfo = function () {
        console.log("You selected the following Product ID: " + this.id + "\nYou would like to purchase " + this.quantity + " units of this item.");
    };
};


function start() {
    var userID = ""

    /*How do I get this to also validate that the number input is not higher than the highest ID number in the table?
    I only have 10 IDs, it should say "enter valid product ID" if number is > 10 */

    inquirer.prompt([{
        name: "id",
        message: "Please provide the product ID of the item you would like to purchase.",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        message: "How many units of this item would you like to purchase?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }

    }]).then(function (answers) {
        var newProductOrder = new ProductOrder(answers.id, answers.quantity);
        newProductOrder.printInfo();

        function queryProducts() {

            userID = answers.id;
            var query = connection.query("SELECT * FROM products where id=?", [userID], function (err, res) {

                if (err) throw err;
                // Log all results of the SELECT statement
                for (i = 0; i < res.length; i++) {
                    console.log("-----------------------------------");

                    console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity + " unit(s)");
                }
                console.log("-----------------------------------");


                //console.log(query.sql);
                checkInventory();

            });
        };
        queryProducts();

        //need a function that checks the inventory 
        function checkInventory() {
            userID = answers.id;
            var query = connection.query("SELECT stock_quantity FROM products where id=?", [userID], function (err, res) {

                if (err) throw err;
                // Log all results of the SELECT statement
                for (i = 0; i < res.length; i++) {


                    if (answers.quantity > res[i].stock_quantity) {
                        console.log("You have requested " + answers.quantity + " units of this item. \nThere are only " + res[i].stock_quantity + " units available. \nPlease adjust your order.");
                        console.log("-----------------------------------");
                        start();
                    } else completeOrder();
                }

                //I'd like to compare the quantity in stock against the client's order here, but I think that I have to create a new function
                //outside of checkInventory to do so.  That feels inefficient.  Can I add another call back after the (err, res)?
                //console.log(query.sql);


            });
        }

        function completeOrder() {
            //if this works, consider using another inquirer to get the client to confirm their purchase.  
            //if you have time, of course.
            console.log("Excellent! You would like to purchase " + answers.quantity + " unit(s)of this product.");
            userID = parseInt(answers.id);
            var query = connection.query("SELECT * FROM products where id=?", [userID], function (err, res) {

                if (err) throw err;
                // Log all results of the SELECT statement
                console.log("Your total cost is $" + res[0].price * answers.quantity + "\nThank you for shopping at Bamazon!");



                // var currentStock = res[answers.id - 1].stock_quantity;
                var currentStock = parseInt(res[0].stock_quantity);
                var newStock = parseInt(currentStock - answers.quantity);
                //console.log(newStock);
                //Now we need to update the inventory.  
                updateInventory(newStock, userID);

            });
        }

        function updateInventory(newStock, userID) {
            // var userID = answers.id;
            // var currentStock = res[answers.id - 1].stock_quantity;
            // console.log(currentStock);
            // var newStock = currentStock - answers.quantity;

            var query = connection.query("UPDATE products SET stock_quantity=? where id=?", [newStock, userID], function (err, res) {

                if (err) throw err;
                // Log all results of the SELECT statement
                // console.log(currentStock);
                // console.log(answers.quantity);
                console.log("There are now " + newStock + " items left in stock!");

            });
        }


    })
}