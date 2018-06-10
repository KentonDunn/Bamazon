DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL (10,2) NULL,
  stock_quantity DECIMAL (10,2) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lightsaber", "Toys", 150.00, 5), ("Optimus Prime", "Toys", 79.99, 10), ("Air Jordan XII", "Shoes", 135.00, 3),
("God of War IV", "Video Games", 65, 15), ("Shadow of The Colossus PS4", "Video Games", 70, 8), ("Blazer Brass 9mm (50 rds)","Ammo", 9.99, 20),
("PooPouri", "Home Goods", 13.99, 20), ("Nintendo Switch", "Electronics", 249.99, 8), ("Playstation 4", "Electronics", 249.99, 9),
("Legend of Zelda Hoodie", "Clothing", 35, 5);

SELECT * FROM products; 