let inquirer = require('inquirer');
let mySQL = require('mysql');

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
	displayItems();
});

function displayItems() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		for (let i = 0; i < results.length; i++) {
			console.log(results[i].product_name);
		}
	});
}
