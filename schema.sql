DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("vanilla cream", "foods", 10.99, 10),
("cursed camera", "electronics", 299.99, 5),
("division 69", "games", 59.99, 20),
("killer queen", "stands", 444.44, 1),
("the world", "stands", 13.42, 2),
("chunky moldy milk", "foods", 99.99, 9),
("half eaten waffle", "foods", 33.15, 5),
("apex average joes", "games", 15.99, 3),
("crusty keyboard", "electronics", 69.96, 2),
("vibranium shield", "toys", 3.50, 1);