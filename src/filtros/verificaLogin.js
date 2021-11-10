const knex = require("../bancodedados/conexao");
const jwt = require("jsonwebtoken");

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado.");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, process.env.JWT_HASH);

    const usuarioLogado = await knex("usuarios").where({ id: id }).first();

    if (!usuarioLogado) {
      return res.status(404).json("Usuario não encontrado");
    }

    const { senha, ...usuario } = usuarioLogado;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(400).json("Sessão expirada, refaça o login.");
  }
};

module.exports = verificaLogin;
