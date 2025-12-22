import { eq, or } from 'drizzle-orm';
import db from '../db/index.js';
import { orders } from '../db/schema.js';

const service = {
  findAll: async function() {
    return db.select().from(orders);
  },

  findById: async function(id) {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  },

  create: async function (order) {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  },

  update: async function(order) {
    await db.update(orders).set(order).where(eq(orders.id, order.id));
    return this.findById(order.id);
  },

  removeById: async function(id) {
    await db.delete(orders).where(eq(orders.id, id));
  },
};

export default service;