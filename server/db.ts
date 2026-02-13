import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contacts, InsertContact } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createContact(data: InsertContact) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(contacts).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create contact:", error);
    throw error;
  }
}

export async function getContacts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contacts: database not available");
    return [];
  }

  try {
    const result = await db.select().from(contacts).orderBy((t) => t.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get contacts:", error);
    throw error;
  }
}

export async function getContactsStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contacts stats: database not available");
    return { daily: [], monthly: [], total: 0 };
  }

  try {
    // Get all contacts
    const allContacts = await db.select().from(contacts);
    const total = allContacts.length;

    // Calculate daily stats (last 30 days)
    const dailyStats: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStats[dateStr] = 0;
    }

    allContacts.forEach((contact) => {
      const dateStr = contact.createdAt.toISOString().split('T')[0];
      if (dateStr in dailyStats) {
        dailyStats[dateStr]++;
      }
    });

    const dailyArray = Object.entries(dailyStats)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, count]) => ({ date, count }));

    // Calculate monthly stats (last 12 months)
    const monthlyStats: Record<string, number> = {};
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      monthlyStats[monthStr] = 0;
    }

    allContacts.forEach((contact) => {
      const monthStr = contact.createdAt.toISOString().slice(0, 7);
      if (monthStr in monthlyStats) {
        monthlyStats[monthStr]++;
      }
    });

    const monthlyArray = Object.entries(monthlyStats)
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .map(([month, count]) => ({ month, count }));

    return {
      daily: dailyArray,
      monthly: monthlyArray,
      total,
    };
  } catch (error) {
    console.error("[Database] Failed to get contacts stats:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.
