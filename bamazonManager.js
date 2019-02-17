const inquirer = require("inquirer");
const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

//start connection
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    //ask what they want
    inquirer.prompt([
        {
            type: "list",
            name: "operations",
            message: "Choose an Operation",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit Program"]
        }
        //execute proper functions
    ]).then(function (user) {
        if (user.operations === "View Products for Sale") {
            viewProduct();
        } else if (user.operations === "View Low Inventory") {
            viewLow();
        } else if (user.operations === "Add to Inventory") {
            addInv();
        } else if (user.operations === "Add New Product") {
            addNew();
        } else {
            connection.end();
        };
    });
};

function viewProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            console.log("----------------------------------------");
            console.log("Item ID: " + results[i].item_id);
            console.log("Product Name: " + results[i].product_name);
            console.log("Department Name: " + results[i].department_name);
            console.log("Item Price: " + results[i].price);
            console.log("Stock Quantity: " + results[i].stock_quantity);
            console.log("----------------------------------------");
        };
        start();
    });
};

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            console.log("----------------------------------------");
            console.log("Item ID: " + results[i].item_id);
            console.log("Product Name: " + results[i].product_name);
            console.log("Department Name: " + results[i].department_name);
            console.log("Item Price: " + results[i].price);
            console.log("Stock Quantity: " + results[i].stock_quantity);
            console.log("----------------------------------------");
        };
        start();
    });
};

function addInv() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        let idArray = [];
        for (let i = 0; i < results.length; i++) {
            idArray.push(results[i].item_id.toString());
        };
        inquirer.prompt([
            {
                type: "list",
                name: "itemId",
                message: "Choose the item ID that you would like to add",
                choices: idArray
            },
            {
                type: "input",
                name: "addQty",
                message: "How many would you like to add?",
                validate: function checkNum(name) {
                    if (Number.isInteger(parseFloat(name)) && parseInt(name) > 0) {
                        return true;
                    } else {
                        console.log("\nMust enter an integer larger then 0");
                        return false;
                    }
                }
            }
        ]).then(function (user) {
            let addItem = results[parseInt(user.itemId) - 1];
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: addItem.stock_quantity + parseInt(user.addQty)
                    },
                    {
                        item_id: user.itemId
                    }
                ],
                function (error) {
                    if (error) throw err;
                    console.log("Inventory added successfully!");
                    start();
                }
            );
        });
    });
};

function addNew() {
    inquirer.prompt([
        {
            type: "input",
            name: "newProdName",
            message: "What is the name of new product?",
            validate: function check(name) {
                if (name.length < 51) {
                    return true;
                } else {
                    console.log("\nInput is too long, must be under 50 characters");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "newDeptName",
            message: "What department does the new product belong to?",
            validate: function check(name) {
                if (name.length < 51) {
                    return true;
                } else {
                    console.log("\nInput is too long, must be under 50 characters");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "newPrice",
            message: "What is the unit price of the new product?",
            validate: function checkNum(name) {
                if (isNaN(name) === false && parseFloat(name) > 0) {
                    return true;
                } else {
                    console.log("\nMust enter a number larger then 0");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "newStock",
            message: "What is the starting quantity of the new product?",
            validate: function checkNum(name) {
                if (isNaN(name) === false && parseInt(name) > 0 && Number.isInteger(parseFloat(name))) {
                    return true;
                } else {
                    console.log("\nMust enter an integer larger then 0");
                    return false;
                }
            }
        }
    ]).then(function (user) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: user.newProdName,
                department_name: user.newDeptName,
                price: user.newPrice,
                stock_quantity: user.newStock
            },
            function (error) {
                if (error) throw err;
                console.log("New product added successfully!");
                start();
            }
        );
    });
};