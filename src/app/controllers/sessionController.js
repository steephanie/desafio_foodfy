const crypto = require('crypto');
const { hash } = require('bcryptjs');
const mailer = require('../../config/mailer');

const User = require('../models/User');

module.exports = {
  async loginForm(req, res) {
    try {
      if (!req.session.userID) {
        return res.render('session/login');
      }
    } catch (error) {
      console.error(error);
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render('main/home/index', {
        recipes,
        error: 'Erro Inesperado!',
      });
    }
  },

  async forgotForm(req, res) {
    try {
      return res.render('session/forgot-password');
    } catch (error) {
      console.error(error);
      return res.render('session/login', {
        error: 'Erro inesperado, tente novamente.',
        user: req.body,
      });
    }
  },

  async resetForm(req, res) {
    try {
      const { token } = req.query;
      return res.render('session/reset-password', { token: token });
    } catch (error) {
      console.error(error);
      return res.render('session/login', {
        error: 'Erro inesperado, tente novamente.',
        user: req.body,
      });
    }
  },

  async login(req, res) {
    try {
      const userID = req.user.id;
      req.session.userID = userID;

      if (req.user.is_admin) return res.redirect('/admin/users');

      return res.redirect('/admin/profile');
    } catch (error) {
      console.error(error);
      return res.render('session/login', {
        error: 'Erro inesperado, tente novamente.',
        user: req.body,
      });
    }
  },

  async logout(req, res) {
    try {
      req.session.destroy();

      //console.log("yeah!");
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return res.render('session/login', {
        error: 'Erro inesperado, tente novamente.',
      });
    }
  },

  async forgot(req, res) {
    try {
      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      const expireHour = now.setHours(now.getHours() + 1);

      await User.updating(req.user.id, {
        reset_token: token,
        reset_token_expires: expireHour,
      });

      const mailMessage = {
        from: 'no-reply@foodfy.com.br',
        to: `${req.user.email}`,
        subject: 'Recuperar Senha!',
        html: `
            <h1 style="text-align=center">
              Recuperação de senha.
            </h1>
            <p>
              Para recuperar a sua senha clique
              <a href="http://localhost:3000/users/reset-password?token=${token}">aqui</a>.
              <br>
              <h2>
                Esse link tem validade de 1 hora.
              </h2>
            </p>
            `,
      };
      await mailer.sendMail(mailMessage);

      return res.render('main/home/index', {
        success: 'Recuperação de senha enviada para o seu email!',
      });
    } catch (error) {
      console.error(error);
      return res.render('session/login', {
        error: 'Erro inesperado, tente novamente.',
        user: req.body,
      });
    }
  },

  async reset(req, res) {
    try {
      const { password } = req.body;

      const passwordHash = await hash(password, 8);

      await User.update(
        { id: req.user.id },
        {
          password: passwordHash,
          reset_token: '',
          reset_token_expires: '',
        }
      );

      return res.render('session/login', {
        success: 'Senha alterada com sucesso!',
      });
    } catch (error) {
      console.error(error);
      return res.render('session/login', {
        error: 'Erro inesperado, tente novamente.',
        user: req.body,
      });
    }
  },
};
