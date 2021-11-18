const db = require('../../config/db');

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid Params');

    this.table = table;

    return this;
  },

  async finding(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = ${id}`;

    const results = await db.query(query);

    return results.rows[0];
  },

  async create(fields) {
    try {
      const keys = Object.keys(fields).join(',');
      const values = Object.values(fields)
        .map((value) => `'${value}'`)
        .join(',');

      const query = `
      INSERT INTO ${this.table} (${keys}) 
      VALUES (${values}) RETURNING id`;

      const results = await db.query(query);

      return results.rows[0].id;
    } catch (error) {
      console.error(error);
    }
  },

  async update({ id }, fields) {
    try {
      let query = `UPDATE ${this.table} `;

      if (Object.values(fields).length > 1) {
        const keys = Object.keys(fields).join(',');
        const values = Object.values(fields)
          .map((value) => `'${value}'`)
          .join(',');

        query += `SET (${keys}) = (${values}) WHERE id=${id} RETURNING id`;
      } else {
        //I have to do this 'cause of chefs update.
        //Chef has only one field to update.
        const key = Object.keys(fields);
        const value = Object.values(fields);
        query += `SET ${key} = '${value}' WHERE id=${id} RETURNING id`;
      }

      const results = await db.query(query);

      return results.rows[0].id;
    } catch (error) {
      console.error(error);
    }
  },

  delete(id) {
    try {
      const query = `DELETE FROM ${this.table} WHERE id = ${id}`;

      return db.query(query);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = Base;
