import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const batch = pgTable("batch", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    batchCode: varchar("batch_code", { length: 50 }).notNull().unique(),
});
