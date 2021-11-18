const {
  validationOfBlankFields,
  validationOfRecipeInputs,
  renderingRecipesWithOnlyOneFile,
  formatPath,
} = require('../../../lib/utils');

const Chef = require('../../models/Chef');
const RecipesFiles = require('../../models/RecipesFiles');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');

async function checkInputImagesForPost(req, res, next) {
  try {
    //Validation of quantity of images sent
    if (req.files.length === 0) {
      return res.render('/admin/recipes/create', {
        error: 'Por favor! envie ao menos uma imagem!',
        recipe: req.body,
        chefs: req.chefs,
        userIsAdmin: req.user.is_admin,
      });
    }

    //making sure that the maximum images sent is 5!
    if (req.files.length > 5) {
      return res.render('/admin/recipes/edit', {
        error: 'Por favor! envie no máximo 5 imagens!',
        recipe: req.body,
        chefs: req.chefs,
        userIsAdmin: req.user.is_admin,
      });
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

async function checkInputImagesForPut(req, res, next) {
  try {
    const { removed_files } = req.body;

    const results = await RecipesFiles.showAllRecipesFiles(req.body.id);
    const recipesFiles = results.rows;

    /*
    Making an array out of a string in req.body.removed_files
    and popping its last index because it's a comma.
    */
    let imagesRemoved = removed_files.split(',');
    imagesRemoved.pop();

    if (imagesRemoved.length >= recipesFiles.length && req.files.length === 0) {
      return res.render(`admin/recipes/edit`, {
        error: 'Por favor, envie ao menos uma imagem!',
        recipe: req.body,
        chefs: req.chefs,
        userIsAdmin: req.user.is_admin,
      });
    }

    //making sure that the maximum images sent is 5!
    const totalImagesSent = recipesFiles.length + req.files.length;
    if (totalImagesSent > 5) {
      return res.render('/admin/recipes/edit', {
        error: 'Por favor! envie no máximo 5 imagens!',
        recipe: req.body,
        chefs: req.chefs,
        userIsAdmin: req.user.is_admin,
      });
    }

    req.imagesRemoved = imagesRemoved;

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

async function checkInputFields(req, res, next) {
  try {
    const { ingredients, preparation } = req.body;

    const result = await Chef.chefsIdAndNames();
    const chefs = result.rows;

    const validation = validationOfBlankFields(req.body);

    if (validation) {
      //this way if the user got some error the images uploaded won't disappear,
      //therefore they won't be needed to select the images sent
      // all over again
      const results = await File.showRecipeFiles(req.body.id);

      const files = formatPath(results.rows, req);
      return res.render('admin/recipes/create', {
        error: 'Por favor, preencha todos os campos!',
        input: validation,
        recipe: req.body,
        recipeFiles: files,
        chefs: chefs,
        userIsAdmin: req.user.is_admin,
      });
    }
    const createdRecipe = {
      ...req.body,
      ingredients: validationOfRecipeInputs(ingredients),
      preparation: validationOfRecipeInputs(preparation),
    };

    req.recipe = createdRecipe;
    req.chefs = chefs;

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
    });
  }
}

async function checkIfRecipesExists(req, res, next) {
  try {
    const results = await Recipe.find();

    //Showing only one recipe instead of one recipe per file.
    let recipes = renderingRecipesWithOnlyOneFile(results);

    recipes = formatPath(recipes, req);

    const recipesID = recipes.map((recipe) => recipe.id);

    const found = recipesID.some((recipeID) => {
      if (recipeID == req.params.id) {
        return recipeID;
      }
    });

    if (!found) {
      return res.render('admin/home/index', {
        error: 'Essa receita não existe no banco de dados!',
        recipes: recipes,
        userIsAdmin: req.user.is_admin,
      });
    }

    next();
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
    });
  }
}

module.exports = {
  checkInputFields,
  checkInputImagesForPost,
  checkInputImagesForPut,
  checkIfRecipesExists,
};
