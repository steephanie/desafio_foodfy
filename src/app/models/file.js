const db = require('../../config/db');

const Base = require('../models/Base');

Base.init({ table: 'files' });

module.exports = {
  ...Base,
  showRecipeFiles(recipe_ID) {
    try {
      const query = `
          SELECT files.id AS file_id, files.name AS file_name, files.path AS file_path
          FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
          WHERE recipe_files.recipe_id = $1
        `;

      return db.query(query, [recipe_ID]);
    } catch (error) {
      console.error(error);
    }
  },

  showAll() {
    try {
      const query = `SELECT recipe_files.recipe_id,files.name AS file_name, files.path AS file_path
      FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)`;

      return db.query(query);
    } catch (error) {
      console.error(error);
    }
  },

  showChefAvatarFile(chef_ID) {
    try {
      const query = `
          SELECT files.*
          FROM chefs LEFT JOIN files ON (chefs.file_id = files.id)
          WHERE chefs.id = $1
        `;

      return db.query(query, [chef_ID]);
    } catch (error) {
      console.error(error);
    }
  },

  show(fileID) {
    try {
      const query = `
          SELECT files.id AS file_id, files.name AS file_name, files.path AS file_path
          FROM recipe_files LEFT JOIN files ON (recipe_files.file_id = files.id)
          WHERE recipe_files.file_id = $1
        `;

      return db.query(query, [fileID]);
    } catch (error) {
      console.error(error);
    }
  },
};
