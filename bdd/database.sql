[-- Tabela de Doadores]
CREATE TABLE IF NOT EXISTS doadores (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL,
	telefone VARCHAR(20),
	cpf_cnpj VARCHAR(20) NOT NULL,
	endereco TEXT,
	status VARCHAR(20) DEFAULT 'ativo',
	data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

[-- Tabela de Usuários]
CREATE TABLE IF NOT EXISTS usuarios (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL,
	nivel_acesso INTEGER NOT NULL DEFAULT 1
);

[-- Tabela de Interações]
CREATE TABLE IF NOT EXISTS interacoes (
	id SERIAL PRIMARY KEY,
	doador_id INTEGER NOT NULL REFERENCES doadores(id) ON DELETE CASCADE,
	usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
	tipo_interacao VARCHAR(50) NOT NULL,
	observacoes TEXT,
	data_interacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

[-- Tabela de Doações]
CREATE TABLE IF NOT EXISTS doacoes (
	id SERIAL PRIMARY KEY,
	doador_id INTEGER NOT NULL REFERENCES doadores(id) ON DELETE CASCADE,
	valor NUMERIC(10,2) NOT NULL,
	data_doacao DATE NOT NULL,
	forma_pagamento VARCHAR(50) NOT NULL,
	status VARCHAR(20) DEFAULT 'pendente'
);
