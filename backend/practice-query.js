import { eq, gt, lt, desc, asc, and, or, sql, inArray } from 'drizzle-orm';
import { auctions, bids, users, categories } from './schema.js';
import db from './db.js';
import { dateDuration, timestamp } from 'drizzle-orm/gel-core';
import { use } from 'react';

const practice = {
    findAll: async () => {
        return await db
            .select()
            .from(auctions)
            .where(
                and(
                    eq(auctions.status, 'active'), 
                    sql`${auctions.endTime} < NOW() + INTERVAL '24'`
                )
            )
            .orderBy(asc(auctions.endTime));
    },

    countAll: async () => {
        return await db
            .select({
                categoryID: auctions.categoryId,
                count: sql`COUNT(${auctions.auctionId})`.mapWith(Number)
            })
            .from(auctions)
            .groupBy(auctions.categoryId)
            .having(sql`COUNT(*) > 5`);
    },
    insertBid: async (newBid) => {
        return db
            .insert(bids)
            .value(newBid)
            .returning({ 
                generatedId: bids.bidId,
                createdAt: bids.createdAt
            });
    },
    findById: async (id) => {
        return await db
            .select()
            .from(auctions)
            .where(inArray(auctions.auctionId, db
                .select(sql`DISTINCT ${bids.auctionId}`)
                .from(bids)
                .where(eq(bids.userId, id))
            ));
    },
    fuzzyMatch: async () => {
        return await db
            .select()
            .from(auctions)
            .where(or(
                sql`${auctions.title} ILIKE %Vintage%`,
                eq(auctions.name, "Antiques")
            ))
    },
    updateUser: async () => {
        return await db
            .update(users)
            .set({ status: "suspended", updated: sql`NOW()`})
            .where(lt(users.reputation, 0));
    },
    getSummary: async (id) => {
        return await db
            .select({
                totalBids: auctions.totalBids,
                highValue: db
                    .select(sql`COUNT(${bids.bidId})`)
                    .from(bids)
                    .where(and(
                        eq(bids.auctionId, id),
                        gt(bids.amountBid, 500)
                    ))
            })
            .from(auctions)
            .where(eq(auctions.auctionId, id))
    }
};

export default practice;