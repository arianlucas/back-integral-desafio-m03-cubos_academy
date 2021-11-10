const knex = require("../bancodedados/conexao");
const {
  schemaCadastrarProduto,
  schemaAtualizarProduto,
} = require("../validacoes/schemas");

const listarProdutos = async (req, res) => {
  const { usuario } = req;
  const { categoria } = req.query;

  try {
    const produtos = await knex("produtos")
      .where({ usuario_id: usuario.id })
      .where((builder) => {
        if (categoria) {
          builder.where("categoria", "ilike", `%${categoria}%`);
        }
      });

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const produto = await knex("produtos")
      .where({ usuario_id: usuario.id, id })
      .first();

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarProduto = async (req, res) => {
  const { usuario } = req;
  const { nome, quantidade, preco, categoria, descricao, imagem } = req.body;

  try {
    await schemaCadastrarProduto.validate(req.body);

    const produto = await knex("produtos").insert([
      {
        usuario_id: usuario.id,
        nome,
        quantidade,
        preco,
        categoria,
        descricao,
        imagem,
      },
    ]);

    if (!produto) {
      return res.status(400).json("O produto não foi cadastrado");
    }

    return res.status(200).json("O produto foi cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nome, quantidade, preco, categoria, descricao, imagem } = req.body;

  if (!nome && !quantidade && !preco && !categoria && !descricao && !imagem) {
    return res.status(404).json("Informe ao menos um campo para atualização.");
  }

  try {
    await schemaAtualizarProduto.validate(req.body);

    const produto = await knex("produtos")
      .where({ usuario_id: usuario.id, id })
      .first();

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    const body = {};

    if (nome) {
      body.nome = nome;
    }

    if (quantidade) {
      body.quantidade = quantidade;
    }

    if (categoria) {
      body.categoria = categoria;
    }

    if (descricao) {
      body.descricao = descricao;
    }

    if (preco) {
      body.preco = preco;
    }

    if (imagem) {
      body.imagem = imagem;
    }
    const produtoAtualizado = await knex("produtos").where({ id }).update(body);

    if (produtoAtualizado === 0) {
      return res.status(400).json("O produto não foi atualizado");
    }

    return res.status(200).json("Produto foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const produto = await knex("produtos")
      .where({ usuario_id: usuario.id, id })
      .first();

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    const produtoExcluido = await knex("produtos").where({ id }).del();

    if (produtoExcluido === 0) {
      return res.status(400).json("O produto não foi excluido");
    }

    return res.status(200).json("Produto excluido com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto,
};
