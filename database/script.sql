CREATE DATABASE IF NOT EXISTS gestao_estoque;
USE gestao_estoque;

CREATE TABLE produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 10
);

CREATE TABLE pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('PENDENTE', 'APROVADO', 'REJEITADO') NOT NULL DEFAULT 'PENDENTE',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

SET FOREIGN_KEY_CHECKS = 0;

-- Substitui ou insere os produtos
REPLACE INTO produtos (id, nome, sku, quantidade_estoque, estoque_minimo) VALUES
(1, 'Monitor Dell 27', 'MON-DELL-27', 5, 10),
(2, 'Teclado Mecânico Keychron', 'TEC-KEY-01', 50, 20),
(3, 'Mouse Logi MX Master 3', 'MOU-LOG-MX', 8, 15);

-- Substitui ou insere os pedidos
REPLACE INTO pedidos (id, status, data_criacao) VALUES
(1, 'PENDENTE', NOW()),
(2, 'PENDENTE', NOW());

-- Substitui ou insere os itens dos pedidos
REPLACE INTO itens_pedido (id, pedido_id, produto_id, quantidade) VALUES
(1, 1, 1, 2),
(2, 1, 3, 1),
(3, 2, 2, 5);

SET FOREIGN_KEY_CHECKS = 1;