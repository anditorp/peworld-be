CREATE TABLE products(
  id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(64),
  description TEXT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY(id)
);

-- ADD PRODUCT

INSERT INTO products(name, description, stock)VALUES('indomie ayam bawang', 'indomie ayam bawang bla bla', 2);