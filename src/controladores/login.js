const knex = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { schemaLogin } = require("../validacoes/schemas");

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    await schemaLogin.validate(req.body);

    const buscarUser = await knex("usuarios").where({ email: email }).first();

    if (!buscarUser) {
      return res.status(400).json("O usuario não foi encontrado");
    }

    const senhaCorreta = await bcrypt.compare(senha, buscarUser.senha);

    if (!senhaCorreta) {
      return res.status(400).json("Email e senha não confere");
    }

    const token = jwt.sign({ id: buscarUser.id }, process.env.JWT_HASH, {
      expiresIn: "8h",
    });

    const { senha: _, ...dadosUsuario } = buscarUser;

    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  login,
};
