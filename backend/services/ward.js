import db from '../db/index.js';
import { wards } from '../db/schema.js';

const service = {
  findAll: async function() {
    return db.select().from(wards);
  },
};

export default service;