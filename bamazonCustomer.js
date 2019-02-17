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
    
    //when connected, list items in chart
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
        let idArray = [];
        for (let i = 0; i < results.length; i++) {
            idArray.push(results[i].item_id.toString());
        };

        //start asking
        inquirer.prompt([
            {
                type: "list",
                name: "itemId",
                message: "Choose the item ID that you would like to buy",
                choices: idArray
            },
            {
                type: "input",
                name: "buyingQty",
                message: "How many would you like to buy?"
            }

        //update chart or inform user
        ]).then(function (user) {
            let buyingItem = results[parseInt(user.itemId) - 1]
            if (user.buyingQty > buyingItem.stock_quantity) {
                console.log("Insufficient quantity!");
                connection.end();
            } else {
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: buyingItem.stock_quantity - user.buyingQty
                        },
                        {
                            item_id: user.itemId
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Order placed successfully!");
                        console.log("Your total is: $" + (user.buyingQty * buyingItem.price));
                        connection.end();
                    }
                );
            };
        });
    });
});