module.exports = {
  //Function guarantees that the arrays are set for the database
  arrayDB(array) {
    let newArray = [];

    for (let i of array) {
      i = `"${i}"`;
      newArray.push(i);
    }

    return `{${newArray}}`;
  },

  /* Function guarantees that inputs that are arrays don't have blank content
  inside it like ""
  */
  validationOfRecipeInputs(inputs) {
    let newInputs = [];
    for (let i = 0; i < inputs.length; i++) {
      const inputClone = inputs[i].trim();

      if (inputClone != '') {
        newInputs.push(inputs[i]);
      }
    }

    return newInputs;
  },

  removingWhiteSpacesInBeginningAndEnding(value) {
    let newValue = value.replace(/^\s+|\s+$/g, '');

    return newValue;
  },

  emailValidation(email) {
    const filterRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const passed = filterRegex.test(String(email).toLocaleLowerCase());

    //console.log(passed);

    return passed;
  },

  validationOfBlankFields(fields) {
    const keys = Object.keys(fields);

    // console.log(fields);

    for (const key of keys) {
      if (
        fields[key] == '' &&
        key != 'removed_files' &&
        key != 'information' &&
        key != 'file_id' &&
        key != 'is_admin'
      ) {
        return key;
      }
    }
    return false;
  },
  formatPath(files, req) {
    let photos = files.map((file) => ({
      ...file,
      file_path: `${req.protocol}://${req.headers.host}${file.file_path
        .replace('public', '')
        .split('\\')
        .join('/')}`,
    }));

    return photos;
  },

  //Assigning each file to the related recipe
  assignFilesToRecipes(recipes, files) {
    let recipesWithFiles = [];
    recipes.forEach((recipe) => {
      let recipeImages = [];
      files.forEach((file) => {
        if (recipe.id === file.recipe_id) {
          recipeImages.push({
            fileName: file.file_name,
            filePath: file.file_path,
          });
        }
      });
      const recipeWithFiles = {
        ...recipe,
        files: recipeImages,
      };

      recipesWithFiles.push(recipeWithFiles);
    });
    return recipesWithFiles;
  },

  renderingRecipesWithOnlyOneFile(recipes) {
    const filteredRecipes = recipes.reduce((recipesFiltered, recipe) => {
      const found = recipesFiltered.some(
        (currRecipe) => currRecipe.id === recipe.id
      );

      if (!found) recipesFiltered.push(recipe);

      return recipesFiltered;
    }, []);

    return filteredRecipes;
  },
};
