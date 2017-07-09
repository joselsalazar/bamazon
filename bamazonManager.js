const inquirer = require('inquirer');
const mySQL = require('mysql');
const Table = require('cli-table');

var choicesArr = [];
var inventory = false;

// MySQL connection
const connection = mySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "J3susThis5uCKS",
	database: "bamazon"
});

connection.connect(function(err) {
	if(err) throw err;
	startManager();
});

function startManager() {
	inquirer.prompt([
		{
			message: "What would you like to do?",
			type: "list",
			name: "managerOptions",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}
	]).then(function(answer) {
		if(answer.managerOptions === "View Products for Sale") {
			viewAll();
		} else if (answer.managerOptions === "View Low Inventory") {
			lowInventory();
		} else if (answer.managerOptions === "Add to Inventory") {
			inventory = true;
			viewAll();
		} else {
			newProduct();
		}
	});
}

function viewAll() {
	connection.query("SELECT * FROM products", function(err, results) {
		if(err) throw err;
		var table = new Table({
			head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock']
		});
		for (let i = 0; i < results.length; i++) {
			choicesArr.push(results[i]);
			// console.log(`
			// 	==============================
			// 	Item ID: ${choicesArr[i].item_id}
			// 	Product Name: ${choicesArr[i].product_name}
			// 	Department Name: ${choicesArr[i].department_name}
			// 	Price: ${choicesArr[i].price}
			// 	Stock Quantity: ${choicesArr[i].stock_quantity}
			// 	==============================
			// 	`
			// );
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
	});

	if(inventory) {
		setTimeout(addProduct, 2000);
	} else {
		setTimeout(startManager, 3000);
	}
}

function lowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity <= 100", function(err, results) {
		if(err) throw err;
		console.log("Showing Items With Inventories Below 100");
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
		setTimeout(startManager, 3000);
	});
}

function newProduct() {
	inquirer.prompt([
		{
			name: "productName",
			type: "input",
			message: "What product are you adding?"
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

function addProduct() {
	function choices() {
		var buyingChoices = [];
		for (let i = 0; i < choicesArr.length; i++) {
			buyingChoices.push(choicesArr[i].product_name);
		}
		return buyingChoices;
	}

	inquirer.prompt([
		{
			message: "Which product will you be adding inventory for?",
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
			message: "How much more will you be adding?",
			name: "additions",
			validate: function(number) {
				if(isNaN(number) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function(answer) {
		var chosenAdd;
		for (var i = 0; i < choicesArr.length; i++) {
			if(choicesArr[i].product_name === answer.products) {
				chosenAdd = choicesArr[i];
			}
		}

		let newInventory = chosenAdd.stock_quantity + parseInt(answer.additions);
		connection.query("UPDATE products SET ? WHERE ?", 
			[
				{
					stock_quantity: newInventory
				},
				{
					product_name: chosenAdd.product_name
				}
			], 
			function(error) {
				if (error) throw err;
				console.log(`You added ${answer.additions} units to the ${chosenAdd.product_name} inventory! There is now a total of ${newInventory} in stock!`);
				process.exit();
			}
		);
	});
}