import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ==================== USERS ====================

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  fullName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  imageUrl: varchar({ length: 500 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ==================== JOBS ====================

export const jobsTable = pgTable("jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  externalJobId: varchar({ length: 255 }),
  title: varchar({ length: 255 }).notNull(),
  company: varchar({ length: 255 }).notNull(),
  companyLogo: varchar({ length: 500 }),
  location: varchar({ length: 255 }),
  employmentType: varchar({ length: 100 }),
  salary: varchar({ length: 100 }),
  description: text(),
  applyUrl: varchar({ length: 500 }),
  source: varchar({ length: 100 }),
  postedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

// ==================== SAVED JOBS ====================

export const savedJobsTable = pgTable("saved_jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  jobId: integer().notNull(),
  savedAt: timestamp().defaultNow().notNull(),
});

// ==================== APPLICATIONS ====================

export const applicationsTable = pgTable("applications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  jobId: integer().notNull(),
  resumeId: integer(),
  coverLetterId: integer(),
  atsReportId: integer(),
  status: varchar({ length: 50 }).notNull(),
  notes: text(),
  archived: boolean().default(false).notNull(),
  appliedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ==================== RESUMES ====================

export const resumesTable = pgTable("resumes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  title: varchar({ length: 255 }).notNull(),
  fileName: varchar({ length: 255 }).notNull(),
  fileUrl: varchar({ length: 500 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// ==================== COVER LETTERS ====================

export const coverLettersTable = pgTable("cover_letters", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  jobId: integer(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ==================== ATS REPORTS ====================

export const atsReportsTable = pgTable("ats_reports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  resumeId: integer().notNull(),
  score: integer().notNull(),
  missingKeywords: text(),
  suggestions: text(),
  createdAt: timestamp().defaultNow().notNull(),
});
