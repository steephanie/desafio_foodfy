const db = require('../../config/db');
const { arrayDB } = require('../../lib/utils');

const Base = require('../models/Base');

Base.init({ table: 'recipes' });

module.exports = {
  ...Base,
  allRecipes() {
    try {
      return db.query('SELECT * FROM recipes');
    } catch (error) {
      console.error(error);
    }
  },
  async find(filters) {
    try {
      let query = `
          SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
          FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
          INNER JOIN files ON (recipe_files.file_id = files.id)
          INNER JOIN chefs ON (recipes.chef_id = chefs.id)`;

      if (filters) {
        // console.log(Object.values(filters));
        Object.keys(filters).map((key) => {
          //WHERE | OR | AND
          query = `
            ${query}
            ${key}
          `;

          Object.keys(filters[key]).map((field) => {
            // console.log(field);
            query = `${query} ${field} = '${filters[key][field]}'`;
          });
        });
      }

      // console.log(query);
      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },

  async searchFilter(filters) {
    try {
      let query = `
          SELECT recipes.*, files.name AS file_name,
              files.path AS file_path, chefs.name AS chef
          FROM recipe_files LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
          INNER JOIN files ON (recipe_files.file_id = files.id)
          INNER JOIN chefs ON (recipes.chef_id = chefs.id)`;

      Object.keys(filters).map((key) => {
        //WHERE | OR | AND
        query = `
            ${query}
            ${key}
          `;

        Object.keys(filters[key]).map((field) => {
          query = `${query} ${field} ILIKE '%${filters[key][field]}%'`;
        });
      });

      query = `
          ${query}
          ORDER BY recipes.created_at DESC
        `;

      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },
};
