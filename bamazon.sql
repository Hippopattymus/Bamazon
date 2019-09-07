DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    id INT (10)
    AUTO_INCREMENT NOT NULL,
    product_name VARCHAR
    (100) NOT NULL,
    department_name VARCHAR
    (100) NOT NULL,
    price DECIMAL
    (10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY
    (id)
);

    SELECT *
    FROM products;

    INSERT INTO products
        (id, product_name, department_name, price, stock_quantity)
    VALUES
        (1, "boots", "soccer", 79.99, 20),
        (2, "jerseys", "basketball", 99.99, 10),
        (3, "helmet", "football", 29.99, 5),
        (4, "sweater", "hockey", 129.99, 14),
        (5, "pants", "football", 39.99, 15),
        (6, "shorts", "soccer", 19.99, 19),
        (7, "gloves", "baseball", 49.99, 11),
        (8, "bats", "baseball", 69.99, 10),
        (9, "pucks", "hockey", 9.99, 19)
    