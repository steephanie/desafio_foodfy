const crypto = require('crypto');
const { hash } = require('bcryptjs');
const mailer = require('../../config/mailer');

const User = require('../models/User');

const { removingWhiteSpacesInBeginningAndEnding } = require('../../lib/utils');

module.exports = {
  async list(req, res) {
    try {
      const users = await User.find();

      return res.render('admin/users/list', {
        users: users,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;

      const user = await User.find({ where: { id } });

      return res.render('admin/users/edit', {
        userIsAdmin: req.user.is_admin,
        user: user[0],
      });
    } catch (error) {
      console.error(error);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async create(req, res) {
    try {
      return res.render('admin/users/create', {
        userIsAdmin: req.user.is_admin,
      });
    } catch (error) {
      console.error(error);
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`admin/home/index`, {
        error: 'Erro inesperado!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }
  },

  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;

      const password = crypto.randomBytes(5).toString('hex');
      const passwordHash = await hash(password, 8);

      const emailFiltered = String(email).toLowerCase();

      const token = crypto.randomBytes(20).toString('hex');

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      const user = {
        name: removingWhiteSpacesInBeginningAndEnding(name),
        email: removingWhiteSpacesInBeginningAndEnding(emailFiltered),
        password: passwordHash,
        is_admin: is_admin || false,
        reset_token: token,
        reset_token_expires: now,
      };

      await User.create(user);

      const users = await User.find();

      const mailMessage = {
        from: 'no-reply@foodfy.com.br',
        to: `${user.email}`,
        subject: 'Conta cadastrada com sucesso!',
        html: `
          <h1 style="text-align=center">
            Sua conta foi registrada com sucesso!
          </h1>
          <p>
            Seu email é ${user.email} e sua senha é ${password}.
            <br>
            Recomendamos que troque a sua senha o quanto antes, faça isso
            <a href="http://localhost:3000/users/reset-password?token=${token}">aqui</a>.
            <br>
            <h2>
              Esse link tem validade de 1 hora.
            </h2>
          </p>
          `,
      };

      await mailer.sendMail(mailMessage);

      return res.render('admin/users/list', {
        users: users,
        userIsAdmin: req.user.is_admin,
        success:
          'Usuário Cadastrado com sucesso! Por favor verifique o seu email.',
      });
    } catch (err) {
      console.error(err);
      const users = await User.find();

      return res.render('admin/users/list', {
        users: users,
        userIsAdmin: req.user.is_admin,
        error: 'Erro inesperado!',
      });
    }
  },

  async put(req, res) {
    try {
      const { id, name, email, is_admin } = req.body;

      const user = {
        name: removingWhiteSpacesInBeginningAndEnding(name),
        email: removingWhiteSpacesInBeginningAndEnding(email),
        is_admin: is_admin || false,
      };

      await User.update({ id }, user);
      const users = await User.find();

      return res.render('admin/users/list', {
        success: `Dados do usuário foram atualizados com sucesso!`,
        users: users,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
      const users = await User.find();

      return res.render('admin/users/list', {
        users: users,
        userIsAdmin: req.user.is_admin,
        error: 'Erro inesperado!',
      });
    }
  },

  async delete(req, res) {
    try {
      await User.delete(req.userID);
      const users = await User.find();

      return res.render('admin/users/list', {
        success: 'Usuário deletado com sucesso!',
        users: users,
        userIsAdmin: req.user.is_admin,
      });
    } catch (err) {
      console.error(err);
      const users = await User.find();

      return res.render('admin/users/list', {
        users: users,
        userIsAdmin: req.user.is_admin,
        error: 'Erro inesperado!',
      });
    }
  },
};
