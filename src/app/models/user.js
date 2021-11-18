const db = require('../../config/db');

const Base = require('../models/Base');

Base.init({ table: 'users' });

module.exports = {
  ...Base,
  async find(filters) {
    try {
      let query = 'SELECT * FROM users';

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
      }
      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },
};
