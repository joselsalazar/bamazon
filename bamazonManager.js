let inquirer = require('inquirer');
let mySQL = require('mysql');
require('console.table');

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
			console.log("This Shizz is low!");
		} else if (answer.managerOptions === "Add to Inventory") {
			console.log("Added Shizz!");
		} else {
			console.log("Add New Shizz!");
		}
	});
}

function viewAll() {
	connection.query("SELECT * FROM products", function(err, results) {
		if(err) throw err;
		console.table(results);
		startManager();
	});
}