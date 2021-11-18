const db = require('../../config/db');

const Base = require('../models/Base');

Base.init({ table: 'recipe_files' });

module.exports = {
  ...Base,

  showAllRecipesFiles(recipeID) {
    try {
      const query = `
              SELECT * FROM recipe_files
              WHERE recipe_id=$1
              `;

      return db.query(query, [recipeID]);
    } catch (error) {
      console.error(error);
    }
  },
};
