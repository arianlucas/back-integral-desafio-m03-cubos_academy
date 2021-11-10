const knex = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");
const {
  schemaCadastrarUsuario,
  schemaAtualizarUsuario,
} = require("../validacoes/schemas");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  try {
    await schemaCadastrarUsuario.validate(req.body);

    const emailExistente = await knex("usuarios")
      .where({ email: email })
      .first()
      .debug();

    if (emailExistente) {
      return res.status(400).json("O email já existe no sistema.");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .insert([
        {
          nome: nome,
          nome_loja: nome_loja,
          email: email,
          senha: senhaCriptografada,
        },
      ])
      .debug();

    if (usuario.length === 0) {
      return res.status(400).json("O usuário não foi cadastrado.");
    }

    return res.status(200).json("O usuario foi cadastrado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterPerfil = async (req, res) => {
  return res.status(200).json(req.usuario);
};

const atualizarPerfil = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  try {
    await schemaAtualizarUsuario.validate(req.body);
    const body = {};

    if (nome) {
      body.nome = nome;
    }

    if (email) {
      if (email !== req.usuario.email) {
        const buscarEmail = await knex("usuarios")
          .where({ email: email })
          .first();

        if (buscarEmail) {
          return res.status(400).json("O email já existe");
        }
      }

      body.email = email;
    }

    if (senha) {
      body.senha = await bcrypt.hash(senha, 10);
    }

    if (nome_loja) {
      body.nome_loja = nome_loja;
    }

    const usuarioAtualizado = await knex("usuarios")
      .where({ id: req.usuario.id })
      .update(body)
      .debug();

    if (!usuarioAtualizado) {
      return res.status(400).json("O usuario não foi atualizado");
    }

    return res.status(200).json("Usuario foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  obterPerfil,
  atualizarPerfil,
};
