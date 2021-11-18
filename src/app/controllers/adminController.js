const Recipe = require('../models/Recipe');
const File = require('../models/File');
const Chef = require('../models/Chef');
const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
} = require('../../lib/utils');

module.exports = {
  async index(req, res) {
    try {
      let results = '';
      let recipes = '';

      if (req.user.is_admin) {
        results = await Recipe.find();

        recipes = formatPath(results, req);

        //Showing only one recipe instead of one recipe per file.
        recipes = renderingRecipesWithOnlyOneFile(recipes);
      } else {
        results = await Recipe.find({
          where: { 'recipes.user_id': req.session.userID },
        });

        recipes = formatPath(results, req);

        //Showing only one recipe instead of one recipe per file.
        recipes = renderingRecipesWithOnlyOneFile(recipes);
      }

      return res.render('admin/home/index', {
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
      recipes = recipes.slice(0, 6);
      return res.render(`main/home/index`, {
        error: 'Erro inesperado!',
        recipes: recipes,
      });
    }
  },

  async showRecipe(req, res) {
    try {
      const { id } = req.params;

      let result = await Recipe.find({ where: { 'recipes.id': id } });
      const recipe = result[0];

      result = await File.showRecipeFiles(id);
      //Formatting the path of the photos to send to the front-end
      let recipeFiles = formatPath(result.rows, req);

      return res.render('admin/recipes/show', {
        recipe,
        files: recipeFiles,
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

  //CHEFS functions
  async listChef(req, res) {
    try {
      const results = await Chef.show();
      const chefsWithAvatarFormated = formatPath(results, req);

      return res.render('admin/chefs/list', {
        chefs: chefsWithAvatarFormated,
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

  // USERS functions
};
