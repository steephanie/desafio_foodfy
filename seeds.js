const faker = require('faker-br');
const { hash } = require('bcryptjs');
const { arrayDB, validationOfRecipeInputs } = require('./src/lib/utils');

const User = require('./src/app/models/User');
const Recipe = require('./src/app/models/Recipe');
const File = require('./src/app/models/File');
const RecipesFile = require('./src/app/models/RecipesFiles');
const Chef = require('./src/app/models/Chef');

let usersId = [];
let chefsId = [];
let recipesId = [];

async function createUsers() {
  let users = [];

  // the password for all the users is '123'
  const password = await hash('123', 8);

  while (users.length < 3) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: password,
      is_admin: false,
    });
  }
  //Creating a user that is Admin
  users.push({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: password,
    is_admin: true,
  });

  const usersPromise = users.map((user) => User.create(user));

  usersId = await Promise.all(usersPromise);
}

async function createFiles() {
  let files = [];
  //let count = 1;
  /* 
    If you change the number of files generated you'll have to change the 
    functions 'createChefs' and 'createRecipes' cause they can't have
    the same file_id values.
  */

  while (files.length < 20) {
    files.push({
      name: faker.image.image(),
      path: `public/img-app/placeholder1.png`,
    });

    //count++;
  }

  const filesPromise = files.map((file) => File.create(file));

  filesId = await Promise.all(filesPromise);
}

async function createChefs() {
  let chefs = [];
  /* 
    Now I need to guarantee that each chef has different file_id
  */
  let count = 1;

  while (chefs.length < 5) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: count,
    });
    count++;
  }

  const chefsPromise = chefs.map((chef) => Chef.create(chef));

  chefsId = await Promise.all(chefsPromise);
}

async function createRecipes() {
  let recipes = [];

  let ingredient = [];
  let preparation = [];

  ingredient.push(faker.random.word());
  preparation.push(faker.random.word());

  //creates 20 recipes
  while (recipes.length < 15) {
    const randomChefId = Math.ceil(Math.random() * chefsId.length);
    const randomUserId = Math.ceil(Math.random() * usersId.length);

    recipes.push({
      chef_id: randomChefId,
      user_id: randomUserId,
      title: faker.name.title(),
      //with ArrayDB the return result will be in the format of array for the Postgres
      ingredients: arrayDB(ingredient),
      preparation: arrayDB(preparation),
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
    });
  }

  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));

  recipesId = await Promise.all(recipesPromise);
}

async function createRecipeFiles() {
  let recipeFiles = [];
  let count = 6;

  while (recipeFiles.length < recipesId.length) {
    recipesId.forEach((recipeId) => {
      //This way each recipe will have a different file_id for them and the chefs

      const obj = {
        recipe_id: recipeId,
        file_id: count,
      };

      recipeFiles.push(obj);
      count++;
    });
  }

  const recipesPromise = recipeFiles.map((recipeFileObj) =>
    RecipesFile.create(recipeFileObj)
  );

  await Promise.all(recipesPromise);
}

async function init() {
  await createUsers();
  await createFiles();
  await createChefs();
  await createRecipes();
  await createRecipeFiles();
}

init();
