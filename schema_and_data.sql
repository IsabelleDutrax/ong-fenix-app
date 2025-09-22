--
-- ONG Fenix Database - Schema and Data Only
--

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Create Tables
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    nivel_acesso integer DEFAULT 1 NOT NULL
);

CREATE TABLE public.doadores (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    telefone character varying(20) NOT NULL,
    cpf_cnpj character varying(20) NOT NULL,
    endereco text,
    status character varying(20) DEFAULT 'ativo'::character varying,
    data_cadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.doacoes (
    id integer NOT NULL,
    doador_id integer NOT NULL,
    valor numeric(10,2) NOT NULL,
    data_doacao date NOT NULL,
    forma_pagamento character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pendente'::character varying
);

CREATE TABLE public.interacoes (
    id integer NOT NULL,
    tipo_interacao character varying(50) NOT NULL,
    observacoes text,
    data_interacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    doador_id integer NOT NULL,
    usuario_id integer NOT NULL
);

--
-- Create Sequences
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.doadores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.doacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.interacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Set Default Values
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
ALTER TABLE ONLY public.doadores ALTER COLUMN id SET DEFAULT nextval('public.doadores_id_seq'::regclass);
ALTER TABLE ONLY public.doacoes ALTER COLUMN id SET DEFAULT nextval('public.doacoes_id_seq'::regclass);
ALTER TABLE ONLY public.interacoes ALTER COLUMN id SET DEFAULT nextval('public.interacoes_id_seq'::regclass);

--
-- Add Primary Keys
--

ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.doadores ADD CONSTRAINT doadores_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.interacoes ADD CONSTRAINT interacoes_pkey PRIMARY KEY (id);

--
-- Add Foreign Keys
--

ALTER TABLE ONLY public.doacoes ADD CONSTRAINT fk_doacoes_doador FOREIGN KEY (doador_id) REFERENCES public.doadores(id);
ALTER TABLE ONLY public.interacoes ADD CONSTRAINT fk_interacoes_doador FOREIGN KEY (doador_id) REFERENCES public.doadores(id);
ALTER TABLE ONLY public.interacoes ADD CONSTRAINT fk_interacoes_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);

--
-- Insert Data
--

INSERT INTO public.usuarios (id, nome, email, senha, nivel_acesso) VALUES
(1, 'Admin', 'admin@email.com', '$2b$10$M5FgEQY0QddGSCrTaOkUW.G4G51KevGeLjBCc/9TItEcaNj3iC546', 1),
(2, 'Joana Lima', 'joana@email.com', '$2b$10$$2b$10$Y.GNGv7oSUEEDfPZD9FWz.Sgn2MnXlgMNcFOhHM9u.7198pVlBgTG', 2),
(3, 'Pedro Alves', 'pedro@email.com', '$2b$10$HsCclXZLoaCDETgO6Ek5sOHOhukkJbyay05c55iqJ8r3VaDgIdQsa', 1);

INSERT INTO public.doadores (id, nome, email, telefone, cpf_cnpj, endereco, status, data_cadastro) VALUES
(1, 'João Silva', 'joao@email.com', '11999999999', '12345678900', 'Rua A, 123', 'ativo', '2025-09-16 02:46:05.419451'),
(3, 'Maria Oliveira', 'maria@email.com', '11988887777', '98765432100', 'Rua B, 456', 'ativo', '2025-09-17 00:20:17.544788'),
(4, 'Carlos Souza', 'carlos@email.com', '11977776666', '11122233344', 'Rua C, 789', 'ativo', '2025-09-17 00:20:17.544788');

INSERT INTO public.doacoes (id, doador_id, valor, data_doacao, forma_pagamento, status) VALUES
(1, 1, 100.00, '2025-09-15', 'Pix', 'pendente'),
(4, 1, 50.00, '2025-09-16', 'Cartão', 'confirmada'),
(5, 3, 75.50, '2025-09-17', 'Boleto', 'pendente');

INSERT INTO public.interacoes (id, tipo_interacao, observacoes, data_interacao, doador_id, usuario_id) VALUES
(1, 'Ligação', 'Primeiro contato', '2025-09-16 02:50:25.017494', 1, 1),
(6, 'WhatsApp', 'Enviado mensagem de agradecimento', '2025-09-17 00:25:09.018591', 1, 1),
(7, 'E-mail', 'Solicitou atualização de cadastro', '2025-09-17 00:25:09.018591', 3, 2);

--
-- Update Sequence Values
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);
SELECT pg_catalog.setval('public.doadores_id_seq', 4, true);
SELECT pg_catalog.setval('public.doacoes_id_seq', 5, true);
SELECT pg_catalog.setval('public.interacoes_id_seq', 7, true);
