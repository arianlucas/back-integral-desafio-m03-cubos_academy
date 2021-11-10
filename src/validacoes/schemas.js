const yup = require("./configuracoes");

const schemaCadastrarUsuario = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required().min(5),
  nome_loja: yup.string().required(),
});

const schemaAtualizarUsuario = yup.object().shape({
  nome: yup.string(),
  email: yup.string().email(),
  senha: yup.string().min(5),
  nome_loja: yup.string(),
});

const schemaLogin = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().required().min(5),
});

const schemaCadastrarProduto = yup.object().shape({
  nome: yup.string().required(),
  quantidade: yup.number().required(),
  preco: yup.number().required(),
  descricao: yup.string().required(),
});

const schemaAtualizarProduto = yup.object().shape({
  nome: yup.string(),
  quantidade: yup.number(),
  preco: yup.number(),
  descricao: yup.string(),
});

module.exports = {
  schemaCadastrarUsuario,
  schemaAtualizarUsuario,
  schemaLogin,
  schemaCadastrarProduto,
  schemaAtualizarProduto,
};
