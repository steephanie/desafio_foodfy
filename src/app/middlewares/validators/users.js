const User = require('../../models/User');
const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');

const {
  formatPath,
  validationOfBlankFields,
  renderingRecipesWithOnlyOneFile,
} = require('../../../lib/utils');

async function login(req, res, next) {
  try {
    if (req.session.userID) {
      const user = await User.find({ where: { id: req.session.userID } });

      if (user[0].is_admin) {
        const allUsers = await User.find();
        return res.render('admin/users/list', {
          success: 'Você está logado!',
          users: allUsers,
          userIsAdmin: user[0].is_admin,
        });
      }

      req.user = user;
      return res.render('admin/users/profile', {
        success: 'Você está logado!',
        user: user[0],
      });
    }

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`main/home/index`, {
      error: 'Erro inesperado!',
      recipes: recipes,
    });
  }
}
async function isLogged(req, res, next) {
  try {
    if (!req.session.userID) {
      const errorCreate =
        'Crie uma conta para ter acesso a essa funcionalidade!';
      return res.render('session/login', { error: errorCreate });
    }

    const user = await User.find({ where: { id: req.session.userID } });

    req.user = user[0];

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`main/home/index`, {
      error: 'Erro inesperado!',
      recipes: recipes,
    });
  }
}
async function isAdmin(req, res, next) {
  try {
    const userID = req.session.userID;
    if (!userID) {
      const errorCreate =
        'Crie uma conta para ter acesso a essa funcionalidade!';
      return res.render('session/login', { error: errorCreate });
    }

    const user = await User.find({ where: { id: userID } });

    if (!user[0].is_admin) {
      let results = await Chef.show();
      const chefsWithAvatarPathFormated = formatPath(results, req);

      return res.render(`admin/chefs/list`, {
        error: 'Apenas o usuário Admin tem acesso a essa funcionalidade!',
        chefs: chefsWithAvatarPathFormated,
        userIsAdmin: user.is_admin,
      });
    }
    req.user = user[0];

    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);

    recipes = recipes.slice(0, 6);
    return res.render(`main/home/index`, {
      error: 'Erro inesperado!',
      recipes: recipes,
    });
  }
}
async function checkRecipeOwner(req, res, next) {
  try {
    if (!req.user.is_admin) {
      let results = await Recipe.find({
        where: { user_id: req.session.userID },
      });

      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results, req);

      const userRecipesId = recipes.map((recipe) => recipe.id);

      const passed = userRecipesId.some(
        (currentId) => req.params.id == currentId
      );

      if (!passed) {
        recipes = formatPath(recipes, req);

        return res.render('admin/home/index', {
          error: 'Essa receita não é sua para editar!',
          recipes: recipes,
          userIsAdmin: req.user.is_admin,
        });
      }
    }
    next();
  } catch (error) {
    console.error(error);
    let results = await Recipe.find({ where: { user_id: req.session.userID } });
    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);
    return res.render(`admin/home/index`, {
      error: 'Erro inesperado!',
      recipes: recipes,
      userIsAdmin: req.user.is_admin,
    });
  }
}
async function checkInputFieldsUserPost(req, res, next) {
  try {
    const { email } = req.body;
    const validation = validationOfBlankFields(req.body);
    if (validation) {
      return res.render('admin/users/create', {
        error: 'Por favor, preencha todos os campos!',
        input: validation,
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    const emailExists = await User.find({ where: { email: email } });

    if (emailExists[0]) {
      return res.render('admin/users/create', {
        error: 'Esse email já existe em nossa base de dados!',
        input: 'email',
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    const allUsers = await User.find();
    return res.render('admin/users/list', {
      error: 'Erro inesperado!',
      users: allUsers,
      userIsAdmin: req.user.is_admin,
    });
  }
}
async function checkInputFieldsUserPut(req, res, next) {
  try {
    const { email } = req.body;
    const validation = validationOfBlankFields(req.body);

    if (validation) {
      return res.render('admin/users/edit', {
        error: 'Por favor, preencha todos os campos!',
        input: validation,
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    const emailExists = await User.find({ where: { email: email } });
    const userBeingUpdated = await User.find({ where: { id: req.body.id } });

    if (
      emailExists.length > 0 &&
      emailExists[0].id !== userBeingUpdated[0].id
    ) {
      return res.render('admin/users/edit', {
        error: 'Esse email já existe em nossa base de dados!',
        input: 'email',
        user: req.body,
        userIsAdmin: req.user.is_admin,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    const allUsers = await User.find();
    return res.render('admin/users/list', {
      error: 'Erro inesperado!',
      users: allUsers,
      userIsAdmin: req.user.is_admin,
    });
  }
}

async function checkIfUserBeingDeletedIsAdmin(req, res, next) {
  try {
    const { id } = req.body;

    const user = await User.find({ where: { id: id } });

    if (user[0].is_admin) {
      console.log('yeahh');
      const allUsers = await User.find();
      return res.render('admin/users/list', {
        error: 'Usuário administrador não pode ser deletado!',
        users: allUsers,
        userIsAdmin: req.user.is_admin,
      });
    }

    req.userID = id;
    next();
  } catch (error) {
    console.error(error);
    const allUsers = await User.find();
    return res.render('admin/users/list', {
      error: 'Erro inesperado!',
      users: allUsers,
      userIsAdmin: req.user.is_admin,
    });
  }
}

module.exports = {
  isLogged,
  isAdmin,
  login,
  checkRecipeOwner,
  checkInputFieldsUserPost,
  checkInputFieldsUserPut,
  checkIfUserBeingDeletedIsAdmin,
};
