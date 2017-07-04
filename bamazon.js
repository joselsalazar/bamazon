let inquirer = require('inquirer');
let mySQL = require('mysql');

let choicesArr = [];

// MySQL connection
let connection = mySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "J3susThis5uCKS",
	database: "bamazon"
});

connection.connect(function(err) {
	if(err) throw err;
	startQuery();
});

function startQuery() {
	inquirer.prompt([
		{
			message: "What would you like to do?",
			type: "list",
			name: "startOptions",
			choices: ["Buy", "Sell", "Exit"]
		}
	]).then(function(answer) {
		if(answer.startOptions === "Buy") {
			createArray();
		} else if (answer.startOptions === "Sell") {
			console.log("Feature Not Available Yet...");
		} else {
			process.exit();
		}
	});
}

function createArray() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		console.log("Current Items Available:");
		for (let i = 0; i < results.length; i++) {
			choicesArr.push(results[i]);

			console.log(
				"=====================================" + "\n" + 
				"Item #:" + choicesArr[i].item_id + "\n" +
				"Product:" + choicesArr[i].product_name + "\n" +
				"Price: $" + choicesArr[i].price + "\n" +
				"Current Stock:" + choicesArr[i].stock_quantity + "\n" +
				"====================================="
			);
		}


		inquirer.prompt([
			{
				message: "Which product would you like to buy?",
				type: "list",
				name: "products",
				choices: function() {
					var buyingChoices = [];
					for (let i = 0; i < choicesArr.length; i++) {
						buyingChoices.push(choicesArr[i].product_name);
					}
					return buyingChoices;
				}	
			},
			{
				message: "How many would you like to buy?",
				name: "quantity",
				validate: function(number) {
					if(isNaN(number) === false) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answer) {
			// console.log(choicesArr[1].product_name);
			var chosenItem;
			for (var i = 0; i < choicesArr.length; i++) {
				if(choicesArr[i].product_name === answer.products) {
					chosenItem = choicesArr[i];
				}
			}

			if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
				newStock = chosenItem.stock_quantity - parseInt(answer.quantity);
				
				console.log(newStock);
			} else {
				console.log("There is not enough!");
			}
		});
	});
}
	
