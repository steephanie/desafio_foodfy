const db = require('../../config/db');

const Base = require('../models/Base');

Base.init({ table: 'chefs' });

module.exports = {
  ...Base,
  chefsIdAndNames() {
    try {
      const query = `
          SELECT id, name FROM chefs
      `;

      return db.query(query);
    } catch (error) {
      console.error(error);
    }
  },

  async show(filters) {
    try {
      let query = `
          SELECT DISTINCT ON (chefs.id)chefs.*, (SELECT count(*) FROM recipes WHERE chefs.id=recipes.chef_id) AS qt_recipes,
            files.id AS file_id, files.path AS file_path, files.name AS file_name
          FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
          INNER JOIN files ON (chefs.file_id = files.id)
      `;

      if (filters) {
        Object.keys(filters).map((key) => {
          //WHERE | OR | AND
          query = `
            ${query}
            ${key}
          `;

          Object.keys(filters[key]).map((field) => {
            query = `${query} ${field} = '${filters[key][field]}'`;
          });
        });
        // console.log(query);
      }

      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },

  quantityOfRecipes(chefID) {
    try {
      const query = `
        SELECT DISTINCT ON (chefs.id)chefs.*,
          (SELECT count(*) FROM recipes WHERE chefs.id=recipes.chef_id) AS qt_recipes
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
      `;

      return db.query(query, [chefID]);
    } catch (error) {
      console.error(error);
    }
  },

  showChefsRecipes(id) {
    try {
      const query = `
          SELECT DISTINCT recipes.*, chefs.name AS chef,
            files.path AS file_path, files.name AS file_name
          FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
          INNER JOIN files ON (recipe_files.file_id = files.id)
          INNER JOIN chefs ON (recipes.chef_id = chefs.id)
          WHERE recipes.chef_id = $1
          ORDER BY recipes.created_at DESC
        `;

      return db.query(query, [id]);
    } catch (error) {
      console.error(error);
    }
  },
};
