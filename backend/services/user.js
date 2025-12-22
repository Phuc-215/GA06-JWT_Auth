import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';

const service = {
  create: async function (user) {
    // email + password + otp
    const result = await db.insert(users).values(user).returning();
    return result[0];
  },

  findById: async function (id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },

  findByEmail: async function (email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  },

  findAll: async function () {
    return db.select().from(users);
  },

  update: async function (user) {
    await db.update(users).set(user).where(eq(users.id, user.id));
    return this.findById(user.id);
  }
};

export default service;