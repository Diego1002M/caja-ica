-- Script para crear la tabla 'usuarios' en PostgreSQL para la base de datos 'caja-ica'
CREATE TABLE IF NOT EXISTS usuarios (
    dni VARCHAR(8) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    password VARCHAR(100) NOT NULL,
    saldo NUMERIC(15, 2) NOT NULL DEFAULT 100.00,
    intereses NUMERIC(15, 2) NOT NULL DEFAULT 0.00
);

-- Ejemplo de inserción de un usuario de prueba (opcional)
-- INSERT INTO usuarios (dni, nombre, password, saldo, intereses)
-- VALUES ('12345678', 'Diego Berrocal', 'password123', 1500.00, 10.50);
