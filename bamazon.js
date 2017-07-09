const inquirer = require('inquirer');
const mySQL = require('mysql');
const Table = require('cli-table');

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
			sellItem();
		} else {
			process.exit();
		}
	});
}

function createArray() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		var table = new Table({
			head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock']
		});
		for (let i = 0; i < results.length; i++) {
			choicesArr.push(results[i]);

			table.push(
				[
					choicesArr[i].item_id,
					choicesArr[i].product_name,
					choicesArr[i].department_name,
					choicesArr[i].price,
					choicesArr[i].stock_quantity
				]
			);
		}
		console.log(table.toString());
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

			if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
				var newStock = chosenItem.stock_quantity - parseInt(answer.quantity);
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: newStock
						},
						{
							product_name: answer.products	
						}
					],
					function(error) {
						if (error) throw err;
						let quantityChosen = parseInt(answer.quantity);
						let parsePrice = parseInt(chosenItem.price);
						let realTotal = quantityChosen * parsePrice;
						console.log("Order Placed Successfully! \n" + 
							"Your total is $" + realTotal);
						process.exit();
					}
				);
			} else {
				console.log("There is not enough of that item! Please try again.");
				setTimeout(createArray, 3000);
			}
		});
	});
}

function sellItem() {
	inquirer.prompt([
		{
			name: "productName",
			type: "input",
			message: "What product are you selling?"
		},
		{
			name: "departmentName",
			type: "input",
			message: "What department would this item fall under?"
		},
		{
			name: "price",
			type: "input",
			message: "What would you like to sell your item for?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},
		{
			name: "stock",
			type: "input",
			message: "How many do you have to sell?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function(answer) {
		var itemID = Math.floor(Math.random()*900000) + 100000;
		connection.query(
			"INSERT INTO products SET ?",
			{
				item_id: itemID,
				product_name: answer.productName,
				department_name: answer.departmentName,
				price: answer.price,
				stock_quantity: answer.stock
			},
			function(err) {
				if (err) throw err;
				console.log("Item Added Successfully!");
				process.exit();
			}
		);
	});
}
	
