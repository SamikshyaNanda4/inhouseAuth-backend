import {pgTable,serial,varchar,text} from "drizzle-orm/pg-core"

export const users=pgTable("users",{
 id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  description: text("description").default(""),
})