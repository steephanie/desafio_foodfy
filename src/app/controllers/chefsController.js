const File = require('../models/File');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const {
  formatPath,
  removingWhiteSpacesInBeginningAndEnding,
  renderingRecipesWithOnlyOneFile,
} = require('../../lib/utils');

const fs = require('fs');

module.exports = {
  async list(req, res) {
    try {
      const results = await Chef.show();
      const chefsWithAvatarPathFormated = formatPath(results, req);

      return res.render('main/chefs/list', {
        chefs: chefsWithAvatarPathFormated,
        userLogged: req.user,
      });
    } catch (err) {
      console.error(err);
      let results = await Recipe.find();
      //Showing only one recipe instead of one recipe per file.
      let recipes = renderingRecipesWithOnlyOneFile(results);

      recipes = formatPath(recipes, req);
      return res.render(`main/home/index`, {
        error: 'Erro inesperado!',
        recipes: recipes,
      });
    }
  },

  async create(req, res) {
    try {
      return res.render('admin/chefs/create', {
        userIsAdmin: req.user.is_admin,
      });
    } catch (error) {
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

  async show(req, res) {
    try {
      const { id } = req.params;

      let results = await Chef.show({ where: { 'chefs.id': id } });
      const chefWithAvatarPathFormated = formatPath(results, req);

      results = await Chef.showChefsRecipes(id);
      let recipes = formatPath(results.rows, req);

      recipes = renderingRecipesWithOnlyOneFile(recipes);

      return res.render('admin/chefs/show', {
        chef: chefWithAvatarPathFormated[0],
        recipes,
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

      let result = await Chef.show({ where: { 'chefs.id': id } });
      const chefWithAvatarPathFormated = formatPath(result, req);

      return res.render('admin/chefs/edit', {
        chef: chefWithAvatarPathFormated[0],
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

  async post(req, res) {
    try {
      const fileID = await File.create({
        name: req.files[0].filename,
        path: req.files[0].path,
      });

      const chefName = removingWhiteSpacesInBeginningAndEnding(req.body.name);

      const chefID = await Chef.create({ name: chefName, file_id: fileID });

      //rendering all the elements for the chefs page
      let results = await Chef.show();
      const chefsWithAvatarPathFormated = formatPath(results, req);

      return res.render(`admin/chefs/list`, {
        success: 'Chef criado(a) com sucesso!',
        chefs: chefsWithAvatarPathFormated,
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

  async put(req, res) {
    try {
      let results = '';

      if (req.files.length != 0) {
        //getting the old file path to delete from server.
        results = await File.showChefAvatarFile(req.body.id);
        const oldFile = results.rows[0];

        await File.update(
          { id: oldFile.id },
          {
            name: req.files[0].filename,
            path: req.files[0].path,
          }
        );
        //deleting file removed from server.
        if (fs.existsSync(oldFile.path)) {
          fs.unlinkSync(oldFile.path);
        }
      }

      await Chef.update({ id: req.body.id }, { name: req.body.name });

      //rendering all the elements for the chefs page
      results = await Chef.show();
      const chefsWithAvatarPathFormated = formatPath(results, req);

      return res.render(`admin/chefs/list`, {
        success: 'Chef atualizado(a) com sucesso!',
        chefs: chefsWithAvatarPathFormated,
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

  async delete(req, res) {
    try {
      const { id, file_id } = req.body;

      let results = await File.showChefAvatarFile(id);
      const file_path = results.rows[0].path;

      await Chef.delete(id);
      await File.delete(file_id);

      //deleting file removed from server.
      if (fs.existsSync(file_path)) {
        fs.unlinkSync(file_path);
      }

      //rendering all the elements for the chefs page
      results = await Chef.show();
      const chefsWithAvatarPathFormated = formatPath(results, req);

      return res.render(`admin/chefs/list`, {
        success: 'Chef deletado(a) com sucesso!',
        chefs: chefsWithAvatarPathFormated,
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
};
