import db from '../db/index.js';
import { provinces } from '../db/schema.js';

const service = {
  findAll: async function() {
    return db.select().from(provinces);
  },
};

export default service;