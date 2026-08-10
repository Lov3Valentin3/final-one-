import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  plan: text("plan").notNull().default("free"), // free | monthly | annual | lifetime
  addons: text("addons").notNull().default("[]"), // JSON array of addon keys
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => parents.id),
  firstName: text("first_name").notNull(),
  age: integer("age").notNull(),
  favoriteColor: text("favorite_color").notNull(),
  favoriteActivity: text("favorite_activity").notNull(),
  elfId: text("elf_id").notNull(),
  magicCode: text("magic_code").notNull().unique(),
  paused: boolean("paused").notNull().default(false),
  responseMode: text("response_mode").notNull().default("ai"), // ai | parent | both
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id),
  sender: text("sender").notNull(), // child | elf | parent
  body: text("body").notNull(),
  readByChild: boolean("read_by_child").notNull().default(false),
  readByParent: boolean("read_by_parent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id),
  certKey: text("cert_key").notNull(),
  premium: boolean("premium").notNull().default(false),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id),
  key: text("key").notNull(),
  title: text("title").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id")
    .notNull()
    .references(() => parents.id),
  childId: integer("child_id").references(() => children.id),
  type: text("type").notNull(), // letter | certificate | video | countdown
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const subscriptionEvents = pgTable("subscription_events", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id")
    .notNull()
    .references(() => parents.id),
  kind: text("kind").notNull(), // plan | addon
  itemKey: text("item_key").notNull(),
  amountCents: integer("amount_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
