require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;



const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Conexão com o banco de dados bem-sucedida! Tempo do servidor: ${result.rows[0].now}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro na conexão com o banco de dados.');
    }
});

// Doadores endpoints
app.post('/doadores', async (req, res) => {
    try {
        const { nome, email, telefone, cpf_cnpj, endereco, status } = req.body;
        const data_cadastro = new Date();

        const query = `
      INSERT INTO doadores (nome, email, telefone, cpf_cnpj, endereco, status, data_cadastro)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const values = [nome, email, telefone, cpf_cnpj, endereco, status, data_cadastro];

        const newDoador = await pool.query(query, values);

        res.status(201).json(newDoador.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao cadastrar o doador." });
    }
});

app.get('/doadores', async (req, res) => {
    try {
        const query = 'SELECT * FROM doadores;';
        const allDoadores = await pool.query(query);

        res.status(200).json(allDoadores.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar a lista de doadores." });
    }
});

app.put('/doadores/:id', async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID da URL
        const { nome, email, telefone, cpf_cnpj, endereco, status } = req.body;

        const query = `
      UPDATE doadores
      SET nome = $1, email = $2, telefone = $3, cpf_cnpj = $4, endereco = $5, status = $6
      WHERE id = $7
      RETURNING *;
    `;
        const values = [nome, email, telefone, cpf_cnpj, endereco, status, id];

        const updatedDoador = await pool.query(query, values);

        if (updatedDoador.rows.length === 0) {
            return res.status(404).json({ error: "Doador não encontrado." });
        }

        res.status(200).json(updatedDoador.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar o doador." });
    }
});

app.delete('/doadores/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM doadores WHERE id = $1 RETURNING *;';
        const deletedDoador = await pool.query(query, [id]);

        if (deletedDoador.rows.length === 0) {
            return res.status(404).json({ error: "Doador não encontrado." });
        }

        res.status(200).json({ message: "Doador excluído com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao excluir o doador." });
    }
});



// Interações endpoints
app.post('/interacoes', async (req, res) => {
    try {
        const { doador_id, usuario_id, tipo_interacao, observacoes } = req.body;
        const data_interacao = new Date();

        const query = `
      INSERT INTO interacoes (doador_id, usuario_id, tipo_interacao, observacoes, data_interacao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [doador_id, usuario_id, tipo_interacao, observacoes, data_interacao];

        const newInteracao = await pool.query(query, values);

        res.status(201).json(newInteracao.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao cadastrar a interação." });
    }
});

app.get('/interacoes', async (req, res) => {
    try {
        const query = 'SELECT * FROM interacoes;';
        const allInteracoes = await pool.query(query);

        res.status(200).json(allInteracoes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar a lista de interações." });
    }
});

app.put('/interacoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { doador_id, usuario_id, tipo_interacao, observacoes } = req.body;

        const query = `
      UPDATE interacoes
      SET doador_id = $1, usuario_id = $2, tipo_interacao = $3, observacoes = $4
      WHERE id = $5
      RETURNING *;
    `;
        const values = [doador_id, usuario_id, tipo_interacao, observacoes, id];

        const updatedInteracao = await pool.query(query, values);

        if (updatedInteracao.rows.length === 0) {
            return res.status(404).json({ error: "Interação não encontrada." });
        }

        res.status(200).json(updatedInteracao.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar a interação." });
    }
});

app.delete('/interacoes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM interacoes WHERE id = $1 RETURNING *;';
        const deletedInteracao = await pool.query(query, [id]);

        if (deletedInteracao.rows.length === 0) {
            return res.status(404).json({ error: "Interação não encontrada." });
        }

        res.status(200).json({ message: "Interação excluída com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao excluir a interação." });
    }
});


const bcrypt = require('bcrypt');
const saltRounds = 10; // Custo de processamento para o hash



// Usuários endpoints
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha, nivel_acesso } = req.body;

        // Criptografa a senha antes de salvar
        const hashedSenha = await bcrypt.hash(senha, saltRounds);

        const query = `
      INSERT INTO usuarios (nome, email, senha, nivel_acesso)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, nivel_acesso;
    `;
        const values = [nome, email, hashedSenha, nivel_acesso];

        const newUsuario = await pool.query(query, values);

        res.status(201).json(newUsuario.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao cadastrar o usuário." });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const query = 'SELECT id, nome, email, nivel_acesso FROM usuarios;';
        const allUsuarios = await pool.query(query);

        res.status(200).json(allUsuarios.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar a lista de usuários." });
    }
});
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, nivel_acesso } = req.body;

        const query = `
      UPDATE usuarios
      SET nome = $1, email = $2, nivel_acesso = $3
      WHERE id = $4
      RETURNING id, nome, email, nivel_acesso;
    `;
        const values = [nome, email, nivel_acesso, id];

        const updatedUsuario = await pool.query(query, values);

        if (updatedUsuario.rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        res.status(200).json(updatedUsuario.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar o usuário." });
    }
});
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id;';
        const deletedUsuario = await pool.query(query, [id]);

        if (deletedUsuario.rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao excluir o usuário." });
    }
});


// Doações endpoints
app.post('/doacoes', async (req, res) => {
    try {
        const { doador_id, valor, data_doacao, forma_pagamento, status } = req.body;

        const query = `
      INSERT INTO doacoes (doador_id, valor, data_doacao, forma_pagamento, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [doador_id, valor, data_doacao, forma_pagamento, status];

        const newDoacao = await pool.query(query, values);

        res.status(201).json(newDoacao.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao registrar a doação." });
    }
});
app.get('/doacoes', async (req, res) => {
    try {
        const query = 'SELECT * FROM doacoes;';
        const allDoacoes = await pool.query(query);

        res.status(200).json(allDoacoes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar a lista de doações." });
    }
});
app.put('/doacoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { doador_id, valor, data_doacao, forma_pagamento, status } = req.body;

        const query = `
      UPDATE doacoes
      SET doador_id = $1, valor = $2, data_doacao = $3, forma_pagamento = $4, status = $5
      WHERE id = $6
      RETURNING *;
    `;
        const values = [doador_id, valor, data_doacao, forma_pagamento, status, id];

        const updatedDoacao = await pool.query(query, values);

        if (updatedDoacao.rows.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }

        res.status(200).json(updatedDoacao.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar a doação." });
    }
});
app.delete('/doacoes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM doacoes WHERE id = $1 RETURNING *;';
        const deletedDoacao = await pool.query(query, [id]);

        if (deletedDoacao.rows.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }

        res.status(200).json({ message: "Doação excluída com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao excluir a doação." });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});