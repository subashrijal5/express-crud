CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the user table with UUIDs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);

-- Seed some initial data
INSERT INTO users (id, name, email, password) VALUES
(uuid_generate_v4(), 'John Doe', 'john@example.com', '$2b$10$Z0B5eTU1flf2KI2/DMakleuVekEuC4xeGOCU2N8AmylvQ9PzY3SA.'),
(uuid_generate_v4(), 'Jane Doe', 'jane@example.com', '$2b$10$Z0B5eTU1flf2KI2/DMakleuVekEuC4xeGOCU2N8AmylvQ9PzY3SA.');
