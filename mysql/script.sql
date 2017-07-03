CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER,
    product_name varchar(50),
    department_name varchar(50),
    price INTEGER,
    stock_quantity INTEGER
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (
	145002,
	"Guitar Strap",
    "Musical Instruments",
    15,
    140
),
(
	144039,
	"Office Desk",
    "Office Supplies",
    240,
    20
),
(
	145654,
	"Racing Chair",
    "Office Supplies",
    140,
    30
),
(
	300598,
	"Xbox One X",
    "Electronics",
    500,
    50
),
(
	299856,
	"Playstation 4",
    "Electronics",
    300,
    100
),
(
	259453,
	"88 Key Piano",
    "Musical Instruments",
    350,
    45
),
(
	156987,
	"Macbook Pro",
    "Computers",
    1200,
    158
),
(
	456852,
	"Asus Laptop",
    "Computers",
    650,
    230
),
(
	520361,
	"Nike Golf Bag",
    "Sporting Goods",
    140,
    240
),
(
	400124,
	"Taylormade Golf Driver",
    "Sporting Goods",
    294,
    85
);

SELECT * FROM products;