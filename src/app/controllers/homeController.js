const Recipe = require('../models/Recipe');

const {
  formatPath,
  renderingRecipesWithOnlyOneFile,
} = require('../../lib/utils');

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipe.find();

      let recipes = formatPath(results, req);

      //Showing only one recipe instead of one recipe per file.
      recipes = renderingRecipesWithOnlyOneFile(recipes);

      recipes = recipes.slice(0, 6);

      return res.render('main/home/index', { recipes });
    } catch (err) {
      console.error(err);
      return res.render(`main/home/about`, {
        error: 'Erro inesperado!',
      });
    }
  },
};
